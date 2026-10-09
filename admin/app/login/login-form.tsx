"use client";

import { useActionState } from "react";
import Button from "@/components/_ui/button";
import Field from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import { login, type LoginState } from "./actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={action} noValidate className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      <Field label="Work email" htmlFor="email" error={state.error}>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          defaultValue={state.email}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "email-error" : undefined}
          className="aria-invalid:border-danger focus-visible:border-primary focus-visible:ring-primary/10 h-12 rounded-xl text-[15px] focus-visible:ring-4"
          required
        />
      </Field>
      <Button
        variant="primary"
        size="md"
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="group h-12 w-full justify-between rounded-xl px-5 text-[15px] shadow-[0_2px_4px_rgba(38,20,85,.15)]"
      >
        {pending ? "Checking…" : "Sign in to your workspace"}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        >
          <path
            d="M4 10h12m-5-5 5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </form>
  );
}
