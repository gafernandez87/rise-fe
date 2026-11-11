"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { ContentTranslation } from "@/types/editorial";
import { translationField } from "@/lib/content-translations";
export const FormLanguageContext = createContext<{ language: string; translations?: ContentTranslation[] }>({ language: "es" });
function useLocalizedField(name: string, value: string | number | null | undefined) {
  const { language, translations } = useContext(FormLanguageContext);
  const field = translationField(name);
  const original = language === "es";
  const saved = translations?.find((item) => item.language === language) as unknown as Record<string, string> | undefined;
  const legacy = field === "shortDescription" ? saved?.summary : field === "fullDescription" ? saved?.content : undefined;
  return { original, omit: !original && !field, name: original ? name : `translation.${language}.${field}`, value: original ? value : saved?.[field ?? ""] ?? legacy ?? "" };
}
type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  step?: string;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  value?: string | number | null;
};

export function Field({ label, name, required, step, type = "text", placeholder, readOnly, value }: FieldProps) {
  const localized = useLocalizedField(name, value);
  if (localized.omit) return null;
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <input
        className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-[color:var(--color-primary)]"
        readOnly={readOnly}
        defaultValue={localized.value ?? undefined}
        name={localized.name}
        placeholder={placeholder}
        required={required && localized.original}
        step={step}
        type={type}
      />
    </label>
  );
}

export function TextArea({ label, name, required, value }: Omit<FieldProps, "type" | "placeholder" | "step">) {
  const localized = useLocalizedField(name, value);
  if (localized.omit) return null;
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <textarea
        className="min-h-28 rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal leading-6 outline-none transition focus:border-[color:var(--color-primary)]"
        defaultValue={localized.value ?? undefined}
        name={localized.name}
        required={required && localized.original}
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  children,
  value,
}: {
  label: string;
  name: string;
  children: ReactNode;
  value?: string | null;
}) {
  const localized = useLocalizedField(name, value);
  if (localized.omit) return null;
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <select
        className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-[color:var(--color-primary)]"
        defaultValue={localized.value ?? undefined}
        name={localized.name}
      >
        {children}
      </select>
    </label>
  );
}

