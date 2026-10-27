import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchBackofficeApi, getBackofficeToken } from "@/lib/backoffice-api";
import { siteConfig } from "@/lib/site";
import type { EditorialMetadata } from "@/types/editorial";
import type { CountryProfile } from "@/types/country-profiles";
import { CountryProfileSections } from "@/components/countries/country-profile-sections";

export default async function EditorialPreview({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  const token = await getBackofficeToken();
  if (!token) redirect("/backoffice");
  const { kind, id } = await params;
  const resources: Record<string, string> = {
    measures: "cases",
    stories: "stories",
    profiles: "country-profiles",
  };
  if (!resources[kind]) notFound();
  const response = await fetchBackofficeApi(
    `${siteConfig.apiUrl}/admin/${resources[kind]}/${encodeURIComponent(id)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (response.status === 401) redirect("/backoffice");
  if (!response.ok) notFound();
  const record = (await response.json()) as EditorialMetadata &
    Record<string, unknown>;
  const title = String(record.title ?? record.name ?? "Vista previa");
  const labels: Record<string, string> = {
    country: "País",
    territory: "Territorio",
    locality: "Localidad",
    threat: "Amenaza",
    measureType: "Tipo de medida",
    sector: "Sector",
    implementationStage: "Etapa de implementación",
    fullDescription: "Descripción",
    content: "Historia",
    objectives: "Objetivos",
    proposedSolutions: "Soluciones propuestas",
    youthRole: "Participación juvenil",
    results: "Resultados",
    riskAnalysis: "Análisis de riesgo",
    climateThreats: "Amenazas climáticas",
    exposureAndVulnerabilities: "Exposición y vulnerabilidades",
    adaptationMeasures: "Medidas de adaptación",
    strategicAlliances: "Alianzas",
    scalability: "Escalabilidad",
    longTermSustainability: "Sostenibilidad",
  };
  return (
    <main className="page-shell space-y-6 py-10">
      <Link
        href="/backoffice"
        className="rise-action rounded-md border bg-white px-4 py-2 text-sm"
      >
        Volver al backoffice
      </Link>
      <p className="rounded-lg border bg-white p-4 text-sm">
        Vista previa interna · Estado:{" "}
        {{
          draft: "Borrador",
          review: "En revisión",
          published: "Publicado",
          archived: "Archivado",
          hidden: "Oculto",
        }[String(record.status) as "draft"] ?? String(record.status)}
        . Esta vista requiere una sesión del equipo y no publica el contenido.
      </p>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="whitespace-pre-wrap text-lg">
        {String(record.shortDescription ?? record.summary ?? "")}
      </p>
      {kind === "profiles" ? (
        <CountryProfileSections profile={record as unknown as CountryProfile} locale="es" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(labels)
            .filter(([key]) => record[key])
            .map(([key, label]) => (
              <section key={key} className="rounded-lg border bg-white p-5">
                <h2 className="text-lg font-semibold">{label}</h2>
                <p className="mt-2 whitespace-pre-wrap leading-7">
                  {String(record[key])}
                </p>
              </section>
            ))}
        </div>
      )}
      <section className="rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">Fuentes</h2>
        {record.referenceRecords?.length ? (
          <ul className="mt-3 space-y-3">
            {record.referenceRecords.map((source, index) => (
              <li key={index}>
                <p>
                  {source.title} · {source.organization} · {source.year}
                </p>
                {source.url ? (
                  <a className="break-words underline" href={source.url}>
                    {source.url}
                  </a>
                ) : null}
                <p>{source.reviewed ? "Revisada" : "Pendiente de revisión"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2">
            Sin fuentes estructuradas. Completa y revisa una antes de publicar.
          </p>
        )}
      </section>
    </main>
  );
}
