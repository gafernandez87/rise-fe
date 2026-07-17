import type { ReactNode } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { getBackofficeCases, getBackofficeToken } from "@/lib/backoffice-api";
import type { AdaptationCase, CaseSeverity, CaseStatus } from "@/types/cases";
import { createMeasure, deleteMeasure, loginBackoffice, logoutBackoffice, updateMeasure } from "./actions";
import { SubmitButton } from "./submit-button";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type BackofficePageProps = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    edit?: string;
    error?: string;
    mode?: string;
    save?: string;
    updated?: string;
  }>;
};

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  step?: string;
  type?: string;
  placeholder?: string;
  value?: string | number | null;
};

const statusLabels: Record<CaseStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  hidden: "Oculto",
};

const severityLabels: Record<CaseSeverity, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
};

function Field({ label, name, required, step, type = "text", placeholder, value }: FieldProps) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <input
        className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-[color:var(--color-primary)]"
        defaultValue={value ?? undefined}
        name={name}
        placeholder={placeholder}
        required={required}
        step={step}
        type={type}
      />
    </label>
  );
}

function TextArea({ label, name, required, value }: Omit<FieldProps, "type" | "placeholder" | "step">) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <textarea
        className="min-h-28 rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal leading-6 outline-none transition focus:border-[color:var(--color-primary)]"
        defaultValue={value ?? undefined}
        name={name}
        required={required}
      />
    </label>
  );
}

function SelectField({
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
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <select
        className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-[color:var(--color-primary)]"
        defaultValue={value ?? undefined}
        name={name}
      >
        {children}
      </select>
    </label>
  );
}

function LoginView({ error }: { error?: string }) {
  const message =
    error === "invalid"
      ? "La clave no coincide."
      : error === "unavailable"
        ? "No se pudo conectar con el backend."
        : error === "session"
          ? "La sesion expiro. Ingresa nuevamente."
          : error === "missing"
            ? "Ingresa la clave."
            : null;

  return (
    <>
      <main className="page-shell grid min-h-screen place-items-center py-10">
        <form action={loginBackoffice} className="w-full max-w-md space-y-5 rounded-lg border border-[color:var(--color-border)] bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Backoffice
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Ingresar</h1>
          </div>
          {message ? (
            <p className="rounded-md bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm font-medium text-[color:var(--color-primary)]">
              {message}
            </p>
          ) : null}
          <Field label="Clave" name="password" required type="password" />
          <SubmitButton fullWidth icon="lock" pendingLabel="Ingresando...">
            Ingresar
          </SubmitButton>
        </form>
      </main>
    </>
  );
}

function Notice({ created, deleted, save, updated }: { created?: string; deleted?: string; save?: string; updated?: string }) {
  if (created === "1") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium">
        Medida creada.
      </p>
    );
  }

  if (updated === "1") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium">
        Medida actualizada.
      </p>
    );
  }

  if (deleted === "1") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium">
        Medida eliminada.
      </p>
    );
  }

  if (save === "missing") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
        Completa titulo, resumen, latitud y longitud.
      </p>
    );
  }

  if (save === "error") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
        No se pudo guardar la medida.
      </p>
    );
  }

  if (save === "delete-error") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
        No se pudo eliminar la medida.
      </p>
    );
  }

  return null;
}

function casePhotoUrl(item?: AdaptationCase) {
  return item?.photoUrl ?? item?.images.find((image) => image.isCover)?.url ?? item?.images[0]?.url ?? null;
}

function MeasureFields({ measure }: { measure?: AdaptationCase }) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Titulo" name="title" required value={measure?.title} />
        <Field label="Slug" name="slug" placeholder="se-genera-si-queda-vacio" value={measure?.slug} />
        <SelectField label="Estado" name="status" value={measure?.status ?? "draft"}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="hidden">Oculto</option>
        </SelectField>
        <SelectField label="Severidad para mapa" name="severity" value={measure?.severity ?? "medium"}>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
          <option value="high">Alta</option>
          <option value="critical">Critica</option>
        </SelectField>
        <Field label="Pais" name="country" value={measure?.country} />
        <Field label="Localidad" name="locality" value={measure?.locality} />
        <Field
          label="Jurisdiccion subnacional"
          name="subnationalJurisdiction"
          value={measure?.subnationalJurisdiction ?? measure?.region}
        />
        <Field label="Ecorregion" name="ecoregion" value={measure?.ecoregion} />
        <Field label="Latitud" name="latitude" required step="any" type="number" value={measure?.latitude} />
        <Field label="Longitud" name="longitude" required step="any" type="number" value={measure?.longitude} />
        <Field label="Fecha de implementacion" name="implementationDate" value={measure?.implementationDate} />
        <Field label="Foto URL" name="photoUrl" type="url" value={casePhotoUrl(measure)} />
        <Field label="Amenaza" name="threat" value={measure?.threat} />
        <Field label="Sector / tipo de medida" name="measureType" value={measure?.measureType ?? measure?.category.name} />
        <Field label="Alcance" name="scope" value={measure?.scope} />
        <Field label="Enfoque adaptativo" name="adaptationFocus" value={measure?.adaptationFocus} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TextArea label="Resumen de la medida" name="shortDescription" required value={measure?.shortDescription} />
        <TextArea label="Descripcion completa" name="fullDescription" value={measure?.fullDescription} />
        <TextArea
          label="Perfil de vulnerabilidad nacional"
          name="nationalVulnerabilityProfile"
          value={measure?.nationalVulnerabilityProfile}
        />
        <TextArea label="Objetivos de la medida" name="objectives" value={measure?.objectives} />
        <TextArea label="Soluciones propuestas" name="proposedSolutions" value={measure?.proposedSolutions} />
        <TextArea label="Comunidades beneficiarias" name="beneficiaryCommunities" value={measure?.beneficiaryCommunities} />
        <TextArea label="Rol de la juventud" name="youthRole" value={measure?.youthRole} />
        <TextArea label="Resultados obtenidos" name="results" value={measure?.results} />
        <TextArea label="Contacto con referente" name="contact" value={measure?.contact} />
        <TextArea label="Problematica climatica local" name="localClimateProblem" value={measure?.localClimateProblem} />
        <TextArea
          label="Contexto socio-politico nacional"
          name="nationalSocioPoliticalContext"
          value={measure?.nationalSocioPoliticalContext}
        />
        <TextArea label="Alianzas estrategicas" name="strategicAlliances" value={measure?.strategicAlliances} />
        <TextArea label="Factores habilitantes y condicionantes" name="enablingFactors" value={measure?.enablingFactors} />
        <TextArea label="Co-beneficios" name="coBenefits" value={measure?.coBenefits} />
        <TextArea label="Escalabilidad" name="scalability" value={measure?.scalability} />
        <TextArea label="Sostenibilidad en el tiempo" name="longTermSustainability" value={measure?.longTermSustainability} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Tipo de financiamiento" name="financingType" value={measure?.financingType} />
        <Field label="Fuente URL" name="sourceUrl" type="url" value={measure?.sourceUrl} />
        <TextArea label="Documentos descargables + referencias" name="downloadableDocuments" value={measure?.downloadableDocuments} />
      </section>
    </>
  );
}

function CasesTable({ activeId, cases }: { activeId?: string; cases: AdaptationCase[] }) {
  if (cases.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm text-[color:var(--color-muted)]">
        Todavia no hay medidas cargadas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-white">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th className="px-4 py-3">Medida</th>
            <th className="px-4 py-3">Ubicacion</th>
            <th className="px-4 py-3">Amenaza</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => {
            const location =
              [item.locality, item.subnationalJurisdiction ?? item.region, item.country].filter(Boolean).join(", ") ||
              "Sin ubicacion";
            const isActive = activeId === item.id;

            return (
              <tr
                key={item.id}
                className={`border-b border-[color:var(--color-border)] last:border-0 ${
                  isActive ? "bg-[color:var(--color-brand-cream)]" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 align-top">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 max-w-[360px] text-xs leading-5 text-[color:var(--color-muted)]">
                    {item.shortDescription}
                  </p>
                </td>
                <td className="px-4 py-3 align-top text-[color:var(--color-muted)]">{location}</td>
                <td className="px-4 py-3 align-top text-[color:var(--color-muted)]">
                  {item.threat ?? severityLabels[item.severity]}
                </td>
                <td className="px-4 py-3 align-top text-[color:var(--color-muted)]">
                  {item.measureType ?? item.category.name}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded-md bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold">
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-top">
                  <Link
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-semibold transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                    href={`/backoffice?edit=${encodeURIComponent(item.id)}`}
                  >
                    <Pencil size={15} aria-hidden="true" />
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MeasureForm({
  action,
  icon,
  measure,
  secondaryAction,
  submitLabel,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  icon?: ReactNode;
  measure?: AdaptationCase;
  secondaryAction?: ReactNode;
  submitLabel: string;
  title: string;
}) {
  return (
    <form action={action} className="space-y-6 rounded-lg border border-[color:var(--color-border)] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ?? <Plus size={18} aria-hidden="true" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {secondaryAction}
      </div>

      <MeasureFields measure={measure} />

      <SubmitButton icon="save" pendingLabel="Guardando...">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}

export default async function BackofficePage({ searchParams }: BackofficePageProps) {
  const params = await searchParams;
  const token = await getBackofficeToken();

  if (!token) {
    return <LoginView error={params.error} />;
  }

  const { cases, unauthorized, error } = await getBackofficeCases(token);
  const isCreating = params.mode === "create" && !params.edit;
  const editingMeasure = params.edit ? cases.find((item) => item.id === params.edit) : undefined;

  if (unauthorized) {
    return <LoginView error="session" />;
  }

  return (
    <>
      <main className="page-shell space-y-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Backoffice
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Medidas de adaptacion</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-strong)]"
              href="/backoffice?mode=create"
            >
              <Plus size={16} aria-hidden="true" />
              Nueva medida
            </Link>
            <form action={logoutBackoffice}>
              <SubmitButton icon="logout" pendingLabel="Saliendo..." variant="secondary">
                Salir
              </SubmitButton>
            </form>
          </div>
        </div>

        <Notice created={params.created} deleted={params.deleted} save={params.save} updated={params.updated} />

        {error ? (
          <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
            No se pudo leer el backend.
          </p>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
            <p className="text-sm text-[color:var(--color-muted)]">Total</p>
            <p className="mt-1 text-2xl font-semibold">{cases.length}</p>
          </div>
          <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
            <p className="text-sm text-[color:var(--color-muted)]">Publicadas</p>
            <p className="mt-1 text-2xl font-semibold">
              {cases.filter((item) => item.status === "published").length}
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
            <p className="text-sm text-[color:var(--color-muted)]">Borradores</p>
            <p className="mt-1 text-2xl font-semibold">
              {cases.filter((item) => item.status === "draft").length}
            </p>
          </div>
        </section>

        {isCreating ? (
          <MeasureForm
            action={createMeasure}
            secondaryAction={
              <Link className="text-sm font-semibold text-[color:var(--color-muted)]" href="/backoffice">
                Cancelar
              </Link>
            }
            submitLabel="Guardar medida"
            title="Nueva medida"
          />
        ) : null}

        {params.edit ? (
          editingMeasure ? (
            <section className="space-y-4">
              <MeasureForm
                action={updateMeasure.bind(null, editingMeasure.id)}
                icon={<Pencil size={18} aria-hidden="true" />}
                measure={editingMeasure}
                secondaryAction={
                  <Link className="text-sm font-semibold text-[color:var(--color-muted)]" href="/backoffice">
                    Cancelar
                  </Link>
                }
                submitLabel="Guardar cambios"
                title="Editar medida"
              />
              <form
                action={deleteMeasure.bind(null, editingMeasure.id)}
                className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Dar de baja medida</h2>
                    <label className="mt-2 flex items-start gap-2 text-sm text-[color:var(--color-muted)]">
                      <input className="mt-1" name="confirmDelete" required type="checkbox" />
                      Confirmo que quiero eliminar esta medida del backoffice.
                    </label>
                  </div>
                  <SubmitButton icon="trash" pendingLabel="Eliminando..." variant="danger">
                    Eliminar
                  </SubmitButton>
                </div>
              </form>
            </section>
          ) : (
            <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
              No se encontro la medida seleccionada.
            </p>
          )
        ) : null}

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Medidas cargadas</h2>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                Vista general de todos los registros creados.
              </p>
            </div>
          </div>
          <CasesTable activeId={editingMeasure?.id} cases={cases} />
        </section>
      </main>
    </>
  );
}
