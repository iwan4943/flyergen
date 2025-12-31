import { PresetTemplate } from './types';

export const PRESETS: Record<string, string> = {
  promo: `<div style="width:400px; height:550px; background:white; position:relative; overflow:hidden; border:1px solid #eee; font-family: sans-serif;">
    <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80" crossorigin="anonymous" style="width:100%; height:240px; object-fit:cover;">
    <div style="position:absolute; top:20px; left:20px; background:var(--theme-color); color:white; padding:6px 16px; font-weight:800; font-size:12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">SPECIAL OFFER</div>
    <div style="text-align:center; margin-top:-30px; position: relative; z-index: 10;">
        <div style="background: white; width: 90%; margin: 0 auto; padding: 25px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h2 style="color:var(--theme-color); font-size:56px; margin:0; line-height: 1; font-weight: 800;">{{DISKON}}%</h2>
          <span style="display:block; font-size: 14px; color: #94a3b8; font-weight: 600; margin-bottom: 15px;">OFF EVERYTHING</span>
          <div style="width: 40px; height: 4px; background: #f1f5f9; margin: 0 auto 15px auto;"></div>
          <h3 style="color:#1e293b; margin:0 0 10px 0; font-size: 20px; font-weight: 700;">{{NAMA_PRODUK}}</h3>
          <p style="color:#64748b; font-size:13px; line-height: 1.6;">Promo terbatas untuk pelanggan setia. Jangan sampai kehabisan stok!</p>
        </div>
    </div>
    <div style="margin:25px auto; text-align: center;">{{QR_CODE}}</div>
</div>`,

  event: `<div style="width:400px; height:600px; background:#0f172a; color:white; font-family:sans-serif; padding:40px; display:flex; flex-direction:column; position: relative; overflow: hidden;">
    <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: var(--theme-color); opacity: 0.1; border-radius: 50%; filter: blur(40px);"></div>
    <div style="position: absolute; bottom: -50px; left: -50px; width: 200px; height: 200px; background: #3b82f6; opacity: 0.1; border-radius: 50%; filter: blur(40px);"></div>
    
    <div style="border-left: 4px solid var(--theme-color); padding-left:24px; position: relative; z-index: 10;">
        <span style="color:var(--theme-color); font-size:12px; letter-spacing:4px; font-weight:800; text-transform: uppercase;">Exclusive Webinar</span>
        <h1 style="font-size:42px; margin:20px 0; font-weight: 800; line-height: 1.1;">{{JUDUL_ACARA}}</h1>
    </div>
    
    <div style="margin:auto 0; position: relative; z-index: 10;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
           <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80" crossorigin="anonymous" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--theme-color); object-fit: cover;" />
           <div>
             <p style="color:#94a3b8; font-size:11px; font-weight: 600; margin: 0; text-transform: uppercase;">Keynote Speaker</p>
             <h3 style="font-size:18px; margin: 0; font-weight: 700;">{{PEMBICARA}}</h3>
           </div>
        </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:20px; border-radius:12px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
        <div>
           <p style="margin:0; font-size:11px; color:#94a3b8; font-weight: 600; text-transform: uppercase;">Save the Date</p>
           <p style="margin:5px 0 0 0; font-weight:bold; font-size: 16px;">{{TANGGAL}}</p>
        </div>
        <div style="background: white; padding: 5px; border-radius: 8px;">{{QR_CODE}}</div>
    </div>
</div>`,

  cert: `<div style="width:800px; height:560px; background:white; padding:40px; position: relative; font-family: serif;">
    <div style="position: absolute; inset: 20px; border: 2px double var(--theme-color); pointer-events: none;"></div>
    <div style="position: absolute; inset: 25px; border: 1px solid var(--theme-color); pointer-events: none; opacity: 0.5;"></div>

    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
      <div style="margin-bottom: 30px;">
        <h1 style="font-size:56px; color:var(--theme-color); margin:0; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Sertifikat</h1>
        <p style="font-size:14px; color:#64748b; letter-spacing:6px; margin-top:5px; text-transform: uppercase; font-family: sans-serif;">of Appreciation</p>
      </div>
      
      <div style="margin:20px 0; width: 70%;">
          <p style="font-size:16px; color:#475569; font-style: italic; font-family: sans-serif;">This certificate is proudly presented to</p>
          <h2 style="font-size:48px; margin:15px 0 25px 0; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-weight: bold;">{{NAMA_PESERTA}}</h2>
          <p style="font-size:16px; color:#475569; font-family: sans-serif; line-height: 1.6;">For outstanding performance and dedication in completing the workshop entitled:</p>
          <h3 style="font-size:24px; color:var(--theme-color); margin:10px 0 0 0; font-weight: bold;">{{NAMA_ACARA}}</h3>
      </div>
      
      <div style="display:flex; justify-content:space-between; align-items:flex-end; width: 80%; margin-top:40px;">
          <div style="text-align:center;">
             <div style="margin-bottom: 5px; opacity: 0.8;">{{QR_CODE}}</div>
             <p style="font-size:9px; color:#94a3b8; font-family: sans-serif; letter-spacing: 1px;">VERIFICATION ID</p>
          </div>
          <div style="text-align:center; width:200px;">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png" crossorigin="anonymous" style="height: 40px; margin-bottom: -10px; opacity: 0.7;" />
             <div style="border-bottom:1px solid #94a3b8; height:10px; margin-bottom: 8px;"></div>
             <p style="font-size:12px; color: #334155; font-weight: bold; font-family: sans-serif;">PROGRAM DIRECTOR</p>
          </div>
      </div>
    </div>
</div>`
};