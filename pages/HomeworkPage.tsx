import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IOSHeader, IOSCard, IOSButton, IOSModal, IOSInput, IOSSelect, SubjectBadge, EmptyState } from '../components/UI';
import { Plus, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Homework } from '../types';
import { format, isPast, isToday, parseISO } from 'date-fns';

const HomeworkPage: React.FC = () => {
  const { homework, subjects, addHomework, toggleHomework, deleteHomework } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'todo' | 'done'>('todo');
  
  const [newTask, setNewTask] = useState<Omit<Homework, 'id' | 'isDone'>>({
    subjectId: subjects[0]?.id || '',
    title: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    type: 'homework'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.subjectId) return;
    addHomework(newTask);
    setNewTask({ ...newTask, title: '' });
    setIsModalOpen(false);
  };

  const filteredHomework = homework
    .filter(h => filter === 'todo' ? !h.isDone : h.isDone)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div>
      <IOSHeader 
        title="Tasks" 
        action={<button onClick={() => setIsModalOpen(true)} className="p-2 bg-ios-blue text-white rounded-full hover:bg-blue-600"><Plus size={20} /></button>} 
      />

      {/* Filter Toggle */}
      <div className="px-4 mb-4">
        <div className="bg-gray-200 p-1 rounded-lg flex text-sm font-medium">
            <button 
                onClick={() => setFilter('todo')}
                className={`flex-1 py-1.5 rounded-md transition-all ${filter === 'todo' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
                To Do
            </button>
            <button 
                onClick={() => setFilter('done')}
                className={`flex-1 py-1.5 rounded-md transition-all ${filter === 'done' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
                Done
            </button>
        </div>
      </div>

      <div className="px-4 space-y-3 pb-20">
        {filteredHomework.length === 0 ? (
            <EmptyState icon={<CheckSquare size={48} />} title="All Caught Up!" message={filter === 'todo' ? "No pending tasks. Great job!" : "No completed tasks yet."} />
        ) : (
            filteredHomework.map(item => {
                const subject = subjects.find(s => s.id === item.subjectId);
                const isOverdue = !item.isDone && isPast(parseISO(item.dueDate)) && !isToday(parseISO(item.dueDate));
                
                return (
                    <IOSCard key={item.id} className="flex items-start space-x-3" onClick={() => toggleHomework(item.id)}>
                        <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${item.isDone ? 'bg-ios-green border-ios-green' : isOverdue ? 'border-ios-red' : 'border-gray-300'}`}>
                             {item.isDone && <span className="text-white text-xs">✓</span>}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-start">
                                <h4 className={`text-base font-semibold truncate pr-2 ${item.isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.title}</h4>
                                {item.priority === 'high' && !item.isDone && <AlertCircle size={16} className="text-ios-red" />}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                                {subject && <SubjectBadge color={subject.color} name={subject.name} small />}
                                <span className={`text-xs flex items-center ${isOverdue ? 'text-ios-red font-bold' : 'text-gray-500'}`}>
                                    <Clock size={10} className="mr-1" />
                                    {isToday(parseISO(item.dueDate)) ? 'Today' : format(parseISO(item.dueDate), 'MMM d')}
                                </span>
                            </div>
                        </div>
                    </IOSCard>
                );
            })
        )}
      </div>

      <IOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task">
        <form onSubmit={handleSubmit} className="space-y-4">
          <IOSInput 
            label="What do you need to do?"
            placeholder="e.g. Algebra Pg. 42" 
            value={newTask.title} 
            onChange={e => setNewTask({...newTask, title: e.target.value})} 
            required 
          />
          
          <IOSSelect 
            label="Subject"
            value={newTask.subjectId} 
            onChange={e => setNewTask({...newTask, subjectId: e.target.value})}
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </IOSSelect>

          <IOSInput 
            type="date"
            label="Due Date"
            value={newTask.dueDate} 
            onChange={e => setNewTask({...newTask, dueDate: e.target.value})} 
          />

          <div className="grid grid-cols-2 gap-4">
             <IOSSelect 
                label="Priority"
                value={newTask.priority}
                onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </IOSSelect>
            <IOSSelect 
                label="Type"
                value={newTask.type}
                onChange={e => setNewTask({...newTask, type: e.target.value as any})}
            >
                <option value="homework">Homework</option>
                <option value="study">Study</option>
            </IOSSelect>
          </div>

          <div className="pt-4">
            <IOSButton type="submit">Add Task</IOSButton>
          </div>
        </form>
      </IOSModal>
    </div>
  );
};

export default HomeworkPage;