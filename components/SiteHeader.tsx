import Link from "next/link";
import { auth } from "@/lib/auth";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/cart", label: "Корзина" },
  { href: "/account", label: "Кабинет" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-ink">
          Flora
        </Link>
        <nav className="flex items-center gap-4 text-sm text-ink-muted sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-leaf"
            >
              {link.label}
            </Link>
          ))}
          {session?.user ? (
            <span className="hidden text-ink sm:inline">{session.user.name || session.user.email}</span>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-leaf px-3 py-1.5 text-cream transition hover:bg-leaf-deep"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
