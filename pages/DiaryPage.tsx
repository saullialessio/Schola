import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IOSHeader, IOSCard, EmptyState, SubjectBadge } from '../components/UI';
import { Calendar as CalendarIcon, Edit3, ChevronLeft, ChevronRight, Smile, Meh, Frown, Battery } from 'lucide-react';
import { format, addDays, subDays, isSameDay, startOfWeek, addWeeks, subWeeks } from 'date-fns';

const DiaryPage: React.FC = () => {
  const { notes, homework, timetable, subjects, updateNote, toggleHomework } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const currentNote = notes.find(n => n.date === dateStr);
  const dayHomework = homework.filter(h => h.dueDate === dateStr);
  const dayTimetable = timetable.filter(t => t.dayOfWeek === selectedDate.getDay()); // 0 is Sunday

  const toggleNoteEdit = () => {
    setIsEditingNote(!isEditingNote);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(dateStr, e.target.value, currentNote?.mood);
  };

  const setMood = (mood: 'happy' | 'neutral' | 'stressed' | 'tired') => {
    updateNote(dateStr, currentNote?.content || '', mood);
  };

  // Generate week days
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="pb-10">
      <IOSHeader title="Diary" />
      
      {/* Weekly Calendar Strip */}
      <div className="bg-white pb-4 pt-2 shadow-sm mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
            <h2 className="text-base font-semibold text-gray-800">{format(weekStart, 'MMMM yyyy')}</h2>
            <div className="flex space-x-4">
                <button onClick={() => setWeekStart(subWeeks(weekStart, 1))}><ChevronLeft size={20} className="text-ios-blue"/></button>
                <button onClick={() => setWeekStart(addWeeks(weekStart, 1))}><ChevronRight size={20} className="text-ios-blue"/></button>
            </div>
        </div>
        <div className="flex justify-around px-2">
          {weekDays.map((day, idx) => {
             const isSelected = isSameDay(day, selectedDate);
             const isToday = isSameDay(day, new Date());
             return (
              <button 
                key={idx} 
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center justify-center h-14 w-10 rounded-xl transition-all ${isSelected ? 'bg-ios-blue text-white shadow-md' : 'bg-transparent text-gray-500'}`}
              >
                <span className={`text-[10px] uppercase font-bold mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{format(day, 'EEE')}</span>
                <span className={`text-lg font-medium ${isSelected ? 'text-white' : isToday ? 'text-ios-blue font-bold' : 'text-gray-900'}`}>{format(day, 'd')}</span>
              </button>
             );
          })}
        </div>
      </div>

      <div className="px-4 space-y-6">
        
        {/* Today's Schedule */}
        <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Schedule</h3>
            {dayTimetable.length > 0 ? (
                <div className="space-y-3">
                    {dayTimetable
                    .sort((a,b) => a.startTime.localeCompare(b.startTime))
                    .map(t => {
                        const subject = subjects.find(s => s.id === t.subjectId);
                        return (
                            <IOSCard key={t.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-1 h-10 rounded-full bg-${subject?.color}-500`}></div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{subject?.name}</h4>
                                        <p className="text-xs text-gray-500">{t.startTime} - {t.endTime} • {subject?.room}</p>
                                    </div>
                                </div>
                            </IOSCard>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic pl-1">No classes scheduled for today.</p>
            )}
        </section>

        {/* Homework due */}
        <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Due Today</h3>
            {dayHomework.length > 0 ? (
                <div className="space-y-2">
                    {dayHomework.map(h => {
                         const subject = subjects.find(s => s.id === h.subjectId);
                         return (
                            <IOSCard key={h.id} className="flex items-start space-x-3" onClick={() => toggleHomework(h.id)}>
                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${h.isDone ? 'bg-ios-green border-ios-green' : 'border-gray-300'}`}>
                                    {h.isDone && <span className="text-white text-xs">✓</span>}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-base font-medium ${h.isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{h.title}</p>
                                    {subject && <SubjectBadge color={subject.color} name={subject.name} small />}
                                </div>
                            </IOSCard>
                         );
                    })}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic pl-1">No homework due today.</p>
            )}
        </section>

        {/* Daily Note */}
        <section>
           <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Daily Notes</h3>
                <div className="flex space-x-2">
                    <button onClick={() => setMood('happy')} className={`p-1 rounded-full ${currentNote?.mood === 'happy' ? 'bg-green-100 text-green-600' : 'text-gray-300'}`}><Smile size={20}/></button>
                    <button onClick={() => setMood('neutral')} className={`p-1 rounded-full ${currentNote?.mood === 'neutral' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-300'}`}><Meh size={20}/></button>
                    <button onClick={() => setMood('stressed')} className={`p-1 rounded-full ${currentNote?.mood === 'stressed' ? 'bg-red-100 text-red-600' : 'text-gray-300'}`}><Frown size={20}/></button>
                    <button onClick={() => setMood('tired')} className={`p-1 rounded-full ${currentNote?.mood === 'tired' ? 'bg-purple-100 text-purple-600' : 'text-gray-300'}`}><Battery size={20}/></button>
                </div>
           </div>
           
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[150px]">
                <textarea
                    value={currentNote?.content || ''}
                    onChange={handleNoteChange}
                    placeholder="How was your day? Write about lessons, events or feelings..."
                    className="w-full h-full p-4 text-base text-gray-800 resize-none focus:outline-none min-h-[150px]"
                />
           </div>
        </section>

      </div>
    </div>
  );
};

export default DiaryPage;