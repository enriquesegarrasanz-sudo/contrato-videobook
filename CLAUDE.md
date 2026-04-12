# CLAUDE.md — Gestor de Plantillas de Contratos

## Qué es
Aplicación de uso personal para gestionar plantillas de contratos. Sin login ni backend.

## Stack
- HTML + CSS + JS vanilla
- Todo en un único archivo: `index.html` (~2100 líneas)

## Datos
- `localStorage` con clave `"contracts_v2"` para almacenar plantillas personalizadas

## Compartir contratos
- URL con parámetro `?c=` codificado en base64 (`btoa` / `atob`)

## Firma
- El prestador escribe su firma al generar el enlace
- El cliente firma al abrir el enlace compartido

## Email
- Se usa `mailto:` con ambos emails como destinatarios tras la firma del cliente

## Servidor de desarrollo
```bash
npx serve -p 3400
```
Configurado en `.claude/launch.json`

## Seguridad
- `esc()` escapa todo `innerHTML` para prevenir XSS
- CSP meta tag en el `<head>` del HTML
