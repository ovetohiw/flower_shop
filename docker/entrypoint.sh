#!/bin/sh
set -eu

echo "Waiting for Postgres at ${DB_HOST:-db}:${DB_PORT:-5432}..."
i=0
until node -e "const n=require('net');const s=n.connect(Number(process.env.DB_PORT||5432),process.env.DB_HOST||'db',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1))"; do
  i=$((i + 1))
  if [ "$i" -gt 60 ]; then
    echo "Database wait timed out"
    exit 1
  fi
  sleep 1
done

echo "Applying Prisma schema (db push)..."
cd /prisma-tools
node ./node_modules/prisma/build/index.js db push

if [ "${SEED_ON_START:-1}" = "1" ]; then
  echo "Seeding catalog..."
  node ./prisma/seed.cjs
fi

echo "Starting Next.js..."
cd /app
exec node ./server.js
