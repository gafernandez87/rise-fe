This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Pruebas de responsive y teclado

Con el frontend y la API ya en ejecución, gestionados manualmente, ejecutar:

```bash
PLAYWRIGHT_CHANNEL=chrome npm run test:responsive
```

Usa Google Chrome instalado. Si Playwright ya tiene Chromium instalado, se puede omitir `PLAYWRIGHT_CHANNEL=chrome`. Para otra URL, definir `PLAYWRIGHT_BASE_URL`.

Estas pruebas **no inician servidores ni ejecutan builds**. Comprueban 360 y 390 px en español, inglés y portugués, fichas publicadas de cada tipo, anchos próximos a los cambios de diseño, textos largos, etiquetas y navegación por teclado. Los carruseles y las tablas pueden desplazarse dentro de su propio contenedor; la página no debe tener desbordamiento horizontal. Las trazas de fallos quedan en `test-results/`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
