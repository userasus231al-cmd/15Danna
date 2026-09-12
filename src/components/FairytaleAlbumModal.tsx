import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Star,
  Maximize2
} from 'lucide-react';
import { GalleryPhoto } from '../types';

interface FairytaleAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: GalleryPhoto[];
  quinceaneraName: string;
  heroPhotoUrl?: string;
  onSetHeroPhoto?: (url: string) => void;
  onUploadPhotos?: (newPhotos: GalleryPhoto[]) => void;
}

export const FairytaleAlbumModal: React.FC<FairytaleAlbumModalProps> = ({
  isOpen,
  onClose,
  photos,
  quinceaneraName,
  heroPhotoUrl,
  onSetHeroPhoto,
  onUploadPhotos
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos.length]);

  const handleNext = () => {
    if (lightboxIndex === null || photos.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null || photos.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Local multiple file upload handler
  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onUploadPhotos) return;

    const uploadedList: GalleryPhoto[] = [];
    let processed = 0;

    Array.from(files).forEach((file: File, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const isBalloons = file.name.toLowerCase().includes('15') || file.name.toLowerCase().includes('globo') || idx === 0;
        
        uploadedList.push({
          id: `uploaded-${Date.now()}-${idx}`,
          url: base64,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          category: 'quince',
          isPrimary: isBalloons,
          aspectRatio: 'portrait'
        });

        processed++;
        if (processed === files.length) {
          onUploadPhotos(uploadedList);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="fairytale-album-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#2e1329] via-[#220d1f] to-[#170714] border-2 border-rose-300/40 shadow-2xl shadow-black/80 text-rose-50 overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-5 py-4 border-b border-rose-400/25 flex items-center justify-between bg-[#381632]/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-xs">
                <Crown className="w-5 h-5 fill-amber-400/40" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-amber-300">✦</span>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-rose-100 tracking-wider uppercase">
                    Álbum de Recuerdos de {quinceaneraName}
                  </h3>
                  <span className="text-[10px] text-amber-300">✦</span>
                </div>
                <p className="text-[11px] font-serif italic text-rose-300/85">
                  Momentos mágicos e inolvidables de mis 15 años
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="btn-close-album-modal"
              onClick={onClose}
              className="p-2 rounded-full bg-rose-950/60 hover:bg-rose-900 border border-rose-400/30 text-rose-200 hover:text-white transition-all cursor-pointer"
              title="Cerrar álbum"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader: Photos count & Upload CTA without sections */}
          <div className="px-5 py-2.5 border-b border-rose-400/15 flex items-center justify-between gap-3 bg-[#240e20]/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-cinzel font-bold text-rose-200 tracking-wider flex items-center gap-1.5">
                <span className="text-amber-300">✦</span>
                Todas las Fotografías ({photos.length})
              </span>
            </div>

            {/* Quick Upload Action */}
            <label
              htmlFor="album-quick-bulk-upload"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-cinzel font-bold tracking-wider cursor-pointer transition-all shadow-xs"
              title="Cargar o actualizar fotos desde tu dispositivo"
            >
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>Subir Fotos</span>
            </label>
            <input
              id="album-quick-bulk-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkUpload}
              className="hidden"
            />
          </div>

          {/* Photo Grid (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {photos.map((photo, index) => {
                const isMainPhoto = photo.isPrimary || (heroPhotoUrl && heroPhotoUrl === photo.url) || index === 0;
                const hasError = imageErrors[photo.id];

                return (
                  <motion.div
                    key={photo.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    onClick={() => setLightboxIndex(index)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 aspect-[3/4] flex flex-col justify-end bg-[#33142c] shadow-lg ${
                      isMainPhoto
                        ? 'border-amber-400/80 ring-2 ring-amber-400/30 shadow-amber-500/10'
                        : 'border-rose-400/35 hover:border-rose-200 hover:shadow-rose-500/20'
                    }`}
                  >
                    {/* Main Photo Badge */}
                    {isMainPhoto && (
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-amber-400/90 backdrop-blur-md text-stone-950 text-[9px] font-cinzel font-bold tracking-wider flex items-center gap-1 shadow-md">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Foto Principal</span>
                      </div>
                    )}

                    {/* Image or Fairytale Fallback Card */}
                    {!hasError ? (
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        onError={() => handleImageError(photo.id)}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#3d1735] to-[#250d21]">
                        <Camera className="w-8 h-8 text-rose-300/60 mb-2" />
                        <span className="text-[11px] font-serif font-bold text-rose-100 line-clamp-2">
                          {photo.caption}
                        </span>
                        <span className="text-[9px] text-amber-300/80 mt-1 font-cinzel">
                          Mis 15 Años
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay & Caption */}
                    <div className="relative z-10 p-2.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end">
                      <p className="text-[11px] font-serif font-semibold text-rose-100 leading-tight drop-shadow-xs line-clamp-2">
                        {photo.caption}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[9px] text-rose-300/80 font-sans">
                        <span>Toca para ampliar</span>
                        <Maximize2 className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Emotional Fairytale Note */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#441838]/70 via-[#5a1e45]/70 to-[#441838]/70 border border-rose-300/30 text-center space-y-1">
              <p className="text-xs font-serif italic text-rose-100">
                "Hay momentos grabados en el corazón que brillan para siempre como estrellas en el cielo."
              </p>
              <p className="text-[10px] text-amber-300/90 font-cinzel tracking-wider">
                ✦ 15 AÑOS DE DANNA ✦
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fullscreen Lightbox Carousel */}
        <AnimatePresence>
          {lightboxIndex !== null && photos[lightboxIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 backdrop-blur-xl p-3 sm:p-6"
              onClick={() => setLightboxIndex(null)}
            >
              <div
                className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Action Bar */}
                <div className="w-full flex items-center justify-between pb-3 text-rose-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-cinzel font-bold text-amber-300">
                      Foto {lightboxIndex + 1} de {photos.length}
                    </span>
                    {photos[lightboxIndex].isPrimary && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-cinzel font-bold">
                        ⭐ Foto Principal
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onSetHeroPhoto && (
                      <button
                        onClick={() => {
                          onSetHeroPhoto(photos[lightboxIndex].url);
                        }}
                        className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer"
                        title="Establecer esta foto como la imagen principal de la invitación"
                      >
                        <Star className="w-3 h-3" />
                        <span>Fijar como Principal</span>
                      </button>
                    )}
                    <button
                      onClick={() => setLightboxIndex(null)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Main Lightbox Image View */}
                <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl border-2 border-rose-300/40 bg-stone-950/80 shadow-2xl">
                  <img
                    src={photos[lightboxIndex].url}
                    alt={photos[lightboxIndex].caption}
                    className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl"
                  />

                  {/* Previous Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-2 sm:left-4 p-2.5 rounded-full bg-black/60 hover:bg-rose-900 border border-rose-400/40 text-rose-100 hover:text-white transition-all cursor-pointer"
                    title="Foto anterior (Flecha izquierda)"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-2 sm:right-4 p-2.5 rounded-full bg-black/60 hover:bg-rose-900 border border-rose-400/40 text-rose-100 hover:text-white transition-all cursor-pointer"
                    title="Foto siguiente (Flecha derecha)"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Caption Footer */}
                <div className="w-full text-center mt-3 px-4">
                  <p className="text-sm font-serif font-semibold text-rose-100">
                    {photos[lightboxIndex].caption}
                  </p>
                  <p className="text-[11px] font-serif italic text-rose-300/80 mt-0.5">
                    Celebrando los 15 Años de {quinceaneraName}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

