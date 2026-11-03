# WHOM

**¿De quién es lo que lee?** Un registro abierto de propiedad de medios y marcas en
Colombia. Busque un medio, una empresa o un apellido y siga la cadena hasta el
control último. Cada vínculo muestra su tipo, su participación —cuando es pública—
y la fuente que lo respalda.

- Sitio: <https://whom-colombia.eridu.top>
- Repositorio: <https://github.com/jdsalasca/whom>
- Fecha de corte de los datos: **2 de noviembre de 2026**

## Qué responde

- **¿Quién es el dueño de…?** El Corral → Nutresa → Gilinski/IHC → familia Gilinski.
- **¿Qué tiene ese grupo?** Semana, Dinero, SoHo, El Heraldo, Nutresa, GNB Sudameris.
- **¿Dos medios con el mismo nombre son del mismo dueño?** No: Caracol Televisión es
  de Valórem; Caracol Radio es de PRISA.
- **¿Qué cambió de manos?** La venta de El País (2025), la compra de Presto (2026),
  la fusión operativa de Caracol Radio y W Radio (2026).

## Funciones

- **Árbol navegable:** expanda y contraiga ramas para bajar del grupo a la empresa y
  a la marca; el nombre abre la ficha y la ruta queda abierta.
- **PDF:** descargue una ficha completa o el registro filtrado, con cadena, fechas,
  tipo de vínculo y fuentes.
- **Ranking de grupos:** ordenados por alcance nacional, número de medios y tamaño.
  Es un criterio editorial, no una medición de riqueza.
- **Búsqueda:** por nombre, alias o marca; fichas de entidad y registro completo.
- **Responsive:** móvil, tablet y escritorio; manifiesto PWA para agregar a inicio.

## Stack

- React 19 + Vite + TypeScript.
- SCSS con tokens y mixins (sin CSS suelto ni estilos inline).
- Datos versionados en `src/data/`; sin backend ni base de datos.
- Docker multi-stage + nginx para producción.
- Vitest + Testing Library; Playwright Core para auditoría visual local.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # integridad de datos + pantallas
npm run build      # tsc -b && vite build
npm run preview    # sirve dist/
```

## Datos

`src/data/` contiene:

- `entities.ts`: grupos, medios, empresas, familias y entidades públicas.
- `relations.ts`: vínculos dirigidos (propietario → propiedad), con tipo,
  participación, fechas, nota, fuente y marca `principal` para la cadena.
- `sources.ts`: bibliografía con URL, medio y fecha.
- `timeline.ts`: movimientos de propiedad documentados.

El dataset incluye grupos nacionales (Ardila Lülle, Valórem, Gilinski, Aval,
PRISA), regionales (Grupo El Colombiano, Grupo Vanguardia) y medios públicos
(RTVC). Los grupos tienen `rank` y `tier` para el orden de lectura.

Reglas de edición:

1. Toda relación necesita al menos una fuente existente en `sources.ts`.
2. La cadena sigue solo la relación `principal`; las demás se muestran como
   historial o como vínculos adicionales.
3. No se afirma control editorial: la propiedad es una cosa y la línea editorial
   es otra.
4. Si un porcentaje no es público, se escribe «No divulgada»; no se inventa.

Los tests de `src/data/queries.test.ts` fallan si una relación apunta a una entidad
inexistente, si falta una fuente o si una cadena esperada se rompe.

## Producción

```bash
docker compose -f compose.tunnel.yaml up -d --build
# publica 127.0.0.1:5178 -> 80
```

Detrás del túnel de Cloudflare:

```yaml
- hostname: whom-colombia.eridu.top
  service: http://localhost:5178
```

Comprobación:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://whom-colombia.eridu.top/
```

## Nota de dominio

El pedido inicial decía `whom-colombia.eritu.top`. El túnel y los demás sitios del
servidor usan `eridu.top`; `eritu.top` no resuelve. Por eso el despliegue quedó en
`whom-colombia.eridu.top`. Si `eritu.top` es un dominio aparte, hace falta agregarlo
a Cloudflare y al túnel.

## Alcance y límites

- No es un registro oficial ni una entidad del Estado.
- No cubre todos los medios de Colombia; cubre los grupos y medios principales.
- La propiedad cambia y no todas las participaciones son públicas. La fecha de
  corte y las fuentes están a la vista para que cada dato se pueda revisar.
- No se usan logotipos de terceros; las marcas se citan con fines informativos.
- La cadena de propiedad no demuestra control editorial ni intención política.

## Estructura

```
src/
  components/     piezas de la interfaz (incluye el árbol)
  data/           entidades, relaciones, fuentes y consultas + tests
  pages/          Inicio, Buscar, Expediente, Registro, Árbol, Mapa, Método
  styles/         tokens, mixins y hoja principal SCSS
  format.ts       etiquetas y fechas
  pdf.ts          modelos y generación de PDF en el navegador
public/           iconos, manifiesto PWA, robots y portada social
docs/             plan y ficha de diseño
scripts/          auditoría visual y generación de iconos
```

## Licencia

Código bajo MIT (`LICENSE`). La compilación de datos se publica bajo
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): se puede reutilizar
citando WHOM y las fuentes originales enlazadas en cada expediente.
