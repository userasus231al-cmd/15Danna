import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Camera, Image as ImageIcon, Plus, X, ChevronLeft, ChevronRight, Sparkles, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { GalleryPhoto, ThemeStyle } from '../types';

interface GallerySectionProps {
  photos: GalleryPhoto[];
  quinceaneraName: string;
  themeStyle?: ThemeStyle;
  onOpenPhotoManager: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  quinceaneraName,
  onOpenPhotoManager
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Display subset unless expanded or small list
  const INITIAL_COUNT = 6;
  const displayedPhotos = isExpanded ? photos : photos.slice(0, INITIAL_COUNT);
  const hasMore = photos.length > INITIAL_COUNT;

  const handleNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
  };

  return (
    <section id="gallery-section" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Outer Fairytale Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2d1228] via-[#240e20] to-[#1a0816] border-2 border-rose-300/35 p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/60 text-white">
        
        {/* Top Golden Crown */}
        <div className="flex justify-center mb-1">
          <Crown className="w-5 h-5 text-amber-400 fill-amber-400/50 drop-shadow" />
        </div>

        {/* Section Header: ✦ ÁLBUM DE FOTOS & RECUERDOS ✦ */}
        <div className="flex items-center justify-center gap-2 mb-1.5 text-center">
          <span className="text-rose-300 text-xs">✦</span>
          <h2 className="text-sm sm:text-base md:text-lg font-cinzel font-bold text-rose-100 tracking-[0.25em] uppercase">
            ÁLBUM DE FOTOS & RECUERDOS
          </h2>
          <span className="text-rose-300 text-xs">✦</span>
        </div>

        <p className="text-center text-xs sm:text-sm font-serif italic text-rose-200/85 max-w-md mx-auto mb-6">
          Momentos mágicos e inolvidables de mis 15 años
        </p>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedPhotos.map((photo, index) => {
            const isMain = photo.isPrimary;

            return (
              <motion.div
                key={photo.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`group relative rounded-2xl overflow-hidden border-2 bg-[#35152d] aspect-[3/4] cursor-pointer shadow-lg transition-all duration-300 ${
                  isMain
                    ? 'border-amber-400/90 ring-2 ring-amber-400/40 shadow-amber-500/15'
                    : 'border-rose-400/40 hover:border-rose-300 hover:shadow-rose-500/20'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || `Foto de ${quinceaneraName}`}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Main Photo Top Badge */}
                {isMain && (
                  <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-amber-400/95 text-stone-950 text-[10px] font-cinzel font-bold tracking-wider flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    <span>FOTO PRINCIPAL: 15 AÑOS</span>
                  </div>
                )}

                {/* Gradient Overlay on Hover & Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f0a1c]/95 via-[#1f0a1c]/40 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
                  <span className="text-xs sm:text-sm font-serif font-semibold text-rose-100 leading-snug">
                    {photo.caption || 'Mis 15 Años'}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-rose-300/80">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Toca para ampliar
                    </span>
                    <span className="font-cinzel text-amber-300/90">
                      ✦ Mis 15 Años ✦
                    </span>
                  </div>
                </div>

                {/* Corner icon badge */}
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#240e20]/80 backdrop-blur-md border border-rose-300/40 text-rose-200 opacity-80 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}

          {/* Add / Edit Photos Card */}
          <button
            onClick={onOpenPhotoManager}
            className="rounded-2xl border-2 border-dashed border-rose-400/40 hover:border-rose-300 bg-[#35152d]/40 hover:bg-[#35152d]/80 p-5 aspect-[3/4] flex flex-col items-center justify-center text-center text-rose-300/70 hover:text-rose-100 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-rose-500/20 group-hover:bg-rose-500/30 text-rose-300 flex items-center justify-center mb-2.5 transition-colors border border-rose-400/40">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-rose-200 block mb-1">
              Editar / Subir Fotos
            </span>
            <span className="text-[10px] text-rose-300/60 max-w-[130px] font-sans">
              Sube fotos desde tu teléfono o actualiza la galería
            </span>
          </button>
        </div>

        {/* "Ver Más del Álbum" Toggle Button if more than initial count */}
        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d87c98] via-[#c96987] to-[#b85474] hover:from-[#e08aa3] hover:to-[#c55f80] text-white text-xs font-cinzel font-bold tracking-wider shadow-lg shadow-rose-950/60 transition-all cursor-pointer uppercase border border-rose-200/40"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isExpanded
                  ? 'Ver Menos Fotos'
                  : `Ver Más del Álbum (${photos.length - INITIAL_COUNT} fotos más)`}
              </span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Manage photos CTA button below */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={onOpenPhotoManager}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-950/60 hover:bg-rose-900 border border-rose-400/30 text-rose-200 text-[11px] font-cinzel tracking-wider transition-all cursor-pointer uppercase"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Personalizar Álbum en el Editor</span>
          </button>
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-4 z-50 p-3 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-4 z-50 p-3 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[selectedPhotoIndex].url}
                alt={photos[selectedPhotoIndex].caption || 'Foto de 15 años'}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-rose-400/40 shadow-2xl"
              />

              <div className="mt-3 text-center">
                <p className="text-sm sm:text-base font-serif text-rose-100 font-semibold">
                  {photos[selectedPhotoIndex].caption || `15 Años de ${quinceaneraName}`}
                </p>
                <span className="text-xs text-rose-300/70">
                  {selectedPhotoIndex + 1} de {photos.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
