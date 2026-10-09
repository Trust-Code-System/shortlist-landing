"use client";

import { useActionState } from "react";
import Button from "@/components/_ui/button";
import Field from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import { login, type LoginState } from "./actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} noValidate className="mt-6 flex flex-col gap-4">
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
          className="aria-invalid:border-danger h-11 text-[15px]"
          autoFocus
          required
        />
      </Field>
      <Button
        variant="primary"
        size="md"
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="h-11 w-full text-[15px]"
      >
        {pending ? "Checking…" : "Continue"}
      </Button>
    </form>
  );
}
