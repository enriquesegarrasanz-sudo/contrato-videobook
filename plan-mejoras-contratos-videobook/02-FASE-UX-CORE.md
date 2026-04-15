# FASE 2 - Mejoras UX Core

## Resumen
| Campo | Valor |
|-------|-------|
| **Dificultad** | Alta |
| **Modelo recomendado** | Opus (logica compleja, multiples flujos nuevos) |
| **Depende de** | Fase 1 |
| **Bloquea a** | Fase 4 (PDF necesita el historial), Fase 6 |
| **Skills** | `simplify` (al finalizar) |
| **Subagentes** | Plan (disenar estructura del historial) |

---

## Objetivo
Mejorar la experiencia del usuario anadiendo las funcionalidades que faltan para un uso profesional diario: historial de contratos, edicion de plantillas, duplicado, auto-relleno de fecha, y validacion de formularios.

---

## Tareas

### 2.1 Historial de contratos enviados
**Problema**: Una vez se comparte un contrato, no queda ningun registro. El usuario no sabe a quien envio que ni cuando.

**Que hacer**:
```
- Crear clave localStorage "contracts_history" como array de objetos
- Cada entrada: { id, templateName, clientName, clientEmail, date, url, status: 'sent'|'signed' }
- Al hacer doShare(), guardar automaticamente en el historial
- Crear una nueva vista "history" accesible desde el header
- Mostrar tabla/lista con los contratos enviados, ordenados por fecha
- Permitir copiar el enlace de nuevo desde el historial
- Permitir eliminar entradas del historial
```

**Estructura de datos del historial**:
```javascript
{
  id: 'hist_' + Date.now(),
  templateName: 'Videobook Portfolio',
  clientName: 'Ana Garcia',
  clientEmail: 'ana@email.com',
  providerName: 'Enrique Segarra',
  date: '2026-04-15',
  url: 'https://...',
  packLabel: 'Pack Medio',  // solo si aplica
  status: 'sent'
}
```

### 2.2 Editar plantillas personalizadas
**Problema**: Las plantillas custom solo se pueden crear y eliminar. Si hay un error hay que borrar y recrear.

**Que hacer**:
```
- Anadir boton "Editar" en las cards de plantillas custom (junto a "Eliminar")
- Al pulsar Editar, cargar el wizard con los datos de la plantilla existente
- Modificar wizSave() para detectar si es edicion (actualizar) o creacion (nuevo id)
- Mantener el id original al editar para no romper nada
```

### 2.3 Duplicar plantillas
**Problema**: Si quiero una plantilla parecida a una existente, tengo que crearla desde cero.

**Que hacer**:
```
- Anadir boton "Duplicar" en todas las cards (built-in y custom)
- Al duplicar: copiar toda la spec, asignar nuevo id, nombre + " (copia)"
- Guardarla como plantilla custom
- Redirigir al wizard en modo edicion para personalizar
```

### 2.4 Auto-relleno de fecha actual
**Problema**: El campo fecha siempre empieza vacio. El 99% de las veces es la fecha de hoy.

**Que hacer**:
```
- En startFill(), inicializar S.fillVals.date con la fecha actual (formato YYYY-MM-DD)
- El usuario puede cambiarla si quiere
```

### 2.5 Confirmacion antes de abandonar formulario
**Problema**: Si estas rellenando un contrato y pulsas "Plantillas" por error, pierdes todo.

**Que hacer**:
```
- En navigate(), si S.view === 'fill' y hay datos rellenados, mostrar confirm()
- "Tienes datos sin guardar. Quieres salir?"
- Solo si hay datos realmente rellenados (no solo el default de city/date)
```

### 2.6 Busqueda/filtro de plantillas
**Problema**: Con muchas plantillas, encontrar la correcta sera dificil.

**Que hacer**:
```
- Anadir barra de busqueda encima del grid de plantillas
- Filtrar por nombre y categoria en tiempo real
- Mostrar mensaje "Sin resultados" si no hay coincidencias
- Input con icono de lupa, estilo coherente con el diseno actual
```

---

## Prompt para ejecutar esta fase

```
Lee el archivo index.html completo. Voy a pedirte varias mejoras de UX. Hazlas todas manteniendo el estilo visual actual y dentro del mismo archivo index.html.

1. HISTORIAL DE CONTRATOS:
   - Crea una nueva clave en localStorage: "contracts_history" (array de objetos)
   - Cada objeto: { id: 'hist_'+Date.now(), templateName, clientName, clientEmail, providerName, date, url, status: 'sent' }
   - En doShare(), tras generar la URL, guarda automaticamente la entrada en el historial
   - Crea funciones getHistory(), saveHistoryEntry(entry), deleteHistoryEntry(id)
   - Crea una nueva vista "history" con renderHistory(root, hdr)
   - Anade un boton en el header (junto a "Nueva plantilla") que lleve al historial: icono de reloj + "Historial"
   - La vista muestra una tabla con: fecha, plantilla, cliente, email, acciones (copiar enlace, eliminar)
   - Diseno coherente con el resto de la app (usa las mismas clases CSS: .page, .panel, etc.)

2. EDITAR PLANTILLAS CUSTOM:
   - En renderHome(), para plantillas NO built-in, anade un boton "Editar" entre "Eliminar" y "Usar"
   - Al pulsar Editar, carga S.wiz.d con los datos de la plantilla (name, subtitle, objectText, services, prices, paymentTerms, clauses)
   - Anade S.wiz.editingId para saber que es edicion
   - En wizSave(), si S.wiz.editingId existe, actualiza la plantilla existente en vez de crear nueva

3. DUPLICAR PLANTILLAS:
   - Anade boton "Duplicar" (icono de copia) en TODAS las cards
   - Al pulsar: copia la spec completa, genera nuevo id, nombre + " (copia)", guarda como custom
   - Redirige al wizard en modo edicion con la copia cargada
   - toast "Plantilla duplicada - personaliza los detalles"

4. AUTO-FECHA:
   - En startFill(), anade: S.fillVals.date = new Date().toISOString().split('T')[0]

5. CONFIRMACION AL SALIR:
   - En navigate(), si S.view === 'fill', comprueba si hay mas datos que solo city y date
   - Si los hay, muestra confirm('Tienes datos sin guardar. Quieres salir?')
   - Si el usuario cancela, haz return sin navegar

6. BUSQUEDA:
   - Anade un input de busqueda encima del grid en renderHome()
   - Filtra las cards por nombre y categoria mientras el usuario escribe
   - Usa una variable S.searchTerm para el estado
   - Si no hay resultados, muestra un mensaje centrado

Importante: usa esc() (creada en Fase 1) para todos los valores del usuario que se insertan en HTML.
```

---

## Verificacion Post-Fase

- [ ] Compartir un contrato -> aparece en el historial con todos los datos correctos
- [ ] El historial persiste al recargar la pagina
- [ ] Editar una plantilla custom -> se abre el wizard con los datos precargados
- [ ] Guardar edicion -> la plantilla se actualiza (no se crea una nueva)
- [ ] Duplicar una plantilla built-in -> se crea copia editable como custom
- [ ] Duplicar una plantilla custom -> se crea copia independiente
- [ ] El campo fecha empieza con la fecha de hoy
- [ ] Pulsar "Plantillas" con datos rellenados -> muestra confirmacion
- [ ] La busqueda filtra correctamente por nombre y categoria
- [ ] Buscar algo que no existe -> muestra "Sin resultados"
- [ ] 0 errores en consola del navegador
- [ ] Ejecutar skill `simplify` sobre el codigo modificado
