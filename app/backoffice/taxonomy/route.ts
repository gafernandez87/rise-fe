import { NextResponse } from "next/server";
import { getBackofficeToken } from "@/lib/backoffice-api";
import { siteConfig } from "@/lib/site";
import { revalidatePath } from "next/cache";
export async function GET() {
  const token = await getBackofficeToken();
  if (!token)
    return NextResponse.json({ message: "Inicia sesión." }, { status: 401 });
  try {
    const response = await fetch(`${siteConfig.apiUrl}/admin/taxonomy`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return unavailable();
  }
}
export async function PATCH(request: Request) {
  const token = await getBackofficeToken();
  if (!token)
    return NextResponse.json({ message: "Inicia sesión." }, { status: 401 });
  let body: { id?: unknown; aliases?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Solicitud no válida." },
      { status: 400 },
    );
  }
  if (
    typeof body?.id !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      body.id,
    )
  )
    return NextResponse.json(
      { message: "Categoría no válida." },
      { status: 400 },
    );
  try {
    const response = await fetch(
      `${siteConfig.apiUrl}/admin/taxonomy/${body.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aliases: body.aliases }),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (response.ok) revalidatePath("/", "layout");
    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return unavailable();
  }
}

function unavailable() {
  return NextResponse.json(
    { message: "No se pudo conectar con el backend. Vuelve a intentar." },
    { status: 502 },
  );
}
