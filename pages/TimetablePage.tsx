import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IOSHeader, IOSCard, IOSButton, IOSModal, IOSInput, IOSSelect, SubjectBadge } from '../components/UI';
import { Plus, Trash2 } from 'lucide-react';
import { TimetableEntry } from '../types';

const TimetablePage: React.FC = () => {
  const { timetable, subjects, addTimetableEntry, deleteTimetableEntry } = useApp();
  const [activeDay, setActiveDay] = useState(new Date().getDay() || 1); // Default to Monday if Sunday (0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newEntry, setNewEntry] = useState<Omit<TimetableEntry, 'id'>>({
    subjectId: subjects[0]?.id || '',
    dayOfWeek: activeDay,
    startTime: '08:00',
    endTime: '09:00'
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.subjectId) return;
    addTimetableEntry(newEntry);
    setIsModalOpen(false);
  };

  const dayEntries = timetable
    .filter(t => t.dayOfWeek === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div>
      <IOSHeader 
        title="Timetable" 
        action={<button onClick={() => setIsModalOpen(true)} className="p-2 bg-ios-blue text-white rounded-full hover:bg-blue-600"><Plus size={20} /></button>} 
      />

      {/* Day Selector */}
      <div className="flex justify-between px-2 mb-6 bg-white py-3 shadow-sm sticky top-[72px] z-30">
        {days.map((day, idx) => {
            if (idx === 0 || idx === 6) return null; // Skip weekend for simplicity in this view
            const isActive = activeDay === idx;
            return (
                <button
                    key={day}
                    onClick={() => setActiveDay(idx)}
                    className={`flex-1 mx-1 rounded-lg py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-ios-blue text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                    {day}
                </button>
            )
        })}
      </div>

      <div className="px-4 space-y-3 pb-20 relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>
        {dayEntries.length === 0 ? (
            <div className="pl-12 pt-10 text-gray-400 italic">No classes for this day.</div>
        ) : (
            dayEntries.map(entry => {
                const subject = subjects.find(s => s.id === entry.subjectId);
                return (
                    <div key={entry.id} className="relative pl-12">
                        <div className="absolute left-0 top-3 text-xs font-semibold text-gray-500 w-8 text-right">
                            {entry.startTime}
                        </div>
                        <IOSCard className="mb-2 relative overflow-hidden">
                             <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${subject?.color || 'gray'}-500`}></div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900">{subject?.name}</h4>
                                    <p className="text-sm text-gray-500">{subject?.room} • {subject?.teacher}</p>
                                    <p className="text-xs text-gray-400 mt-1">{entry.startTime} - {entry.endTime}</p>
                                </div>
                                <button onClick={() => deleteTimetableEntry(entry.id)} className="text-gray-300 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </IOSCard>
                    </div>
                );
            })
        )}
      </div>

      <IOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Class">
        <form onSubmit={handleSubmit} className="space-y-4">
           <IOSSelect 
            label="Day"
            value={newEntry.dayOfWeek}
            onChange={e => setNewEntry({...newEntry, dayOfWeek: parseInt(e.target.value)})}
          >
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
          </IOSSelect>

          <IOSSelect 
            label="Subject"
            value={newEntry.subjectId} 
            onChange={e => setNewEntry({...newEntry, subjectId: e.target.value})}
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </IOSSelect>

          <div className="grid grid-cols-2 gap-4">
            <IOSInput 
                type="time"
                label="Start Time"
                value={newEntry.startTime} 
                onChange={e => setNewEntry({...newEntry, startTime: e.target.value})} 
                required
            />
             <IOSInput 
                type="time"
                label="End Time"
                value={newEntry.endTime} 
                onChange={e => setNewEntry({...newEntry, endTime: e.target.value})} 
                required
            />
          </div>

          <div className="pt-4">
            <IOSButton type="submit">Add Class</IOSButton>
          </div>
        </form>
      </IOSModal>
    </div>
  );
};

export default TimetablePage;