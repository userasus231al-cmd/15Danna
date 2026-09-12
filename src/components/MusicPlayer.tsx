import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, Volume2, VolumeX, Disc, ListMusic, Upload, Link as LinkIcon, Check, Sparkles, X, Plus } from 'lucide-react';
import { MusicTrack, ThemeStyle } from '../types';
import { PRESET_MUSIC_TRACKS } from '../data/defaultInvitation';
import { waltzSynthesizer } from '../utils/audioSynth';
import { THEME_CONFIGS } from '../utils/theme';

interface MusicPlayerProps {
  currentTrackId: string;
  customTrackUrl?: string;
  customTrackTitle?: string;
  themeStyle: ThemeStyle;
  onTrackChange: (trackId: string, customUrl?: string, customTitle?: string) => void;
  onOpenMusicSettings?: () => void;
  shouldAutoStart?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrackId,
  customTrackUrl,
  customTrackTitle,
  themeStyle,
  onTrackChange,
  onOpenMusicSettings,
  shouldAutoStart = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(customTrackUrl || '');
  const [inputTitle, setInputTitle] = useState(customTrackTitle || 'Mi Canción Personalizada');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>(PRESET_MUSIC_TRACKS);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const theme = THEME_CONFIGS[themeStyle] || THEME_CONFIGS['luxury-gold'];

  // Current track details
  const activeTrack = currentTrackId === 'custom' && customTrackUrl
    ? {
        id: 'custom',
        title: customTrackTitle || 'Música Personalizada',
        artist: 'Quinceañera',
        url: customTrackUrl,
        type: 'custom' as const
      }
    : tracks.find((t) => t.id === currentTrackId) || tracks[0];

  // Auto-update audio source if activeTrack changes while playing
  useEffect(() => {
    if (isPlaying && audioRef.current && activeTrack.type !== 'synth') {
      if (audioRef.current.src !== activeTrack.url) {
        audioRef.current.src = activeTrack.url;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [activeTrack.url, isPlaying]);

  // Playback control
  const startPlayback = () => {
    if (activeTrack.type === 'synth' || activeTrack.url === 'synth:waltz') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      waltzSynthesizer.play();
      setIsPlaying(true);
    } else {
      waltzSynthesizer.stop();
      if (audioRef.current) {
        audioRef.current.src = activeTrack.url;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback error, falling back to synth waltz:', err);
            waltzSynthesizer.play();
            setIsPlaying(true);
          });
      }
    }
  };

  const stopPlayback = () => {
    waltzSynthesizer.stop();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Switch track handler
  const handleSelectTrack = (track: MusicTrack) => {
    stopPlayback();
    onTrackChange(track.id, track.type === 'custom' ? track.url : undefined, track.type === 'custom' ? track.title : undefined);
    setTimeout(() => {
      if (track.type === 'synth') {
        waltzSynthesizer.play();
        setIsPlaying(true);
      } else if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            waltzSynthesizer.play();
            setIsPlaying(true);
          });
      }
    }, 150);
  };

  // Add custom URL track
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const customTrack: MusicTrack = {
      id: 'custom-' + Date.now(),
      title: inputTitle.trim() || 'Canción Personalizada',
      artist: 'Audio Enlazado',
      url: inputUrl.trim(),
      type: 'custom'
    };

    setTracks((prev) => [...prev.filter((t) => t.id !== customTrack.id), customTrack]);
    handleSelectTrack(customTrack);
    setIsModalOpen(false);
  };

  // Upload local MP3 file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const uploadedTrack: MusicTrack = {
      id: 'upload-' + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Subido desde dispositivo',
      url: objectUrl,
      type: 'uploaded'
    };

    setUploadedFileName(file.name);
    setTracks((prev) => [...prev, uploadedTrack]);
    handleSelectTrack(uploadedTrack);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (shouldAutoStart && !isPlaying) {
      startPlayback();
    }
  }, [shouldAutoStart]);

  useEffect(() => {
    return () => {
      waltzSynthesizer.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        loop
        playsInline
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        }}
      />

      {/* Floating Vinyl Music Button */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        {/* Track Title Badge (Visible on hover or play) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-xs text-amber-200 shadow-xl backdrop-blur-md max-w-[220px]"
        >
          <div className="flex gap-0.5 items-end h-3">
            <span className={`w-0.5 bg-amber-400 rounded-full ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
            <span className={`w-0.5 bg-amber-400 rounded-full ${isPlaying ? 'h-2 animate-pulse delay-75' : 'h-1'}`} />
            <span className={`w-0.5 bg-amber-400 rounded-full ${isPlaying ? 'h-3.5 animate-pulse delay-150' : 'h-1'}`} />
          </div>
          <span className="truncate font-medium">{activeTrack.title}</span>
        </motion.div>

        {/* Spinning Vinyl Play/Pause Button */}
        <button
          id="toggle-music-play-btn"
          onClick={togglePlay}
          className={`relative p-3 rounded-full border-2 transition-all duration-300 shadow-2xl cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-200 text-stone-950 shadow-amber-500/40 scale-105'
              : 'bg-stone-900/95 border-amber-500/40 text-amber-300 hover:border-amber-300'
          }`}
          title={isPlaying ? 'Pausar Música' : 'Reproducir Música'}
        >
          <Disc
            className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`}
            style={{ animationDuration: '4s' }}
          />

          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            {isPlaying && (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </>
            )}
          </span>
        </button>
      </div>

      {/* Modal: Cambiar Música / Selector de Canciones */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#1e1713] to-[#120e0b] p-6 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-100">
                      Música de la Invitación
                    </h3>
                    <p className="text-xs text-stone-400">
                      Selecciona o sube la melodía para los 15 años
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Playlist items */}
              <div className="my-4 space-y-3">
                <span className="text-[11px] font-semibold tracking-wider text-amber-300 uppercase block">
                  Canción Oficial de la Invitación
                </span>

                {tracks.map((track) => {
                  const isSelected = track.id === activeTrack.id;

                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(track)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/40 text-amber-100 shadow-md shadow-amber-900/20'
                          : 'border-stone-800 bg-stone-900/60 hover:bg-stone-900 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={`p-2.5 rounded-xl ${
                            isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-400'
                          }`}
                        >
                          {isSelected && isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 fill-current" />
                          )}
                        </div>
                        <div className="truncate">
                          <span className="text-sm font-semibold block truncate">
                            {track.title}
                          </span>
                          <span className="text-xs text-amber-300/80 block truncate">
                            {track.artist}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30">
                          <Check className="w-3.5 h-3.5" />
                          <span>Canción Exclusiva</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Audio Options (Upload & Link) */}
              <div className="pt-4 border-t border-amber-500/20 space-y-4">
                <span className="text-[11px] font-semibold tracking-wider text-amber-300 uppercase block">
                  ¿Quieres poner tu propia canción?
                </span>

                {/* Upload MP3 File */}
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="music-file-upload"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/40 text-amber-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Subir archivo MP3 desde tu teléfono o PC</span>
                  </label>
                  <input
                    id="music-file-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Direct Link Input */}
                <form onSubmit={handleApplyCustomUrl} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="O pega el enlace URL de un archivo MP3"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={!inputUrl.trim()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Usar Link
                    </button>
                  </div>
                </form>
              </div>

              {/* Close footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
                >
                  Listo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
