import type { TimelineEvent } from './types'

export const timeline: TimelineEvent[] = [
  {
    date: '1997-11-12',
    title: 'Valórem compra El Espectador',
    detail:
      'Valores Bavaria, hoy Valórem, adquiere la mayoría accionaria del periódico fundado en 1887.',
    entityIds: ['valorem', 'el-espectador'],
    sourceIds: ['mom-espectador', 'valorem-espectador'],
  },
  {
    date: '2003-04-07',
    title: 'PRISA compra Caracol Radio',
    detail:
      'El grupo español suma la cadena radial a su operación en Colombia; W Radio nace ese mismo año.',
    entityIds: ['prisa', 'caracol-radio', 'w-radio'],
    sourceIds: ['caracol-prisa', 'prisa'],
  },
  {
    date: '2011-10-05',
    title: 'Muere Julio Mario Santo Domingo',
    detail:
      'El control de Valórem pasa a sus descendientes; el holding sigue siendo el vehículo de la familia.',
    entityIds: ['familia-santo-domingo', 'valorem'],
    sourceIds: ['wiki-jmsd', 'valorem'],
  },
  {
    date: '2014-11-28',
    title: 'Nutresa acuerda comprar El Corral',
    detail:
      'El grupo alimentario anuncia la adquisición del 100% de la cadena de hamburguesas por unos US$383 millones.',
    entityIds: ['nutresa', 'el-corral'],
    sourceIds: ['reuters-corral'],
  },
  {
    date: '2019-08-05',
    title: 'Gómez Martínez se queda con El Colombiano',
    detail:
      'La familia Gómez Martínez compra la participación de la familia Hernández y queda como única propietaria del grupo de medios antioqueño.',
    entityIds: ['familia-gomez-martinez', 'grupo-el-colombiano'],
    sourceIds: ['pulzo-colombiano'],
  },
  {
    date: '2020-11-11',
    title: 'Los Gilinski entran a Semana',
    detail:
      'Jaime y Gabriel Gilinski acuerdan adquirir el 50% de Publicaciones Semana; la familia queda al mando del grupo editorial.',
    entityIds: ['familia-gilinski', 'grupo-semana', 'semana'],
    sourceIds: ['forbes-semana', 'eltiempo-semana'],
  },
  {
    date: '2021-08-13',
    title: 'Muere Carlos Ardila Lülle',
    detail:
      'El fundador de la Organización Ardila Lülle fallece a los 91 años; el conglomerado queda en manos de sus herederos.',
    entityIds: ['familia-ardila', 'oal'],
    sourceIds: ['reuters-ardila'],
  },
  {
    date: '2023-01-15',
    title: 'Gilinski compra El País de Cali',
    detail:
      'Gabriel Gilinski adquiere el diario caleño, que atravesaba una crisis financiera, y lo integra a su expansión en medios.',
    entityIds: ['familia-gilinski', 'el-pais'],
    sourceIds: ['elcolombiano-pais'],
  },
  {
    date: '2023-06-23',
    title: 'Acuerdo por El Heraldo',
    detail:
      'El Grupo Semana firma la compra del 100% del diario de Barranquilla a la familia Pumarejo.',
    entityIds: ['grupo-semana', 'el-heraldo'],
    sourceIds: ['elpais-heraldo'],
  },
  {
    date: '2024-02-09',
    title: 'Gilinski e IHC toman Nutresa',
    detail:
      'El consorcio completa el control del grupo alimentario; la familia Gilinski queda al mando de la junta directiva.',
    entityIds: ['gilinski', 'nutresa'],
    sourceIds: ['reuters-nutresa', 'nutresa-junta'],
  },
  {
    date: '2024-03-20',
    title: 'Sarmiento se retira de Grupo Aval',
    detail:
      'Luis Carlos Sarmiento Angulo deja la presidencia de la junta tras casi 30 años; su hijo asume la sucesión.',
    entityIds: ['familia-sarmiento', 'aval'],
    sourceIds: ['aval-retiro'],
  },
  {
    date: '2025-06-27',
    title: 'Gilinski vende El País',
    detail:
      'Dos años y medio después de comprarlo, el grupo vende el diario caleño al empresario dominicano Eduardo Hernández Incháustegui.',
    entityIds: ['familia-gilinski', 'el-pais', 'eduardo-hernandez'],
    sourceIds: ['elcolombiano-pais'],
  },
  {
    date: '2025-12-31',
    title: 'El Espectador, sin ánimo de lucro',
    detail:
      'El periódico se transforma en entidad sin ánimo de lucro; Valórem lo sigue presentando como parte de su grupo.',
    entityIds: ['valorem', 'el-espectador'],
    sourceIds: ['valorem-espectador'],
  },
  {
    date: '2026-01-13',
    title: 'Caracol Radio integra W Radio',
    detail:
      'PRISA unifica la operación informativa de sus dos emisoras en Colombia bajo la marca Caracol Radio.',
    entityIds: ['prisa', 'caracol-radio', 'w-radio'],
    sourceIds: ['caracol-prisa'],
  },
  {
    date: '2026-10-23',
    title: 'Nutresa compra Presto',
    detail:
      'El Grupo Nutresa adquiere la marca Presto y su unidad productiva, ampliando su presencia en comida rápida.',
    entityIds: ['nutresa', 'presto'],
    sourceIds: ['nutresa-presto'],
  },
]
