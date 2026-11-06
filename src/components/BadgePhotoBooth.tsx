import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, RefreshCw, X, Download, Check, Sparkles, 
  FlipHorizontal, Upload, AlertCircle, ShieldCheck,
  Move, ZoomIn, ZoomOut, RotateCw, Focus
} from 'lucide-react';
import { Delegate } from '../types/agenda';
import { soundEngine } from '../utils/audio';

interface BadgePhotoBoothProps {
  isOpen: boolean;
  onClose: () => void;
  delegate: Delegate;
  onSavePhoto: (photoDataUrl: string) => void;
}

type FrameTheme = 'summit-neon' | 'summit-classic' | 'creator-gold';

export const BadgePhotoBooth: React.FC<BadgePhotoBoothProps> = ({
  isOpen,
  onClose,
  delegate,
  onSavePhoto
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  // RAW image captured from camera or uploaded by user (prior to framing)
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  // Framing & Transform State: Pan (x, y), Zoom (1 to 3), Rotation (0, 90, 180, 270)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Track drag start
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({ x: 0, y: 0, panX: 0, panY: 0 });

  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [selectedFrame, setSelectedFrame] = useState<FrameTheme>('summit-neon');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start camera
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('La cámara no está soportada en este entorno. Puedes subir una foto desde tu dispositivo.');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      setCameraError('No se pudo acceder a la cámara. Por favor permite los permisos o sube una imagen desde tus archivos.');
    }
  }, [facingMode, stopCamera]);

  // Manage camera on open / close or when raw photo is loaded
  useEffect(() => {
    if (isOpen && !rawImageSrc) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, rawImageSrc, startCamera, stopCamera]);

  // Reset or initialize state when opened
  useEffect(() => {
    if (isOpen) {
      setRawImageSrc(delegate.photoUrl || null);
      setPan({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setIsCountingDown(false);
    }
  }, [isOpen, delegate]);

  // Capture frame from live video to raw photo
  const captureRawFromVideo = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 800;
    canvas.height = v.videoHeight || 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setRawImageSrc(dataUrl);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    stopCamera();
  };

  // Trigger snapshot with 3-second countdown
  const takePhotoWithCountdown = () => {
    if (!videoRef.current || isCountingDown) return;

    setIsCountingDown(true);
    setCountdownNum(3);

    const timer = setInterval(() => {
      setCountdownNum((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundEngine.playStartedAlert();
          captureRawFromVideo();
          setIsCountingDown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Upload file to raw photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setPan({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Pointer / Mouse / Touch Drag Handlers for Panning & Framing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rawImageSrc) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !rawImageSrc) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!rawImageSrc || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      panX: pan.x,
      panY: pan.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !rawImageSrc || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom(prev => Math.min(3, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoom(prev => Math.max(0.7, +(prev - 0.15).toFixed(2)));
  const handleResetFraming = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Render high-res framed composite badge onto HTML5 Canvas
  const generateFinalFramedBadge = useCallback(async (): Promise<string> => {
    if (!rawImageSrc) return '';

    const loadImage = (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const i = new Image();
        i.crossOrigin = 'anonymous';
        i.onload = () => resolve(i);
        i.onerror = () => resolve(null);
        i.src = src;
      });
    };

    const [img, logoImg] = await Promise.all([
      loadImage(rawImageSrc),
      loadImage('/ov27-logo-color-v2.png')
    ]);
    if (!img) return '';

    const canvas = document.createElement('canvas');
    const size = 1000; // 1000x1000 high resolution
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

        // Get viewport size for scaling relative pan coordinates
        const vpWidth = viewportRef.current?.clientWidth || 360;
        const vpHeight = viewportRef.current?.clientHeight || 360;
        const panRatioX = pan.x / vpWidth;
        const panRatioY = pan.y / vpHeight;

        // 1. Draw transformed user photo
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.translate(panRatioX * size, panRatioY * size);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        // Aspect fill scaling for the raw image
        const imgW = img.naturalWidth || img.width;
        const imgH = img.naturalHeight || img.height;
        const baseScale = Math.max(size / imgW, size / imgH);
        const dw = imgW * baseScale;
        const dh = imgH * baseScale;

        ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();

        // 2. Artistic Frame Overlays matching Digital Creator Summit theme
        ctx.save();
        const borderWidth = 34;

        if (selectedFrame === 'summit-neon') {
          // Neon Magenta & Cyan Summit Gradient Border
          const gradient = ctx.createLinearGradient(0, 0, size, size);
          gradient.addColorStop(0, '#E01E7E');    // Vibrant Summit Magenta
          gradient.addColorStop(0.3, '#1C0235');  // Deep Violet
          gradient.addColorStop(0.7, '#007D80');  // Teal
          gradient.addColorStop(1, '#00D5D8');    // Cyan

          ctx.lineWidth = borderWidth;
          ctx.strokeStyle = gradient;
          ctx.strokeRect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);

          // Inner thin cyan accent border
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#00D5D8';
          ctx.strokeRect(borderWidth + 10, borderWidth + 10, size - (borderWidth + 10) * 2, size - (borderWidth + 10) * 2);

        } else if (selectedFrame === 'summit-classic') {
          // Classic Teal & Magenta
          const gradient = ctx.createLinearGradient(0, 0, 0, size);
          gradient.addColorStop(0, '#007D80');
          gradient.addColorStop(0.5, '#E01E7E');
          gradient.addColorStop(1, '#1C0235');

          ctx.lineWidth = borderWidth;
          ctx.strokeStyle = gradient;
          ctx.strokeRect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);

          ctx.lineWidth = 4;
          ctx.strokeStyle = '#FFFFFF';
          ctx.strokeRect(borderWidth + 10, borderWidth + 10, size - (borderWidth + 10) * 2, size - (borderWidth + 10) * 2);

        } else {
          // Creator Gold & Purple
          const gradient = ctx.createLinearGradient(0, 0, size, 0);
          gradient.addColorStop(0, '#FFB703');
          gradient.addColorStop(0.5, '#E01E7E');
          gradient.addColorStop(1, '#00D5D8');

          ctx.lineWidth = borderWidth;
          ctx.strokeStyle = gradient;
          ctx.strokeRect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);
        }

        // 3. Top Banner: Summit Header with OneVoice27 Logo
        ctx.fillStyle = 'rgba(28, 2, 53, 0.94)';
        ctx.beginPath();
        ctx.roundRect(50, 42, size - 100, 86, 20);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#E01E7E';
        ctx.stroke();

        if (logoImg && logoImg.width > 0) {
          // White container pill for crisp logo contrast
          const pillW = 160;
          const pillH = 50;
          const pillX = 75;
          const pillY = 60;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, 12);
          ctx.fill();

          // Draw official OneVoice27 logo inside pill
          const lAspect = logoImg.width / logoImg.height;
          const lH = 36;
          const lW = Math.min(lH * lAspect, pillW - 16);
          ctx.drawImage(logoImg, pillX + (pillW - lW) / 2, pillY + (pillH - lH) / 2, lW, lH);

          // Top Banner Typography
          ctx.textAlign = 'left';
          ctx.font = 'bold 26px system-ui, sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('DIGITAL CREATOR SUMMIT', pillX + pillW + 24, 88);

          ctx.font = 'bold 16px system-ui, sans-serif';
          ctx.fillStyle = '#00D5D8';
          ctx.fillText('ONEVOICE27 · PANAMÁ · EN CRISTO TODAS LAS COSAS SON NUEVAS', pillX + pillW + 24, 114);
        } else {
          ctx.textAlign = 'center';
          ctx.font = 'bold 30px system-ui, sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('★ DIGITAL CREATOR SUMMIT PNM26 ★', size / 2, 90);

          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillStyle = '#00D5D8';
          ctx.fillText('UNAVOZ27 · PANAMÁ · EN CRISTO TODAS LAS COSAS SON NUEVAS', size / 2, 115);
        }

        // 4. Bottom Nameplate Placard
        const placardHeight = 175;
        const placardY = size - placardHeight - 45;

        ctx.fillStyle = 'rgba(28, 2, 53, 0.95)';
        ctx.beginPath();
        ctx.roundRect(50, placardY, size - 100, placardHeight, 24);
        ctx.fill();

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#00D5D8';
        ctx.stroke();

        // Attendee Name
        ctx.textAlign = 'center';
        ctx.font = '900 42px system-ui, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(delegate.name, size / 2, placardY + 54);

        // Association pill background
        const assocText = `${delegate.association.toUpperCase()} · DELEGADO OFICIAL`;
        ctx.font = 'bold 20px system-ui, sans-serif';
        const textWidth = ctx.measureText(assocText).width;

        ctx.fillStyle = '#E01E7E';
        ctx.beginPath();
        ctx.roundRect(size / 2 - textWidth / 2 - 20, placardY + 76, textWidth + 40, 36, 18);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(assocText, size / 2, placardY + 101);

        // Official Motto / Footer
        ctx.font = 'italic 18px system-ui, sans-serif';
        ctx.fillStyle = '#00D5D8';
        ctx.fillText('“En Cristo, todas las cosas son nuevas” · 26 Nov 2026', size / 2, placardY + 145);

        // Corner decorative stars
        ctx.font = 'bold 34px system-ui, sans-serif';
        ctx.fillStyle = '#00D5D8';
        ctx.fillText('✦', 75, placardY + 45);
        ctx.fillStyle = '#E01E7E';
        ctx.fillText('✦', size - 75, placardY + 45);

        ctx.restore();

        return canvas.toDataURL('image/jpeg', 0.94);
  }, [rawImageSrc, pan, zoom, rotation, selectedFrame, delegate]);

  // Save framed badge to delegate
  const handleSaveToBadge = async () => {
    setIsProcessing(true);
    try {
      const finalDataUrl = await generateFinalFramedBadge();
      if (finalDataUrl) {
        onSavePhoto(finalDataUrl);
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Download framed photo file
  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const finalDataUrl = await generateFinalFramedBadge();
      if (!finalDataUrl) return;
      const a = document.createElement('a');
      a.href = finalDataUrl;
      const cleanName = delegate.name.replace(/\s+/g, '_');
      a.download = `Foto_Summit_PNM26_${cleanName}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsProcessing(false);
    }
  };

  // Retake photo or shoot again
  const handleRetake = () => {
    setRawImageSrc(null);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#140124]/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Clickable Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => {
          stopCamera();
          onClose();
        }} 
        aria-hidden="true" 
      />

      {/* Main Studio Modal Card */}
      <div className="relative z-10 max-w-xl w-full mx-auto my-auto rounded-3xl overflow-hidden border-2 border-purple-200/90 bg-white text-slate-900 shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#1C0235] via-[#2D0652] to-[#E01E7E] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 px-2 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0 border border-white/30">
              <img 
                src="/ov27-logo-color-v2.png" 
                alt="OneVoice27" 
                className="h-5 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://adventista.es/wp-content/uploads/2026/09/ov27-logo-color-v2.png';
                }}
              />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5">
                <span>Foto de Acreditación Oficial</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00D5D8] text-[#1C0235] font-black">PNM26</span>
              </h3>
              <p className="text-[11px] text-purple-200 font-medium">
                {rawImageSrc ? 'Encuadra y ajusta tu foto dentro del marco' : `Fotografía para ${delegate.name}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Cerrar estudio fotográfico"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          
          {/* Frame Theme Selector */}
          <div className="flex items-center justify-between gap-2 bg-purple-50 p-1 rounded-2xl border border-purple-200">
            <span className="text-[11px] font-black text-purple-900 px-2 uppercase tracking-wider hidden sm:inline">
              Estilo de Marco:
            </span>
            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <button
                type="button"
                onClick={() => setSelectedFrame('summit-neon')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFrame === 'summit-neon'
                    ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                    : 'text-purple-800 hover:text-[#1C0235] hover:bg-white'
                }`}
              >
                Summit Neón
              </button>
              <button
                type="button"
                onClick={() => setSelectedFrame('summit-classic')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFrame === 'summit-classic'
                    ? 'bg-[#007D80] text-white shadow-md shadow-[#007D80]/30'
                    : 'text-purple-800 hover:text-[#007D80] hover:bg-white'
                }`}
              >
                Teal Clásico
              </button>
              <button
                type="button"
                onClick={() => setSelectedFrame('creator-gold')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFrame === 'creator-gold'
                    ? 'bg-[#1C0235] text-[#00D5D8] shadow-md shadow-[#1C0235]/30'
                    : 'text-purple-800 hover:text-[#1C0235] hover:bg-white'
                }`}
              >
                Creador Pro
              </button>
            </div>
          </div>

          {/* VIEWPORT AREA: LIVE CAMERA OR INTERACTIVE DRAGGABLE FRAMING */}
          <div 
            ref={viewportRef}
            className={`relative aspect-square max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#140124] select-none ${
              rawImageSrc ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {rawImageSrc ? (
              
              /* INTERACTIVE DRAGGABLE & SCALABLE PHOTO WITH LIVE FRAME OVERLAY */
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                
                {/* Transformed Raw Image */}
                <img
                  src={rawImageSrc}
                  alt={delegate.name}
                  draggable={false}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.08s ease-out',
                    transformOrigin: 'center center'
                  }}
                  className="w-full h-full object-cover pointer-events-none select-none max-w-none"
                />

                {/* Framing Overlay Hint Badge (Disappears while dragging) */}
                <div className={`absolute top-16 left-1/2 -translate-x-1/2 bg-[#1C0235]/85 border border-[#00D5D8] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 pointer-events-none shadow-lg backdrop-blur-sm transition-opacity duration-200 ${
                  isDragging ? 'opacity-0' : 'opacity-90'
                }`}>
                  <Move className="w-3 h-3 text-[#00D5D8]" />
                  <span>Arrastra para mover · Usa el zoom para encuadrar</span>
                </div>

                {/* ARTISTIC THEMED FRAME OVERLAY */}
                <div 
                  className="absolute inset-0 pointer-events-none border-[12px] sm:border-[16px] rounded-3xl transition-colors duration-300"
                  style={{
                    borderColor: selectedFrame === 'summit-neon' ? '#E01E7E' : selectedFrame === 'summit-classic' ? '#007D80' : '#FFB703'
                  }}
                >
                  <div className="absolute inset-1 sm:inset-2 border-2 border-white/70 rounded-2xl" />

                  {/* Top Header Badge on Frame */}
                  <div className="absolute top-2 inset-x-3 sm:inset-x-4 bg-[#1C0235]/95 border border-[#E01E7E] rounded-xl px-2 py-1 flex items-center justify-center gap-2 shadow-lg">
                    <img 
                      src="/ov27-logo-color-v2.png" 
                      alt="OneVoice27" 
                      className="h-3.5 sm:h-4 w-auto object-contain bg-white px-1.5 py-0.5 rounded"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://adventista.es/wp-content/uploads/2026/09/ov27-logo-color-v2.png';
                      }}
                    />
                    <div className="text-left leading-none">
                      <span className="text-[10px] sm:text-xs font-black text-white tracking-widest block uppercase">
                        DIGITAL CREATOR SUMMIT
                      </span>
                      <span className="text-[8px] font-bold text-[#00D5D8] block">
                        PNM26 · UNAVOZ27
                      </span>
                    </div>
                  </div>

                  {/* Bottom Placard on Frame */}
                  <div className="absolute bottom-2 inset-x-3 sm:inset-x-4 bg-[#1C0235]/95 border border-[#00D5D8] rounded-xl p-2 text-center shadow-lg space-y-0.5">
                    <span className="text-xs sm:text-sm font-black text-white block truncate">
                      {delegate.name}
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[9px] font-bold text-white bg-[#E01E7E] px-2 py-0.5 rounded-full inline-block truncate max-w-[200px]">
                        {delegate.association}
                      </span>
                    </div>
                    <span className="text-[8px] text-[#00D5D8] italic block font-medium">
                      “En Cristo, todas las cosas son nuevas”
                    </span>
                  </div>
                </div>

              </div>

            ) : (

              /* LIVE CAMERA FEED WITH REAL-TIME OVERLAY */
              <div className="relative w-full h-full flex items-center justify-center bg-purple-950">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                />

                {/* Simulated Real-Time Artistic Frame Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none border-[12px] sm:border-[16px] rounded-3xl"
                  style={{
                    borderColor: selectedFrame === 'summit-neon' ? '#E01E7E' : selectedFrame === 'summit-classic' ? '#007D80' : '#FFB703'
                  }}
                >
                  <div className="absolute inset-1 sm:inset-2 border-2 border-white/60 rounded-2xl" />

                  <div className="absolute top-2 inset-x-3 sm:inset-x-4 bg-[#1C0235]/95 border border-[#E01E7E] rounded-xl px-2 py-1 flex items-center justify-center gap-2 shadow-lg">
                    <img 
                      src="/ov27-logo-color-v2.png" 
                      alt="OneVoice27" 
                      className="h-3.5 sm:h-4 w-auto object-contain bg-white px-1.5 py-0.5 rounded"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://adventista.es/wp-content/uploads/2026/09/ov27-logo-color-v2.png';
                      }}
                    />
                    <div className="text-left leading-none">
                      <span className="text-[10px] sm:text-xs font-black text-white tracking-widest block uppercase">
                        DIGITAL CREATOR SUMMIT
                      </span>
                      <span className="text-[8px] font-bold text-[#00D5D8] block">
                        PNM26 · UNAVOZ27
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-2 inset-x-3 sm:inset-x-4 bg-[#1C0235]/90 border border-[#00D5D8] rounded-xl p-2 text-center shadow-lg space-y-0.5">
                    <span className="text-xs sm:text-sm font-black text-white block truncate">
                      {delegate.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#E01E7E] bg-white px-2 py-0.5 rounded-full inline-block">
                      {delegate.association}
                    </span>
                  </div>
                </div>

                {/* Countdown Overlay */}
                {isCountingDown && (
                  <div className="absolute inset-0 bg-[#140124]/75 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in-50 duration-150">
                    <span className="text-7xl sm:text-9xl font-black font-mono text-[#00D5D8] animate-ping">
                      {countdownNum}
                    </span>
                    <span className="text-sm font-black uppercase text-white tracking-wider mt-4">
                      ¡Sonríe para tu foto oficial!
                    </span>
                  </div>
                )}

                {/* Camera Error Message */}
                {cameraError && (
                  <div className="absolute inset-0 p-6 bg-purple-950/95 flex flex-col items-center justify-center text-center space-y-3 text-white">
                    <AlertCircle className="w-10 h-10 text-[#E01E7E]" />
                    <p className="text-xs font-medium text-purple-200 max-w-xs">
                      {cameraError}
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#E01E7E] text-white font-black text-xs flex items-center gap-2 shadow-lg"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Subir foto desde archivo</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FRAMING CONTROLS BAR (Active when photo is loaded) */}
          {rawImageSrc && (
            <div className="p-3 bg-purple-50/90 rounded-2xl border border-purple-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-[#1C0235] flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                  <Focus className="w-4 h-4 text-[#E01E7E]" />
                  <span>Ajustes de Encuadre</span>
                </span>
                <span className="text-[10px] text-purple-700 font-bold">
                  Zoom: {Math.round(zoom * 100)}% {rotation > 0 ? `· ${rotation}°` : ''}
                </span>
              </div>

              {/* Slider & Quick Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Alejar foto"
                  className="w-8 h-8 rounded-xl bg-white border border-purple-200 hover:bg-purple-100 flex items-center justify-center text-purple-800 active:scale-95 transition-all shrink-0"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                {/* Zoom range input */}
                <input
                  type="range"
                  min="0.7"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#E01E7E] cursor-pointer"
                  title="Ajustar tamaño de la foto"
                />

                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Acercar foto"
                  className="w-8 h-8 rounded-xl bg-white border border-purple-200 hover:bg-purple-100 flex items-center justify-center text-purple-800 active:scale-95 transition-all shrink-0"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Rotate 90° button */}
                <button
                  type="button"
                  onClick={handleRotate}
                  title="Girar foto 90 grados"
                  className="px-2.5 h-8 rounded-xl bg-white border border-purple-200 hover:bg-purple-100 flex items-center gap-1 text-[11px] font-bold text-purple-800 active:scale-95 transition-all shrink-0"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#007D80]" />
                  <span>Girar</span>
                </button>

                {/* Reset framing */}
                <button
                  type="button"
                  onClick={handleResetFraming}
                  title="Restablecer posición y zoom al centro"
                  className="px-2.5 h-8 rounded-xl bg-white border border-purple-200 hover:bg-purple-100 text-[11px] font-bold text-purple-700 active:scale-95 transition-all shrink-0"
                >
                  Centrar
                </button>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* ACTION BUTTONS & CONTROLS */}
          <div className="space-y-2 pt-1">
            {rawImageSrc ? (
              
              /* POST-CAPTURE / FRAMING ACTIONS */
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={handleSaveToBadge}
                  disabled={isProcessing}
                  className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#007D80] hover:bg-[#006264] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#007D80]/30 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>{isProcessing ? 'Guardando...' : 'Confirmar Encuadre y Guardar'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#E01E7E]/30 transition-all"
                  title="Descargar imagen en alta resolución con marco"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Foto</span>
                </button>

                <button
                  onClick={handleRetake}
                  className="min-h-[46px] px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-900 font-bold text-xs border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tomar otra</span>
                </button>
              </div>

            ) : (

              /* CAMERA LIVE ACTIONS */
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
                    }}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Girar cámara frontal / trasera"
                  >
                    <FlipHorizontal className="w-4 h-4 text-[#007D80]" />
                    <span>Girar Cámara</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Subir archivo de foto existente"
                  >
                    <Upload className="w-4 h-4 text-[#E01E7E]" />
                    <span>Subir Foto</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isCountingDown}
                  onClick={takePhotoWithCountdown}
                  className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#E01E7E] to-[#FF2E93] hover:from-[#C21268] hover:to-[#E01E7E] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E01E7E]/40 transition-all disabled:opacity-50"
                >
                  <Camera className="w-5 h-5" />
                  <span>{isCountingDown ? 'Preparando...' : 'Tomar Foto (3s)'}</span>
                </button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-center text-purple-800/80 font-medium pt-0.5">
            Puedes arrastrar la foto libremente con el dedo o mouse para encuadrarla dentro del marco oficial del Summit.
          </p>

        </div>

      </div>

    </div>
  );
};
