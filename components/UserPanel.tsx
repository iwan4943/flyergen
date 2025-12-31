import React, { useEffect, useState } from 'react';
import { Palette, QrCode, Download, FileCode } from 'lucide-react';
import QRCode from 'qrcode';

interface UserPanelProps {
  html: string;
  variables: Record<string, string>;
  themeColor: string;
  onUpdateVariable: (key: string, value: string) => void;
  onUpdateTheme: (color: string) => void;
  onExportImage: () => void;
  onExportHtml: () => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ 
  html, 
  variables, 
  themeColor,
  onUpdateVariable, 
  onUpdateTheme,
  onExportImage,
  onExportHtml
}) => {
  const [fields, setFields] = useState<string[]>([]);
  const [qrText, setQrText] = useState('');
  const [hasQr, setHasQr] = useState(false);

  // Extract fields from HTML
  useEffect(() => {
    const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    const foundFields = new Set<string>();
    let match;
    let qrFound = false;

    while ((match = regex.exec(html)) !== null) {
      const fieldName = match[1].trim();
      if (fieldName === 'QR_CODE') {
        qrFound = true;
      } else {
        foundFields.add(fieldName);
      }
    }
    setFields(Array.from(foundFields));
    setHasQr(qrFound);
  }, [html]);

  // Handle QR Generation
  useEffect(() => {
    if (!qrText) {
        if (hasQr) onUpdateVariable('QR_CODE', ''); 
        return;
    }

    const generate = async () => {
        try {
            const dataUrl = await QRCode.toDataURL(qrText, { 
                width: 200, 
                margin: 0,
                color: {
                    dark: themeColor,
                    light: '#ffffff'
                }
            });
            onUpdateVariable('QR_CODE', `<img src="${dataUrl}" style="display:block; width:100%; max-width:120px; height:auto; margin: 0 auto;">`);
        } catch (e) {
            console.error(e);
        }
    };
    generate();
  }, [qrText, themeColor, hasQr]); // Regenerate when text or theme changes

  return (
    <div className="flex flex-col h-full">
        
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-6">
        <h4 className="text-sky-700 font-bold text-sm mb-1">🎨 Customize Design</h4>
        <p className="text-sky-600/70 text-xs">Fill in the details below. The preview updates automatically.</p>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Theme Color */}
        <div>
            <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Palette className="w-3 h-3" /> Theme Color
            </label>
            <div className="flex gap-3 items-center">
                <input 
                    type="color" 
                    value={themeColor}
                    onChange={(e) => onUpdateTheme(e.target.value)}
                    className="h-10 w-14 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <input 
                    type="text" 
                    value={themeColor}
                    onChange={(e) => onUpdateTheme(e.target.value)}
                    className="flex-1 py-2 px-3 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
        </div>

        {/* QR Code Special Field */}
        {hasQr && (
            <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                <label className="text-xs font-bold text-pink-700 mb-2 flex items-center gap-2">
                    <QrCode className="w-3 h-3" /> QR Code Destination
                </label>
                <input 
                    type="text" 
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full py-2.5 px-3 border border-pink-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white transition-all"
                />
            </div>
        )}

        {/* Dynamic Fields */}
        {fields.map(field => (
            <div key={field}>
                <label className="text-xs font-bold text-slate-700 mb-2 block capitalize">
                    {field.replace(/_/g, ' ')}
                </label>
                <input 
                    type="text" 
                    value={variables[field] || ''}
                    onChange={(e) => onUpdateVariable(field, e.target.value)}
                    placeholder={`Enter ${field.toLowerCase().replace(/_/g, ' ')}...`}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
         <button 
            onClick={onExportHtml}
            className="col-span-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all"
         >
            <FileCode className="w-4 h-4" /> HTML
         </button>
         <button 
            onClick={onExportImage}
            className="col-span-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-indigo-200 transition-all"
         >
            <Download className="w-4 h-4" /> Download PNG
         </button>
      </div>

    </div>
  );
};

export default UserPanel;