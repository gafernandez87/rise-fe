import { TaxonomyPanel } from "@/components/backoffice/taxonomy-panel";
import { EditorialFields } from "@/components/backoffice/editorial-fields";
import { WorkbookPanel } from "@/components/backoffice/workbook-panel";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, FileText, Pencil, Plus } from "lucide-react";
import {
  getBackofficeUser,
  getBackofficeCases,
  getBackofficeCountryProfiles,
  getBackofficeStories,
  getBackofficeToken,
} from "@/lib/backoffice-api";
import type { AdaptationCase, CaseSeverity, CaseStatus } from "@/types/cases";
import type { CountryProfile } from "@/types/country-profiles";
import { countryProfileSections, countryProfileSectionValue } from "@/lib/country-profiles";
import { getDictionary } from "@/lib/i18n";
import type { ResilienceStory } from "@/types/stories";
import {
  createCountryProfile,
  createMeasure,
  createStory,
  deleteCountryProfile,
  deleteMeasure,
  loginBackoffice,
  logoutBackoffice,
  updateCountryProfile,
  updateMeasure,
  updateStory,
} from "./actions";
import { SubmitButton } from "./submit-button";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type BackofficePageProps = {
  searchParams: Promise<{
    detail?: string;
    created?: string;
    deleted?: string;
    edit?: string;
    error?: string;
    mode?: string;
    profileCreated?: string;
    profileDeleted?: string;
    profileEdit?: string;
    profileMode?: string;
    profileSave?: string;
    profileUpdated?: string;
    save?: string;
    section?: string;
    measureTab?: string;
    storyCreated?: string;
    storyEdit?: string;
    storyMode?: string;
    storySave?: string;
    storyUpdated?: string;
    updated?: string;
  }>;
};

type BackofficeSection = "measures" | "profiles" | "stories";

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

const statusLabels: Record<CaseStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  hidden: "Oculto",
  review: "En revisión",
  archived: "Archivado",
};

const severityLabels: Record<CaseSeverity, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

function Field({ label, name, required, step, type = "text", placeholder, readOnly, value }: FieldProps) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <input
        className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-[color:var(--color-primary)]"
        readOnly={readOnly}
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
          ? "La sesión expiró. Ingresa nuevamente."
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
          <Field label="Email (opcional para la cuenta principal)" name="email" type="email" />
          <Field label="Clave" name="password" required type="password" />
          <SubmitButton fullWidth icon="lock" pendingLabel="Ingresando...">
            Ingresar
          </SubmitButton>
        </form>
      </main>
    </>
  );
}

function Notice({
  created,
  deleted,
  entityLabel,
  gender = "feminine",
  missingMessage,
  save,
  updated,
}: {
  created?: string;
  deleted?: string;
  entityLabel: string;
  gender?: "feminine" | "masculine";
  missingMessage: string;
  save?: string;
  updated?: string;
}) {
  const article = gender === "masculine" ? "el" : "la";
  const createdSuffix = gender === "masculine" ? "creado" : "creada";
  const updatedSuffix = gender === "masculine" ? "actualizado" : "actualizada";
  const deletedSuffix = gender === "masculine" ? "archivado" : "archivada";

  if (created === "1") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium">
        {entityLabel} {createdSuffix}.
      </p>
    );
  }

  if (updated === "1") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium">
        {entityLabel} {updatedSuffix}.
      </p>
    );
  }

  if (deleted === "1") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium">
        {entityLabel} {deletedSuffix}.
      </p>
    );
  }

  if (save === "missing") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
        {missingMessage}
      </p>
    );
  }

  if (save === "error") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
        No se pudo guardar {article} {entityLabel.toLowerCase()}.
      </p>
    );
  }

  if (save === "delete-error") {
    return (
      <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
        No se pudo eliminar {article} {entityLabel.toLowerCase()}.
      </p>
    );
  }

  return null;
}

function casePhotoUrl(item?: AdaptationCase) {
  return item?.photoUrl ?? item?.images.find((image) => image.isCover)?.url ?? item?.images[0]?.url ?? null;
}

function MeasureFields({ measure, canPublish }: { canPublish: boolean; measure?: AdaptationCase }) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Título" name="title" required value={measure?.title} />
        <Field readOnly={Boolean(measure)} label="Slug" name="slug" placeholder="se-genera-si-queda-vacio" value={measure?.slug} />
        <SelectField label="Estado" name="status" value={measure?.status ?? "draft"}>
          <option value="draft">Borrador</option>
          <option value="review">En revisión</option>
          <option value="published" disabled={!canPublish}>Publicado</option>
          <option value="archived">Archivado</option>
          <option value="hidden">Oculto</option>
        </SelectField>
        <SelectField label="Nivel de riesgo (requiere método y fuente)" name="severity" value={measure?.severity ?? ""}>
          <option value="">No evaluado</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </SelectField>
        <Field label="Método de evaluación del riesgo" name="riskMethod" value={measure?.riskMethod} />
        <Field label="Fuente de evaluación del riesgo" name="riskSourceUrl" type="url" value={measure?.riskSourceUrl} />
        <SelectField label="Precisión de la ubicación" name="coordinatePrecision" value={measure?.coordinatePrecision ?? ""}>
          <option value="">No indicada</option><option value="country">País</option><option value="region">Región</option><option value="locality">Localidad</option><option value="exact">Ubicación exacta documentada</option>
        </SelectField>
        <Field label="Fuente o criterio de ubicación" name="locationMethod" value={measure?.locationMethod} />
        <Field label="Etapa de implementación" name="implementationStage" value={measure?.implementationStage} />
        <Field label="Sector" name="sector" value={measure?.sector} />
        <input name="originalPhotoUrl" type="hidden" value={casePhotoUrl(measure) ?? ""} />
        <Field label="País" name="country" value={measure?.country} />
        <Field label="Localidad" name="locality" value={measure?.locality} />
        <Field
          label="Jurisdicción subnacional"
          name="subnationalJurisdiction"
          value={measure?.subnationalJurisdiction ?? measure?.region}
        />
        <Field label="Ecorregión" name="ecoregion" value={measure?.ecoregion} />
        <Field label="Latitud" name="latitude" step="any" type="number" value={measure?.latitude} />
        <Field label="Longitud" name="longitude" step="any" type="number" value={measure?.longitude} />
        <Field label="Fecha de implementación" name="implementationDate" value={measure?.implementationDate} />
        <Field label="Foto URL" name="photoUrl" type="url" value={casePhotoUrl(measure)} />
        <Field label="Amenaza" name="threat" value={measure?.threat} />
        <Field label="Tipo de medida" name="measureType" value={measure?.measureType ?? measure?.category.name} />
        <Field label="Alcance" name="scope" value={measure?.scope} />
        <Field label="Enfoque adaptativo" name="adaptationFocus" value={measure?.adaptationFocus} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TextArea label="Resumen de la medida" name="shortDescription" value={measure?.shortDescription} />
        <TextArea label="Descripción completa" name="fullDescription" value={measure?.fullDescription} />
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
        <TextArea label="Problemática climática local" name="localClimateProblem" value={measure?.localClimateProblem} />
        <TextArea
          label="Contexto sociopolítico nacional"
          name="nationalSocioPoliticalContext"
          value={measure?.nationalSocioPoliticalContext}
        />
        <TextArea label="Alianzas estratégicas" name="strategicAlliances" value={measure?.strategicAlliances} />
        <TextArea label="Factores habilitantes y condicionantes" name="enablingFactors" value={measure?.enablingFactors} />
        <TextArea label="Cobeneficios" name="coBenefits" value={measure?.coBenefits} />
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

function StoryFields({ story, canPublish, cases }: { canPublish: boolean; cases: AdaptationCase[]; story?: ResilienceStory }) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Título" name="storyTitle" required value={story?.title} />
        <Field readOnly={Boolean(story)} label="Slug" name="storySlug" placeholder="se-genera-si-queda-vacio" value={story?.slug} />
        <SelectField label="Estado" name="storyStatus" value={story?.status ?? "draft"}>
          <option value="draft">Borrador</option>
          <option value="review">En revisión</option>
          <option value="published" disabled={!canPublish}>Publicado</option>
          <option value="archived">Archivado</option>
          <option value="hidden">Oculto</option>
        </SelectField>
        <SelectField label="Medida vinculada (opcional)" name="storyCaseId" value={story?.caseId ?? ""}><option value="">Sin vincular</option>{cases.map((item) => <option key={item.id} value={item.id}>{item.title} · {item.country}</option>)}</SelectField>
        <Field label="País" name="storyCountry" value={story?.country} />
        <Field label="Territorio" name="storyTerritory" value={story?.territory} />
        <Field label="Riesgo principal" name="storyMainRisk" value={story?.mainRisk} />
        <Field label="URL de video o imagen" name="storyMediaUrl" type="url" value={story?.mediaUrl} />
        <Field label="Texto alternativo del medio" name="storyMediaAlt" value={story?.mediaAlt} />
        <Field label="Fuente URL" name="storySourceUrl" type="url" value={story?.sourceUrl} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TextArea label="Resumen" name="storySummary" value={story?.summary} />
        <TextArea label="Historia completa" name="storyContent" value={story?.content} />
      </section>
    </>
  );
}

function CountryProfileFields({ profile, canPublish }: { canPublish: boolean; profile?: CountryProfile }) {
  const sectionLabels = getDictionary("es").profiles.sections;
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="País" name="profileName" required value={profile?.name} />
        <Field readOnly={Boolean(profile)} label="Slug" name="profileSlug" placeholder="se-genera-si-queda-vacio" value={profile?.slug} />
        <SelectField label="Estado" name="profileStatus" value={profile?.status ?? "draft"}>
          <option value="draft">Borrador</option>
          <option value="review">En revisión</option>
          <option value="published" disabled={!canPublish}>Publicado</option>
          <option value="archived">Archivado</option>
          <option value="hidden">Oculto</option>
        </SelectField>
        <Field label="Riesgo principal" name="profileMainRisk" value={profile?.mainRisk} />
        <Field label="Territorio priorizado" name="profileTerritory" value={profile?.territory} />
        <Field label="Sector más afectado" name="profileSector" value={profile?.sector} />
        <Field label="Medidas identificadas" name="profileMeasuresCount" type="number" value={profile?.measuresCount} />
        <Field label="Título de historia destacada" name="profileStoryTitle" value={profile?.storyTitle} />
        <Field label="Imagen principal URL" name="profileHeroImageUrl" type="url" value={profile?.heroImageUrl} />
        <Field label="Perfil PDF URL" name="profilePdfUrl" type="url" value={profile?.profilePdfUrl} />
        <TextArea label="Riesgos para el listado (uno por línea)" name="profileRisks" value={profile?.risks.join("\n")} />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Contenido de los recuadros del perfil</h3>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            Cada campo corresponde al recuadro con el mismo título en la web, en este mismo orden. Separá los párrafos con una línea en blanco.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {countryProfileSections.map(({ field, formName }) => (
            <TextArea key={field} label={sectionLabels[field]} name={formName} value={countryProfileSectionValue(profile, field)} />
          ))}
        </div>
      </section>
    </>
  );
}

function CasesTable({ activeId, cases }: { activeId?: string; cases: AdaptationCase[] }) {
  if (cases.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm text-[color:var(--color-muted)]">
        Todavía no hay medidas cargadas.
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
              "Sin ubicación";
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
                  {item.threat ?? (item.severity ? severityLabels[item.severity] : "No evaluado")}
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
                    className="rise-action inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-semibold transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
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

function StoriesTable({ activeId, stories }: { activeId?: string; stories: ResilienceStory[] }) {
  if (stories.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm text-[color:var(--color-muted)]">
        Todavía no hay historias cargadas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-white">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th className="px-4 py-3">Historia</th>
            <th className="px-4 py-3">Territorio</th>
            <th className="px-4 py-3">Riesgo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((item) => {
            const territory = [item.country, item.territory].filter(Boolean).join(", ") || "Sin territorio";
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
                  <p className="mt-1 max-w-[380px] text-xs leading-5 text-[color:var(--color-muted)]">
                    {item.summary}
                  </p>
                </td>
                <td className="px-4 py-3 align-top text-[color:var(--color-muted)]">{territory}</td>
                <td className="px-4 py-3 align-top text-[color:var(--color-muted)]">
                  {item.mainRisk ?? "Sin riesgo"}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded-md bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold">
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-top">
                  <Link
                    className="rise-action inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-semibold transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                    href={`/backoffice?section=stories&storyEdit=${encodeURIComponent(item.id)}`}
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

function CountryProfilesTable({ activeId, profiles }: { activeId?: string; profiles: CountryProfile[] }) {
  if (profiles.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm text-[color:var(--color-muted)]">
        Todavía no hay perfiles cargados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-white">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th className="px-4 py-3">Perfil</th>
            <th className="px-4 py-3">Territorio</th>
            <th className="px-4 py-3">Sector</th>
            <th className="px-4 py-3">Medidas</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((item) => {
            const isActive = activeId === item.id;

            return (
              <tr
                key={item.id}
                className={`border-b border-[color:var(--color-border)] last:border-0 ${
                  isActive ? "bg-[color:var(--color-brand-cream)]" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 align-top">
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 max-w-[380px] text-xs leading-5 text-[color:var(--color-muted)]">
                    {item.mainRisk}
                  </p>
                </td>
                <td className="px-4 py-3 align-top text-[color:var(--color-muted)]">{item.territory}</td>
                <td className="px-4 py-3 align-top text-[color:var(--color-muted)]">{item.sector}</td>
                <td className="px-4 py-3 align-top text-[color:var(--color-muted)]">{item.measuresCount}</td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded-md bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold">
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-top">
                  <Link
                    className="rise-action inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-semibold transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                    href={`/backoffice?section=profiles&profileEdit=${encodeURIComponent(item.id)}`}
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
  canPublish,
  action,
  errorPath,
  icon,
  measure,
  secondaryAction,
  submitLabel,
  title,
}: {
  canPublish: boolean;
  action: (formData: FormData) => Promise<void>;
  errorPath?: string;
  icon?: ReactNode;
  measure?: AdaptationCase;
  secondaryAction?: ReactNode;
  submitLabel: string;
  title: string;
}) {
  const readOnly = !canPublish && measure?.status === "published";
  return (
    <form action={action} className="space-y-6 rounded-lg border border-[color:var(--color-border)] bg-white p-5">
      {errorPath ? <input name="backofficeErrorPath" type="hidden" value={errorPath} /> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ?? <Plus size={18} aria-hidden="true" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {secondaryAction}
          <SubmitButton disabled={readOnly} icon="save" pendingLabel="Guardando...">
            Guardar
          </SubmitButton>
        </div>
      </div>

      {measure ? <Link className="rise-action rounded-md border px-4 py-2 text-sm font-semibold" href={`/backoffice/preview/measures/${measure.id}`} target="_blank">Vista previa interna</Link> : null}
      {readOnly ? <p className="text-sm">Solo lectura: un publicador debe realizar los cambios sobre contenido publicado.</p> : null}
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <MeasureFields measure={measure} canPublish={canPublish} />
        <EditorialFields record={measure} />
      </fieldset>

      <SubmitButton disabled={readOnly} icon="save" pendingLabel="Guardando...">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}

function StoryForm({
  canPublish,
  cases,
  action,
  errorPath,
  icon,
  secondaryAction,
  story,
  submitLabel,
  title,
}: {
  canPublish: boolean;
  cases: AdaptationCase[];
  action: (formData: FormData) => Promise<void>;
  errorPath?: string;
  icon?: ReactNode;
  secondaryAction?: ReactNode;
  story?: ResilienceStory;
  submitLabel: string;
  title: string;
}) {
  const readOnly = !canPublish && story?.status === "published";
  return (
    <form action={action} className="space-y-6 rounded-lg border border-[color:var(--color-border)] bg-white p-5">
      {errorPath ? <input name="backofficeErrorPath" type="hidden" value={errorPath} /> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ?? <BookOpen size={18} aria-hidden="true" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {secondaryAction}
          <SubmitButton disabled={readOnly} icon="save" pendingLabel="Guardando...">
            Guardar
          </SubmitButton>
        </div>
      </div>

      {story ? <Link className="rise-action rounded-md border px-4 py-2 text-sm font-semibold" href={`/backoffice/preview/stories/${story.id}`} target="_blank">Vista previa interna</Link> : null}
      {readOnly ? <p className="text-sm">Solo lectura: un publicador debe realizar los cambios sobre contenido publicado.</p> : null}
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <StoryFields story={story} canPublish={canPublish} cases={cases} />
        <EditorialFields record={story} />
      </fieldset>

      <SubmitButton disabled={readOnly} icon="save" pendingLabel="Guardando...">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}

function CountryProfileForm({
  canPublish,
  action,
  errorPath,
  icon,
  profile,
  secondaryAction,
  submitLabel,
  title,
}: {
  canPublish: boolean;
  action: (formData: FormData) => Promise<void>;
  errorPath?: string;
  icon?: ReactNode;
  profile?: CountryProfile;
  secondaryAction?: ReactNode;
  submitLabel: string;
  title: string;
}) {
  const readOnly = !canPublish && profile?.status === "published";
  return (
    <form action={action} className="space-y-6 rounded-lg border border-[color:var(--color-border)] bg-white p-5">
      {errorPath ? <input name="backofficeErrorPath" type="hidden" value={errorPath} /> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ?? <FileText size={18} aria-hidden="true" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {secondaryAction}
          <SubmitButton disabled={readOnly} icon="save" pendingLabel="Guardando...">
            Guardar
          </SubmitButton>
        </div>
      </div>

      {profile ? <Link className="rise-action rounded-md border px-4 py-2 text-sm font-semibold" href={`/backoffice/preview/profiles/${profile.id}`} target="_blank">Vista previa interna</Link> : null}
      {readOnly ? <p className="text-sm">Solo lectura: un publicador debe realizar los cambios sobre contenido publicado.</p> : null}
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <CountryProfileFields profile={profile} canPublish={canPublish} />
        <EditorialFields record={profile} />
      </fieldset>

      <SubmitButton disabled={readOnly} icon="save" pendingLabel="Guardando...">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}

function sidebarLinkClass(isActive: boolean) {
  return `grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? "bg-[color:var(--color-primary)] text-white"
      : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-primary)]"
  }`;
}

function activeSectionTitle(section: BackofficeSection) {
  if (section === "profiles") {
    return "Perfiles de país";
  }

  if (section === "stories") {
    return "Historias de resiliencia";
  }

  return "Medidas de adaptación";
}

function sectionBackHref(section: BackofficeSection) {
  if (section === "profiles") {
    return "/backoffice?section=profiles";
  }

  if (section === "stories") {
    return "/backoffice?section=stories";
  }

  return "/backoffice";
}

function createHref(section: BackofficeSection) {
  if (section === "profiles") {
    return "/backoffice?section=profiles&profileMode=create";
  }

  if (section === "stories") {
    return "/backoffice?section=stories&storyMode=create";
  }

  return "/backoffice?mode=create";
}

function createLabel(section: BackofficeSection) {
  if (section === "profiles") {
    return "Nuevo perfil";
  }

  if (section === "stories") {
    return "Nueva historia";
  }

  return "Nueva medida";
}

function screenTitle(section: BackofficeSection, isCreating: boolean, isEditing: boolean) {
  if (!isCreating && !isEditing) {
    return "Administrar contenido";
  }

  if (section === "profiles") {
    return isCreating ? "Nuevo perfil de país" : "Editar perfil de país";
  }

  if (section === "stories") {
    return isCreating ? "Nueva historia" : "Editar historia";
  }

  return isCreating ? "Nueva medida" : "Editar medida";
}

function BackofficeSidebar({
  activeSection,
  counts,
}: {
  activeSection: BackofficeSection;
  counts: Record<BackofficeSection, number>;
}) {
  const items = [
    {
      count: counts.measures,
      href: "/backoffice",
      icon: <Plus size={17} aria-hidden="true" />,
      label: "Medidas",
      section: "measures" as const,
    },
    {
      count: counts.profiles,
      href: "/backoffice?section=profiles",
      icon: <FileText size={17} aria-hidden="true" />,
      label: "Perfiles",
      section: "profiles" as const,
    },
    {
      count: counts.stories,
      href: "/backoffice?section=stories",
      icon: <BookOpen size={17} aria-hidden="true" />,
      label: "Historias",
      section: "stories" as const,
    },
  ];

  return (
    <aside className="border-b border-[color:var(--color-border)] bg-white p-3 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-4">
      <div className="px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
          Backoffice
        </p>
        <p className="mt-1 text-lg font-semibold">Contenido RISE</p>
      </div>

      <nav aria-label="Secciones del backoffice" className="mt-3 grid gap-1">
        {items.map((item) => {
          const isActive = activeSection === item.section;

          return (
            <Link key={item.section} className={sidebarLinkClass(isActive)} href={item.href}>
              {item.icon}
              <span className="truncate">{item.label}</span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-muted)]"
                }`}
              >
                {item.count}
              </span>
            </Link>
          );
        })}
      </nav>

      <form action={logoutBackoffice} className="mt-4 border-t border-[color:var(--color-border)] pt-3">
        <SubmitButton fullWidth icon="logout" pendingLabel="Saliendo..." variant="secondary">
          Salir
        </SubmitButton>
      </form>
    </aside>
  );
}

function CompactStats({
  drafts,
  published,
  total,
}: {
  drafts: number;
  published: number;
  total: number;
}) {
  const stats = [
    { label: "Total", value: total },
    { label: "Publicadas", value: published },
    { label: "Borradores", value: drafts },
  ];

  return (
    <dl className="flex flex-wrap gap-2 text-xs">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-surface-muted)] px-2.5 py-1.5"
        >
          <dt className="font-semibold text-[color:var(--color-muted)]">{stat.label}</dt>
          <dd className="font-semibold text-[color:var(--color-text)]">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function BackofficePage({ searchParams }: BackofficePageProps) {
  const params = await searchParams;
  const token = await getBackofficeToken();

  if (!token) {
    return <LoginView error={params.error} />;
  }

  const user = await getBackofficeUser(token);
  if (!user) return <LoginView error="session" />;
  const canPublish = user.role === "publisher";

  const [casesResult, profilesResult, storiesResult] = await Promise.all([
    getBackofficeCases(token),
    getBackofficeCountryProfiles(token),
    getBackofficeStories(token),
  ]);
  const activeSection: BackofficeSection =
    params.section === "profiles" ? "profiles" : params.section === "stories" ? "stories" : "measures";
  const { cases } = casesResult;
  const { countryProfiles } = profilesResult;
  const { stories } = storiesResult;
  const isCreatingMeasure = activeSection === "measures" && params.mode === "create" && !params.edit;
  const isCreatingProfile =
    activeSection === "profiles" && params.profileMode === "create" && !params.profileEdit;
  const isCreatingStory =
    activeSection === "stories" && params.storyMode === "create" && !params.storyEdit;
  const editingMeasure =
    activeSection === "measures" && params.edit ? cases.find((item) => item.id === params.edit) : undefined;
  const editingProfile =
    activeSection === "profiles" && params.profileEdit
      ? countryProfiles.find((item) => item.id === params.profileEdit)
      : undefined;
  const editingStory =
    activeSection === "stories" && params.storyEdit
      ? stories.find((item) => item.id === params.storyEdit)
      : undefined;
  const isEditingMeasure = activeSection === "measures" && Boolean(params.edit);
  const isEditingProfile = activeSection === "profiles" && Boolean(params.profileEdit);
  const isEditingStory = activeSection === "stories" && Boolean(params.storyEdit);
  const isCreating = isCreatingMeasure || isCreatingProfile || isCreatingStory;
  const isEditing = isEditingMeasure || isEditingProfile || isEditingStory;
  const isFormScreen = isCreating || isEditing;
  const measureTab = !isFormScreen && ["import", "export", "synonyms"].includes(params.measureTab ?? "") ? params.measureTab : "measures";
  const activeItems =
    activeSection === "profiles" ? countryProfiles : activeSection === "stories" ? stories : cases;
  const activeError =
    activeSection === "profiles"
      ? profilesResult.error
      : activeSection === "stories"
        ? storiesResult.error
        : casesResult.error;

  if (casesResult.unauthorized || profilesResult.unauthorized || storiesResult.unauthorized) {
    return <LoginView error="session" />;
  }

  const sectionCounts = {
    measures: cases.length,
    profiles: countryProfiles.length,
    stories: stories.length,
  };
  const activePublishedCount = activeItems.filter((item) => item.status === "published").length;
  const activeDraftCount = activeItems.filter((item) => item.status === "draft").length;
  const currentSectionTitle = activeSectionTitle(activeSection);
  const currentCreateHref = createHref(activeSection);
  const currentCreateLabel = createLabel(activeSection);
  const currentScreenTitle = screenTitle(activeSection, isCreating, isEditing);
  const currentSectionBackHref = sectionBackHref(activeSection);

  return (
    <main className="min-h-screen bg-[color:var(--color-background)] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <BackofficeSidebar activeSection={activeSection} counts={sectionCounts} />

        <section className="min-w-0 px-4 py-6 md:px-6 lg:min-h-screen lg:px-8">
          <div className={`mx-auto space-y-5 ${isFormScreen ? "max-w-[980px]" : "max-w-[1120px]"}`}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--color-border)] pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {currentSectionTitle}
                </p>
                <h1 className="mt-2 text-3xl font-semibold">{currentScreenTitle}</h1>
                {!isFormScreen ? (
                  <div className="mt-3">
                    <CompactStats
                      drafts={activeDraftCount}
                      published={activePublishedCount}
                      total={activeItems.length}
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {isFormScreen ? (
                  <Link
                    className="rise-action inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                    href={currentSectionBackHref}
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Volver
                  </Link>
                ) : (
                  <Link
                    className="rise-action inline-flex items-center gap-2 rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-strong)]"
                    href={currentCreateHref}
                  >
                    {activeSection === "profiles" ? (
                      <FileText size={16} aria-hidden="true" />
                    ) : activeSection === "stories" ? (
                      <BookOpen size={16} aria-hidden="true" />
                    ) : (
                      <Plus size={16} aria-hidden="true" />
                    )}
                    {currentCreateLabel}
                  </Link>
                )}
              </div>
            </div>

        <p className="text-sm text-[color:var(--color-muted)]">Sesión de {user.name} · {canPublish ? "Publicador" : "Editor: puede preparar borradores y enviarlos a revisión. La publicación y los cambios sobre contenido publicado requieren un publicador."}</p>
        {params.detail ? <p role="alert" className="rounded-md border border-[color:var(--color-border)] bg-white p-4 text-sm text-[color:var(--color-primary)]">{params.detail}</p> : null}
        {!isFormScreen && activeSection === "measures" ? (
          <nav aria-label="Secciones de medidas" className="flex flex-wrap gap-2 border-b border-[color:var(--color-border)]">
            {[["measures", "MEDIDAS"], ["import", "IMPORTAR"], ["export", "EXPORTAR"]].map(([value, label]) => (
              <Link key={value} href={`/backoffice?section=measures&measureTab=${value}`} aria-current={measureTab === value ? "page" : undefined}
                className={`border-b-2 px-4 py-3 text-sm font-semibold ${measureTab === value ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]" : "border-transparent text-[color:var(--color-muted)]"}`}>
                {label}
              </Link>
            ))}
          </nav>
        ) : null}
        {!isFormScreen && activeSection !== "measures" ? <WorkbookPanel key={activeSection} kind={activeSection} /> : null}
        {!isFormScreen && activeSection === "measures" && (measureTab === "import" || measureTab === "export") ? <WorkbookPanel key={measureTab} kind="measures" mode={measureTab} /> : null}
        {!isFormScreen && activeSection === "measures" && measureTab === "synonyms" ? <TaxonomyPanel canPublish={canPublish} expanded /> : null}
        {activeSection === "profiles" ? (
          <Notice
            created={params.profileCreated}
            deleted={params.profileDeleted}
            entityLabel="Ficha de perfil"
            missingMessage="Completa el país. Puedes guardar un borrador con el resto de los campos incompletos."
            save={params.profileSave}
            updated={params.profileUpdated}
          />
        ) : activeSection === "stories" ? (
          <Notice
            created={params.storyCreated}
            entityLabel="Historia"
            missingMessage="Completa el título. Puedes guardar un borrador con el resto del contenido incompleto."
            save={params.storySave}
            updated={params.storyUpdated}
          />
        ) : (
          <Notice
            created={params.created}
            deleted={params.deleted}
            entityLabel="Medida"
            missingMessage="Completa el título. Las coordenadas son opcionales; debes cargar ambas o dejar ambas vacías."
            save={params.save}
            updated={params.updated}
          />
        )}

        {activeError ? (
          <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
            No se pudo leer el backend.
          </p>
        ) : null}

        {isCreatingMeasure ? (
          <MeasureForm
            canPublish={canPublish}
            action={createMeasure}
            errorPath="/backoffice?mode=create"
            secondaryAction={
              <Link className="text-sm font-semibold text-[color:var(--color-muted)]" href="/backoffice">
                Cancelar
              </Link>
            }
            submitLabel="Guardar medida"
            title="Nueva medida"
          />
        ) : null}

        {isCreatingProfile ? (
          <CountryProfileForm
            canPublish={canPublish}
            action={createCountryProfile}
            errorPath="/backoffice?section=profiles&profileMode=create"
            secondaryAction={
              <Link className="text-sm font-semibold text-[color:var(--color-muted)]" href="/backoffice?section=profiles">
                Cancelar
              </Link>
            }
            submitLabel="Guardar perfil"
            title="Nuevo perfil de país"
          />
        ) : null}

        {isCreatingStory ? (
          <StoryForm
            cases={cases}
            canPublish={canPublish}
            action={createStory}
            errorPath="/backoffice?section=stories&storyMode=create"
            secondaryAction={
              <Link className="text-sm font-semibold text-[color:var(--color-muted)]" href="/backoffice?section=stories">
                Cancelar
              </Link>
            }
            submitLabel="Guardar historia"
            title="Nueva historia"
          />
        ) : null}

        {activeSection === "measures" && params.edit ? (
          editingMeasure ? (
            <section className="space-y-4">
              <MeasureForm
            canPublish={canPublish}
                action={updateMeasure.bind(null, editingMeasure.id)}
                errorPath={`/backoffice?edit=${encodeURIComponent(editingMeasure.id)}`}
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
                <input
                  name="backofficeErrorPath"
                  type="hidden"
                  value={`/backoffice?edit=${encodeURIComponent(editingMeasure.id)}`}
                />
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
              No se encontró la medida seleccionada.
            </p>
          )
        ) : null}

        {activeSection === "profiles" && params.profileEdit ? (
          editingProfile ? (
            <section className="space-y-4">
              <CountryProfileForm
            canPublish={canPublish}
                action={updateCountryProfile.bind(null, editingProfile.id)}
                errorPath={`/backoffice?section=profiles&profileEdit=${encodeURIComponent(editingProfile.id)}`}
                icon={<Pencil size={18} aria-hidden="true" />}
                profile={editingProfile}
                secondaryAction={
                  <Link className="text-sm font-semibold text-[color:var(--color-muted)]" href="/backoffice?section=profiles">
                    Cancelar
                  </Link>
                }
                submitLabel="Guardar cambios"
                title="Editar perfil de país"
              />
              <form
                action={deleteCountryProfile.bind(null, editingProfile.id)}
                className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
              >
                <input
                  name="backofficeErrorPath"
                  type="hidden"
                  value={`/backoffice?section=profiles&profileEdit=${encodeURIComponent(editingProfile.id)}`}
                />
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Dar de baja perfil</h2>
                    <label className="mt-2 flex items-start gap-2 text-sm text-[color:var(--color-muted)]">
                      <input className="mt-1" name="confirmDelete" required type="checkbox" />
                      Confirmo que quiero eliminar este perfil del backoffice.
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
              No se encontró el perfil seleccionado.
            </p>
          )
        ) : null}

        {activeSection === "stories" && params.storyEdit ? (
          editingStory ? (
            <StoryForm
            cases={cases}
            canPublish={canPublish}
              action={updateStory.bind(null, editingStory.id)}
              errorPath={`/backoffice?section=stories&storyEdit=${encodeURIComponent(editingStory.id)}`}
              icon={<Pencil size={18} aria-hidden="true" />}
              secondaryAction={
                <Link className="text-sm font-semibold text-[color:var(--color-muted)]" href="/backoffice?section=stories">
                  Cancelar
                </Link>
              }
              story={editingStory}
              submitLabel="Guardar cambios"
              title="Editar historia"
            />
          ) : (
            <p className="rounded-md border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-primary)]">
              No se encontró la historia seleccionada.
            </p>
          )
        ) : null}

        {!isFormScreen && activeSection === "profiles" ? (
          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Perfiles cargados</h2>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                  Vista general de todos los perfiles de país creados.
                </p>
              </div>
            </div>
            <CountryProfilesTable activeId={editingProfile?.id} profiles={countryProfiles} />
          </section>
        ) : !isFormScreen && activeSection === "stories" ? (
          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Historias cargadas</h2>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                  Vista general de todos los relatos creados.
                </p>
              </div>
            </div>
            <StoriesTable activeId={editingStory?.id} stories={stories} />
          </section>
        ) : !isFormScreen && measureTab === "measures" ? (
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
        ) : null}
          </div>
        </section>
    </main>
  );
}
