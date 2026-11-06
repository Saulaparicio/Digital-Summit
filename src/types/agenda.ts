export type ActivityCategory = 
  | 'ceremony'     // Bienvenida, Apertura, Cierre
  | 'devotional'   // Devocionales
  | 'keynote'      // Conferencias magistrales
  | 'capsule'      // Microcápsulas
  | 'workshop'     // Exploración digital, Desafíos grupales
  | 'panel'        // Conversatorio, Preguntas y respuestas
  | 'break';       // Almuerzo, Recesos

export interface AgendaItem {
  id: string;
  order: number;
  startTime: string; // 'HH:mm' 24h
  endTime: string;   // 'HH:mm' 24h
  title: string;
  speaker?: string;
  category: ActivityCategory;
  description?: string;
  location?: string;
  alertShownStages?: number[]; // Track thresholds alerted for this item (e.g. [10, 5, 2, 0])
}

export interface Delegate {
  id: string;
  name: string;
  association: 'Asociación Occidental' | 'Asociación Central' | 'Asociación Metropolitana' | 'Asociación Atlántica' | 'Misión Sureste' | 'Bocas Mission' | string;
  checkedInAt?: string;
  isCustom?: boolean;
  photoUrl?: string;
}

export interface SpecialGuest {
  name: string;
  role: string;
  organization: string;
  quote?: string;
  avatarSeed?: string;
}

export interface AlertNotification {
  id: string;
  activityId: string;
  title: string;
  speaker?: string;
  startTime: string;
  minutesRemaining: number;
  isStartingNow: boolean;
  timestamp: number;
}
