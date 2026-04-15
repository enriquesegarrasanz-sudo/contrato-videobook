# FASE 7 - QA y Revision Final

## Resumen
| Campo | Valor |
|-------|-------|
| **Dificultad** | Media-Alta |
| **Modelo recomendado** | Opus (revision exhaustiva, juicio critico, regresiones) |
| **Depende de** | Todas las fases anteriores |
| **Bloquea a** | Nada (es la fase final) |
| **Skills** | `security-auditor`, `simplify` |
| **Subagentes** | Explore (auditoria completa del codigo final) |

---

## Objetivo
Realizar una revision exhaustiva de toda la aplicacion para asegurar que:
1. No hay regresiones respecto al estado original
2. No hay bugs nuevos introducidos
3. El codigo es limpio y mantenible
4. La seguridad es solida
5. La experiencia es profesional en todos los dispositivos

---

## Tareas

### 7.1 Auditoria de Seguridad Final
**Que hacer**:
```
- Ejecutar skill security-auditor sobre index.html
- Verificar que esc() se aplica en TODOS los puntos de inyeccion
- Probar inyeccion XSS en todos los campos:
  - Nombre del prestador: <script>alert(1)</script>
  - Nombre del cliente: <img src=x onerror=alert(1)>
  - Ciudad: javascript:alert(1)
  - En la URL compartida: manipular el base64 con payload malicioso
- Verificar CSP meta tag
- Verificar que no hay eval(), innerHTML sin escapar, o document.write() peligroso
  (document.write solo se usa en getPrintDoc para la ventana de impresion - aceptable)
- Verificar que las librerias CDN son de versiones estables y sin vulnerabilidades conocidas
```

### 7.2 Testing Funcional Completo
**Checklist de flujos**:

```
FLUJO 1: Crear plantilla nueva
[ ] Abrir app -> pulsar "Nueva plantilla"
[ ] Seleccionar categoria -> rellenar nombre -> Siguiente
[ ] Anadir 3+ servicios -> eliminar uno -> Siguiente
[ ] Anadir 2 conceptos de precio -> rellenar condiciones -> Siguiente
[ ] Seleccionar clausulas RGPD + IP -> Guardar
[ ] Verificar que aparece en home con badge "Personalizada"

FLUJO 2: Editar plantilla custom
[ ] Pulsar "Editar" en plantilla custom
[ ] Cambiar nombre y anadir un servicio
[ ] Guardar -> verificar que se actualizo (no se creo nueva)

FLUJO 3: Duplicar plantilla built-in
[ ] Pulsar "Duplicar" en Videobook Portfolio
[ ] Se abre wizard con datos precargados + nombre "(copia)"
[ ] Modificar algo y guardar
[ ] Verificar que hay nueva plantilla custom + la original intacta

FLUJO 4: Generar contrato con packs (Fotografia)
[ ] Seleccionar Sesion Fotografica -> "Usar"
[ ] Seleccionar Pack Medio
[ ] Rellenar todos los campos del prestador + firma
[ ] Rellenar datos del cliente
[ ] Verificar preview en tiempo real
[ ] Generar enlace -> copiar URL

FLUJO 5: Contrato compartido (vista cliente)
[ ] Abrir la URL copiada en pestana nueva (o modo incognito)
[ ] Verificar que se ven los datos del prestador correctos
[ ] Rellenar campos del cliente (nombre, NIF, email)
[ ] Marcar checkboxes de consentimiento
[ ] Dibujar firma del cliente
[ ] Pulsar "Firmar y confirmar"
[ ] Verificar que se genera PDF real descargable
[ ] Verificar que se abre modal post-firma
[ ] Verificar que el mailto tiene datos correctos

FLUJO 6: WhatsApp
[ ] Generar enlace -> pulsar "Enviar por WhatsApp"
[ ] Verificar que abre WhatsApp (o WhatsApp Web) con mensaje correcto

FLUJO 7: Historial
[ ] Generar un contrato -> verificar que aparece en historial
[ ] Copiar enlace desde historial -> funciona
[ ] Eliminar entrada del historial

FLUJO 8: Busqueda
[ ] Escribir nombre de plantilla -> se filtra correctamente
[ ] Escribir algo que no existe -> muestra "Sin resultados"
[ ] Borrar busqueda -> vuelven todas las plantillas

FLUJO 9: Dark Mode
[ ] Toggle de tema -> cambia a dark
[ ] Verificar legibilidad en todas las vistas
[ ] Recargar -> persiste el tema
[ ] La vista del contrato compartido esta SIEMPRE en modo claro

FLUJO 10: PWA y Movil
[ ] Abrir en viewport 375px -> todo se ve correcto
[ ] La firma es comoda en movil
[ ] Los botones tienen area tactil suficiente
[ ] El modal se ve como bottom sheet en movil
```

### 7.3 Testing Cross-Browser
**Que hacer**:
```
- Probar en Chrome (principal)
- Probar en Firefox (verificar canvas firma, generacion PDF)
- Probar en Safari (verificar localStorage modo incognito, canvas)
- Probar en movil real o simulador (Chrome Android, Safari iOS)
```

### 7.4 Revision de Codigo
**Que hacer**:
```
- Ejecutar skill simplify sobre el codigo completo
- Buscar:
  - Variables no usadas
  - Funciones duplicadas
  - CSS no utilizado
  - Event listeners que no se limpian
  - Memory leaks potenciales (canvas, intervals, timeouts)
- Verificar que el codigo sigue siendo legible y bien organizado
- Verificar que los comentarios de seccion siguen siendo correctos
```

### 7.5 Performance
**Que hacer**:
```
- Verificar que la pagina carga en <2 segundos (incluido Google Fonts)
- Verificar que la generacion de PDF tarda <3 segundos
- Verificar que el localStorage no crece indefinidamente
  (el historial deberia tener un limite, ej: 100 entradas max)
- Verificar que las animaciones CSS no causan jank (usar will-change si es necesario)
- Verificar que el service worker cachea correctamente
```

### 7.6 Limpieza Final
**Que hacer**:
```
- Eliminar console.log() que se hayan colado
- Verificar que index.backup.html sigue intacto
- Actualizar CLAUDE.md si hay cambios en la arquitectura
- Verificar que .gitignore excluye node_modules
- Asegurar que los archivos nuevos (manifest.json, sw.js) estan trackeados
```

---

## Prompt para ejecutar esta fase

```
Lee el archivo index.html completo, manifest.json y sw.js. Esta es la fase final de revision. Necesito que hagas una auditoria exhaustiva.

1. SEGURIDAD:
   - Busca TODOS los lugares donde se usa innerHTML, template literals con variables, o document.write
   - Para cada uno, verifica que los valores del usuario estan escapados con esc()
   - Si encuentras alguno sin escapar, corrigelo
   - Verifica que el CSP meta tag es correcto y restrictivo

2. BUGS:
   - Prueba mentalmente cada flujo:
     a) Crear plantilla -> rellenar -> compartir -> firmar -> PDF
     b) Editar plantilla -> guardar -> verificar
     c) Duplicar -> modificar -> guardar
     d) URL comprimida -> decodificar -> renderizar
     e) URL antigua (sin comprimir) -> retrocompatibilidad
   - Busca edge cases: campos vacios, caracteres especiales, URLs muy largas
   - Verifica que todas las funciones onclick existen y estan definidas

3. CODIGO:
   - Busca variables no usadas y eliminalas
   - Busca funciones que nunca se llaman y eliminalas
   - Busca CSS sin usar y eliminalo
   - Verifica que no hay event listeners que se registran multiples veces
   - Asegurate de que clearTimeout/clearInterval se usa cuando corresponde

4. PERFORMANCE:
   - Si el historial puede crecer mucho, anade un limite de 100 entradas (eliminar las mas antiguas)
   - Verifica que el canvas de firma no tiene memory leaks
   - Verifica que los div temporales de generacion de PDF se eliminan siempre (incluso si hay error)

5. LIMPIEZA:
   - Elimina cualquier console.log
   - Verifica que los comentarios de seccion del JS siguen siendo correctos
   - Actualiza el CLAUDE.md con las nuevas funcionalidades si es necesario

Si encuentras problemas, corrigelos directamente. Al final, haz un resumen de todo lo que revisaste y cualquier cambio que hiciste.
```

---

## Verificacion Post-Fase

- [ ] 0 vulnerabilidades XSS encontradas
- [ ] Los 10 flujos funcionales pasan correctamente
- [ ] Chrome, Firefox y Safari funcionan sin errores
- [ ] En movil (375px viewport) todo se ve y funciona bien
- [ ] 0 errores y 0 warnings en consola
- [ ] El codigo esta limpio: sin variables/funciones/CSS sin usar
- [ ] La pagina carga en <2 segundos
- [ ] El PDF se genera en <3 segundos
- [ ] El service worker cachea y sirve offline correctamente
- [ ] CLAUDE.md esta actualizado
- [ ] index.backup.html sigue intacto como referencia
- [ ] Todo listo para commit final y push a GitHub

---

## Commit Final

Tras pasar todas las verificaciones:

```bash
git add index.html manifest.json sw.js
git commit -m "feat: mejora profesional completa - seguridad, UX, PDF, PWA, dark mode, accesibilidad"
git tag v2.0-profesional
git push origin main --tags
```
