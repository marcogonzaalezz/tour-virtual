# Tour Virtual IA para Inmobiliarias

MVP completo en Next.js 15 · Claude API · Supabase · Resend · REimagineHome · n8n

## Stack

| Capa | Herramienta | Coste |
|---|---|---|
| Framework | Next.js 15 + TypeScript | Gratis |
| Deploy | Vercel | Gratis |
| Tour 360° | Kuula Pro (iframe embed) | €16/mes |
| Chatbot IA | Claude Haiku (Anthropic) | ~€0.01/sesión |
| Staging IA | REimagineHome API | €0.10/imagen |
| Emails | Resend API | Gratis hasta 3k/mes |
| Base de datos | Supabase (Postgres) | Gratis tier |
| Automatización | n8n | Self-hosted gratis |

## Arranque rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
# Rellenar todas las keys en .env.local
```

### 3. Crear la tabla en Supabase

Copiar y ejecutar `supabase-schema.sql` en el SQL Editor de tu proyecto Supabase.

### 4. Arrancar en local

```bash
npm run dev
# http://localhost:3000 → redirige a /piso/piso-ejemplo
```

### 5. Deploy en Vercel

```bash
npx vercel --prod
# Añadir las variables de entorno en Vercel Dashboard > Settings > Environment Variables
```

## Añadir un nuevo piso

1. Crear `data/pisos/nombre-del-piso.json` con la ficha técnica (copiar de `piso-ejemplo.json`)
2. Subir las fotos 360° a Kuula Pro y copiar la URL embed al campo `kuula_embed`
3. La URL del piso es automáticamente: `https://tudominio.com/piso/nombre-del-piso`

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       → Chatbot (Claude Haiku)
│   │   ├── lead/route.ts       → Guardar lead + emails
│   │   ├── staging/route.ts    → Proxy REimagineHome
│   │   └── piso/[slug]/route.ts → Datos del inmueble
│   └── piso/[slug]/page.tsx   → Página principal
├── components/
│   ├── TourEmbed.tsx           → iframe Kuula 360°
│   ├── Chatbot.tsx             → Chat IA contextualizado
│   ├── LeadForm.tsx            → Formulario + RGPD
│   ├── StagingSelector.tsx     → Decoración IA
│   └── FichaTecnica.tsx        → Datos del piso
└── lib/
    ├── pisos.ts                → Carga JSONs + system prompt
    ├── supabase.ts             → Cliente BD
    └── resend.ts               → Emails
```

## Workflow n8n

Importar `n8n-workflow.json` en tu instancia de n8n:
- Recibe leads vía webhook POST
- Valida RGPD y campos obligatorios
- Envía email al agente con historial del chatbot
- Envía confirmación al comprador
- Configura credenciales SMTP en n8n antes de activar

## Criterios de aceptación (PRD)

- [x] Tour carga en móvil (iPhone Safari, Chrome Android)
- [x] Chatbot responde en el idioma del usuario
- [x] Lead llega al agente en menos de 1 minuto
- [x] Staging genera imagen en menos de 20 segundos
- [x] URL compartible desde WhatsApp y email
- [x] RGPD: formulario no se puede enviar sin aceptar política
- [x] noindex en meta robots (exclusividad del cliente)

## Precio al cliente

| Concepto | Precio |
|---|---|
| Setup por inmueble | €300–400 |
| Mantenimiento mensual | €60–80/mes |
| Staging premium (10 renders) | €50 extra |
