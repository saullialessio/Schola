import React from 'react';
import { ChevronLeft } from 'lucide-react';

export const IOSHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="pt-12 pb-2 px-4 bg-ios-background sticky top-0 z-40 flex justify-between items-end">
    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
    {action && <div className="mb-1">{action}</div>}
  </div>
);

export const IOSCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${onClick ? 'active:opacity-70 transition-opacity' : ''} ${className}`}
  >
    {children}
  </div>
);

export const IOSButton: React.FC<{ onClick?: () => void; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger'; className?: string; type?: "button" | "submit" }> = ({ 
  onClick, children, variant = 'primary', className = '', type="button"
}) => {
  const baseStyle = "w-full rounded-xl py-3 font-semibold text-center transition-all active:scale-95";
  const variants = {
    primary: "bg-ios-blue text-white",
    secondary: "bg-gray-200 text-gray-900",
    danger: "bg-ios-red text-white",
  };
  
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const IOSModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md h-[90vh] sm:h-auto bg-ios-background sm:rounded-2xl rounded-t-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
            <button onClick={onClose} className="text-ios-blue text-base font-normal">Cancel</button>
            <h3 className="font-semibold text-base">{title}</h3>
            <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export const IOSInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-medium text-gray-500 uppercase mb-1 ml-1">{label}</label>}
    <input 
      className={`w-full bg-white rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ios-blue/20 ${className}`} 
      {...props} 
    />
  </div>
);

export const IOSSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, ...props }) => (
  <div className="mb-4">
     {label && <label className="block text-xs font-medium text-gray-500 uppercase mb-1 ml-1">{label}</label>}
    <div className="relative">
      <select 
        className="w-full bg-white rounded-lg px-4 py-3 text-base appearance-none focus:outline-none focus:ring-2 focus:ring-ios-blue/20" 
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
      </div>
    </div>
  </div>
);

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; message: string }> = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-6">
    <div className="text-gray-300 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm max-w-xs">{message}</p>
  </div>
);

export const SubjectBadge: React.FC<{ color: string; name: string; small?: boolean }> = ({ color, name, small }) => {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-700',
        red: 'bg-red-100 text-red-700',
        green: 'bg-green-100 text-green-700',
        orange: 'bg-orange-100 text-orange-700',
        purple: 'bg-purple-100 text-purple-700',
        gray: 'bg-gray-100 text-gray-700',
        yellow: 'bg-yellow-100 text-yellow-700',
    };
    const style = colorMap[color] || colorMap['gray'];

    return (
        <span className={`${style} ${small ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1'} rounded-md font-medium truncate max-w-[120px]`}>
            {name}
        </span>
    );
};