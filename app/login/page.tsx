import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { loginAction } from "@/lib/actions/auth";

export const metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-center font-[family-name:var(--font-display)] text-4xl">Вход</h1>
        <AuthForm mode="login" action={loginAction} />
        <p className="text-center text-sm text-ink-muted">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-leaf hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
