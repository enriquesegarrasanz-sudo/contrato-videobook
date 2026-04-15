# Plan Maestro de Mejoras - Contratos Videobook

## Resumen Ejecutivo

Este documento contiene el plan completo para llevar la aplicacion "Mis Contratos" de su estado actual (funcional, ~2159 lineas en un unico `index.html`) a un nivel profesional, pulido y robusto para uso real con clientes.

La aplicacion actual gestiona plantillas de contratos para servicios de fotografia y videobook. Permite crear plantillas, rellenar datos, compartir via URL, firmar digitalmente y generar PDF via impresion del navegador.

---

## Estado Actual - Analisis Completo

### Lo que funciona bien
- Diseno visual elegante con tipografia profesional (Inter, Playfair Display, EB Garamond)
- Wizard de 4 pasos para crear plantillas personalizadas
- Selector de packs con 3 niveles de precio (Sesion Fotografica)
- Firma digital con canvas (prestador + cliente)
- Compartir contrato via URL con base64
- Vista previa en tiempo real al rellenar datos
- Responsive basico (breakpoints 860px, 600px)
- Almacenamiento en localStorage

### Problemas Identificados

| # | Problema | Severidad | Impacto |
|---|---------|-----------|---------|
| 1 | **No hay funcion `esc()` real** - CLAUDE.md menciona XSS protection pero no se usa en renderContract | CRITICA | Seguridad |
| 2 | **URLs extremadamente largas** - base64 sin comprimir puede superar limites de URL | ALTA | Funcionalidad |
| 3 | **No hay generacion real de PDF** - depende del dialogo de impresion del navegador | ALTA | Profesionalidad |
| 4 | **No hay historial de contratos** - una vez compartido, no queda registro | ALTA | Gestion |
| 5 | **No se pueden editar plantillas** personalizadas, solo crear y eliminar | MEDIA | UX |
| 6 | **Logica de firma duplicada 3 veces** - initProviderSigCanvas, initClientSigCanvas, initProviderContractCanvas | MEDIA | Mantenibilidad |
| 7 | **No hay validacion de campos** requeridos antes de compartir | MEDIA | UX |
| 8 | **No hay boton de WhatsApp** - canal principal de comunicacion en Espana | MEDIA | Usabilidad |
| 9 | **Sin soporte offline/PWA** | BAJA | Accesibilidad |
| 10 | **Sin dark mode** | BAJA | UX |
| 11 | **Sin favicon ni branding PWA** | BAJA | Profesionalidad |
| 12 | **Sin accesibilidad** (ARIA, teclado, lector de pantalla) | BAJA | Inclusividad |

---

## Arquitectura de Fases

```
FASE 1: Seguridad y Cimientos        [Prerequisito de todo]
   |
   v
FASE 2: UX Core -----------------> FASE 3: Experiencia Movil
   |                                   |
   v                                   v
FASE 4: PDF y Compartir          FASE 5: Polish Visual
   |                                   |
   +------ ambas necesarias -------+
                  |
                  v
          FASE 6: Accesibilidad
                  |
                  v
          FASE 7: QA y Revision Final
```

### Mapa de Dependencias

| Fase | Depende de | Independiente de |
|------|-----------|-----------------|
| Fase 1 | Ninguna | - |
| Fase 2 | Fase 1 | Fase 3, 5 |
| Fase 3 | Fase 1 | Fase 2, 4, 5 |
| Fase 4 | Fase 1, Fase 2 | Fase 3, 5 |
| Fase 5 | Fase 1 | Fase 2, 3, 4 |
| Fase 6 | Fase 1, 2, 3, 5 | - |
| Fase 7 | Todas las anteriores | - |

### Tareas Paralelizables

Despues de completar la Fase 1, se pueden ejecutar **en paralelo**:
- **Bloque A**: Fase 2 + Fase 4 (secuencial entre ellas)
- **Bloque B**: Fase 3 + Fase 5 (independientes entre si y del Bloque A)

Despues, Fase 6 y Fase 7 son secuenciales finales.

---

## Resumen de Fases

### FASE 1 - Seguridad y Cimientos
- **Dificultad**: Media
- **Modelo recomendado**: Sonnet (rapido, bueno para refactoring de seguridad)
- **Estimacion**: ~30 min de ejecucion con Claude
- **Archivo detallado**: `01-FASE-SEGURIDAD-CIMIENTOS.md`

### FASE 2 - Mejoras UX Core
- **Dificultad**: Alta
- **Modelo recomendado**: Opus (logica compleja, multiples flujos)
- **Estimacion**: ~60 min de ejecucion con Claude
- **Archivo detallado**: `02-FASE-UX-CORE.md`

### FASE 3 - Experiencia Movil y PWA
- **Dificultad**: Media
- **Modelo recomendado**: Sonnet (CSS y manifest, no requiere logica compleja)
- **Estimacion**: ~30 min de ejecucion con Claude
- **Archivo detallado**: `03-FASE-MOVIL-PWA.md`

### FASE 4 - PDF Profesional y Compartir
- **Dificultad**: Alta
- **Modelo recomendado**: Opus (integracion de libreria externa, logica de compresion)
- **Estimacion**: ~45 min de ejecucion con Claude
- **Archivo detallado**: `04-FASE-PDF-COMPARTIR.md`

### FASE 5 - Polish Visual y Branding
- **Dificultad**: Baja-Media
- **Modelo recomendado**: Sonnet (CSS, animaciones, temas)
- **Estimacion**: ~30 min de ejecucion con Claude
- **Archivo detallado**: `05-FASE-POLISH-VISUAL.md`

### FASE 6 - Accesibilidad
- **Dificultad**: Media
- **Modelo recomendado**: Sonnet (ARIA, semantica HTML)
- **Estimacion**: ~25 min de ejecucion con Claude
- **Archivo detallado**: `06-FASE-ACCESIBILIDAD.md`

### FASE 7 - QA y Revision Final
- **Dificultad**: Media-Alta
- **Modelo recomendado**: Opus (revision exhaustiva, testing cross-browser)
- **Estimacion**: ~40 min de ejecucion con Claude
- **Archivo detallado**: `07-FASE-QA-REVISION.md`

---

## Skills Necesarias

### Skills existentes que se usaran
| Skill | Fase | Uso |
|-------|------|-----|
| `security-auditor` | 1, 7 | Auditoria de seguridad XSS, CSP, inyeccion |
| `simplify` | 2, 7 | Revision de codigo tras refactoring |
| `git-guardian` | Todas | Commits incrementales seguros |

### Skills que NO se necesitan crear
La aplicacion es HTML/CSS/JS vanilla en un solo archivo. No necesita skills especializadas adicionales porque:
- No hay API externa que investigar (no necesita `api-detective`)
- No hay base de datos (no necesita `database-navigator`)
- No hay framework que configurar (no necesita `vibecoding-architect`)

---

## Subagentes Recomendados

| Subagente | Tipo | Fase | Tarea |
|-----------|------|------|-------|
| Explore | Explorar | 1 | Buscar todos los puntos de inyeccion HTML sin escapar |
| Plan | Planificar | 2 | Disenar la estructura del historial de contratos |
| general-purpose | Implementar | 4 | Integrar libreria html2canvas/jspdf para PDF real |
| Explore | Verificar | 7 | Auditoria completa de la app terminada |

---

## Plan de Revision

Cada fase tiene 3 puntos de revision:

### Revision Pre-Fase
- Leer el estado actual del codigo
- Confirmar que las dependencias de fases anteriores estan completadas
- Verificar que el backup esta actualizado

### Revision Post-Implementacion
- Ejecutar `npx serve -p 3400` y probar la funcionalidad
- Verificar en preview que no hay regresiones
- Comprobar responsive en distintos viewports
- Revisar la consola del navegador (0 errores, 0 warnings)

### Revision Post-Fase
- Commit con mensaje descriptivo
- Comparar visualmente con el backup (index.backup.html)
- Ejecutar la skill `simplify` sobre el codigo modificado
- En Fase 1 y 7: ejecutar skill `security-auditor`

---

## Estrategia de Backup y Versionado

1. **Backup inicial**: `index.backup.html` (ya creado)
2. **Commits por fase**: Un commit al completar cada fase con mensaje descriptivo
3. **Tag por fase**: `git tag v1.X-faseN` tras cada fase completada
4. **Branch de trabajo**: Se trabaja en `main` con commits incrementales (proyecto personal)

---

## Orden de Ejecucion Recomendado

```
1. Fase 1: Seguridad y Cimientos     [PRIMERO - obligatorio]
2. Fase 2: UX Core                   [Segundo - habilita Fase 4]
3. Fase 3: Movil + PWA               [Paralelo con Fase 2 si se desea]
4. Fase 5: Polish Visual             [Paralelo con Fase 2-3]
5. Fase 4: PDF y Compartir           [Requiere Fase 2]
6. Fase 6: Accesibilidad             [Tras Fases 2, 3, 5]
7. Fase 7: QA y Revision Final       [ULTIMO - obligatorio]
```

---

## Notas Importantes

- **Todo se mantiene en un unico `index.html`** - no se rompe la arquitectura actual
- **Sin dependencias de backend** - la app sigue siendo 100% cliente
- **Las librerias externas** (html2canvas, jspdf, pako) se cargan via CDN
- **Cada fase es autocontenida** - se puede pausar entre fases sin problemas
- **El backup `index.backup.html` permite revertir** en cualquier momento
