import { FormEvent, startTransition } from "react";

/**
 * Use as `<form onSubmit={submitWithoutReset(action)}>` instead of
 * `<form action={action}>`.
 *
 * React 19 resets a `<form action>` after every submission, and Radix Select
 * (2.3+) clears its value on that reset, so dropdown choices were lost after a
 * failed submit or a multi-step "Next". Submitting through onSubmit skips the
 * reset; the action still runs inside a transition, so useActionState's
 * isPending works (pass it to SubmitButton's `loading`, since useFormStatus
 * only tracks `<form action>`).
 */
export function submitWithoutReset(action: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };
}
