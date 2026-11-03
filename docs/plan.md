# WHOM — plan de construcción

## Objetivo

Un registro público, consultable y responsive de **quién es dueño de qué** en los
medios colombianos: grupos, familias, medios, empresas y marcas. La pregunta central
es «¿de quién es esto?» y su inversa «¿qué tiene este grupo?», con la cadena de
propiedad y las fuentes a la vista.

## Alcance

- Sitio estático (React + Vite + TypeScript + SCSS), sin backend ni cuentas.
- Datos curados en el repo, cada relación con fuente y fecha de verificación.
- Búsqueda por nombre, alias y marca; fichas de entidad; cadena de propiedad;
  registro completo; línea de tiempo de movimientos.
- Responsive: móvil, tablet y escritorio. Manifiesto PWA para instalar.
- Repo público `jdsalasca/whom` y despliegue en `whom-colombia.eridu.top`.

## No objetivos

- No es una app nativa de iOS/Android.
- No es un CMS colaborativo ni permite editar datos desde la web.
- No emite juicios editoriales sobre los medios: describe propiedad documentada.
- No cubre el universo completo de medios de Colombia; cubre los grupos y medios
  principales, con espacio para crecer.

## Datos

Entidades: `grupo`, `medio`, `empresa`, `persona`, `estado`.
Relaciones: `propiedad`, `control`, `participación`, `afiliación`, `operación`.
Cada relación tiene `stake` (si es público), `desde`, `hasta`, `nota`, `principal`
y una o más fuentes. La cadena de propiedad sigue la relación `principal`.

Los datos iniciales cubren:

- Organización Ardila Lülle (RCN TV, RCN Radio, La FM, La República, NTN24,
  Win Sports, Postobón, Incauca, Atlético Nacional).
- Valórem / familia Santo Domingo (Caracol TV, Blu Radio, El Espectador, D1,
  Cine Colombia).
- Grupo Gilinski / Grupo Semana (Semana, Dinero, SoHo, El Heraldo, Nutresa,
  El Corral, Presto, GNB Sudameris).
- Grupo Aval / familia Sarmiento (El Tiempo, Portafolio, Banco de Bogotá,
  Corficolombiana, Porvenir).
- PRISA (Caracol Radio, W Radio, Los 40).
- Grupo El Colombiano (El Colombiano, Q’hubo, Gente).
- Grupo Vanguardia (Vanguardia).
- RTVC (Señal Colombia, Radio Nacional).
- Movimientos recientes: compra de Presto (2026), venta de El País (2025),
  El Espectador sin ánimo de lucro (2025), fusión Caracol Radio/W Radio (2026).

## Estética

«Papers, Please» + industrial soviético: papel crema, tinta negra, acentos rojos,
sellos, formularios, seriales, texturas de impresión y tipografía condensada/mono.
No se usan logotipos de terceros: monogramas tipográficos.

## Rondas

1. **R1 — Base verificable.** Scaffold, modelo de datos, dataset inicial y tests de
   integridad/búsqueda/cadenas. Entregable: `npm test` verde.
2. **R2 — App.** Inicio, búsqueda, fichas, registro, mapa y método. SCSS con tokens.
   Entregable: build de producción y capturas en 3 anchos.
3. **R3 — Despliegue.** Docker + nginx, puerto 5178, túnel y DNS. Entregable: URL
   pública en 200 con el bundle nuevo.
4. **R4 — Cierre.** Repo público, README, verificación final y limpieza.
5. **R5 — Árbol, PDF y ranking.** Árbol expandible con subida/bajada, descarga PDF de
   fichas y del registro filtrado, y grupos ordenados por alcance. Entregable:
   capturas del árbol en 1440/390, PDF generado y descargado, tests verdes.

## Criterios verificables

- `npm test` pasa (integridad de datos incluida).
- `npm run build` produce `dist/`.
- Capturas reales en 390, 834 y 1440 px; sin desbordes horizontales.
- `https://whom-colombia.eridu.top/` responde 200 y sirve el bundle nuevo.
- Los sitios existentes del túnel siguen en 200.
- El repo público existe y el `git status` queda limpio.

## Nota de dominio

El pedido dice `whom-colombia.eritu.top`; el túnel y los demás sitios usan
`eridu.top`. Se publica en `whom-colombia.eridu.top` y se deja anotado para
confirmar si `eritu.top` es un dominio aparte.
