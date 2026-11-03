# WHOM — diseño

## Intención

Hacer visible, en una sola consulta, quién está detrás de un medio o de una marca
conocida. El caso que ordena el producto: alguien busca «El Corral» y ve que
pertenece a Nutresa, que a su vez está controlada por el consorcio Gilinski/IHC,
y que la misma familia es dueña de Semana. La segunda consulta: «Semana» muestra
su grupo y las demás empresas de ese grupo.

## Approaches considerados

1. **App nativa (Flutter/React Native) + API.** Mejor instalación, pero exige
   backend, cuentas de tiendas y duplica el trabajo responsive. No aporta al caso:
   el valor está en consultar y compartir fichas.
2. **CMS + backend + front.** Permite edición colaborativa, pero añade base de
   datos, autenticación y mantenimiento. El dataset es pequeño y curado; Git es
   suficiente.
3. **Sitio estático React + Vite + SCSS, datos versionados, Docker/nginx.**
   Elegido. Rápido, barato, auditable, fácil de desplegar detrás del túnel y de
   revisar en pull requests. La PWA cubre el uso móvil sin tiendas.

## Modelo

`Entidad` (grupo, medio, empresa, persona, estado) y `Relación` dirigida
(propietario → propiedad) con tipo, participación, fechas, nota, fuente y marca
`principal` para calcular la cadena. Las fuentes son entidades de primera clase.
La UI nunca inventa un dato: si no hay participación pública, muestra «no
divulgada».

## Pantallas

- **Inicio:** buscador grande, casos destacados, grupos, movimientos recientes.
- **Búsqueda:** resultados agrupados por tipo, con cadena resumida.
- **Ficha:** identificación, cadena de propiedad, properties, medios/empresas del
  grupo, fuentes, relaciones.
- **Registro:** tabla/ledger filtrable de todas las relaciones.
- **Mapa:** grupos con sus medios y empresas, en columnas.
- **Método:** criterios, fuentes, fecha de corte, aviso de independencia.

## Estética

Papel y tinta: fondo de sala oscura, hojas crema, sellos rojos, formularios,
seriales, texturas de halftone y scanlines. Tipografía condensada para titulares
y mono para datos. Todo con SCSS, tokens y mixins; sin CSS suelto ni estilos
inline.

## Riesgos y decisiones

- **Precisión:** la propiedad cambia y muchas participaciones no son públicas. Se
  muestra la fecha de verificación y se enlazan fuentes; se distingue control de
  participación.
- **Marcas:** no se usan logos; monogramas tipográficos.
- **Independencia:** aviso visible de que el sitio no es una entidad estatal ni
  representa a los medios.
- **Dominio:** se usa `eridu.top`, que es el que resuelve el túnel; `eritu.top` no
  resuelve. Queda anotado.

## Extensión: árbol, PDF y ranking

- **Árbol:** se calcula desde la raíz de control (familia o grupo) con las relaciones
  `principal`; cada nodo se expande/contrae y enlaza a su ficha. La ruta al foco se
  abre automáticamente. Resuelve «subir y bajar» sin depender de una gráfica pesada.
- **PDF:** se genera en el navegador con jsPDF, bajo demanda. Hay dos modelos: ficha
  de entidad (cadena, propiedades, historial, fuentes) y registro filtrado. El PDF
  no sustituye la ficha web: es una copia portable con la misma fecha de corte.
- **Ranking:** `rank` y `tier` ordenan los grupos por alcance nacional, cantidad de
  medios y tamaño. Es un criterio editorial explicado en Método, no una medición
  objetiva de poder.
