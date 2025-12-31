import React, { useState, useRef, useEffect } from 'react';
import { AppMode } from './types';
import { PRESETS } from './constants';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import FlyerCanvas, { FlyerCanvasRef } from './components/FlyerCanvas';
import { Layers, User, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('ADMIN');
  const [currentHtml, setCurrentHtml] = useState<string>(PRESETS['promo']);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [themeColor, setThemeColor] = useState<string>('#4f46e5');
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<FlyerCanvasRef>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Auto-fit preview
  useEffect(() => {
    const handleResize = () => {
      if (!previewContainerRef.current) return;
      const containerWidth = previewContainerRef.current.clientWidth;
      const containerHeight = previewContainerRef.current.clientHeight;
      
      // Assume average flyer width is around 400px to 800px based on templates
      // We need to parse the width from the HTML or assume a standard base width for scaling calculation.
      // For simplicity, we assume the base rendered width is roughly 450px (including padding).
      // A more robust way is measuring the actual rendered div, but we can start with a safe estimate.
      const targetWidth = 500; 
      const padding = 60;
      
      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;
      
      const scaleX = availableWidth / targetWidth;
      // Limit max scale to 1 (don't upscale pixelatedly)
      const newScale = Math.min(Math.max(scaleX, 0.4), 1.2); 
      
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    // Call initially after a short delay to ensure render
    setTimeout(handleResize, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [currentHtml]); // Re-calc when HTML changes as size might change

  const handleUpdateVariable = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20 flex-shrink-0">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
             </div>
             <div>
                <h1 className="text-sm font-extrabold text-slate-900 leading-tight">Flyer Pro</h1>
                <p className="text-[10px] font-medium text-slate-400 tracking-wide">V2.4 GENERATOR</p>
             </div>
           </div>
           <div className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider ${mode === 'ADMIN' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              {mode}
           </div>
        </div>

        {/* Mode Switcher */}
        <div className="p-4">
            <div className="bg-slate-100 p-1 rounded-lg flex relative">
                <div 
                    className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-all duration-300 ease-in-out"
                    style={{ 
                        left: '4px', 
                        width: 'calc(50% - 4px)',
                        transform: mode === 'USER' ? 'translateX(100%)' : 'translateX(0)' 
                    }}
                />
                <button 
                    onClick={() => setMode('ADMIN')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold relative z-10 transition-colors ${mode === 'ADMIN' ? 'text-slate-900' : 'text-slate-500'}`}
                >
                    <Layers className="w-3.5 h-3.5" /> Template
                </button>
                <button 
                    onClick={() => setMode('USER')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold relative z-10 transition-colors ${mode === 'USER' ? 'text-slate-900' : 'text-slate-500'}`}
                >
                    <User className="w-3.5 h-3.5" /> Customize
                </button>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
            {mode === 'ADMIN' ? (
                <AdminPanel 
                    currentHtml={currentHtml} 
                    onUpdateHtml={setCurrentHtml}
                    onSave={() => setMode('USER')}
                />
            ) : (
                <UserPanel 
                    html={currentHtml}
                    variables={variables}
                    themeColor={themeColor}
                    onUpdateVariable={handleUpdateVariable}
                    onUpdateTheme={setThemeColor}
                    onExportImage={() => canvasRef.current?.exportImage('my-flyer')}
                    onExportHtml={() => canvasRef.current?.exportHtml('my-flyer')}
                />
            )}
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 relative bg-slate-100/50 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Canvas Preview</span>
            <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">Scale: {Math.round(scale * 100)}%</span>
            </div>
        </div>

        {/* Canvas Container */}
        <div 
            ref={previewContainerRef}
            className="flex-1 flex items-center justify-center overflow-auto p-10 relative"
            style={{ 
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
            }}
        >
            <FlyerCanvas 
                ref={canvasRef}
                html={currentHtml}
                themeColor={themeColor}
                variables={variables}
                scale={scale}
            />
        </div>
      </main>

    </div>
  );
};

export default App;