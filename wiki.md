# Rise FE - Wiki tecnica

## Proposito

Frontend publico y administrativo de Rise.

Contiene la landing, el mapa interactivo, paginas individuales de medidas/casos de adaptacion y el backoffice temporal para cargar medidas.

## Stack

- Next.js con App Router.
- React 19.
- TypeScript.
- Tailwind CSS.
- Leaflet y React Leaflet para mapa.
- React Hook Form y Zod disponibles para formularios y validaciones futuras.
- Server Actions para el backoffice temporal.
- Vercel para deploy.

## Estructura principal

```text
app/
  page.tsx                      Landing publica
  mapa/page.tsx                 Mapa interactivo
  casos/[slug]/page.tsx         Detalle publico con SEO
  backoffice/page.tsx           Backoffice temporal protegido por clave
  backoffice/actions.ts         Login, logout y acciones CRUD de medidas
  backoffice/submit-button.tsx  Boton de formulario con estado de carga
  admin/                        Pantallas admin placeholder previas
components/
  cases/                        Componentes de casos
  layout/                       Header y layout compartido publico
  map/                          Componentes de mapa
  pages/                        Vistas publicas
lib/
  api.ts                        Cliente de API publica con fallback placeholder
  backoffice-api.ts             Cliente server-side para endpoints admin
  placeholders.ts               Datos temporales si la API no responde
  site.ts                       Configuracion general del sitio
types/
  cases.ts                      Tipos compartidos del frontend
```

## Variables de entorno

Copiar `.env.example` a `.env.local` para desarrollo local.

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BACKOFFICE_ADMIN_EMAIL=backoffice@rise.local
```

`BACKOFFICE_ADMIN_EMAIL` se usa solo en servidor para el login del backoffice. La password no se guarda en el frontend.

En Vercel, `NEXT_PUBLIC_SITE_URL` debe apuntar al dominio productivo.

## Comandos

```bash
npm run dev
npm run lint
npm run build
```

Usar Node 22, indicado en `.nvmrc`.

## Flujo de datos publico

- El frontend consume la API definida en `NEXT_PUBLIC_API_URL`.
- Mientras la API no este disponible, `lib/api.ts` usa datos placeholder para permitir avanzar con UI.
- El mapa consume `/cases/map`.
- Las paginas individuales consumen `/cases/:slug`.
- El sitemap dinamico usa los casos publicados disponibles desde la API o placeholders.

## Backoffice

Ruta principal:

```text
/backoffice
```

Caracteristicas actuales:

- Protegido por clave temporal.
- No muestra el header publico.
- Login via Server Action contra `POST /auth/login`.
- Usa `BACKOFFICE_ADMIN_EMAIL` y la password ingresada por formulario.
- Guarda el JWT en una cookie `HttpOnly` llamada `rise_backoffice_token`.
- Lee listado administrativo desde `GET /admin/cases`.
- Muestra las medidas en una tabla de administracion.
- Expone un boton superior para crear una medida nueva.
- Permite editar desde cada fila de la tabla.
- Los formularios muestran estado de carga mientras envian acciones.
- Crea medidas con `POST /admin/cases`.
- Edita medidas existentes con `PATCH /admin/cases/:id`.
- Elimina medidas existentes con `DELETE /admin/cases/:id` y confirmacion por checkbox.
- Permite cargar los campos principales definidos por la planilla de medidas.

Campos incluidos en el formulario:

- Titulo, slug, estado, severidad.
- Pais, localidad, jurisdiccion subnacional, ecorregion.
- Latitud, longitud, fecha de implementacion, foto URL.
- Amenaza, sector/tipo de medida, alcance, enfoque adaptativo.
- Resumen, descripcion completa, perfil de vulnerabilidad, objetivos.
- Soluciones propuestas, comunidades beneficiarias, rol de juventud, resultados.
- Contacto, financiamiento, problematica climatica local, contexto nacional.
- Alianzas, factores habilitantes, co-beneficios, escalabilidad, sostenibilidad y documentos.

Las rutas antiguas bajo `/admin` siguen existiendo como pantallas placeholder heredadas, pero el flujo activo temporal esta en `/backoffice`.

## Mapa

Componentes principales:

- `components/map/map-loader.tsx`
- `components/map/cases-map.tsx`
- `components/map/map-explorer.tsx`

`map-loader.tsx` existe porque Leaflet depende del navegador y debe cargarse como componente cliente.

El mapa ahora usa campos reales cuando vienen del backend:

- `threat` para amenaza/riesgo.
- `measureType` para sector o tipo de medida.
- `ecoregion`, `locality` o `region` para territorio.
- `youthRole` para filtros relacionados con actor.
- `coverImageUrl` o imagen de portada.

Si esos campos no vienen, conserva los fallback de severidad, categoria y placeholder.

## Tipos

Los tipos viven en `types/cases.ts`.

`AdaptationCase` incluye campos extendidos de la ficha de medidas. `MapCase` es el subconjunto optimizado para el mapa.

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

`robots.ts` bloquea `/admin/` y `/backoffice/`.

## UI y diseno

Las variables base viven en `app/globals.css`:

- Colores.
- Fuente.
- Espaciados.
- Radios.
- Sombras.

El header publico esta en `components/layout/site-header.tsx`. No se renderiza en `/backoffice`.

## Datos de prueba

Hay dos medidas publicadas en Supabase para validar el flujo:

- `test-restauracion-humedales-valdivia-chile`
- `test-cosecha-agua-huertas-oaxaca-mexico`

Deberian aparecer en el mapa si el backend esta disponible y `NEXT_PUBLIC_API_URL` apunta a la API correcta.

## Pendiente

- Agregar estados de loading y error mas finos.
- Agregar importacion masiva desde Google Sheets o archivo.
- Reemplazar la clave temporal por un flujo admin definitivo si el proyecto lo requiere.
- Mejorar validaciones del formulario con Zod/React Hook Form.

## Buenas practicas

- Reutilizar componentes antes de crear variantes nuevas.
- Mantener componentes chicos y claros.
- Evitar credenciales en frontend.
- Mantener Server Actions con verificacion de sesion antes de mutar datos.
- No duplicar tipos si pueden centralizarse en `types/`.
- Mantener SEO y accesibilidad en paginas publicas.
