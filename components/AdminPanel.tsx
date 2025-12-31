import React, { useState } from 'react';
import { PRESETS } from '../constants';
import { Type, Image as ImageIcon, QrCode, Code, Save, Store, Mic2, Award } from 'lucide-react';

interface AdminPanelProps {
  currentHtml: string;
  onUpdateHtml: (html: string) => void;
  onSave: () => void;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
  },
  section: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #f1f5f9',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '12px',
    display: 'block',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  presetBtn: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#64748b',
  },
  presetIcon: {
    width: '20px',
    height: '20px',
  },
  presetText: {
    fontSize: '10px',
    fontWeight: '600',
  },
  row: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  inputWrapper: {
    position: 'relative' as const,
    flex: 1,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  actionBtn: {
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  dashedBtn: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '6px',
    border: '1px dashed #cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  editorSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: 0,
  },
  editorLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  textarea: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0f172a',
    color: '#cbd5e1',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    lineHeight: '1.6',
    padding: '16px',
    borderRadius: '8px',
    resize: 'none' as const,
    outline: 'none',
    border: '1px solid #1e293b',
  },
  saveBtnContainer: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  saveBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#059669',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
    transition: 'background-color 0.2s',
  }
};

const AdminPanel: React.FC<AdminPanelProps> = ({ currentHtml, onUpdateHtml, onSave }) => {
  const [varInput, setVarInput] = useState('');
  const [imgInput, setImgInput] = useState('');

  const loadPreset = (key: string) => {
    if (PRESETS[key]) {
      onUpdateHtml(PRESETS[key]);
    }
  };

  const insertAtCursor = (text: string) => {
    const textarea = document.getElementById('code-editor') as HTMLTextAreaElement;
    if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const newValue = value.substring(0, start) + text + value.substring(end);
        onUpdateHtml(newValue);
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

  return (
    <div style={styles.container}>
      
      {/* 1. Templates */}
      <div style={styles.section}>
        <span style={styles.label}>1. Select Template</span>
        <div style={styles.grid}>
          {['promo', 'event', 'cert'].map(type => (
              <button 
                key={type} 
                onClick={() => loadPreset(type)} 
                style={styles.presetBtn}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.backgroundColor = '#eef2ff';
                    e.currentTarget.style.color = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.color = '#64748b';
                }}
              >
                {type === 'promo' && <Store style={styles.presetIcon} />}
                {type === 'event' && <Mic2 style={styles.presetIcon} />}
                {type === 'cert' && <Award style={styles.presetIcon} />}
                <span style={styles.presetText}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </button>
          ))}
        </div>
      </div>

      {/* 2. Tools */}
      <div style={styles.section}>
        <span style={styles.label}>2. Dynamic Tools</span>
        
        {/* Variable */}
        <div style={styles.row}>
          <div style={styles.inputWrapper}>
             <input 
                type="text" 
                value={varInput}
                onChange={(e) => setVarInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addVariable()}
                placeholder="Label (e.g. PRICE)" 
                style={styles.input}
             />
          </div>
          <button onClick={addVariable} style={styles.actionBtn}>
            <Type size={12} /> Add
          </button>
        </div>

        {/* Image */}
        <div style={styles.row}>
           <input 
              type="text" 
              value={imgInput}
              onChange={(e) => setImgInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
              placeholder="Image URL (https://...)" 
              style={{...styles.input, flex: 1}}
           />
          <button onClick={addImage} style={styles.actionBtn}>
            <ImageIcon size={12} /> Img
          </button>
        </div>

        {/* QR Placeholder */}
        <button onClick={() => insertAtCursor(`{{QR_CODE}}`)} style={styles.dashedBtn}>
          <QrCode size={12} /> Insert QR Placeholder
        </button>
      </div>

      {/* 3. Editor */}
      <div style={styles.editorSection}>
        <span style={styles.editorLabel}>
            <Code size={12} /> Source Code
        </span>
        <textarea
            id="code-editor"
            value={currentHtml}
            onChange={(e) => onUpdateHtml(e.target.value)}
            style={styles.textarea}
            placeholder="<html>..."
        ></textarea>
      </div>

      <div style={styles.saveBtnContainer}>
        <button 
            onClick={onSave} 
            style={styles.saveBtn}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#047857'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#059669'}
        >
            <Save size={16} /> Save Template
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;