import React from 'react';
import { useApp } from '../context/AppContext';
import { IOSHeader, IOSCard } from '../components/UI';
import { Trash2, Smartphone, Shield, Moon, Bell } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { resetData } = useApp();

  const handleReset = () => {
    if (confirm("Are you sure? This will delete ALL data. This action cannot be undone.")) {
      resetData();
      alert("All data has been reset.");
    }
  };

  return (
    <div>
      <IOSHeader title="Settings" />
      
      <div className="px-4 space-y-6">
        
        {/* Preferences Section (Visual Only for Demo) */}
        <section>
            <h3 className="text-xs font-medium text-gray-500 uppercase mb-2 ml-2">Preferences</h3>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 p-1.5 rounded-md text-white"><Moon size={16}/></div>
                        <span className="text-base text-gray-900">Dark Mode</span>
                    </div>
                    <div className="w-12 h-7 bg-gray-200 rounded-full relative p-1 transition-colors cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform"></div>
                    </div>
                </div>
                 <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-red-500 p-1.5 rounded-md text-white"><Bell size={16}/></div>
                        <span className="text-base text-gray-900">Notifications</span>
                    </div>
                    <div className="w-12 h-7 bg-green-500 rounded-full relative p-1 transition-colors cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-5 transition-transform"></div>
                    </div>
                </div>
            </div>
        </section>

         {/* Privacy Section */}
        <section>
            <h3 className="text-xs font-medium text-gray-500 uppercase mb-2 ml-2">Privacy & Data</h3>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="flex items-center p-4 border-b border-gray-100">
                     <div className="bg-gray-500 p-1.5 rounded-md text-white mr-3"><Shield size={16}/></div>
                    <div className="flex-1">
                        <span className="text-base text-gray-900 block">Data Storage</span>
                        <span className="text-xs text-gray-500 block">All data is stored locally on this device.</span>
                    </div>
                </div>
                <button 
                    onClick={handleReset}
                    className="w-full flex items-center p-4 active:bg-gray-50 transition-colors text-left"
                >
                     <div className="bg-red-500 p-1.5 rounded-md text-white mr-3"><Trash2 size={16}/></div>
                    <span className="text-base text-red-600">Reset All Data</span>
                </button>
            </div>
        </section>

        {/* About */}
        <section className="text-center pt-8">
            <div className="inline-flex items-center justify-center p-4 bg-gray-200 rounded-2xl mb-4">
                <Smartphone size={32} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Schola</h2>
            <p className="text-sm text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-400 mt-2">Designed for Students. Built with React.</p>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;