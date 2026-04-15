# FASE 6 - Accesibilidad

## Resumen
| Campo | Valor |
|-------|-------|
| **Dificultad** | Media |
| **Modelo recomendado** | Sonnet (ARIA, semantica, sin logica compleja) |
| **Depende de** | Fase 1, 2, 3, 5 (necesita que el HTML final este casi completo) |
| **Bloquea a** | Fase 7 |
| **Skills** | Ninguna especifica |
| **Subagentes** | Ninguno |

---

## Objetivo
Asegurar que la aplicacion es usable con teclado, compatible con lectores de pantalla, y cumple los criterios basicos de WCAG 2.1 nivel AA.

---

## Tareas

### 6.1 Semantica HTML
**Que hacer**:
```
- Cambiar <div class="page-title"> por <h1> donde corresponda
- Usar <nav> para la navegacion del header
- Usar <main> para el contenido principal (#root)
- Usar <section> para las secciones del contrato
- Usar <footer> para los pies de panel
- Asegurar que los formularios usan <fieldset> y <legend> donde tiene sentido
- El wizard debe usar <form> para cada paso
```

### 6.2 ARIA labels y roles
**Que hacer**:
```
- Botones sin texto visible: anadir aria-label (ej: boton de borrar firma)
- Canvas de firma: aria-label="Area de firma digital"
- Modal: role="dialog", aria-modal="true", aria-labelledby
- Toast: role="alert", aria-live="polite"
- Wizard progress: role="progressbar" o role="navigation" con aria-current
- Cards de plantillas: role="article" o usar <article>
- Pack selector: role="radiogroup" con role="radio" en cada opcion
- Consent checkboxes: ya son <input type="checkbox">, verificar labels
```

### 6.3 Navegacion por teclado
**Que hacer**:
```
- Todas las cards deben ser focusables (tabindex="0") y activables con Enter/Space
- El wizard debe navegar con Tab entre campos
- Los botones de clausula deben responder a Enter/Space
- La firma por canvas no se puede hacer con teclado: anadir alternativa
  (input de texto "Escribe tu nombre como firma" que genere imagen de texto cursivo)
- El modal debe atrapar el foco (focus trap) mientras esta abierto
- ESC cierra el modal
- La barra de busqueda (Fase 2) debe ser accesible con / como atajo
```

### 6.4 Alternativa de firma por texto
**Problema**: El canvas no es accesible con teclado ni lectores de pantalla.

**Que hacer**:
```
- Debajo de cada canvas de firma, anadir enlace "Firmar escribiendo tu nombre"
- Al pulsar, mostrar input de texto
- Al escribir el nombre, generar un canvas con el texto en fuente cursiva (Playfair Display italic)
- Convertir a imagen y usarla como firma
- Esto tambien es util para personas con movilidad reducida
```

### 6.5 Contraste y tamano de texto
**Que hacer**:
```
- Verificar que TODO el texto cumple ratio de contraste 4.5:1 (AA)
- Los textos en var(--tertiary) #888 sobre var(--bg) #F7F5F0 tienen ratio ~3.7:1 -> FALLA AA
  Solucion: cambiar --tertiary a #767676 (ratio 4.54:1)
- En dark mode, verificar igualmente todos los contrastes
- Asegurar que el texto del contrato es legible: min font-size 14px
- Los labels .form-label de 12.5px estan bien si son bold (500+)
```

### 6.6 Indicadores de foco visibles
**Que hacer**:
```
- Anadir estilos :focus-visible consistentes en toda la app
- Outline dorado (var(--gold)) con offset para que sea visible
- No eliminar nunca outline sin reemplazarlo por una alternativa visible
- Estilo: outline: 2px solid var(--gold); outline-offset: 2px;
```

---

## Prompt para ejecutar esta fase

```
Lee el archivo index.html completo. Necesito mejorar la accesibilidad para cumplir WCAG 2.1 AA. Todo dentro del mismo archivo.

1. SEMANTICA HTML:
   - Envuelve el contenido de #root con <main> (o mejor, cambia #root por <main id="root">)
   - Envuelve el header con <nav> dentro del <header>
   - Donde haya .page-title, usa <h1> en vez de <div>
   - Donde haya .panel-title, usa <h2>
   - Donde haya .doc-section-title, usa <h3>
   - Usa <article> para cada .tpl-card

2. ARIA:
   - Al toast (#toast): anade role="status" y aria-live="polite"
   - Al modal (#shareModal): anade role="dialog" y aria-modal="true" y aria-labelledby="modal-title-id"
   - A cada canvas de firma: aria-label="Area de firma. Dibuja tu firma con el raton o el dedo."
   - A los botones con solo icono (como los de borrar): aria-label descriptivo
   - Al wizard progress: anade role="navigation" y aria-label="Progreso del asistente"
   - A cada .wiz-step.active: aria-current="step"
   - A .pack-selector: role="radiogroup", a cada .pack-option: role="radio" y aria-checked

3. TECLADO:
   - Anade tabindex="0" y onkeydown handler a .tpl-card y .tpl-card-new (Enter/Space = click)
   - Anade tabindex="0" y keyboard handler a .clause-row (Enter/Space = toggle)
   - Anade tabindex="0" y keyboard handler a .cat-card (Enter/Space = select)
   - Al abrir el modal: guardar el elemento que tenia foco, mover foco al primer boton del modal
   - Al cerrar el modal: devolver foco al elemento guardado
   - Anade listener de ESC para cerrar el modal: document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); })

4. FIRMA POR TEXTO (ALTERNATIVA ACCESIBLE):
   Debajo de cada .sig-canvas-wrap, anade un enlace:
   <button class="btn btn-ghost btn-sm" onclick="showTextSig('canvasId')">O escribe tu nombre como firma</button>
   
   Funcion showTextSig(canvasId):
   - Oculta el canvas wrapper
   - Muestra un input de texto en su lugar
   - Al escribir, genera imagen del nombre en fuente cursiva:
     Crea un canvas temporal, escribe el texto con ctx.font = 'italic 28px Playfair Display'
     Convierte a dataURL y usala como firma
   - Boton "Volver a dibujar" para restaurar el canvas

5. CONTRASTE:
   - Cambia --tertiary de #888888 a #767676
   - En dark mode, verifica que --secondary (#B0B0B0) sobre --bg (#1A1A1A) tiene suficiente contraste (ratio ~8:1, OK)
   - Verifica .party-field-label color #AAAAAA sobre #FAFAF5 -> ratio ~2.3:1 -> FALLA. Cambialo a #777777

6. FOCO VISIBLE:
   Anade al CSS global:
   :focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; border-radius: 2px; }
   button:focus-visible, .btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
   .form-input:focus-visible, .form-textarea:focus-visible { outline: none; } /* ya tienen su propio estilo de foco con border-color */
```

---

## Verificacion Post-Fase

- [ ] Se puede navegar toda la app solo con teclado (Tab, Enter, Space, Escape)
- [ ] El lector de pantalla anuncia correctamente: paginas, formularios, botones, alertas
- [ ] Las cards de plantillas son focusables y activables con Enter
- [ ] El modal atrapa el foco y se cierra con ESC
- [ ] La firma por texto funciona como alternativa al canvas
- [ ] El nombre escrito genera una imagen de firma cursiva aceptable
- [ ] Todos los textos pasan contraste AA (4.5:1 normal, 3:1 grande)
- [ ] Los indicadores :focus-visible son claramente visibles
- [ ] El canvas de firma tiene aria-label descriptivo
- [ ] El toast se anuncia como alerta a lectores de pantalla
- [ ] 0 errores en consola del navegador
