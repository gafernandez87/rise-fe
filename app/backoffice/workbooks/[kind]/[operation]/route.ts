import { NextResponse } from "next/server";
import { getBackofficeToken } from "@/lib/backoffice-api";
import { siteConfig } from "@/lib/site";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
type Context = { params: Promise<{ kind: string; operation: string }> };
async function proxy(request: Request, context: Context) {
  const token = await getBackofficeToken();
  if (!token)
    return NextResponse.json(
      { message: "Inicia sesión para continuar." },
      { status: 401 },
    );
  const { kind, operation } = await context.params;
  if (
    !["measures", "stories", "profiles"].includes(kind) ||
    !["template", "export", "preview", "commit"].includes(operation)
  )
    return new Response(null, { status: 404 });
  if ((request.method === "GET") !== ["template", "export"].includes(operation))
    return new Response(null, { status: 405 });
  const url = new URL(request.url);
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  let body: BodyInit | undefined;
  if (request.method === "POST") {
    if (operation === "preview") {
      if (Number(request.headers.get("content-length")) > 6 * 1024 * 1024)
        return NextResponse.json(
          { message: "El archivo supera 5 MB." },
          { status: 413 },
        );
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File) || file.size > 5 * 1024 * 1024)
        return NextResponse.json(
          { message: "Selecciona un .xlsx de hasta 5 MB." },
          { status: 400 },
        );
      body = form;
    } else {
      headers["Content-Type"] = "application/json";
      body = await request.text();
    }
  }
  try {
    const response = await fetch(
      `${siteConfig.apiUrl}/admin/workbooks/${kind}/${operation}${url.search}`,
      {
        method: request.method,
        headers,
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(150_000),
      },
    );
    if (response.ok && operation === "commit") {
      revalidatePath("/backoffice");
      revalidatePath("/", "layout");
    }
    const result = new Response(await response.arrayBuffer(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
        "Cache-Control": "private, no-store",
        ...(response.headers.get("content-disposition")
          ? {
              "Content-Disposition": response.headers.get(
                "content-disposition",
              )!,
            }
          : {}),
      },
    });
    return result;
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con el backend. Vuelve a intentar." },
      { status: 502 },
    );
  }
}
export const GET = proxy;
export const POST = proxy;
