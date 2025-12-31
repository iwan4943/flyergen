import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import html2canvas from 'html2canvas';

interface FlyerCanvasProps {
  html: string;
  themeColor: string;
  variables: Record<string, string>;
  scale?: number;
}

export interface FlyerCanvasRef {
  exportImage: (fileName: string) => Promise<void>;
  exportHtml: (fileName: string) => void;
}

const FlyerCanvas = forwardRef<FlyerCanvasRef, FlyerCanvasProps>(({ html, themeColor, variables, scale = 1 }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to process the HTML string with current variable values
  const getProcessedHtml = () => {
    let processed = html;
    
    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processed = processed.replace(regex, value);
    });

    // Handle variables that haven't been filled yet (show placeholder or empty)
    // We intentionally leave them as {{VAR}} if not found, or replace with empty string if desired.
    // Here we just let them be, or the user can see them to know what to fill.
    
    return processed;
  };

  useImperativeHandle(ref, () => ({
    exportImage: async (fileName: string) => {
      if (!containerRef.current) return;
      
      const element = containerRef.current.firstChild as HTMLElement;
      if (!element) return;

      try {
        // Temporarily remove transform to render accurately
        const originalTransform = element.style.transform;
        element.style.transform = 'none';

        const canvas = await html2canvas(element, {
          scale: 2, // Higher quality
          useCORS: true,
          backgroundColor: null,
          logging: false
        });

        // Restore transform
        element.style.transform = originalTransform;

        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Export failed", err);
        alert("Failed to export image. Ensure images use CORS headers.");
      }
    },
    exportHtml: (fileName: string) => {
        if (!containerRef.current) return;
        const content = containerRef.current.innerHTML;
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${fileName}</title>
            </head>
            <body style="display:flex;justify-content:center;background:#f1f5f9;padding:50px;">
                <style>:root{--theme-color: ${themeColor};}</style>
                <div style="background:white;box-shadow:0 10px 25px rgba(0,0,0,0.1);">${content}</div>
            </body>
            </html>
        `;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }
  }));

  useEffect(() => {
    if (containerRef.current) {
      // Set the CSS variable for theme color dynamically
      containerRef.current.style.setProperty('--theme-color', themeColor);
    }
  }, [themeColor]);

  return (
    <div 
      ref={containerRef}
      className="origin-top shadow-2xl transition-all duration-300 ease-out"
      style={{
        transform: `scale(${scale})`,
      }}
      dangerouslySetInnerHTML={{ __html: getProcessedHtml() }}
    />
  );
});

FlyerCanvas.displayName = 'FlyerCanvas';

export default FlyerCanvas;