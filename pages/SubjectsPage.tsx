import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IOSHeader, IOSCard, IOSButton, IOSModal, IOSInput, IOSSelect, EmptyState } from '../components/UI';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { Subject } from '../types';

const SubjectsPage: React.FC = () => {
  const { subjects, addSubject, deleteSubject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState<Omit<Subject, 'id'>>({ name: '', color: 'blue', teacher: '', room: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name) return;
    addSubject(newSubject);
    setNewSubject({ name: '', color: 'blue', teacher: '', room: '' });
    setIsModalOpen(false);
  };

  const colors = ['blue', 'red', 'green', 'orange', 'purple', 'yellow', 'gray'];

  return (
    <div>
      <IOSHeader 
        title="Subjects" 
        action={<button onClick={() => setIsModalOpen(true)} className="p-2 bg-ios-blue text-white rounded-full hover:bg-blue-600"><Plus size={20} /></button>} 
      />
      
      <div className="px-4 pb-20 grid grid-cols-1 gap-4">
        {subjects.length === 0 ? (
           <EmptyState icon={<BookOpen size={48} />} title="No Subjects Yet" message="Add your school subjects to get started with your schedule and grades." />
        ) : (
            subjects.map(subject => (
            <IOSCard key={subject.id} className="flex justify-between items-center relative overflow-hidden">
                 <div className={`absolute left-0 top-0 bottom-0 w-2 bg-${subject.color}-500`}></div>
                 <div className="pl-4">
                     <h3 className="font-bold text-lg text-gray-900">{subject.name}</h3>
                     <p className="text-sm text-gray-500">{subject.teacher} {subject.room ? `• ${subject.room}` : ''}</p>
                 </div>
                 <button 
                    onClick={() => {
                        if(confirm('Delete this subject and all related data?')) deleteSubject(subject.id);
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                 >
                    <Trash2 size={18} />
                 </button>
            </IOSCard>
            ))
        )}
      </div>

      <IOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Subject">
        <form onSubmit={handleSubmit} className="space-y-4">
          <IOSInput 
            label="Subject Name"
            placeholder="e.g. Mathematics" 
            value={newSubject.name} 
            onChange={e => setNewSubject({...newSubject, name: e.target.value})} 
            required 
          />
          <IOSInput 
            label="Teacher"
            placeholder="e.g. Mr. Smith" 
            value={newSubject.teacher} 
            onChange={e => setNewSubject({...newSubject, teacher: e.target.value})} 
          />
          <IOSInput 
            label="Room"
            placeholder="e.g. 101" 
            value={newSubject.room} 
            onChange={e => setNewSubject({...newSubject, room: e.target.value})} 
          />
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2 ml-1">Color</label>
            <div className="flex space-x-2">
                {colors.map(c => (
                    <button
                        key={c}
                        type="button"
                        onClick={() => setNewSubject({...newSubject, color: c})}
                        className={`w-8 h-8 rounded-full bg-${c}-500 transition-transform ${newSubject.color === c ? 'scale-110 ring-2 ring-offset-2 ring-gray-300' : 'opacity-70'}`}
                    />
                ))}
            </div>
          </div>

          <div className="pt-4">
            <IOSButton type="submit">Add Subject</IOSButton>
          </div>
        </form>
      </IOSModal>
    </div>
  );
};

export default SubjectsPage;