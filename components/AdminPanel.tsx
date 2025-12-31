import React, { useState } from 'react';
import { PRESETS } from '../constants';
import { LayoutTemplate, Type, Image as ImageIcon, QrCode, Code, Save, Store, Mic2, Award } from 'lucide-react';

interface AdminPanelProps {
  currentHtml: string;
  onUpdateHtml: (html: string) => void;
  onSave: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentHtml, onUpdateHtml, onSave }) => {
  const [varInput, setVarInput] = useState('');
  const [imgInput, setImgInput] = useState('');

  const loadPreset = (key: string) => {
    if (PRESETS[key]) {
      onUpdateHtml(PRESETS[key]);
    }
  };

  const insertAtCursor = (text: string) => {
    // Simple append for now as textarea cursor insertion is complex in React 
    // without a ref to the textarea and selection manipulation.
    // For this level of complexity, appending to the end or replacing selection 
    // if using a proper code editor component is standard. 
    // We'll use a simple append to the HTML for this demo, or try to insert sensibly.
    
    // A better UX for a "Sophisticated" app is modifying the textarea value directly:
    const textarea = document.getElementById('code-editor') as HTMLTextAreaElement;
    if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const newValue = value.substring(0, start) + text + value.substring(end);
        onUpdateHtml(newValue);
        
        // Restore focus next tick
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
        }, 0);
    } else {
        onUpdateHtml(currentHtml + text);
    }
  };

  const addVariable = () => {
    if (!varInput) return;
    const cleanVar = varInput.trim().toUpperCase().replace(/\s+/g, '_');
    insertAtCursor(`{{${cleanVar}}}`);
    setVarInput('');
  };

  const addImage = () => {
    if (!imgInput) return;
    insertAtCursor(`<img src="${imgInput}" style="width:100%; max-width:200px; display:block; margin:10px auto; border-radius:8px;">`);
    setImgInput('');
  };

  const addQRPlaceholder = () => {
    insertAtCursor(`{{QR_CODE}}`);
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* 1. Templates */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">1. Select Template</span>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => loadPreset('promo')} className="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
            <Store className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
            <span className="text-[10px] font-semibold">Promo</span>
          </button>
          <button onClick={() => loadPreset('event')} className="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
            <Mic2 className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
            <span className="text-[10px] font-semibold">Event</span>
          </button>
          <button onClick={() => loadPreset('cert')} className="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
            <Award className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
            <span className="text-[10px] font-semibold">Cert</span>
          </button>
        </div>
      </div>

      {/* 2. Tools */}
      <div className="mb-6 pb-6 border-b border-slate-100 space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">2. Dynamic Tools</span>
        
        {/* Variable */}
        <div className="flex gap-2">
          <div className="relative flex-1">
             <input 
                type="text" 
                value={varInput}
                onChange={(e) => setVarInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addVariable()}
                placeholder="Label (e.g. PRICE)" 
                className="w-full pl-3 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
             />
          </div>
          <button onClick={addVariable} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md flex items-center gap-1 text-xs font-medium transition-colors">
            <Type className="w-3 h-3" /> Add
          </button>
        </div>

        {/* Image */}
        <div className="flex gap-2">
           <input 
              type="text" 
              value={imgInput}
              onChange={(e) => setImgInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
              placeholder="Image URL (https://...)" 
              className="flex-1 pl-3 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
           />
          <button onClick={addImage} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md flex items-center gap-1 text-xs font-medium transition-colors">
            <ImageIcon className="w-3 h-3" /> Img
          </button>
        </div>

        {/* QR Placeholder */}
        <button onClick={addQRPlaceholder} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md flex items-center justify-center gap-2 text-xs font-medium transition-colors border border-dashed border-slate-300">
          <QrCode className="w-3 h-3" /> Insert QR Placeholder
        </button>
      </div>

      {/* 3. Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Code className="w-3 h-3" /> Source Code
        </span>
        <textarea
            id="code-editor"
            value={currentHtml}
            onChange={(e) => onUpdateHtml(e.target.value)}
            className="flex-1 w-full bg-slate-900 text-slate-300 font-mono text-[11px] leading-relaxed p-4 rounded-lg resize-none outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-800"
            placeholder="<html>..."
        ></textarea>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <button onClick={onSave} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-emerald-200 transition-all">
            <Save className="w-4 h-4" /> Save Template
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;