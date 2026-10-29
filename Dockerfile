# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://flower:flower@db:5432/flower_shop?schema=public"
RUN npm run build \
  && ./node_modules/.bin/esbuild prisma/seed.ts \
    --bundle \
    --platform=node \
    --format=cjs \
    --outfile=prisma/seed.cjs \
    --external:@prisma/client

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DB_HOST=db
ENV DB_PORT=5432

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Full install for prisma CLI + seed (standalone omits prisma transitive deps)
COPY --from=deps /app/node_modules /prisma-tools/node_modules
COPY --from=builder /app/prisma /prisma-tools/prisma
COPY --from=builder /app/package.json /prisma-tools/package.json

COPY docker/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh \
  && chown -R nextjs:nodejs /app /prisma-tools

USER nextjs
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
