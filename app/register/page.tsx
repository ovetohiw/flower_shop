import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { registerAction } from "@/lib/actions/auth";

export const metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-center font-[family-name:var(--font-display)] text-4xl">
          Регистрация
        </h1>
        <AuthForm mode="register" action={registerAction} />
        <p className="text-center text-sm text-ink-muted">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-leaf hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
