import { Link } from 'react-router-dom'
import { entities, relations, sources } from '../data'
import { timeline } from '../data/timeline'
import { DATA_CUTOFF } from '../data/types'
import { formatDate } from '../format'
import { Chain } from '../components/Chain'
import { SourceList } from '../components/SourceList'
import { Stamp } from '../components/Stamp'
import { TimelineList } from '../components/TimelineList'
import { usePageTitle } from '../usePageTitle'

const relationTypes = [
  {
    name: 'Propiedad',
    text: 'El propietario tiene acciones o cuotas de la entidad. Cuando el porcentaje es público, se muestra.',
  },
  {
    name: 'Control',
    text: 'El propietario ejerce control societario o de gobierno, aunque la participación accionaria sea compartida.',
  },
  {
    name: 'Participación',
    text: 'Existe una inversión accionaria relevante, sin que el porcentaje permita afirmar control total.',
  },
  {
    name: 'Afiliación',
    text: 'La entidad se presenta públicamente como parte del grupo, sin que se haya divulgado una relación accionaria directa.',
  },
  {
    name: 'Operación',
    text: 'Una entidad opera un medio o activo que pertenece a otra, como en el caso de los medios públicos.',
  },
]

export function Method() {
  usePageTitle('Método y fuentes')
  return (
    <div className="page">
      <section className="page-head shell">
        <p className="eyebrow">MÉTODO / NOTA DE ORIGEN</p>
        <h1 className="page-title">Cómo se construye este archivo</h1>
        <p className="page-lede">
          WHOM reúne información pública sobre propiedad de medios y empresas. No es un ranking ni
          una acusación: es una cadena de custodia de datos, con la fuente al lado de cada vínculo.
        </p>
      </section>

      <section className="shell section section--tight method-grid">
        <article className="method-card paper">
          <Stamp tone="olive">Qué es</Stamp>
          <h2>Un registro, no un veredicto</h2>
          <p>
            El archivo responde dos preguntas: ¿de quién es este medio o esta marca? y ¿qué más tiene
            ese dueño? Cada respuesta se puede recorrer hasta el control último y volver a la fuente.
          </p>
          <p>
            La fecha de corte es <strong>{formatDate(DATA_CUTOFF)}</strong>. La propiedad cambia; si
            una operación posterior no está registrada, el expediente puede estar desactualizado.
          </p>
        </article>

        <article className="method-card paper">
          <Stamp tone="red">Qué no es</Stamp>
          <h2>Propiedad no es línea editorial</h2>
          <p>
            Que un grupo sea dueño de un medio no implica que cada publicación responda a sus
            intereses. WHOM describe estructura de propiedad; no atribuye intenciones ni califica
            la independencia de una redacción.
          </p>
          <p>
            Tampoco es un registro estatal ni una base oficial. Es un proyecto independiente y su
            código es abierto.
          </p>
        </article>
      </section>

      <div className="shell">
        <p className="fine-print method-ranking">
          <strong>Orden de los grupos:</strong> se usa el alcance nacional, la cantidad de medios y
          el tamaño del grupo. Es un criterio editorial para orientar la lectura, no una medición
          objetiva de poder ni de riqueza. El árbol permite explorar la misma información por ramas.
        </p>
      </div>

      <section className="shell section">
        <div className="section__head">
          <div>
            <p className="eyebrow">LECTURA</p>
            <h2>Una cadena, paso a paso</h2>
          </div>
          <p className="section__note">Ejemplo: la marca que casi nadie asocia con una revista.</p>
        </div>
        <div className="paper method-chain">
          <Chain id="el-corral" />
          <p className="fine-print">
            El Corral es una empresa de Nutresa. Nutresa está controlada por el consorcio
            Gilinski/IHC. La familia Gilinski controla el Grupo Semana, dueño de Semana, Dinero y
            SoHo. La cadena se detiene en la familia porque no hay un propietario superior
            documentado.
          </p>
        </div>
      </section>

      <section className="shell section">
        <div className="section__head">
          <div>
            <p className="eyebrow">GLOSARIO</p>
            <h2>Tipos de vínculo</h2>
          </div>
        </div>
        <dl className="glossary">
          {relationTypes.map((item) => (
            <div className="glossary__item paper" key={item.name}>
              <dt>{item.name}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell section" id="movimientos">
        <div className="section__head">
          <div>
            <p className="eyebrow">CRONOLOGÍA</p>
            <h2>Movimientos registrados</h2>
          </div>
          <p className="section__note">Compras, ventas y cambios de control que explican el mapa actual.</p>
        </div>
        <div className="timeline-wrap paper">
          <TimelineList events={[...timeline].reverse()} />
        </div>
      </section>

      <section className="shell section">
        <div className="section__head">
          <div>
            <p className="eyebrow">PAPEL DE ORIGEN</p>
            <h2>Fuentes citadas</h2>
          </div>
          <p className="section__note">
            {entities.length} entidades, {relations.length} vínculos y {sources.length} fuentes.
            Cada relación del registro enlaza al menos una.
          </p>
        </div>
        <div className="paper sources-wrap">
          <details className="sources-details">
            <summary>
              <span>Ver las {sources.length} fuentes citadas</span>
              <span className="sources-details__hint">Abrir bibliografía</span>
            </summary>
            <div className="sources-details__body">
              <SourceList sourceIds={sources.map((source) => source.id)} />
            </div>
          </details>
        </div>
      </section>

      <section className="method-band">
        <div className="shell method-band__inner">
          <div>
            <p className="eyebrow">CORRECCIONES</p>
            <h2>Si un dato cambió, el archivo debe cambiar.</h2>
          </div>
          <p>
            La propiedad no es estática y las participaciones no siempre son públicas. Si encuentra
            un error o una operación reciente, abra un reporte en el repositorio con la fuente.
          </p>
          <a className="btn btn--ghost" href="https://github.com/jdsalasca/whom/issues" target="_blank" rel="noreferrer">
            Reportar en GitHub ↗
          </a>
        </div>
      </section>

      <section className="shell section section--tight">
        <p className="fine-print">
          WHOM es un proyecto independiente. No está afiliado a los medios, grupos o personas
          mencionadas. Las marcas se citan con fines informativos y no se usan sus logotipos.{' '}
          <Link to="/registro">Volver al registro completo →</Link>
        </p>
      </section>
    </div>
  )
}
