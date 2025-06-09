"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

type TProps = {
  value: string;
  pendingValue?: string;
  submitform?: string;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

export type SubmitButtonType = {
  isPending: boolean;
};

const SubmitButton = forwardRef<SubmitButtonType, TProps>((props, ref) => {
  const { pending: formPending } = useFormStatus();
  const isPending = props.loading ?? formPending;
  const disabled = props.disabled;
  useImperativeHandle(ref, () => ({
    isPending,
  }));

  return (
    <Button
      aria-disabled={isPending}
      disabled={isPending || disabled}
      form={props.submitform}
      type="submit"
      className={cn(
        "flex items-center bg-red-600 hover:bg-red-700/90 h-11 justify-center gap-2",
        (isPending || disabled) && "opacity-50 cursor-not-allowed",
        props.className
      )}
    >
      {props.children}
      <span>
        {isPending ? (
          <span className="flex gap-2 items-center">
            <LoaderCircle size={18} className="rotation-loader animate-spin" />
            {props.pendingValue ?? `${props.value}...`}
          </span>
        ) : (
          props.value
        )}
      </span>

    </Button>

  );
});

SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
