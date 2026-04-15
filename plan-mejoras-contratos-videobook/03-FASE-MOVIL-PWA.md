# FASE 3 - Experiencia Movil y PWA

## Resumen
| Campo | Valor |
|-------|-------|
| **Dificultad** | Media |
| **Modelo recomendado** | Sonnet (CSS responsive, manifest, service worker) |
| **Depende de** | Fase 1 |
| **Bloquea a** | Fase 6 |
| **Skills** | Ninguna especifica |
| **Subagentes** | Ninguno |
| **Paralelizable con** | Fase 2, Fase 5 |

---

## Objetivo
Optimizar la experiencia en dispositivos moviles (donde el cliente firmara el contrato) y convertir la app en una PWA instalable que funcione offline.

---

## Tareas

### 3.1 Mejorar la firma en movil
**Problema**: El canvas de firma tiene 300x80px fijos. En moviles es diminuto e incomodo de usar. El area tactil es muy pequena.

**Que hacer**:
```
- Hacer que el canvas ocupe el 100% del ancho disponible
- En movil, aumentar la altura del canvas a 120px minimo
- Anadir mensaje "Firma con tu dedo" en movil
- Mejorar el grosor del trazo en movil (lineWidth: 2.5 en vez de 2)
- Prevenir scroll accidental mientras se firma (ya tiene touch-action: none, verificar)
```

### 3.2 Responsive mejorado para pantallas pequenas
**Problema**: En 600px cambian algunas cosas pero la experiencia no es optima.

**Que hacer**:
```
- Header: reducir padding, logo mas pequeno en movil
- Pack selector: 1 columna en <400px (actualmente 3 columnas siempre)
- Sign action bar: reducir padding en movil
- Contract sheet: padding mas compacto en movil (ya tiene 32px 24px, verificar)
- Wizard: steps mas compactos, dots mas pequenos
- Modal: full-width en movil con bordes redondeados solo arriba
- Consent checkboxes: area tactil mas grande (min 44px segun Apple HIG)
- Botones: min-height 44px en movil para area tactil adecuada
```

### 3.3 Favicon y meta tags
**Que hacer**:
```
- Crear favicon SVG inline (diamante dorado, coherente con el logo)
- Anadir meta tags: theme-color, apple-mobile-web-app-capable, etc.
- Anadir Open Graph tags para cuando se comparta la URL en redes/WhatsApp
```

### 3.4 PWA - Manifest y Service Worker
**Que hacer**:
```
- Crear manifest.json con: name, short_name, icons, start_url, display: standalone
- Crear service-worker.js basico que cachee index.html y las fuentes de Google
- Registrar el service worker desde index.html
- Estrategia: cache-first para assets estaticos, network-first para la app
```

**Nota**: Esto requiere crear 2 archivos adicionales (manifest.json y sw.js), ademas del index.html.

### 3.5 Scroll suave y foco
**Que hacer**:
```
- Cuando el cliente abre un contrato compartido en movil, hacer scroll automatico al primer campo editable
- Al firmar, hacer scroll al canvas de firma
- Al mostrar un toast, asegurar que sea visible (no quede oculto por el teclado)
```

---

## Prompt para ejecutar esta fase

```
Lee el archivo index.html completo. Necesito mejorar la experiencia movil y convertir la app en PWA. Todo dentro del mismo index.html excepto manifest.json y sw.js que seran archivos nuevos.

1. FIRMA EN MOVIL:
   - En la clase .sig-canvas, cambia width de fijo a 100%. Usa CSS para que el canvas se adapte al contenedor.
   - Anade un media query para movil (<600px): .sig-canvas { height: 120px; }
   - En initSigCanvas() (la funcion generica de Fase 1), ajusta lineWidth a 2.5 si window.innerWidth < 600
   - Anade un texto "Dibuja tu firma aqui" como placeholder visual en el canvas vacio

2. RESPONSIVE MEJORADO:
   Anade estos estilos en el media query de 600px o crea uno nuevo para 400px:
   - .pack-selector en <400px: grid-template-columns: 1fr (una columna)
   - .app-header: padding: 0 16px; height: 52px
   - .logo: font-size: 16px
   - .btn: min-height: 44px (area tactil Apple HIG)
   - .consent-check: width: 22px; height: 22px (area tactil mayor)
   - .consent-row: gap: 14px; padding: 12px 0
   - .modal en <600px: border-radius: 14px 14px 0 0; max-width: 100%; margin-top: auto (pegado abajo)
   - .sign-action-bar: padding: 20px 16px; margin: 20px 12px 40px

3. FAVICON Y META TAGS:
   Anade en el <head>:
   - <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,..."> con un diamante dorado SVG
   - <meta name="theme-color" content="#111111">
   - <meta name="apple-mobile-web-app-capable" content="yes">
   - <meta name="apple-mobile-web-app-status-bar-style" content="black">
   - <meta property="og:title" content="Mis Contratos">
   - <meta property="og:description" content="Gestiona y comparte contratos profesionales">

4. PWA:
   Crea manifest.json en la raiz del proyecto con:
   { "name": "Mis Contratos", "short_name": "Contratos", "start_url": "/", "display": "standalone", "background_color": "#F7F5F0", "theme_color": "#111111", "icons": [{ "src": "data:image/svg+xml,...", "sizes": "any", "type": "image/svg+xml" }] }
   
   Crea sw.js basico:
   - Cache name: 'contratos-v1'
   - En install: cachear '/', '/index.html'
   - En fetch: cache-first para archivos cacheados, network-first para el resto
   
   En index.html, al final del <script>, registra el service worker:
   if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
   
   Anade en <head>: <link rel="manifest" href="/manifest.json">

5. SCROLL INTELIGENTE:
   - En renderContractPage(), tras el render, si hay campos .contract-inline-input, haz scrollIntoView del primero con { behavior: 'smooth', block: 'center' } tras un setTimeout de 500ms
   - Al pulsar "Firmar y confirmar" con boton deshabilitado, en vez de no hacer nada, haz scroll al elemento que falta (firma o checkbox)
```

---

## Verificacion Post-Fase

- [ ] En movil (o viewport 375px): la firma ocupa todo el ancho y es comoda
- [ ] En movil: los botones tienen min 44px de altura tactil
- [ ] En movil: el modal aparece pegado abajo como una sheet
- [ ] En movil: el pack selector se ve en 1 columna en pantallas muy estrechas
- [ ] El favicon (diamante dorado) aparece en la pestana del navegador
- [ ] Al compartir la URL en WhatsApp, aparece titulo y descripcion en la preview
- [ ] La app se puede instalar como PWA (icono "Instalar" en Chrome)
- [ ] Con el service worker activo, la app carga offline (al menos la pagina principal)
- [ ] Al abrir contrato compartido en movil, hace scroll al primer campo editable
- [ ] 0 errores en consola del navegador
