"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/auth";

const initial: ActionState = { ok: false };

type Props = {
  mode: "login" | "register";
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="mx-auto w-full max-w-md space-y-4">
      {mode === "register" ? (
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-muted">Имя</span>
          <input
            name="name"
            required
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none ring-leaf focus:ring-2"
          />
          {state.errors?.name ? (
            <span className="text-sm text-blush">{state.errors.name[0]}</span>
          ) : null}
        </label>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none ring-leaf focus:ring-2"
        />
        {state.errors?.email ? (
          <span className="text-sm text-blush">{state.errors.email[0]}</span>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-muted">Пароль</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none ring-leaf focus:ring-2"
        />
        {state.errors?.password ? (
          <span className="text-sm text-blush">{state.errors.password[0]}</span>
        ) : null}
      </label>

      {state.message ? <p className="text-sm text-blush">{state.message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-leaf py-3 text-sm font-medium text-cream transition hover:bg-leaf-deep disabled:opacity-60"
      >
        {pending ? "Секунду…" : mode === "login" ? "Войти" : "Зарегистрироваться"}
      </button>
    </form>
  );
}
