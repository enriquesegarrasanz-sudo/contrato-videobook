# FASE 1 - Seguridad y Cimientos

## Resumen
| Campo | Valor |
|-------|-------|
| **Dificultad** | Media |
| **Modelo recomendado** | Sonnet (rapido, bueno para refactoring estructurado) |
| **Depende de** | Ninguna fase |
| **Bloquea a** | Todas las demas fases |
| **Skills** | `security-auditor` (al finalizar) |
| **Subagentes** | Explore (buscar puntos de inyeccion) |

---

## Objetivo
Establecer una base segura y robusta antes de anadir funcionalidades. Corregir vulnerabilidades XSS, anadir validacion de entrada, y refactorizar el codigo duplicado de firma para facilitar las fases siguientes.

---

## Tareas

### 1.1 Implementar funcion `esc()` real y aplicarla
**Problema**: CLAUDE.md menciona que `esc()` escapa `innerHTML` para prevenir XSS, pero la funcion no existe en el codigo. En `renderContract()` los valores del usuario se insertan directamente en el HTML via template literals sin escapar.

**Que hacer**:
```
- Crear la funcion esc(str) que escape &, <, >, " y '
- Aplicarla en TODOS los puntos donde se usa v() dentro de renderContract()
- Aplicarla en renderHome() donde se muestra t.name y t.description
- Aplicarla en el wizard donde se muestran valores del usuario
- NO aplicarla donde el HTML es intencional (como spec.priceIntro que usa <strong>)
```

**Puntos criticos a escapar** (lineas aproximadas):
- `renderContract()` linea 1181+: v(vals, 'provider_name'), v(vals, 'client_name'), v(vals, 'city'), etc.
- `renderHome()` linea 1493+: `t.name`, `t.description`
- `renderFill()` linea 1599+: `tpl.name`
- `renderCreate()` linea 1964+: valores del wizard

### 1.2 Validacion de campos antes de compartir
**Problema**: Se puede generar un enlace con todos los campos vacios, lo cual produce un contrato inutilizable.

**Que hacer**:
```
- En doShare(), validar que al menos provider_name y provider_sig esten rellenos
- Mostrar toast con mensaje claro si falta algo
- Resaltar visualmente los campos obligatorios (borde rojo o similar)
- Marcar con asterisco (*) los campos obligatorios en el formulario
```

### 1.3 Refactorizar logica de firma duplicada
**Problema**: El codigo de inicializacion del canvas de firma esta copiado 3 veces con variaciones minimas:
- `initProviderSigCanvas()` (linea 1743)
- `initProviderContractCanvas()` (linea 1791)
- `initClientSigCanvas()` (linea 1819)

**Que hacer**:
```
- Crear una funcion generica initSigCanvas(canvasId, options)
- options = { onDraw: callback, onEnd: callback }
- Reemplazar las 3 funciones por llamadas a la generica
- Mantener clearProviderSig(), clearClientSig() como wrappers simples
```

### 1.4 Revisar y reforzar CSP
**Problema**: CLAUDE.md menciona CSP meta tag pero hay que verificar que sea correcto y cubra las fuentes externas (Google Fonts).

**Que hacer**:
```
- Verificar que el meta CSP existe y es correcto
- Asegurar que permite Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
- Asegurar que bloquea scripts inline peligrosos (usar nonce si es necesario)
- Asegurar que data: esta permitido para las firmas en base64
```

### 1.5 Manejo de errores basico
**Que hacer**:
```
- Envolver decodeUrl() en try-catch robusto con mensaje al usuario
- Manejar el caso de URL corrupta mostrando mensaje amigable en vez de pagina rota
- Anadir fallback si localStorage no esta disponible (modo incognito en Safari)
```

---

## Prompt para ejecutar esta fase

```
Lee el archivo index.html completo de la aplicacion de contratos. Necesito que hagas lo siguiente, en este orden:

1. FUNCION ESC(): Crea una funcion `function esc(s)` que convierta &, <, >, " y ' en sus entidades HTML. Luego busca TODOS los lugares en renderContract(), renderHome(), renderFill() y renderCreate() donde se insertan valores del usuario (no contenido HTML intencional como priceIntro) y envuelvelos con esc(). La funcion v() deberia llamar a esc() internamente para los valores del usuario.

2. VALIDACION: En la funcion doShare(), antes de generar la URL, valida que provider_name tenga valor. Si falta, muestra un toast "Rellena al menos tu nombre como prestador" y haz return. Anade class="req" al label de Nombre del prestador.

3. REFACTORIZAR FIRMA: Crea una funcion generica `initSigCanvas(canvasId, opts)` que encapsule toda la logica de dibujo en canvas (mousedown, mousemove, mouseup, mouseleave, touchstart, touchmove, touchend). opts = { onDraw: fn, onEnd: fn }. Luego reemplaza initProviderSigCanvas, initProviderContractCanvas e initClientSigCanvas por llamadas a esta funcion generica, pasando los callbacks apropiados.

4. ERRORES: Mejora decodeUrl() para que si el JSON es invalido o la estructura no es la esperada, devuelva null y muestre un toast "Este enlace de contrato no es valido o ha expirado". En render(), si c existe pero decodeUrl devuelve null, muestra una pagina con mensaje de error en vez de redirigir silenciosamente a home.

Mantente dentro del archivo index.html unico. No cambies la estructura visual ni el diseno. Solo seguridad y robustez.
```

---

## Verificacion Post-Fase

- [ ] La funcion `esc()` existe y se usa en todos los puntos de insercion de datos del usuario
- [ ] Intentar inyectar `<script>alert(1)</script>` en un campo de nombre -> se muestra como texto
- [ ] Compartir un contrato con campos vacios -> muestra toast de validacion
- [ ] Las 3 firmas siguen funcionando identicamente (prestador fill, prestador contrato, cliente)
- [ ] Una URL corrupta muestra mensaje amigable, no pagina rota
- [ ] Ejecutar skill `security-auditor` y resolver cualquier hallazgo
- [ ] 0 errores en consola del navegador
