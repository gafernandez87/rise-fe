"use client";

import { Loader2, LockKeyhole, LogOut, Save, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonIcon = "lock" | "logout" | "save" | "trash";
type SubmitButtonVariant = "danger" | "primary" | "secondary";

type SubmitButtonProps = {
  children: string;
  fullWidth?: boolean;
  icon: SubmitButtonIcon;
  pendingLabel: string;
  variant?: SubmitButtonVariant;
};

const iconByName = {
  lock: LockKeyhole,
  logout: LogOut,
  save: Save,
  trash: Trash2,
};

const variantClasses: Record<SubmitButtonVariant, string> = {
  danger:
    "border border-[color:var(--color-primary)] bg-white text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white",
  primary: "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-strong)]",
  secondary:
    "border border-[color:var(--color-border)] bg-white text-[color:var(--color-text)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-primary)]",
};

export function SubmitButton({
  children,
  fullWidth = false,
  icon,
  pendingLabel,
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const Icon = pending ? Loader2 : iconByName[icon];

  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-75 ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]}`}
      disabled={pending}
      type="submit"
    >
      <Icon className={pending ? "animate-spin" : undefined} size={16} aria-hidden="true" />
      {pending ? pendingLabel : children}
    </button>
  );
}
