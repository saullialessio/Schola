import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Subject, Homework, Grade, TimetableEntry, DayNote } from '../types';

interface AppContextType extends AppState {
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: string) => void;
  addHomework: (homework: Omit<Homework, 'id' | 'isDone'>) => void;
  toggleHomework: (id: string) => void;
  deleteHomework: (id: string) => void;
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  deleteGrade: (id: string) => void;
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  deleteTimetableEntry: (id: string) => void;
  updateNote: (date: string, content: string, mood?: DayNote['mood']) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'schola_app_data_v1';

const INITIAL_STATE: AppState = {
  subjects: [
    { id: '1', name: 'Mathematics', color: 'blue', teacher: 'Mr. Smith', room: '101' },
    { id: '2', name: 'History', color: 'orange', teacher: 'Mrs. Jones', room: '204' },
    { id: '3', name: 'Physics', color: 'purple', teacher: 'Dr. Brown', room: 'LAB-1' },
  ],
  homework: [],
  grades: [],
  timetable: [],
  notes: [],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    setState(prev => ({
      ...prev,
      subjects: [...prev.subjects, { ...subject, id: Date.now().toString() }]
    }));
  };

  const deleteSubject = (id: string) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
      // Cascade delete related items
      homework: prev.homework.filter(h => h.subjectId !== id),
      grades: prev.grades.filter(g => g.subjectId !== id),
      timetable: prev.timetable.filter(t => t.subjectId !== id),
    }));
  };

  const addHomework = (homework: Omit<Homework, 'id' | 'isDone'>) => {
    setState(prev => ({
      ...prev,
      homework: [...prev.homework, { ...homework, id: Date.now().toString(), isDone: false }]
    }));
  };

  const toggleHomework = (id: string) => {
    setState(prev => ({
      ...prev,
      homework: prev.homework.map(h => h.id === id ? { ...h, isDone: !h.isDone } : h)
    }));
  };

  const deleteHomework = (id: string) => {
    setState(prev => ({
      ...prev,
      homework: prev.homework.filter(h => h.id !== id)
    }));
  };

  const addGrade = (grade: Omit<Grade, 'id'>) => {
    setState(prev => ({
      ...prev,
      grades: [...prev.grades, { ...grade, id: Date.now().toString() }]
    }));
  };

  const deleteGrade = (id: string) => {
    setState(prev => ({
      ...prev,
      grades: prev.grades.filter(g => g.id !== id)
    }));
  };

  const addTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    setState(prev => ({
      ...prev,
      timetable: [...prev.timetable, { ...entry, id: Date.now().toString() }]
    }));
  };

  const deleteTimetableEntry = (id: string) => {
    setState(prev => ({
      ...prev,
      timetable: prev.timetable.filter(t => t.id !== id)
    }));
  };

  const updateNote = (date: string, content: string, mood?: DayNote['mood']) => {
    setState(prev => {
      const existingIndex = prev.notes.findIndex(n => n.date === date);
      if (existingIndex >= 0) {
        const newNotes = [...prev.notes];
        newNotes[existingIndex] = { ...newNotes[existingIndex], content, mood: mood || newNotes[existingIndex].mood };
        return { ...prev, notes: newNotes };
      } else {
        return {
          ...prev,
          notes: [...prev.notes, { id: Date.now().toString(), date, content, mood }]
        };
      }
    });
  };

  const resetData = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      ...state,
      addSubject, deleteSubject,
      addHomework, toggleHomework, deleteHomework,
      addGrade, deleteGrade,
      addTimetableEntry, deleteTimetableEntry,
      updateNote,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};