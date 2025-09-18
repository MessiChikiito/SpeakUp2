# SpeakUp Backend

API para gestión de denuncias con autenticación JWT, votos (ranking Top y Recientes), perfil de usuario y soporte para severidad y ubicación.

## Tecnologías
Node.js, TypeScript, Express, TypeORM (PostgreSQL), JWT, Jest.

## Variables de entorno (incluidas en el repo por ser proyecto escolar)
Archivo `.env` (se versiona):
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=speakup
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=dev_super_secreto
NODE_ENV=development
```
Puedes cambiar estos valores directamente sin pasos extra.

## Instalación rápida
```
npm install
npm run dev
```
Si la DB está vacía y usas sincronización automática se crearán las tablas.

## Endpoints principales
Auth:
- POST /usuarios/register
- POST /usuarios/login → { token, user }

Denuncias:
- POST /denuncias
- GET /denuncias?sort=top|recent&page=1&pageSize=20 *(paginación opcional, page>=1, pageSize<=100)*
- GET /denuncias/:id
- POST /denuncias/:id/vote  (value: -1 | 0 | 1)

## Votos (resumen)
Transiciones y efecto en score (ver tabla completa abajo):
0→1 (+1), 1→0 (-1), 1→-1 (-2), etc.
Referenciar sección “Transiciones de voto” al mantener la lógica.

### Tabla de transiciones
| Prev | Nuevo | Δ score | upCount | downCount |
|------|-------|---------|---------|-----------|
| 0    | 1     | +1      | +1      | 0         |
| 0    | -1    | -1      | 0       | +1        |
| 1    | -1    | -2      | -1      | +1        |
| -1   | 1     | +2      | +1      | -1        |
| 1    | 0     | -1      | -1      | 0         |
| -1   | 0     | +1      | 0       | -1        |

## Listado / Ordenamiento
- sort=top → score DESC, createdAt DESC
- sort=recent (default) → createdAt DESC
- `page` y `pageSize` permiten paginar resultados. Si `pageSize` supera 100 se ajusta automáticamente. Las cabeceras `X-Page` y `X-Page-Size` reflejan los valores efectivos.
- Respuestas 200 del listado se cachean en memoria por 30 segundos (por usuario y parámetros) para aliviar carga.

## Rate limiting
- `/usuarios/login`: 10 intentos en una ventana de 15 minutos (respuesta 429 en exceso).
- `/denuncias`: 120 solicitudes por minuto por origen para evitar abusos.

## Estructura relevante
```
src/application/user/UserApplicationService.ts
src/application/denuncia/DenunciaApplicationService.ts
src/infrastructure/controller/UserController.ts
src/infrastructure/controller/DenunciaController.ts
src/infrastructure/adapter/DenunciaAdapter.ts
```

## Notas de implementación
- `login` ahora retorna `{ token, user }` para cargar perfil inmediato.
- `hotScore` removido de la UI; si queda la columna puedes planear migración para eliminarla.
- Un voto por usuario por denuncia (valor -1, 0, 1). Repetir el mismo valor es idempotente.
- `score = upCount - downCount`.

## Tests
```
npm test
```
Incluye pruebas de transiciones de voto.

## Análisis de calidad con SonarQube

1. Configura el secret `SONAR_TOKEN` en el repositorio (token generado desde tu instancia de SonarQube/SonarCloud) y, si usas un host distinto a SonarCloud, define la variable `SONAR_HOST_URL`.
2. Ejecuta el análisis localmente con:
   ```
   SONAR_TOKEN=xxxxxxxx npm run sonar
   ```
   El workflow de CI lanza el mismo comando y sólo se ejecuta cuando `SONAR_TOKEN` está presente.

### Interpretación del reporte
- **Quality Gate**: debe estar en estado `Passed`. Si está en `Failed`, consulta las métricas resaltadas como incumplidas.
- **Cobertura** (`Coverage`): objetivo mínimo 80% en nuevo código. Revisa los archivos listados en la pestaña Coverage para priorizar pruebas adicionales.
- **Bugs y Vulnerabilidades**: los issues de severidad `Blocker` o `Critical` deben resolverse antes de aprobar cambios.
- **Code Smells**: acepta un máximo de deuda técnica equivalente a 5 minutos por archivo nuevo/modificado.
- **Duplicaciones**: mantener el porcentaje de duplicación por debajo del 3% en los archivos modificados.

Cumpliendo estas reglas mínimas el pipeline se mantendrá en verde y el proyecto conservará un estado saludable.

## Comentarios recomendados
En `DenunciaAdapter.vote()` agregar referencia “Ver README sección Votos”. Eliminar comentarios viejos de “hotScore”.

## Ejecutar en otra PC
1. Copiar repo.
2. Asegurar PostgreSQL y mismo .env (ya incluido).
3. `npm ci` (o `npm install`).
4. Crear DB si no existe.
5. `npm run dev`.
6. (Opcional acceso LAN) cambiar `app.listen` a host `0.0.0.0` y abrir puerto 4000 en firewall.
