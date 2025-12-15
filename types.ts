export interface Subject {
  id: string;
  name: string;
  color: string;
  teacher: string;
  room: string;
}

export interface Homework {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string; // ISO Date string
  isDone: boolean;
  priority: 'low' | 'medium' | 'high';
  type: 'homework' | 'study';
}

export interface Grade {
  id: string;
  subjectId: string;
  value: number;
  max: number; // e.g. 10 or 100
  date: string;
  type: 'oral' | 'written' | 'practical';
  weight: number; // 1.0 is standard
}

export interface TimetableEntry {
  id: string;
  subjectId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "08:00"
  endTime: string; // "09:00"
}

export interface DayNote {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood?: 'happy' | 'neutral' | 'stressed' | 'tired';
}

export interface AppState {
  subjects: Subject[];
  homework: Homework[];
  grades: Grade[];
  timetable: TimetableEntry[];
  notes: DayNote[];
}