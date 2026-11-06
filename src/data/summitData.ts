import { AgendaItem, Delegate, SpecialGuest } from '../types/agenda';

export const ONEVOICE_LOGO_URL = '/summit-logo.png';
export const SUMMIT_LOGO_URL = '/summit-logo.png';
export const ONEVOICE_LOGO_FALLBACK = '/summit-logo.png';

export const OFFICIAL_SUMMIT_AGENDA: AgendaItem[] = [
  {
    id: 'act-01',
    order: 1,
    startTime: '07:45',
    endTime: '08:30',
    title: 'Llegada y Registro',
    speaker: 'Equipo de Recepción & Acreditación',
    category: 'ceremony',
    description: 'Te esperamos para registrarte y hacer entrega del suéter oficial del evento en color crema.',
    location: 'Lobby Principal · Edif. 0844, Balboa'
  },
  {
    id: 'act-02',
    order: 2,
    startTime: '08:30',
    endTime: '08:50',
    title: 'Bienvenida Oficial e Inauguración',
    speaker: 'Pr. José Smith y Pr. Luis Guerra',
    category: 'ceremony',
    description: 'Apertura formal del Digital Creator Summit PNM26. "En Cristo, todas las cosas son nuevas."',
    location: 'Auditorio Central'
  },
  {
    id: 'act-03',
    order: 3,
    startTime: '08:50',
    endTime: '09:30',
    title: 'Devocional · El perfil del creador',
    speaker: 'Abel Márquez',
    category: 'devotional',
    description: 'Director de Comunicación División Interamericana. El propósito sagrado del misionero digital contemporáneo.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-04',
    order: 4,
    startTime: '09:30',
    endTime: '09:40',
    title: 'Microcápsula 1: Narrativa y Propósito',
    speaker: 'Producción Digital Creator Summit',
    category: 'capsule',
    description: 'Píldora práctica de alto impacto sobre cómo enfocar mensajes con significado eterno.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-05',
    order: 5,
    startTime: '09:40',
    endTime: '10:25',
    title: 'El creador como misionero digital',
    speaker: 'Miqueas Fortunato',
    category: 'keynote',
    description: 'Director de Marketing de Hope Channel Interamerica. "Empieza con lo que tengas en las manos... Con lo que tú tienes en las manos, Dios te puede usar."',
    location: 'Auditorio Central'
  },
  {
    id: 'act-06',
    order: 6,
    startTime: '10:25',
    endTime: '10:35',
    title: 'Microcápsula 2: Optimización de Canales',
    speaker: 'Producción Digital Creator Summit',
    category: 'capsule',
    description: 'Consejos técnicos de bio, links, branding y consistencia en plataformas digitales.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-07',
    order: 7,
    startTime: '10:35',
    endTime: '11:20',
    title: 'Exploración digital · Casos de estudio',
    speaker: 'Actividad Grupal & Facilitadores',
    category: 'workshop',
    description: 'Dinámica de análisis colaborativo: disección de campañas virales con contenido cristiano y lecciones clave.',
    location: 'Salón de Trabajo en Equipos'
  },
  {
    id: 'act-08',
    order: 8,
    startTime: '11:20',
    endTime: '11:30',
    title: 'Microcápsula 3: Audio y Ritmo Audiovisual',
    speaker: 'Producción Digital Creator Summit',
    category: 'capsule',
    description: 'El poder del diseño sonoro y selección musical para conectar emocionalmente.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-09',
    order: 9,
    startTime: '11:30',
    endTime: '12:15',
    title: 'Contar historias que cambian vidas',
    speaker: 'Némesis Guerra',
    category: 'keynote',
    description: 'Storytelling auténtico y testimonios digitales para transformar vidas a través de la esperanza.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-10',
    order: 10,
    startTime: '12:15',
    endTime: '12:25',
    title: 'Microcápsula 4: Iluminación y Encuadre Móvil',
    speaker: 'Producción Digital Creator Summit',
    category: 'capsule',
    description: 'Técnicas cinematográficas accesibles usando únicamente smartphones y luz natural.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-11',
    order: 11,
    startTime: '12:25',
    endTime: '13:00',
    title: 'Del like al estudio bíblico',
    speaker: 'Pr. Misael González',
    category: 'keynote',
    description: 'Cómo construir puentes de discipulado real a partir de la interacción y comentarios en redes sociales.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-12',
    order: 12,
    startTime: '13:00',
    endTime: '13:10',
    title: 'Microcápsula 5: Métricas que Importan',
    speaker: 'Producción Digital Creator Summit',
    category: 'capsule',
    description: 'Diferencia entre métricas de vanidad y métricas de conversión espiritual e impacto genuino.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-13',
    order: 13,
    startTime: '13:10',
    endTime: '14:15',
    title: 'Almuerzo y Espacio de Confraternidad',
    speaker: 'Todos los Delegados e Invitados',
    category: 'break',
    description: 'Pausa para compartir alimentos, networking entre creadores, fotos y descanso.',
    location: 'Área Social y Comedor'
  },
  {
    id: 'act-14',
    order: 14,
    startTime: '14:15',
    endTime: '14:25',
    title: 'Microcápsula 6: Ganchos y Primeros 3 Segundos',
    speaker: 'Producción Digital Creator Summit',
    category: 'capsule',
    description: 'Estrategias visuales y textuales para capturar la atención en el scroll frenético de redes.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-15',
    order: 15,
    startTime: '14:25',
    endTime: '15:05',
    title: 'Formatos cortos que funcionan',
    speaker: 'Tito Villanueva',
    category: 'keynote',
    description: 'Estructura ganadora de Reels, TikToks y Shorts: retención, dinamismo y llamada a la acción.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-16',
    order: 16,
    startTime: '15:05',
    endTime: '15:15',
    title: 'Microcápsula 7: Miniaturas y Títulos Ganadores',
    speaker: 'Producción Digital Creator Summit',
    category: 'capsule',
    description: 'Psicología visual y redacción persuasiva sin caer en clickbait vacío.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-17',
    order: 17,
    startTime: '15:15',
    endTime: '16:00',
    title: 'IA y creación de contenido',
    speaker: 'Darwin Erazo y Tomás Hills',
    category: 'keynote',
    description: 'Potenciando la productividad con herramientas de inteligencia artificial generativa, prompts éticos y workflows modernos.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-18',
    order: 18,
    startTime: '16:00',
    endTime: '16:10',
    title: 'Microcápsula 8: Organización y Calendario Editorial',
    speaker: 'Producción Digital Creator Summit',
    category: 'capsule',
    description: 'Cómo sostener un ministerio digital sin sufrir agotamiento emocional o burnout.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-19',
    order: 19,
    startTime: '16:10',
    endTime: '16:50',
    title: 'UnaVoz27 · Redes sociales y All Things New',
    speaker: 'Abel Márquez',
    category: 'keynote',
    description: 'Estrategia global de la iglesia para 2027: Una sola visión comunicacional conectando miles de voces adventistas.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-20',
    order: 20,
    startTime: '16:50',
    endTime: '17:20',
    title: 'Conversatorio · Preguntas y respuestas',
    speaker: 'Pr. Luis Guerra, Abel Márquez y Miqueas Fortunato',
    category: 'panel',
    description: 'Panel abierto con los directores y ponentes. Espacio para preguntas en vivo de la audiencia y delegados.',
    location: 'Escenario Principal'
  },
  {
    id: 'act-21',
    order: 21,
    startTime: '17:20',
    endTime: '17:40',
    title: 'Desafío OneVoice27',
    speaker: 'Actividad Grupal',
    category: 'workshop',
    description: 'Desafío colaborativo en vivo: creación y publicación coordinada de un micro-contenido de impacto con el hashtag oficial.',
    location: 'Auditorio Central y Espacios Exteriores'
  },
  {
    id: 'act-22',
    order: 22,
    startTime: '17:40',
    endTime: '17:55',
    title: 'Presentación de propuestas y lanzamiento',
    speaker: 'Pr. Luis Guerra',
    category: 'ceremony',
    description: 'Exposición de las ideas más destacadas del desafío y lanzamiento de la red de misioneros digitales de Panamá.',
    location: 'Auditorio Central'
  },
  {
    id: 'act-23',
    order: 23,
    startTime: '17:55',
    endTime: '18:00',
    title: 'Cierre, Oración y Agradecimientos',
    speaker: 'Pr. José Smith y Pr. Luis Guerra',
    category: 'ceremony',
    description: 'Oración de consagración para todos los creadores digitales. Despedida y foto oficial del evento.',
    location: 'Auditorio Central'
  }
];

export const SPECIAL_GUESTS: SpecialGuest[] = [
  {
    name: 'Abel Márquez',
    role: 'Director de Comunicación',
    organization: 'División Interamericana',
    quote: 'Este es un movimiento histórico de comunicación para la Iglesia Adventista. En todo el mundo, todos hablarán de la misma esperanza, pero cada territorio la contextualizará según su cultura y posibilidades… Es más importante que nunca llevar a la iglesia la misión de unirse en el propósito de compartir que en Jesús todas las cosas son nuevas.',
    avatarSeed: 'abel'
  },
  {
    name: 'Miqueas Fortunato',
    role: 'Director de Marketing de Hope Channel Interamerica',
    organization: 'División Interamericana',
    quote: 'Empieza con lo que tengas en las manos. A veces estamos esperando tener la mejor cámara, el mejor micrófono. Con tu teléfono celular, empieza a hacer lo que tú sabes, con lo que tienes... Cuando hay una convocatoria de comunicación, asiste, aprende, pero empieza a hacer lo que sabes... Con lo que tú tienes en las manos, Dios te puede usar...',
    avatarSeed: 'miqueas'
  },
  {
    name: 'Pr. José Smith & Pr. Luis Guerra',
    role: 'Líderes de Comunicación y Pastoral',
    organization: 'Unión Adventista Panameña',
    quote: 'Una misión. Muchas voces. Un mismo mensaje.',
    avatarSeed: 'smith_guerra'
  },
  {
    name: 'Némesis Guerra',
    role: 'Especialista en Storytelling Digital',
    organization: 'Digital Creators Network',
    quote: 'Contar historias que tocan el corazón y apuntan hacia la eternidad.',
    avatarSeed: 'nemesis'
  },
  {
    name: 'Pr. Misael González',
    role: 'Evangelismo Digital & Discipulado',
    organization: 'Unión Adventista Panameña',
    quote: 'Hacer que un like en redes trascienda hacia una decisión real por Cristo.',
    avatarSeed: 'misael'
  },
  {
    name: 'Tito Villanueva',
    role: 'Especialista en Formatos Cortos & Reels',
    organization: 'Creadores Con Misión',
    quote: 'El secreto está en el dinamismo con mensaje claro en menos de 60 segundos.',
    avatarSeed: 'tito'
  },
  {
    name: 'Darwin Erazo & Tomás Hills',
    role: 'Tecnología, IA & Contenido',
    organization: 'Innovación Digital Adventista',
    quote: 'La inteligencia artificial como multiplicador de dones para la predicación.',
    avatarSeed: 'darwin_tomas'
  }
];

export const DELEGATES_LIST: Delegate[] = [
  // Bocas Mission
  { id: 'del-01', name: 'Gustavo Guerrero', association: 'Bocas Mission' },
  { id: 'del-02', name: 'Lyseth De León', association: 'Bocas Mission' },
  { id: 'del-03', name: 'Néstor Jiménez', association: 'Bocas Mission' },
  { id: 'del-04', name: 'Sammer Justavino', association: 'Bocas Mission' },

  // Asociación Central
  { id: 'del-05', name: 'Natalia Bustamante', association: 'Asociación Central' },
  { id: 'del-06', name: 'Daniel Raúl Dominguez Melgar', association: 'Asociación Central' },
  { id: 'del-07', name: 'Linda Aguilar', association: 'Asociación Central' },
  { id: 'del-08', name: 'Ismari Jiménez', association: 'Asociación Central' },
  { id: 'del-09', name: 'Joharys Jiménez', association: 'Asociación Central' },
  { id: 'del-10', name: 'Nathaly Aguilar', association: 'Asociación Central' },
  { id: 'del-11', name: 'Bennie Magallon', association: 'Asociación Central' },
  { id: 'del-12', name: 'Ismael Degracia', association: 'Asociación Central' },
  { id: 'del-13', name: 'Zoraida Vega', association: 'Asociación Central' },
  { id: 'del-14', name: 'Genesis Martinez', association: 'Asociación Central' },
  { id: 'del-15', name: 'Riani Forbes', association: 'Asociación Central' },
  { id: 'del-16', name: 'Alisson Arauz', association: 'Asociación Central' },
  { id: 'del-17', name: 'Daniel Jafet Guerra Santos', association: 'Asociación Central' },
  { id: 'del-18', name: 'Victoria Cadavid', association: 'Asociación Central' },
  { id: 'del-19', name: 'Zorababel Solis', association: 'Asociación Central' },
  { id: 'del-20', name: 'Ana Morris', association: 'Asociación Central' },
  { id: 'del-21', name: 'Ana González', association: 'Asociación Central' },
  { id: 'del-22', name: 'Jeimy Rojas de Villa', association: 'Asociación Central' },
  { id: 'del-23', name: 'Eira Rivas', association: 'Asociación Central' },
  { id: 'del-24', name: 'Luis Villa', association: 'Asociación Central' },

  // Asociación Atlántica
  { id: 'del-25', name: 'Beli Ortiz', association: 'Asociación Atlántica' },
  { id: 'del-26', name: 'Humberto Vasquez', association: 'Asociación Atlántica' },
  { id: 'del-27', name: 'Henry González', association: 'Asociación Atlántica' },
  { id: 'del-28', name: 'Liliana Castillo', association: 'Asociación Atlántica' },
  { id: 'del-29', name: 'Lilian de Santiago', association: 'Asociación Atlántica' },
  { id: 'del-30', name: 'Luis González', association: 'Asociación Atlántica' },
  { id: 'del-31', name: 'José Apochito', association: 'Asociación Atlántica' },
  { id: 'del-32', name: 'Isaac Velasquez', association: 'Asociación Atlántica' },
  { id: 'del-33', name: 'Esther Apochito', association: 'Asociación Atlántica' },
  { id: 'del-34', name: 'Guevara Hernandez Giberto', association: 'Asociación Atlántica' },
  { id: 'del-35', name: 'Jairo Taborda', association: 'Asociación Atlántica' },
  { id: 'del-36', name: 'Xavier Alveo', association: 'Asociación Atlántica' },
  { id: 'del-37', name: 'Gabriel Gámez', association: 'Asociación Atlántica' },
  { id: 'del-38', name: 'Danay Garcia Malagon', association: 'Asociación Atlántica' },
  { id: 'del-39', name: 'Orlando Odreman', association: 'Asociación Atlántica' },

  // Misión Sureste
  { id: 'del-40', name: 'Gabriel Lezcano', association: 'Misión Sureste' },
  { id: 'del-41', name: 'Hamys Phillips', association: 'Misión Sureste' },
  { id: 'del-42', name: 'Jovany Andres Morales', association: 'Misión Sureste' },
  { id: 'del-43', name: 'Amitt Trejos', association: 'Misión Sureste' },
  { id: 'del-44', name: 'Mercedes Solis', association: 'Misión Sureste' },
  { id: 'del-45', name: 'Alen Ramírez', association: 'Misión Sureste' },
  { id: 'del-46', name: 'Keicibel Navarro', association: 'Misión Sureste' },
  { id: 'del-47', name: 'Didier', association: 'Misión Sureste' },
  { id: 'del-48', name: 'Arielle Carrera', association: 'Misión Sureste' },
  { id: 'del-49', name: 'Vivian', association: 'Misión Sureste' },

  // Asociación Metropolitana
  { id: 'del-50', name: 'María José Caro', association: 'Asociación Metropolitana' },
  { id: 'del-51', name: 'Jenny Cuero', association: 'Asociación Metropolitana' },
  { id: 'del-52', name: 'Yailennys Miranda', association: 'Asociación Metropolitana' },
  { id: 'del-53', name: 'Angelinho Javier', association: 'Asociación Metropolitana' },
  { id: 'del-54', name: 'Ariadne Alguero', association: 'Asociación Metropolitana' },
  { id: 'del-55', name: 'Keysha Jimenez', association: 'Asociación Metropolitana' },
  { id: 'del-56', name: 'Justin Master', association: 'Asociación Metropolitana' },
  { id: 'del-57', name: 'Allan Bennett', association: 'Asociación Metropolitana' },
  { id: 'del-58', name: 'Sharon Thompson', association: 'Asociación Metropolitana' },
  { id: 'del-59', name: 'Abril Valdes', association: 'Asociación Metropolitana' },
  { id: 'del-60', name: 'Katina Kingston', association: 'Asociación Metropolitana' },
  { id: 'del-61', name: 'Andrea Paredes', association: 'Asociación Metropolitana' },
  { id: 'del-62', name: 'Rachel Jordan', association: 'Asociación Metropolitana' },
  { id: 'del-63', name: 'Emelyn Crespo', association: 'Asociación Metropolitana' },
  { id: 'del-64', name: 'Michelle Castrejo', association: 'Asociación Metropolitana' },
  { id: 'del-65', name: 'Jeniffer Peña', association: 'Asociación Metropolitana' },
  { id: 'del-66', name: 'Nathaly Cáceres', association: 'Asociación Metropolitana' },
  { id: 'del-67', name: 'Saul aparicio', association: 'Asociación Metropolitana' },
  { id: 'del-68', name: 'Génesis González Mairena', association: 'Asociación Metropolitana' },
  { id: 'del-69', name: 'Tanis Espinoza', association: 'Asociación Metropolitana' },

  // Asociación Occidental
  { id: 'del-70', name: 'Emilia Rivera', association: 'Asociación Occidental' },
  { id: 'del-71', name: 'Ketlie Gonzalez', association: 'Asociación Occidental' },
  { id: 'del-72', name: 'Yeimy González', association: 'Asociación Occidental' },
  { id: 'del-73', name: 'Genesis Z. Guerra', association: 'Asociación Occidental' },
  { id: 'del-74', name: 'Laura Ethel Soto López', association: 'Asociación Occidental' },
  { id: 'del-75', name: 'Nicole Marie González', association: 'Asociación Occidental' },
  { id: 'del-76', name: 'Denisse Chávez', association: 'Asociación Occidental' },
  { id: 'del-77', name: 'Daniel Chávez', association: 'Asociación Occidental' },
  { id: 'del-78', name: 'Daniela Miranda', association: 'Asociación Occidental' },
  { id: 'del-79', name: 'Jiovani Atencio Gómez', association: 'Asociación Occidental' },
  { id: 'del-80', name: 'Jaime André Ramos Guevara', association: 'Asociación Occidental' },
  { id: 'del-81', name: 'Gabriela Herrera', association: 'Asociación Occidental' },
  { id: 'del-82', name: 'Delany Arcia', association: 'Asociación Occidental' },
  { id: 'del-83', name: 'Katherine Alfaro', association: 'Asociación Occidental' },
  { id: 'del-84', name: 'Naydelin González', association: 'Asociación Occidental' },
  { id: 'del-85', name: 'Gabriel Jiménez De León', association: 'Asociación Occidental' },
  { id: 'del-86', name: 'Marilyn Cedeño Granda', association: 'Asociación Occidental' },
  { id: 'del-87', name: 'Gidalti Santamaria', association: 'Asociación Occidental' },
  { id: 'del-88', name: 'Randall', association: 'Asociación Occidental' },
  { id: 'del-89', name: 'Ricardo Carrera Rodriguez', association: 'Asociación Occidental' },
  { id: 'del-90', name: 'Yaniseth Yanguez', association: 'Asociación Occidental' },
  { id: 'del-91', name: 'Daniel Velez', association: 'Asociación Occidental' },
  { id: 'del-92', name: 'Kener De Gracia', association: 'Asociación Occidental' },
  { id: 'del-93', name: 'Kaira de Gracia', association: 'Asociación Occidental' },
  { id: 'del-94', name: 'Jeremi Concepcion', association: 'Asociación Occidental' }
];

export const VENUE_INFO = {
  name: 'Unión Adventista Panameña',
  address: 'Balboa, Ancón, Calle Ramón Levy, Edif. 0844, Panamá',
  scheduleTimes: 'Registro 7:45 AM · Cierre 6:00 PM',
  dressCode: 'Casual o semiformal (Recibirás el suéter oficial en color crema)',
  motto: 'En Cristo, todas las cosas son nuevas · Una misión. Muchas voces. Un mismo mensaje.',
  contentHubUrl: 'https://abre.ai/creatorsummit26',
  socialHandles: [
    { label: 'Unión Adventista Panameña', handle: '@adventistaspanama', url: 'https://instagram.com/adventistaspanama' },
    { label: 'División Interamericana', handle: '@adventistiad', url: 'https://instagram.com/adventistiad' },
    { label: 'Biblia Contigo', handle: '@bibliacontigo', url: 'https://instagram.com/bibliacontigo' },
    { label: 'Hope Radio Panamá', handle: '@hoperadiopanama', url: 'https://instagram.com/hoperadiopanama' },
    { label: 'Hope Media Panamá', handle: '@hopemediapanama', url: 'https://instagram.com/hopemediapanama' }
  ]
};
