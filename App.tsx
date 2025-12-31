import React, { useState, useRef, useEffect } from 'react';
import { AppMode } from './types';
import { PRESETS } from './constants';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import FlyerCanvas, { FlyerCanvasRef } from './components/FlyerCanvas';
import { Layers, User, Zap } from 'lucide-react';

const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    color: '#1e293b',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  sidebar: {
    width: '380px',
    backgroundColor: 'white',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '4px 0 24px rgba(0,0,0,0.03)',
    zIndex: 20,
    flexShrink: 0,
  },
  header: {
    height: '64px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#4f46e5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  logoTextContainer: {
    lineHeight: 1.2,
  },
  logoTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  logoSubtitle: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    margin: 0,
  },
  badge: (active: boolean) => ({
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    backgroundColor: active ? '#ecfdf5' : '#eff6ff',
    color: active ? '#047857' : '#1d4ed8',
  }),
  switcherContainer: {
    padding: '16px',
  },
  switcherBg: {
    backgroundColor: '#f1f5f9',
    padding: '4px',
    borderRadius: '8px',
    display: 'flex',
    position: 'relative' as const,
  },
  switcherHighlight: (isUser: boolean) => ({
    position: 'absolute' as const,
    top: '4px',
    bottom: '4px',
    left: '4px',
    width: 'calc(50% - 4px)',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease',
    transform: isUser ? 'translateX(100%)' : 'translateX(0)',
  }),
  switcherBtn: (isActive: boolean) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px',
    fontSize: '12px',
    fontWeight: '700',
    position: 'relative' as const,
    zIndex: 10,
    transition: 'color 0.3s',
    color: isActive ? '#0f172a' : '#64748b',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
  }),
  contentArea: {
    flex: 1,
    overflow: 'hidden',
    padding: '0 24px 24px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  mainPreview: {
    flex: 1,
    position: 'relative' as const,
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  topBar: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(8px)',
  },
  topBarLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  canvasContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    padding: '40px',
    position: 'relative' as const,
    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  }
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('ADMIN');
  const [currentHtml, setCurrentHtml] = useState<string>(PRESETS['promo']);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [themeColor, setThemeColor] = useState<string>('#4f46e5');
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<FlyerCanvasRef>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!previewContainerRef.current) return;
      const containerWidth = previewContainerRef.current.clientWidth;
      const containerHeight = previewContainerRef.current.clientHeight;
      
      const targetWidth = 500; 
      const padding = 80;
      
      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;
      
      const scaleX = availableWidth / targetWidth;
      const newScale = Math.min(Math.max(scaleX, 0.4), 1.2); 
      
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [currentHtml]);

  const handleUpdateVariable = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={styles.appContainer}>
      
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        
        {/* Header */}
        <div style={styles.header}>
           <div style={styles.logoBox}>
             <div style={styles.logoIcon}>
                <Zap size={20} fill="currentColor" />
             </div>
             <div style={styles.logoTextContainer}>
                <h1 style={styles.logoTitle}>Flyer Pro</h1>
                <p style={styles.logoSubtitle}>V2.4 GENERATOR</p>
             </div>
           </div>
           <div style={styles.badge(mode === 'ADMIN')}>
              {mode}
           </div>
        </div>

        {/* Mode Switcher */}
        <div style={styles.switcherContainer}>
            <div style={styles.switcherBg}>
                <div style={styles.switcherHighlight(mode === 'USER')} />
                <button 
                    onClick={() => setMode('ADMIN')}
                    style={styles.switcherBtn(mode === 'ADMIN')}
                    onMouseEnter={(e) => mode !== 'ADMIN' && (e.currentTarget.style.color = '#334155')}
                    onMouseLeave={(e) => mode !== 'ADMIN' && (e.currentTarget.style.color = '#64748b')}
                >
                    <Layers size={14} /> Template
                </button>
                <button 
                    onClick={() => setMode('USER')}
                    style={styles.switcherBtn(mode === 'USER')}
                    onMouseEnter={(e) => mode !== 'USER' && (e.currentTarget.style.color = '#334155')}
                    onMouseLeave={(e) => mode !== 'USER' && (e.currentTarget.style.color = '#64748b')}
                >
                    <User size={14} /> Customize
                </button>
            </div>
        </div>

        {/* Scrollable Content */}
        <div style={styles.contentArea}>
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
      <main style={styles.mainPreview}>
        
        {/* Top Bar */}
        <div style={styles.topBar}>
            <span style={styles.topBarLabel}>Canvas Preview</span>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <span style={{fontSize: '12px', color: '#94a3b8'}}>Scale: {Math.round(scale * 100)}%</span>
            </div>
        </div>

        {/* Canvas Container */}
        <div 
            ref={previewContainerRef}
            style={styles.canvasContainer}
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