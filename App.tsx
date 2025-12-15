import React, { useState } from 'react';
import { Book, Calendar, CheckSquare, GraduationCap, Settings, Clock } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import DiaryPage from './pages/DiaryPage';
import SubjectsPage from './pages/SubjectsPage';
import HomeworkPage from './pages/HomeworkPage';
import TimetablePage from './pages/TimetablePage';
import GradesPage from './pages/GradesPage';
import SettingsPage from './pages/SettingsPage';

enum Tab {
  Diary = 'diary',
  Subjects = 'subjects',
  Homework = 'homework',
  Timetable = 'timetable',
  Grades = 'grades',
  Settings = 'settings',
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Diary);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Diary: return <DiaryPage />;
      case Tab.Subjects: return <SubjectsPage />;
      case Tab.Homework: return <HomeworkPage />;
      case Tab.Timetable: return <TimetablePage />;
      case Tab.Grades: return <GradesPage />;
      case Tab.Settings: return <SettingsPage />;
      default: return <DiaryPage />;
    }
  };

  return (
    <AppProvider>
      <div className="flex flex-col h-screen w-full bg-ios-background text-gray-900 overflow-hidden font-sans">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {renderContent()}
        </main>

        {/* Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 pb-safe pt-2 px-2 z-50">
          <div className="flex justify-around items-center h-16 pb-4">
            <TabButton 
              active={activeTab === Tab.Diary} 
              onClick={() => setActiveTab(Tab.Diary)} 
              icon={<Calendar size={24} />} 
              label="Diary" 
            />
            <TabButton 
              active={activeTab === Tab.Subjects} 
              onClick={() => setActiveTab(Tab.Subjects)} 
              icon={<Book size={24} />} 
              label="Subjects" 
            />
            <TabButton 
              active={activeTab === Tab.Homework} 
              onClick={() => setActiveTab(Tab.Homework)} 
              icon={<CheckSquare size={24} />} 
              label="Tasks" 
            />
            <TabButton 
              active={activeTab === Tab.Timetable} 
              onClick={() => setActiveTab(Tab.Timetable)} 
              icon={<Clock size={24} />} 
              label="Schedule" 
            />
            <TabButton 
              active={activeTab === Tab.Grades} 
              onClick={() => setActiveTab(Tab.Grades)} 
              icon={<GraduationCap size={24} />} 
              label="Grades" 
            />
             <TabButton 
              active={activeTab === Tab.Settings} 
              onClick={() => setActiveTab(Tab.Settings)} 
              icon={<Settings size={24} />} 
              label="Settings" 
            />
          </div>
        </nav>
      </div>
    </AppProvider>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full space-y-1 transition-colors duration-200 ${active ? 'text-ios-blue' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;