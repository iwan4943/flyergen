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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
  },
  headerBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #e0f2fe',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
  },
  headerTitle: {
    color: '#0369a1',
    fontWeight: '700',
    fontSize: '14px',
    marginBottom: '4px',
    margin: 0,
  },
  headerDesc: {
    color: '#0284c7',
    opacity: 0.7,
    fontSize: '12px',
    margin: 0,
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto' as const,
    paddingRight: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'capitalize' as const,
  },
  colorInputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  colorPicker: {
    height: '40px',
    width: '56px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
    backgroundColor: 'transparent',
  },
  textInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '12px',
    outline: 'none',
    width: '100%',
  },
  qrBox: {
    backgroundColor: 'rgba(253, 242, 248, 0.5)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #fce7f3',
  },
  qrLabel: {
    color: '#be185d',
  },
  qrInput: {
    borderColor: '#fbcfe8',
    backgroundColor: 'white',
  },
  actions: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #f1f5f9',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  btnSecondary: {
    padding: '12px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    color: '#475569',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnPrimary: {
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  }
};

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
  }, [qrText, themeColor, hasQr]);

  return (
    <div style={styles.container}>
        
      <div style={styles.headerBox}>
        <h4 style={styles.headerTitle}>🎨 Customize Design</h4>
        <p style={styles.headerDesc}>Fill in the details below. The preview updates automatically.</p>
      </div>

      <div style={styles.scrollArea} className="custom-scrollbar">
        {/* Theme Color */}
        <div style={styles.fieldGroup}>
            <label style={styles.label}>
                <Palette size={12} /> Theme Color
            </label>
            <div style={styles.colorInputWrapper}>
                <input 
                    type="color" 
                    value={themeColor}
                    onChange={(e) => onUpdateTheme(e.target.value)}
                    style={styles.colorPicker}
                />
                <input 
                    type="text" 
                    value={themeColor}
                    onChange={(e) => onUpdateTheme(e.target.value)}
                    style={{...styles.textInput, fontFamily: 'monospace', textTransform: 'uppercase'}}
                />
            </div>
        </div>

        {/* QR Code Special Field */}
        {hasQr && (
            <div style={styles.qrBox}>
                <label style={{...styles.label, ...styles.qrLabel}}>
                    <QrCode size={12} /> QR Code Destination
                </label>
                <input 
                    type="text" 
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="https://example.com"
                    style={{...styles.textInput, ...styles.qrInput}}
                />
            </div>
        )}

        {/* Dynamic Fields */}
        {fields.map(field => (
            <div key={field} style={styles.fieldGroup}>
                <label style={styles.label}>
                    {field.replace(/_/g, ' ')}
                </label>
                <input 
                    type="text" 
                    value={variables[field] || ''}
                    onChange={(e) => onUpdateVariable(field, e.target.value)}
                    placeholder={`Enter ${field.toLowerCase().replace(/_/g, ' ')}...`}
                    style={styles.textInput}
                />
            </div>
        ))}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
         <button 
            onClick={onExportHtml}
            style={styles.btnSecondary}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
         >
            <FileCode size={16} /> HTML
         </button>
         <button 
            onClick={onExportImage}
            style={styles.btnPrimary}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4338ca'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
         >
            <Download size={16} /> Download PNG
         </button>
      </div>

    </div>
  );
};

export default UserPanel;