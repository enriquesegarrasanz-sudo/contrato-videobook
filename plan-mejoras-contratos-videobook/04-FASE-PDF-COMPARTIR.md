# FASE 4 - PDF Profesional y Compartir

## Resumen
| Campo | Valor |
|-------|-------|
| **Dificultad** | Alta |
| **Modelo recomendado** | Opus (integracion de librerias externas, logica compleja) |
| **Depende de** | Fase 1, Fase 2 (historial necesario para actualizar status) |
| **Bloquea a** | Fase 6 |
| **Skills** | Ninguna especifica |
| **Subagentes** | general-purpose (investigar mejor libreria PDF para el caso de uso) |
| **Paralelizable con** | Fase 3, Fase 5 (parcialmente) |

---

## Objetivo
Reemplazar la generacion de PDF por dialogo de impresion con una solucion real que genere PDFs descargables. Anadir boton de WhatsApp para compartir. Comprimir las URLs para que no sean excesivamente largas.

---

## Tareas

### 4.1 Generacion real de PDF
**Problema**: Actualmente `doPrint()` abre una ventana nueva con `window.open('','_blank')`, escribe el HTML y llama a `window.print()`. Esto depende del navegador, no genera un archivo PDF real, y en movil muchas veces no funciona bien.

**Solucion**: Usar **html2canvas + jsPDF** via CDN para generar PDFs reales descargables.

**Que hacer**:
```
- Cargar html2canvas y jsPDF via CDN en el <head>
- Crear funcion generatePDF(spec, vals) que:
  1. Renderice el contrato en un div temporal oculto
  2. Use html2canvas para capturar el div como imagen
  3. Use jsPDF para crear el PDF con esa imagen
  4. Devuelva el blob/url del PDF
- Reemplazar doPrint() por la nueva funcion
- Reemplazar doPrintFill() para usar la nueva funcion
- En doClientSign(), generar PDF real y ofrecerlo como descarga
- Mostrar spinner/loading mientras se genera el PDF (puede tardar 1-2 segundos)
```

**CDNs a usar**:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js"></script>
```

### 4.2 Boton de compartir por WhatsApp
**Problema**: WhatsApp es el canal de comunicacion mas usado en Espana. No hay forma directa de enviar el contrato por WhatsApp.

**Que hacer**:
```
- En el modal de compartir (shareModal), anadir boton "Enviar por WhatsApp" junto a "Copiar"
- Usar la API de WhatsApp: https://wa.me/?text=ENCODED_MESSAGE
- El mensaje: "Hola! Te envio el contrato de [nombre_plantilla]. Puedes verlo y firmarlo aqui: [URL]"
- Boton verde con icono de WhatsApp
- Tambien anadir boton de WhatsApp en la vista de historial
```

### 4.3 Comprimir URLs
**Problema**: Las URLs generadas con `btoa(encodeURIComponent(JSON.stringify(...)))` pueden ser MUY largas, especialmente con plantillas custom que incluyen muchas clausulas. URLs de >2000 caracteres causan problemas en algunos navegadores y plataformas.

**Solucion**: Usar **pako** (libreria de compresion zlib) para comprimir el JSON antes de codificarlo en base64.

**Que hacer**:
```
- Cargar pako via CDN
- Modificar makeUrl(): JSON -> pako.deflate -> btoa (base64 de bytes comprimidos)
- Modificar decodeUrl(): atob -> pako.inflate -> JSON.parse
- Mantener retrocompatibilidad: si la URL empieza con 'Z' (pako), descomprimir; si no, usar el metodo antiguo
- Esto puede reducir las URLs un 50-70%
```

**CDN**:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>
```

### 4.4 Mejorar flujo de firma del cliente
**Que hacer**:
```
- Tras firmar, en vez de abrir mailto + print, mostrar un modal de exito con:
  a) Boton "Descargar PDF firmado" (descarga real)
  b) Boton "Enviar por email" (mailto como ahora)
  c) Mensaje de confirmacion profesional
- Actualizar el estado en el historial a 'signed' (si es posible via URL callback)
```

### 4.5 Preview del contrato antes de compartir
**Que hacer**:
```
- En el modal de compartir, el boton "Ver como cliente" ya existe
- Anadir un mini-preview del contrato dentro del modal (thumbnail)
- O mejor: anadir un paso intermedio donde se ve el contrato completo antes de confirmar
```

---

## Prompt para ejecutar esta fase

```
Lee el archivo index.html completo. Voy a pedirte mejoras en la generacion de PDF y el sistema de compartir. Todo dentro del mismo index.html.

1. PDF REAL:
   Anade en el <head> estos CDN:
   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js"></script>
   
   Crea una funcion async generatePDF(spec, vals, filename):
   - Crea un div temporal con id="pdf-render", posicion absolute, left: -9999px, width: 800px
   - Inserta el HTML del contrato (usa renderContract(spec, vals, false))
   - Anade los estilos del contrato inline en ese div (los de getPrintDoc)
   - Carga las fuentes esperando a que document.fonts.ready se resuelva
   - Usa html2canvas(div, { scale: 2, useCORS: true }) para capturarlo
   - Usa jsPDF para crear el PDF:
     const { jsPDF } = window.jspdf;
     const pdf = new jsPDF('p', 'mm', 'a4');
     Calcula el ratio para que quepa en A4 (210mm x 297mm) con margenes de 10mm
     Si el contenido es muy largo, divide en multiples paginas
   - Llama a pdf.save(filename || 'contrato.pdf')
   - Elimina el div temporal
   - Muestra toast "PDF descargado" al completar
   
   Reemplaza doPrintFill() para que llame a generatePDF() con el nombre del contrato.
   
   En doClientSign(), reemplaza la llamada a doPrint() por:
   - Mostrar un overlay de loading "Generando PDF firmado..."
   - Llamar a generatePDF(d.spec, finalVals, 'contrato-firmado.pdf')
   - Al completar, mostrar modal de exito con boton de descarga y boton de email
   
   Mantener la opcion de "Imprimir" como alternativa (por si el PDF falla).

2. WHATSAPP:
   En el modal de compartir (#shareModal), anade un boton verde debajo del boton "Copiar":
   - Texto: "Enviar por WhatsApp"
   - Color: #25D366 (verde WhatsApp)
   - onclick: abre wa.me con mensaje predefinido que incluya la URL del contrato
   - Icono SVG de WhatsApp
   
   Anade CSS para .btn-whatsapp { background: #25D366; color: #fff; }

3. COMPRIMIR URLS:
   Anade CDN de pako:
   <script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>
   
   Modifica makeUrl():
   - Donde hacia: btoa(encodeURIComponent(payload))
   - Ahora: 'Z' + btoa(String.fromCharCode(...pako.deflate(new TextEncoder().encode(payload))))
   - El prefijo 'Z' indica URL comprimida
   
   Modifica decodeUrl():
   - Si c empieza por 'Z': extraer c.slice(1), atob -> Uint8Array -> pako.inflate -> TextDecoder -> JSON.parse
   - Si c NO empieza por 'Z': usar el metodo antiguo (retrocompatibilidad con URLs ya enviadas)

4. MODAL POST-FIRMA:
   Tras doClientSign(), en vez de solo toast + mailto, muestra un modal profesional:
   - Icono de check verde grande
   - Titulo: "Contrato firmado correctamente"
   - Boton principal: "Descargar PDF firmado" (llama a generatePDF de nuevo o reutiliza el generado)
   - Boton secundario: "Enviar por email" (el mailto actual)
   - Boton terciario: "Cerrar"
```

---

## Verificacion Post-Fase

- [ ] Pulsar "Imprimir / PDF" genera un archivo PDF real que se descarga
- [ ] El PDF tiene buena calidad (texto legible, firmas visibles)
- [ ] Si el contrato es largo, el PDF tiene multiples paginas
- [ ] El boton de WhatsApp abre WhatsApp con mensaje y URL del contrato
- [ ] Las URLs comprimidas son significativamente mas cortas que las antiguas
- [ ] URLs antiguas (sin comprimir) siguen funcionando (retrocompatibilidad)
- [ ] Tras firmar el cliente, aparece modal con opciones claras
- [ ] El PDF firmado incluye ambas firmas y los checkboxes marcados
- [ ] En movil, la generacion de PDF funciona correctamente
- [ ] 0 errores en consola del navegador
