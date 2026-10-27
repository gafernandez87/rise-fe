"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PreviewRow = {
  row: number;
  id: string;
  operation: string;
  data: Record<string, unknown>;
  errors: string[];
  expectedUpdatedAt: string | null;
};
const actionClass =
  "rise-action rounded-md border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50";
export function WorkbookPanel({
  kind,
  mode,
}: {
  kind: "measures" | "stories" | "profiles";
  mode?: "import" | "export";
}) {
  const router = useRouter();
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const base = `/backoffice/workbooks/${kind}`;
  async function preview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setRows([]);
    try {
      const response = await fetch(`${base}/preview`, {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "No se pudo revisar el archivo.",
        );
      setRows(result.rows);
      setMessage(
        result.canImport
          ? "Revisa los registros antes de confirmar."
          : "Corrige los errores indicados y vuelve a cargar el archivo. No se guardó ningún registro.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo leer el archivo.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function commit() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`${base}/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "No se pudo importar. Vuelve a revisar el archivo.",
        );
      setMessage(`Se importaron ${result.imported} registros.`);
      setRows([]);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo importar.",
      );
    } finally {
      setBusy(false);
    }
  }
  const query = new URLSearchParams({
    ...(country ? { country } : {}),
    ...(statuses.length ? { status: statuses.join(",") } : {}),
  });
  return (
    <div className="space-y-4">
      {mode !== "export" && (
        <details
          open={mode === "import"}
          className="rounded-lg border border-[color:var(--color-border)] bg-white p-4"
        >
          <summary className="cursor-pointer font-semibold">
            Importar Excel
          </summary>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-[color:var(--color-muted)]">
              Descarga la plantilla, completa los registros y selecciona el
              archivo. “Validar y ver vista previa” comprueba los datos y
              muestra qué registros se crearán o actualizarán y los errores que
              debes corregir. Los datos se guardan solo al confirmar la
              importación.
            </p>
            <a className={actionClass} href={`${base}/template`}>
              Descargar plantilla .xlsx
            </a>
            <form onSubmit={preview} className="flex flex-wrap items-end gap-3">
              <div className="grid gap-2 text-sm">
                <span>Archivo .xlsx (hasta 5 MB, 200 registros)</span>
                <input
                  ref={fileInput}
                  className="hidden"
                  aria-label="Archivo Excel para importar"
                  name="file"
                  type="file"
                  accept=".xlsx"
                  disabled={busy}
                  onChange={(event) => {
                    setFileName(event.target.files?.[0]?.name ?? "");
                    setRows([]);
                    setMessage("");
                  }}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className={actionClass}
                    type="button"
                    disabled={busy}
                    onClick={() => fileInput.current?.click()}
                  >
                    Seleccionar archivo Excel
                  </button>
                  <span className="break-all">
                    {fileName || "Ningún archivo seleccionado"}
                  </span>
                </div>
              </div>
              <button
                className={actionClass}
                type="submit"
                disabled={busy || !fileName}
              >
                {busy ? "Procesando…" : "Validar y ver vista previa"}
              </button>
            </form>
            <p role="status" className="text-sm">
              {message}
            </p>
            {rows.length > 0 ? (
              <>
                <div className="max-h-96 overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr>
                        <th className="p-2">Fila</th>
                        <th className="p-2">Registro</th>
                        <th className="p-2">Acción</th>
                        <th className="p-2">Revisión</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{row.row}</td>
                          <td className="p-2">
                            <details>
                              <summary className="cursor-pointer">
                                {String(
                                  row.data.title ??
                                    row.data.name ??
                                    row.data.slug,
                                )}
                              </summary>
                              <dl className="mt-2 space-y-1">
                                {Object.entries(row.data).map(
                                  ([key, value]) => (
                                    <div key={key}>
                                      <dt className="font-semibold">{key}</dt>
                                      <dd className="max-w-lg whitespace-pre-wrap break-words">
                                        {typeof value === "object"
                                          ? JSON.stringify(value)
                                          : String(value)}
                                      </dd>
                                    </div>
                                  ),
                                )}
                              </dl>
                            </details>
                          </td>
                          <td className="p-2">
                            {row.operation === "create"
                              ? "Crear"
                              : "Actualizar"}
                          </td>
                          <td className="p-2">
                            {row.errors.length ? (
                              <ul>
                                {row.errors.map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            ) : (
                              "Correcto"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className={actionClass}
                  onClick={commit}
                  disabled={busy || rows.some((row) => row.errors.length > 0)}
                >
                  Confirmar importación de {rows.length} registros
                </button>
              </>
            ) : null}
          </div>
        </details>
      )}
      {mode !== "import" && (
        <details
          open={mode === "export"}
          className="rounded-lg border border-[color:var(--color-border)] bg-white p-4"
        >
          <summary className="cursor-pointer font-semibold">
            Exportar Excel
          </summary>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-[color:var(--color-muted)]">
              Descarga una sola hoja con los registros de la base y columnas en
              español. Puedes filtrar por país y elegir varios estados.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <label className="grid gap-1 text-sm">
                País (opcional)
                <input
                  className="rounded border px-3 py-2"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                />
              </label>
              <fieldset className="grid gap-2 text-sm">
                <legend className="mb-2">Estados (sin selección: todos)</legend>
                <div className="flex flex-wrap gap-3">
                  {[
                    ["draft", "Borradores"],
                    ["review", "En revisión"],
                    ["published", "Publicados"],
                    ["archived", "Archivados"],
                    ["hidden", "Ocultos"],
                  ].map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={statuses.includes(value)}
                        onChange={(event) =>
                          setStatuses((current) =>
                            event.target.checked
                              ? [...current, value]
                              : current.filter((item) => item !== value),
                          )
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <a className={actionClass} href={`${base}/export?${query}`}>
                Exportar Excel privado
              </a>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
