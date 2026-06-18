# Rise FE - Wiki tecnica

## Proposito

Frontend publico y administrativo de Rise.

Este proyecto contiene la landing, el mapa interactivo, las paginas individuales de casos de adaptacion y las primeras pantallas del backoffice.

## Stack

- Next.js con App Router.
- TypeScript.
- Tailwind CSS.
- Leaflet y React Leaflet para mapa.
- React Hook Form y Zod para formularios y validaciones futuras.
- Vercel para deploy.

## Estructura principal

```text
app/
  page.tsx                 Landing publica
  mapa/page.tsx            Mapa interactivo
  casos/[slug]/page.tsx    Detalle publico con SEO
  admin/                   Pantallas administrativas
components/
  cases/                   Componentes de casos
  layout/                  Header y layout compartido
  map/                     Componentes de mapa
lib/
  api.ts                   Cliente de API con fallback placeholder
  placeholders.ts          Datos temporales hasta conectar backend
  site.ts                  Configuracion general del sitio
types/
  cases.ts                 Tipos compartidos del frontend
```

## Variables de entorno

Copiar `.env.example` a `.env.local` para desarrollo local.

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

En Vercel, `NEXT_PUBLIC_SITE_URL` debe apuntar al dominio productivo.

## Comandos

```bash
npm run dev
npm run lint
npm run build
```

Usar Node 22, indicado en `.nvmrc`.

## Flujo de datos

- El frontend consume la API definida en `NEXT_PUBLIC_API_URL`.
- Mientras la API no este disponible, `lib/api.ts` usa datos placeholder para permitir avanzar con UI.
- El mapa consume `/cases/map`.
- Las paginas individuales consumen `/cases/:slug`.
- El sitemap dinamico usa los casos publicados disponibles desde la API o placeholders.

## SEO

Las paginas individuales en `app/casos/[slug]/page.tsx` generan:

- Title y description dinamicos.
- Canonical URL.
- Open Graph.
- Twitter Cards.
- JSON-LD tipo `Article`.

Tambien existen:

- `app/sitemap.ts`
- `app/robots.ts`

## UI y diseño

La identidad visual definitiva esta pendiente.

Por ahora, las variables base viven en `app/globals.css`:

- Colores.
- Fuente.
- Espaciados.
- Radios.
- Sombras.

Cuando se definan marca y lineamientos, ajustar primero esas variables y despues componentes especificos si hace falta.

## Backoffice

El backoffice actual es una base visual inicial.

Pantallas existentes:

- `/admin/login`
- `/admin/casos`
- `/admin/casos/nuevo`
- `/admin/casos/[id]`

Pendiente:

- Conectar login con JWT.
- Persistir token.
- Proteger rutas admin.
- Conectar CRUD real.
- Agregar formularios completos de alta y edicion.

## Mapa

El mapa esta en:

- `components/map/map-loader.tsx`
- `components/map/cases-map.tsx`

`map-loader.tsx` existe porque Leaflet depende del navegador y debe cargarse como componente cliente.

Pendiente:

- Agregar clustering de pines.
- Conectar filtros con query params/API.
- Ajustar estados de loading, error y sin resultados.

## Buenas practicas

- Reutilizar componentes antes de crear variantes nuevas.
- Mantener componentes chicos y claros.
- Evitar credenciales en frontend.
- No duplicar tipos si pueden centralizarse en `types/`.
- Mantener SEO y accesibilidad en paginas publicas.

