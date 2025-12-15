import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IOSHeader, IOSCard, IOSButton, IOSModal, IOSInput, IOSSelect, SubjectBadge, EmptyState } from '../components/UI';
import { Plus, TrendingUp } from 'lucide-react';
import { Grade } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GradesPage: React.FC = () => {
  const { grades, subjects, addGrade } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState<Omit<Grade, 'id'>>({
    subjectId: subjects[0]?.id || '',
    value: 8,
    max: 10,
    date: new Date().toISOString().split('T')[0],
    type: 'written',
    weight: 1.0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.subjectId) return;
    addGrade(newGrade);
    setIsModalOpen(false);
  };

  // Calculate Averages
  const subjectAverages = subjects.map(s => {
      const sGrades = grades.filter(g => g.subjectId === s.id);
      if (sGrades.length === 0) return { name: s.name, avg: 0, color: s.color, count: 0 };
      
      const totalWeighted = sGrades.reduce((acc, curr) => acc + ((curr.value / curr.max) * 10 * curr.weight), 0);
      const totalWeights = sGrades.reduce((acc, curr) => acc + curr.weight, 0);
      return { 
          name: s.name, 
          avg: parseFloat((totalWeighted / totalWeights).toFixed(1)), 
          color: s.color,
          count: sGrades.length
      };
  }).filter(d => d.count > 0);

  const overallAvg = subjectAverages.length > 0 
    ? (subjectAverages.reduce((acc, curr) => acc + curr.avg, 0) / subjectAverages.length).toFixed(2)
    : "0.0";

  const getColorHex = (colorName: string) => {
      const map: any = { blue: '#007AFF', red: '#FF3B30', green: '#34C759', orange: '#FF9500', purple: '#AF52DE', gray: '#8E8E93', yellow: '#FFCC00' };
      return map[colorName] || '#8E8E93';
  };

  return (
    <div>
      <IOSHeader 
        title="Grades" 
        action={<button onClick={() => setIsModalOpen(true)} className="p-2 bg-ios-blue text-white rounded-full hover:bg-blue-600"><Plus size={20} /></button>} 
      />

      <div className="px-4 space-y-6 pb-20">
        
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-ios-blue to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-blue-100 text-sm font-semibold uppercase mb-1">Overall GPA</h3>
            <div className="flex items-end space-x-2">
                <span className="text-5xl font-bold">{overallAvg}</span>
                <span className="text-blue-200 text-lg mb-1">/ 10</span>
            </div>
            <p className="text-sm text-blue-100 mt-2 opacity-80">Keep up the good work!</p>
        </div>

        {/* Chart */}
        {subjectAverages.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-64">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Performance</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={subjectAverages}>
                        <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                        <YAxis domain={[0, 10]} hide />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                            cursor={{fill: 'transparent'}}
                        />
                        <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                            {subjectAverages.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColorHex(entry.color)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )}

        {/* Recent Grades List */}
        <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 pl-1">Recent History</h3>
             {grades.length === 0 ? (
                 <EmptyState icon={<TrendingUp size={48} />} title="No Grades" message="Add your first grade to track your progress." />
             ) : (
                <div className="space-y-3">
                    {[...grades].reverse().map(grade => {
                        const subject = subjects.find(s => s.id === grade.subjectId);
                        return (
                            <IOSCard key={grade.id} className="flex justify-between items-center py-3">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                         {subject && <SubjectBadge color={subject.color} name={subject.name} small />}
                                         <span className="text-xs text-gray-400 capitalize">{grade.type}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{grade.date}</span>
                                </div>
                                <div className={`text-xl font-bold ${grade.value >= 6 ? 'text-ios-green' : 'text-ios-red'}`}>
                                    {grade.value}<span className="text-xs text-gray-400 font-normal">/{grade.max}</span>
                                </div>
                            </IOSCard>
                        )
                    })}
                </div>
             )}
        </div>
      </div>

       <IOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Grade">
        <form onSubmit={handleSubmit} className="space-y-4">
          <IOSSelect 
            label="Subject"
            value={newGrade.subjectId} 
            onChange={e => setNewGrade({...newGrade, subjectId: e.target.value})}
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </IOSSelect>

          <div className="grid grid-cols-2 gap-4">
             <IOSInput 
                type="number"
                label="Value"
                step="0.1"
                value={newGrade.value} 
                onChange={e => setNewGrade({...newGrade, value: parseFloat(e.target.value)})} 
                required 
            />
             <IOSInput 
                type="number"
                label="Max Score"
                value={newGrade.max} 
                onChange={e => setNewGrade({...newGrade, max: parseFloat(e.target.value)})} 
                required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <IOSSelect 
                label="Type"
                value={newGrade.type}
                onChange={e => setNewGrade({...newGrade, type: e.target.value as any})}
            >
                <option value="written">Written</option>
                <option value="oral">Oral</option>
                <option value="practical">Practical</option>
            </IOSSelect>
            <IOSInput 
                type="number"
                label="Weight"
                step="0.1"
                value={newGrade.weight} 
                onChange={e => setNewGrade({...newGrade, weight: parseFloat(e.target.value)})} 
            />
          </div>

          <IOSInput 
            type="date"
            label="Date"
            value={newGrade.date} 
            onChange={e => setNewGrade({...newGrade, date: e.target.value})} 
          />

          <div className="pt-4">
            <IOSButton type="submit">Add Grade</IOSButton>
          </div>
        </form>
      </IOSModal>
    </div>
  );
};

export default GradesPage;