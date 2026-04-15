# FASE 5 - Polish Visual y Branding

## Resumen
| Campo | Valor |
|-------|-------|
| **Dificultad** | Baja-Media |
| **Modelo recomendado** | Sonnet (CSS, animaciones, sin logica compleja) |
| **Depende de** | Fase 1 |
| **Bloquea a** | Fase 6 |
| **Skills** | Ninguna especifica |
| **Subagentes** | Ninguno |
| **Paralelizable con** | Fase 2, Fase 3 |

---

## Objetivo
Pulir los detalles visuales para que la aplicacion transmita profesionalidad y confianza. Animaciones sutiles, transiciones entre vistas, dark mode, y mejoras de microinteraccion.

---

## Tareas

### 5.1 Transiciones entre vistas
**Problema**: Al navegar entre home, fill, create, contract, el cambio es instantaneo y brusco. No hay sensacion de flujo.

**Que hacer**:
```
- Anadir clase .view-enter con opacity: 0, transform: translateY(10px)
- Anadir clase .view-active con opacity: 1, transform: translateY(0), transition: 0.25s ease
- En render(), al cambiar de vista, aplicar la animacion al #root
- Usar requestAnimationFrame para asegurar que la transicion se aplica
```

### 5.2 Animaciones de micro-interaccion
**Que hacer**:
```
- Cards: anadir animacion de entrada escalonada al cargar la pagina (staggered fade-in)
- Toast: mejorar la animacion de entrada (slide-up + fade ya existe, refinar timing)
- Modal: ya tiene scale + translateY, verificar que es suave
- Botones: anadir feedback tactil con :active scale(0.97) (ya existe parcialmente)
- Pack selector: animacion suave al cambiar de pack seleccionado
- Wizard steps: transicion suave del dot activo (ya tiene transition: all 0.2s)
```

### 5.3 Dark Mode
**Que hacer**:
```
- Definir tokens dark en @media (prefers-color-scheme: dark) y clase .dark
- Tokens dark:
  --bg: #1A1A1A
  --surface: #242424
  --surface2: #2A2A2A
  --primary: #F0F0F0
  --secondary: #B0B0B0
  --tertiary: #777777
  --border: #3A3A3A
  --border2: #333333
  --gold: #D4A44A (ligeramente mas claro para contraste)
  --gold-light: rgba(196,148,58,0.12)
  --gold-dark: #E8B85A
- Anadir toggle en el header (icono sol/luna)
- Guardar preferencia en localStorage "theme"
- El contrato compartido (vista cliente) siempre en modo claro para el PDF
```

### 5.4 Estados vacios mejorados
**Que hacer**:
```
- Cuando no hay plantillas custom y solo hay las 2 built-in, mostrar un mensaje motivador
- En el historial vacio: "Aun no has compartido ningun contrato. Empieza seleccionando una plantilla."
- Iconos SVG decorativos para los estados vacios
```

### 5.5 Indicadores de estado visual
**Que hacer**:
```
- En el formulario de relleno, anadir indicador de "progreso" (campos rellenados / total)
- Barra de progreso discreta en la parte superior del panel de datos
- Color verde cuando todos los campos importantes estan rellenos
```

### 5.6 Mejoras tipograficas menores
**Que hacer**:
```
- Verificar que el interlineado es consistente en todo el documento del contrato
- Verificar que los tamanos de fuente escalan bien entre desktop y movil
- Asegurar contraste WCAG AA minimo en todos los textos
```

---

## Prompt para ejecutar esta fase

```
Lee el archivo index.html completo. Voy a pedirte mejoras visuales y de polish. Todo dentro del mismo archivo.

1. TRANSICIONES ENTRE VISTAS:
   Anade estas clases CSS:
   .view-transition { opacity: 0; transform: translateY(8px); transition: opacity 0.25s ease, transform 0.25s ease; }
   .view-visible { opacity: 1; transform: translateY(0); }
   
   Modifica la funcion render(): tras actualizar root.innerHTML, anade la clase .view-transition al #root, luego en un requestAnimationFrame anade .view-visible. Antes del cambio, quita .view-visible para resetear.

2. ANIMACIONES DE CARDS:
   Anade CSS:
   .tpl-card { opacity: 0; transform: translateY(15px); animation: cardIn 0.3s ease forwards; }
   @keyframes cardIn { to { opacity: 1; transform: translateY(0); } }
   
   Usa animation-delay con nth-child para escalonar:
   .tpl-card:nth-child(1) { animation-delay: 0.05s; }
   .tpl-card:nth-child(2) { animation-delay: 0.1s; }
   .tpl-card:nth-child(3) { animation-delay: 0.15s; }
   etc. (hasta 6 o usa calc)

3. DARK MODE:
   Anade despues de los tokens :root actuales:
   
   @media (prefers-color-scheme: dark) {
     :root:not(.light) { /* tokens dark */ }
   }
   .dark { /* mismos tokens dark, forzado */ }
   
   Tokens dark: --bg:#1A1A1A; --surface:#242424; --surface2:#2A2A2A; --primary:#F0F0F0; --secondary:#B0B0B0; --tertiary:#777; --border:#3A3A3A; --border2:#333; --gold:#D4A44A; --gold-light:rgba(212,164,74,0.12); --gold-dark:#E8B85A; --gold-border:rgba(212,164,74,0.3); --blue:#5B82EA; --blue-light:rgba(91,130,234,0.1); --success:#2AAA6A; --danger:#E05A50;
   
   Anade boton toggle en .header-right (antes de "Nueva plantilla"):
   - Boton con icono sol/luna (SVG)
   - onclick: toggleTheme()
   - Funcion toggleTheme(): alterna clase .dark en <html>, guarda en localStorage "theme"
   - Al cargar (DOMContentLoaded): leer localStorage "theme" y aplicar
   
   IMPORTANTE: La vista de contrato compartido (.contract-full-page) debe mantener SIEMPRE fondo claro para que el PDF quede bien. Anade: .contract-full-page { background: #EFEDE8 !important; color: #1A1A1A !important; }
   Y dentro del .contract-sheet, forzar colores claros.

4. ESTADOS VACIOS:
   En renderHistory() (creada en Fase 2), si el historial esta vacio, muestra:
   - Un icono SVG decorativo (carpeta vacia o similar)
   - Texto: "Aun no has compartido ningun contrato"
   - Subtexto: "Selecciona una plantilla y comparte tu primer contrato"
   - Boton: "Ir a plantillas" que lleve a home

5. BARRA DE PROGRESO EN FILL:
   Anade encima del panel de datos en renderFill():
   - Contar campos "importantes" rellenados: provider_name, provider_nif, provider_email, provider_sig, client_name, client_email
   - Mostrar "X de 6 campos completados" con barra de progreso
   - Barra con background var(--border) y fill var(--gold), height: 3px, border-radius
   - Color verde (var(--success)) cuando todos estan completos
```

---

## Verificacion Post-Fase

- [ ] Al navegar entre vistas, hay una transicion suave (fade + slide)
- [ ] Las cards aparecen con animacion escalonada al cargar home
- [ ] Dark mode se activa automaticamente si el OS esta en dark mode
- [ ] El toggle de tema funciona y persiste al recargar
- [ ] El contrato compartido (vista cliente) SIEMPRE se ve en modo claro
- [ ] En dark mode, todos los textos son legibles (contraste suficiente)
- [ ] El historial vacio muestra mensaje motivador
- [ ] La barra de progreso en fill se actualiza en tiempo real
- [ ] La barra se pone verde cuando todos los campos estan completos
- [ ] 0 errores en consola del navegador
- [ ] El diseno sigue siendo coherente y profesional en ambos modos
