import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Upload,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  MapPin,
  MessageCircle,
  CreditCard,
  Calendar,
  Shirt,
  Palette,
  Image as ImageIcon,
  Check,
  Download,
  FileCode,
  Music,
  Play,
  Pause,
  Volume2,
  Disc,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { InvitationData, GalleryPhoto, ThemeStyle } from '../types';
import { DEFAULT_INVITATION_DATA, PRESET_MUSIC_TRACKS } from '../data/defaultInvitation';
import { THEME_CONFIGS } from '../utils/theme';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationData;
  onSave: (updatedData: InvitationData) => void;
  initialTab?: 'photos' | 'music' | 'basic' | 'venue' | 'rsvp' | 'transfer' | 'theme';
}

export const EditorModal: React.FC<EditorModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  initialTab = 'photos'
}) => {
  const [formData, setFormData] = useState<InvitationData>(data);
  const [activeTab, setActiveTab] = useState<'photos' | 'music' | 'basic' | 'venue' | 'rsvp' | 'transfer' | 'theme'>(initialTab);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Audio Upload & Management state
  const [audioTitleInput, setAudioTitleInput] = useState(data.customTrackTitle || '');
  const [audioUrlInput, setAudioUrlInput] = useState(data.customTrackUrl || '');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [uploadAudioError, setUploadAudioError] = useState<string | null>(null);
  const [uploadAudioSuccess, setUploadAudioSuccess] = useState<string | null>(null);
  const [isPreviewAudioPlaying, setIsPreviewAudioPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync state if prop changes
  React.useEffect(() => {
    setFormData(data);
    setAudioTitleInput(data.customTrackTitle || '');
    setAudioUrlInput(data.customTrackUrl || '');
  }, [data]);

  // Tab change if initialTab prop changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Clean up preview audio on unmount or tab change
  React.useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, [activeTab, isOpen]);

  const handleSaveAll = async () => {
    // Attempt global save
    try {
      await fetch('/api/save-invitation-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.log('Fallo guardado global', err);
    }
    
    onSave(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restablecer los datos originales de la invitación?')) {
      setFormData(DEFAULT_INVITATION_DATA);
      onSave(DEFAULT_INVITATION_DATA);
    }
  };

  // Upload local photo from device
  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // We can upload multiple files at once for gallery, one for hero
    for (const file of Array.from(files) as File[]) {
      const reader = new FileReader();
      
      const processImage = async (base64Url: string) => {
        let finalUrl = base64Url;
        
        // Try uploading to server
        try {
          const res = await fetch('/api/upload-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, base64: base64Url })
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.url) finalUrl = data.url;
          }
        } catch (err) {
          console.log('Fallo subida a servidor, usando base64 local', err);
        }
        
        if (isHero) {
          setFormData((prev) => ({ ...prev, heroPhotoUrl: finalUrl }));
        } else {
          const newPhoto: GalleryPhoto = {
            id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            url: finalUrl,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            aspectRatio: 'portrait'
          };
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, newPhoto]
          }));
        }
      };
      
      reader.onload = (event) => {
        if (event.target?.result) {
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add photo via URL
  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: 'photo-' + Date.now(),
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || 'Foto de Mis 15',
      aspectRatio: 'portrait'
    };

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto]
    }));
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  // Delete photo
  const handleDeletePhoto = (photoId: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId)
    }));
  };

  // Update photo caption
  const handleUpdateCaption = (photoId: string, caption: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.map((p) => (p.id === photoId ? { ...p, caption } : p))
    }));
  };

  // Audio upload handler
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    setUploadAudioError(null);
    setUploadAudioSuccess(null);

    const titleToUse = audioTitleInput.trim() || file.name.replace(/\.[^/.]+$/, '');
    setAudioTitleInput(titleToUse);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;

        try {
          // Send to API to persist to /public/music/ and public/invitation-config.json
          const res = await fetch('/api/upload-music', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              base64: base64Url,
              title: titleToUse
            })
          });

          const data = await res.json();
          if (res.ok && data.url) {
            setFormData((prev) => ({
              ...prev,
              selectedTrackId: 'custom',
              customTrackUrl: data.url,
              customTrackTitle: data.title || titleToUse
            }));
            setAudioUrlInput(data.url);
            setUploadAudioSuccess(`¡Música guardada con éxito! "${data.title || titleToUse}" sonará para todos los invitados con el enlace.`);
            setIsUploadingAudio(false);

            if (previewAudioRef.current) {
              previewAudioRef.current.src = data.url;
              previewAudioRef.current.play().then(() => setIsPreviewAudioPlaying(true)).catch(() => {});
            }
          } else {
            throw new Error(data.error || 'Error al guardar en el servidor');
          }
        } catch (err: any) {
          console.warn('Fallo upload al servidor, usando dataURL local:', err);
          setFormData((prev) => ({
            ...prev,
            selectedTrackId: 'custom',
            customTrackUrl: base64Url,
            customTrackTitle: titleToUse
          }));
          setUploadAudioSuccess(`¡Música cargada correctamente! Guarda los cambios para que se aplique.`);
          setIsUploadingAudio(false);
          if (previewAudioRef.current) {
            previewAudioRef.current.src = base64Url;
            previewAudioRef.current.play().then(() => setIsPreviewAudioPlaying(true)).catch(() => {});
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadAudioError('Error al leer el archivo de música: ' + err.message);
      setIsUploadingAudio(false);
    }
  };

  const handleAudioUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioUrlInput.trim()) return;

    const titleToUse = audioTitleInput.trim() || 'Música Personalizada de 15 Años';
    setFormData((prev) => ({
      ...prev,
      selectedTrackId: 'custom',
      customTrackUrl: audioUrlInput.trim(),
      customTrackTitle: titleToUse
    }));

    fetch('/api/save-music-selection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackId: 'custom',
        customTrackUrl: audioUrlInput.trim(),
        customTrackTitle: titleToUse
      })
    }).catch(() => {});

    setUploadAudioSuccess(`¡Enlace establecido como música oficial!`);
    if (previewAudioRef.current) {
      previewAudioRef.current.src = audioUrlInput.trim();
      previewAudioRef.current.play().then(() => setIsPreviewAudioPlaying(true)).catch(() => {});
    }
  };

  const handleSelectPresetTrack = (trackId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTrackId: trackId,
      customTrackUrl: '',
      customTrackTitle: ''
    }));
    setAudioUrlInput('');

    fetch('/api/save-music-selection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackId: trackId,
        customTrackUrl: '',
        customTrackTitle: ''
      })
    }).catch(() => {});

    setUploadAudioSuccess(`¡Se restableció el vals clásico "Once Upon a Dream"!`);
    if (previewAudioRef.current) {
      previewAudioRef.current.src = '/music/once-upon-a-dream.mp3';
      previewAudioRef.current.play().then(() => setIsPreviewAudioPlaying(true)).catch(() => {});
    }
  };

  const togglePreviewAudio = () => {
    if (!previewAudioRef.current) return;
    if (isPreviewAudioPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewAudioPlaying(false);
    } else {
      const activeUrl = formData.selectedTrackId === 'custom' && formData.customTrackUrl
        ? formData.customTrackUrl
        : '/music/once-upon-a-dream.mp3';
      previewAudioRef.current.src = activeUrl;
      previewAudioRef.current.play().then(() => setIsPreviewAudioPlaying(true)).catch(() => {});
    }
  };

  // Export JSON backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `invitacion-15-${formData.quinceaneraName.replace(/\s+/g, '-').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#1c1613] to-[#100d0a] shadow-2xl overflow-hidden text-stone-100"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between bg-stone-900/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-100">
                  Personalizar Invitación de 15 Años
                </h2>
                <p className="text-xs text-stone-400">
                  Edita fotos, WhatsApp, datos bancarios, textos y música en tiempo real
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-2 border-b border-stone-800 bg-stone-950/40 text-xs scrollbar-none">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeTab === 'photos'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Fotos de la Quinceañera ({formData.photos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeTab === 'music'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-rose-200 hover:bg-stone-800'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>Música / Vals</span>
            </button>

            <button
              onClick={() => setActiveTab('rsvp')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeTab === 'rsvp'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp & RSVP</span>
            </button>

            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeTab === 'transfer'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Datos Transferencia (Ueno)</span>
            </button>

            <button
              onClick={() => setActiveTab('venue')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeTab === 'venue'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Salón & Ubicación</span>
            </button>

            <button
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeTab === 'basic'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Nombres & Fecha</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeTab === 'theme'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Tema Visual</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* 1. PHOTOS TAB */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                {/* Hero Photo Section */}
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-stone-900/60">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-300 block mb-2">
                    Foto Principal de Portada (Hero)
                  </span>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={formData.heroPhotoUrl}
                      alt="Portada"
                      className="w-24 h-32 object-cover rounded-xl border border-amber-400/50 shadow-md"
                    />
                    <div className="flex-1 space-y-2 w-full">
                      <label
                        htmlFor="hero-upload-input"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Subir Foto Principal desde tu dispositivo</span>
                      </label>
                      <input
                        id="hero-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoFileUpload(e, true)}
                        className="hidden"
                      />
                      <input
                        type="text"
                        placeholder="O escribe URL de la imagen de portada"
                        value={formData.heroPhotoUrl}
                        onChange={(e) => setFormData({ ...formData, heroPhotoUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-700 bg-stone-950 text-stone-100 text-xs focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Multiple Gallery Photos */}
                <div className="p-4 rounded-2xl border border-stone-800 bg-stone-900/40 space-y-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-300 block">
                    Agregar Fotos al Álbum de la Quinceañera
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Device Upload */}
                    <label
                      htmlFor="gallery-bulk-upload"
                      className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/30 text-amber-200 text-xs font-semibold text-center cursor-pointer transition-all"
                    >
                      <Upload className="w-7 h-7 text-amber-400 mb-2" />
                      <span>Subir Fotos desde Teléfono o PC</span>
                      <span className="text-[10px] text-stone-400 mt-1">Puedes seleccionar varias imágenes</span>
                    </label>
                    <input
                      id="gallery-bulk-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotoFileUpload(e, false)}
                      className="hidden"
                    />

                    {/* URL Upload */}
                    <form onSubmit={handleAddPhotoByUrl} className="space-y-2">
                      <input
                        type="url"
                        placeholder="Pegar URL de foto web"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-700 bg-stone-950 text-stone-100 text-xs focus:border-amber-400 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Descripción o Pie de foto (opcional)"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-700 bg-stone-950 text-stone-100 text-xs focus:border-amber-400 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newPhotoUrl.trim()}
                        className="w-full py-2 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold disabled:opacity-40"
                      >
                        + Agregar Foto por Enlace
                      </button>
                    </form>
                  </div>
                </div>

                {/* Current Photo Grid in Editor */}
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-3">
                    Fotos Actuales ({formData.photos.length})
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.photos.map((photo, idx) => (
                      <div
                        key={photo.id || idx}
                        className="group relative rounded-xl overflow-hidden border border-stone-700 bg-stone-900 p-1.5 flex flex-col gap-1.5"
                      >
                        <div className="aspect-[3/4] w-full rounded-lg overflow-hidden relative">
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="absolute top-1 right-1 p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-500 shadow-md"
                            title="Eliminar foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={photo.caption}
                          placeholder="Pie de foto..."
                          onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                          className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-800 text-[11px] text-stone-200 focus:border-amber-400 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. RSVP & WHATSAPP TAB */}
            {activeTab === 'rsvp' && (
              <div className="space-y-4 max-w-xl">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs">
                  Este número se usará para el botón de confirmación directa a WhatsApp.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Número de WhatsApp (con código de país) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: +595981335389 o 595981335389"
                    value={formData.whatsappRsvp.phoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsappRsvp: { ...formData.whatsappRsvp, phoneNumber: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-emerald-400 outline-none"
                  />
                  <span className="text-[11px] text-stone-500">Ejemplo para Paraguay: +595 981 123456</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nombre del Contacto / Quinceañera
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappRsvp.contactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsappRsvp: { ...formData.whatsappRsvp, contactName: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Mensaje Predeterminado para WhatsApp
                  </label>
                  <textarea
                    rows={3}
                    value={formData.whatsappRsvp.defaultMessage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsappRsvp: { ...formData.whatsappRsvp, defaultMessage: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Texto de Fecha Límite de Confirmación
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappRsvp.deadlineText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsappRsvp: { ...formData.whatsappRsvp, deadlineText: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-emerald-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* 3. TRANSFER / BANK DATA TAB */}
            {activeTab === 'transfer' && (
              <div className="space-y-4 max-w-xl">
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
                  Datos de regalo por transferencia configurados según tu solicitud:
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Alias de Transferencia *
                  </label>
                  <input
                    type="text"
                    value={formData.transferInfo.alias}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transferInfo: { ...formData.transferInfo, alias: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/40 bg-stone-900 text-amber-200 font-mono font-bold text-sm focus:border-amber-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Entidad Bancaria *
                  </label>
                  <input
                    type="text"
                    value={formData.transferInfo.entity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transferInfo: { ...formData.transferInfo, entity: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nombre del Titular de la Cuenta *
                  </label>
                  <input
                    type="text"
                    value={formData.transferInfo.accountHolder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transferInfo: { ...formData.transferInfo, accountHolder: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Mensaje para los Invitados (Opción de Regalo / Transferencia)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.transferInfo.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transferInfo: { ...formData.transferInfo, notes: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* 4. SALÓN & UBICACIÓN TAB */}
            {activeTab === 'venue' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nombre del Salón de Eventos *
                  </label>
                  <input
                    type="text"
                    value={formData.venue.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: { ...formData.venue, name: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Dirección del Salón *
                  </label>
                  <input
                    type="text"
                    value={formData.venue.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: { ...formData.venue, address: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Ciudad / País
                  </label>
                  <input
                    type="text"
                    value={formData.venue.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: { ...formData.venue, city: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Enlace de Google Maps (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={formData.venue.mapsUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: { ...formData.venue, mapsUrl: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Notas adicionales (Estacionamiento, entrada, etc.)
                  </label>
                  <input
                    type="text"
                    value={formData.venue.notes || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: { ...formData.venue, notes: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* 5. BASIC INFO & DATE TAB */}
            {activeTab === 'basic' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nombre de la Quinceañera *
                  </label>
                  <input
                    type="text"
                    value={formData.quinceaneraName}
                    onChange={(e) => setFormData({ ...formData, quinceaneraName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 font-serif text-base focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Frase Principal / Poema
                  </label>
                  <textarea
                    rows={2}
                    value={formData.titlePhrase}
                    onChange={(e) => setFormData({ ...formData, titlePhrase: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Dedicatoria / Palabras de Bienvenida
                  </label>
                  <textarea
                    rows={2}
                    value={formData.dedicationQuote}
                    onChange={(e) => setFormData({ ...formData, dedicationQuote: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Madre
                    </label>
                    <input
                      type="text"
                      value={formData.parents.mother}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parents: { ...formData.parents, mother: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Padre
                    </label>
                    <input
                      type="text"
                      value={formData.parents.father}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parents: { ...formData.parents, father: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Fecha del Evento (para cuenta regresiva)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.eventDate.substring(0, 16)}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-sm focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Hidden preview audio element for testing */}
            <audio
              ref={previewAudioRef}
              onEnded={() => setIsPreviewAudioPlaying(false)}
            />

            {/* MUSIC / VALS TAB */}
            {activeTab === 'music' && (
              <div className="space-y-6">
                {/* Security & Access Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-stone-900 border border-rose-400/30 shadow-sm flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 shrink-0 mt-0.5">
                    <Music className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="text-xs">
                    <span className="font-serif font-bold text-rose-100 text-sm block mb-1">
                      Música Oficial de los 15 Años (Acceso Privado)
                    </span>
                    <p className="text-stone-300 leading-relaxed">
                      Solo tú con tu clave de seguridad puedes cambiar la música. Cualquier canción que subas o elijas aquí quedará guardada de forma permanente para <strong className="text-amber-300 font-semibold">todos los invitados</strong> que abran el enlace de la invitación.
                    </p>
                  </div>
                </div>

                {/* Status Messages */}
                {uploadAudioSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="flex-1 font-medium">{uploadAudioSuccess}</span>
                  </motion.div>
                )}

                {uploadAudioError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="flex-1 font-medium">{uploadAudioError}</span>
                  </motion.div>
                )}

                {/* Current Active Music Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-amber-500/30 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-300">
                        <Disc className={`w-6 h-6 ${isPreviewAudioPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                        {isPreviewAudioPlaying && (
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                          Canción Actual Activa
                        </span>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-stone-100">
                          {formData.selectedTrackId === 'custom' && formData.customTrackTitle
                            ? formData.customTrackTitle
                            : formData.selectedTrackId === 'custom' && formData.customTrackUrl
                            ? 'Música Personalizada de Quinceañera'
                            : 'Once Upon a Dream (Vals de La Bella Durmiente)'}
                        </h4>
                        <span className="text-xs text-stone-400 block mt-0.5">
                          {formData.selectedTrackId === 'custom'
                            ? 'Música personalizada subida por ti'
                            : 'Vals clásico de cuento de hadas'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Play Preview Button */}
                      <button
                        type="button"
                        onClick={togglePreviewAudio}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        {isPreviewAudioPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Pausar Prueba</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Escuchar Prueba</span>
                          </>
                        )}
                      </button>

                      {formData.selectedTrackId === 'custom' && (
                        <button
                          type="button"
                          onClick={() => handleSelectPresetTrack('track-once-upon-a-dream')}
                          className="px-3 py-2 rounded-xl border border-stone-700 hover:border-amber-500/40 text-stone-300 hover:text-stone-100 text-xs transition-colors"
                          title="Restablecer al vals de cuento de hadas"
                        >
                          Restablecer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Option 1: Upload Audio File */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#241520] to-[#180c15] border border-rose-400/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-rose-200 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-rose-300" />
                      Opción 1: Subir Archivo de Audio (MP3, M4A, WAV)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-300/30">
                      Recomendado
                    </span>
                  </div>

                  <p className="text-xs text-stone-300">
                    Sube directamente tu canción o vals desde los archivos de tu celular o computadora.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Nombre de la canción o artista (opcional):
                      </label>
                      <input
                        type="text"
                        value={audioTitleInput}
                        onChange={(e) => setAudioTitleInput(e.target.value)}
                        placeholder="Ej: A Thousand Years - Christina Perri / Vals de Mis 15"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-xs focus:border-rose-400 focus:outline-none"
                      />
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="audio-file-input-modal"
                        className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
                          isUploadingAudio
                            ? 'border-amber-400 bg-amber-950/20 text-amber-200 cursor-wait'
                            : 'border-rose-400/40 hover:border-rose-300 bg-rose-950/20 hover:bg-rose-950/40 text-rose-200'
                        }`}
                      >
                        {isUploadingAudio ? (
                          <>
                            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
                            <span className="text-xs font-bold text-amber-200">
                              Subiendo y sincronizando música para todos los invitados...
                            </span>
                            <span className="text-[11px] text-stone-400">
                              Por favor espera un instante
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block text-rose-100">
                                Haz clic aquí para elegir tu archivo de música
                              </span>
                              <span className="text-[11px] text-stone-400 block mt-0.5">
                                Formatos admitidos: MP3, M4A, WAV, AAC, OGG
                              </span>
                            </div>
                          </>
                        )}
                      </label>
                      <input
                        id="audio-file-input-modal"
                        type="file"
                        accept="audio/mp3,audio/mpeg,audio/m4a,audio/wav,audio/x-m4a,audio/*"
                        onChange={handleAudioFileUpload}
                        disabled={isUploadingAudio}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Option 2: Paste Audio Link */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-300 flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5" />
                    Opción 2: O pega un enlace directo de internet (URL)
                  </span>
                  <p className="text-xs text-stone-400">
                    Si tienes un archivo MP3 alojado en la web, pega aquí la dirección directa:
                  </p>
                  <form onSubmit={handleAudioUrlSubmit} className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/mi-vals.mp3"
                      value={audioUrlInput}
                      onChange={(e) => setAudioUrlInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!audioUrlInput.trim()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Aplicar Link
                    </button>
                  </form>
                </div>

                {/* Option 3: Restore Once Upon a Dream */}
                <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-200 block">
                      Once Upon a Dream (La Bella Durmiente)
                    </span>
                    <span className="text-[11px] text-stone-400 block">
                      El vals instrumental de fantasía original de la invitación
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetTrack('track-once-upon-a-dream')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      formData.selectedTrackId === 'track-once-upon-a-dream'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    }`}
                  >
                    {formData.selectedTrackId === 'track-once-upon-a-dream' ? 'Seleccionado' : 'Elegir'}
                  </button>
                </div>
              </div>
            )}

            {/* 6. THEME STYLES TAB */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-300 block mb-2">
                  Elige la paleta y estilo visual de la invitación:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(THEME_CONFIGS) as ThemeStyle[]).map((themeKey) => {
                    const themeObj = THEME_CONFIGS[themeKey];
                    const isSelected = formData.themeStyle === themeKey;

                    return (
                      <div
                        key={themeKey}
                        onClick={() => setFormData({ ...formData, themeStyle: themeKey })}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/40 shadow-lg'
                            : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                        }`}
                      >
                        <div>
                          <span className="font-serif font-bold text-sm block text-stone-100 mb-1">
                            {themeObj.name}
                          </span>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${themeObj.badge}`}>
                            {themeKey}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-amber-500/20 bg-stone-900/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 text-xs transition-colors"
                title="Restablecer valores iniciales"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-800 text-xs transition-colors"
                title="Exportar respaldo JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar JSON</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>

          {/* Save Success Toast */}
          <AnimatePresence>
            {showSavedToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-emerald-500 text-stone-950 font-bold text-xs shadow-2xl flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>¡Invitación actualizada y guardada!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
