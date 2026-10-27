"use client";
import { useState } from "react";
type Term = { id: string; kind: string; name: string; aliases: string[] };
export function TaxonomyPanel({
  canPublish,
  expanded = false,
}: {
  canPublish: boolean;
  expanded?: boolean;
}) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    if (loaded) return;
    try {
      const response = await fetch("/backoffice/taxonomy");
      if (!response.ok) throw new Error();
      setTerms(await response.json());
      setLoaded(true);
    } catch {
      setMessage("No se pudieron leer las categorías.");
    }
  }
  async function save(event: React.FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const aliases = String(
      new FormData(event.currentTarget).get("aliases") ?? "",
    )
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);
    try {
      const response = await fetch("/backoffice/taxonomy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, aliases }),
      });
      if (!response.ok) throw new Error();
      const term = (await response.json()) as Term;
      setTerms((items) => items.map((item) => (item.id === id ? term : item)));
      setMessage(
        "Sinónimos guardados. Las próximas cargas reutilizarán esta categoría.",
      );
    } catch {
      setMessage("No se pudieron guardar los sinónimos. Revisa tus permisos.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <details
      open={expanded || undefined}
      className="rounded-lg border bg-white p-4"
      onToggle={(event) => {
        if (event.currentTarget.open) void load();
      }}
    >
      <summary className="cursor-pointer font-semibold">
        Categorías y sinónimos
      </summary>
      <p className="mt-3 text-sm">
        Los IDs de categoría se conservan. Agrega variaciones de escritura para
        que las próximas cargas se asignen a la categoría correcta. Las
        amenazas, tipos de medida, sectores y entornos se administran por
        separado.
      </p>
      <p role="status" className="mt-2 text-sm">
        {message}
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {terms.map((term) => (
          <form
            key={term.id}
            onSubmit={(event) => save(event, term.id)}
            className="space-y-2 rounded border p-3"
          >
            <h3 className="font-semibold">{term.name}</h3>
            <p className="text-xs">
              {
                (
                  {
                    threat: "Amenaza",
                    measure: "Tipo de medida",
                    sector: "Sector",
                    environment: "Entorno",
                  } as Record<string, string>
                )[term.kind]
              }
            </p>
            <label className="grid gap-1 text-sm">
              Sinónimos (uno por línea)
              <textarea
                name="aliases"
                rows={3}
                className="w-full rounded border p-2"
                defaultValue={term.aliases.join("\n")}
                disabled={!canPublish || busy}
              />
            </label>
            {canPublish ? (
              <button
                type="submit"
                className="rise-action rounded border px-3 py-2 text-sm font-semibold"
                disabled={busy}
              >
                Guardar sinónimos
              </button>
            ) : null}
          </form>
        ))}
      </div>
    </details>
  );
}
