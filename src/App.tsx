/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InvitationData } from './types';
import { DEFAULT_INVITATION_DATA } from './data/defaultInvitation';
import { SparkleBackground } from './components/SparkleBackground';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { TopNavbar } from './components/TopNavbar';
import { StorybookView } from './components/StorybookView';
import { MusicPlayer } from './components/MusicPlayer';
import { EditorModal } from './components/EditorModal';
import { PasswordAuthModal } from './components/PasswordAuthModal';
import { triggerRoyalFanfareSparkles } from './utils/sparkleEffects';

const STORAGE_KEY = 'quinceanera_invitation_danna_v6';

export default function App() {
  // Load saved state from LocalStorage or default
  const [invitationData, setInvitationData] = useState<InvitationData>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('quinceanera_invitation_danna_v5') ||
        localStorage.getItem('quinceanera_invitation_danna_v4');

      if (saved) {
        const parsed = JSON.parse(saved);
        // Normalize titlePhrase to "CUENTO DE HADAS" if it had "CUENTO PERFECTO"
        if (parsed.titlePhrase && parsed.titlePhrase.toLowerCase().includes('perfecto')) {
          parsed.titlePhrase = 'ÉRASE UNA VEZ UNA PRINCESA QUE SOÑABA CON SU CUENTO DE HADAS...';
        }
        if (parsed.dressCode) {
          parsed.dressCode.reservedColorsNotice = 'Colores blanco y rosa reservados exclusivamente para la quinceañera';
        }
        // Ensure the photo with balloons of 15 is set as main photo (hero)
        if (!parsed.heroPhotoUrl || parsed.heroPhotoUrl === '' || parsed.heroPhotoUrl.includes('unsplash')) {
          parsed.heroPhotoUrl = DEFAULT_INVITATION_DATA.heroPhotoUrl;
        }
        // If photos list only had the old 4 photos or unsplash photos, migrate to the full 12 photos
        if (!parsed.photos || parsed.photos.length <= 4 || parsed.photos[0]?.url?.includes('unsplash')) {
          parsed.photos = DEFAULT_INVITATION_DATA.photos;
        } else if (Array.isArray(parsed.photos)) {
          parsed.photos = parsed.photos.map((p: any) => {
            if (p.caption?.includes('Infancia')) {
              return { ...p, caption: 'Mis Primeros Pasos' };
            }
            if (p.caption?.includes('Princesita')) {
              return { ...p, caption: 'Mi Primer Cuento de Hadas' };
            }
            return p;
          });
        }
        return { ...DEFAULT_INVITATION_DATA, ...parsed };
      }
    } catch {
      // fallback
    }
    return DEFAULT_INVITATION_DATA;
  });

  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<'photos' | 'music' | 'basic' | 'venue' | 'rsvp' | 'transfer' | 'theme'>('photos');
  const [editorInitialTab, setEditorInitialTab] = useState<'photos' | 'music' | 'basic' | 'venue' | 'rsvp' | 'transfer' | 'theme'>('photos');
  const [shouldAutoPlayMusic, setShouldAutoPlayMusic] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [storybookKey, setStorybookKey] = useState(0);

  // Fetch global config on mount (Music & Photos)
  React.useEffect(() => {
    fetch('/invitation-config.json?t=' + new Date().getTime())
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Config not found');
      })
      .then((data) => {
        if (data) {
          setInvitationData((prev) => {
            const updated = {
              ...prev,
              ...data, // merge all global fields!
              // Ensure we don't accidentally overwrite with nulls
              selectedTrackId: data.selectedTrackId || prev.selectedTrackId,
              customTrackUrl: data.customTrackUrl || prev.customTrackUrl,
              customTrackTitle: data.customTrackTitle || prev.customTrackTitle,
            };
            // Remove updatedAt to avoid polluting the app state
            delete updated.updatedAt;
            // Also update local storage so it persists between reloads
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch((err) => console.log('Using local config or defaults', err));
  }, []);

  // Save to LocalStorage whenever data changes
  const handleSaveData = (newData: InvitationData) => {
    setInvitationData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleOpenEditor = (tab: 'photos' | 'music' | 'basic' | 'venue' | 'rsvp' | 'transfer' | 'theme' = 'photos') => {
    setPendingTab(tab);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSuccess = () => {
    setEditorInitialTab(pendingTab);
    setIsEditorOpen(true);
  };

  const handleEnvelopeOpened = () => {
    setIsEnvelopeOpen(true);
    setShouldAutoPlayMusic(true);
    triggerRoyalFanfareSparkles();
  };

  const handleTrackChange = (trackId: string, customUrl?: string, customTitle?: string) => {
    const updated: InvitationData = {
      ...invitationData,
      selectedTrackId: trackId,
      customTrackUrl: customUrl || invitationData.customTrackUrl,
      customTrackTitle: customTitle || invitationData.customTrackTitle
    };
    handleSaveData(updated);
  };

  const handleJumpToChapter = (chapterIndex: number) => {
    // Jump to chapter inside storybook
    const dots = document.querySelectorAll('button[title^="Ir a"]');
    if (dots && dots[chapterIndex]) {
      (dots[chapterIndex] as HTMLButtonElement).click();
    }
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-damask-pattern text-stone-100 font-sans selection:bg-[#d87c98]/40 selection:text-white overflow-hidden relative flex flex-col justify-between">
      {/* Background ambient lighting and stars */}
      <SparkleBackground glowColor="#f472b6" />

      {/* Royal Sealed Envelope Introduction (Rose Gold & Princess Theme) */}
      <EnvelopeIntro
        data={invitationData}
        isOpen={isEnvelopeOpen}
        onOpen={handleEnvelopeOpened}
      />

      {/* Fixed Top Navigation Bar */}
      <TopNavbar
        data={invitationData}
        onOpenEditor={handleOpenEditor}
        onReopenEnvelope={() => setIsEnvelopeOpen(false)}
        onJumpToChapter={handleJumpToChapter}
      />

      {/* Main Interactive Fairytale Storybook (100dvh Mobile Fit - Zero vertical scrolling) */}
      <main className="relative z-10 pt-12 sm:pt-14 flex-1 h-[calc(100dvh-3rem)] max-h-[calc(100dvh-3rem)] overflow-hidden flex flex-col items-center justify-center">
        <StorybookView
          key={storybookKey}
          data={invitationData}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={() => {
            const btn = document.getElementById('toggle-music-play-btn');
            if (btn) btn.click();
          }}
          onOpenMusicSelector={() => {
            const btn = document.getElementById('open-music-modal-btn');
            if (btn) btn.click();
          }}
          onOpenEditor={handleOpenEditor}
          onUpdateData={handleSaveData}
        />
      </main>

      {/* Floating Music Vinyl Record Player & Audio Synth / MP3 */}
      <MusicPlayer
        currentTrackId={invitationData.selectedTrackId}
        customTrackUrl={invitationData.customTrackUrl}
        customTrackTitle={invitationData.customTrackTitle}
        themeStyle={invitationData.themeStyle}
        onTrackChange={handleTrackChange}
        onOpenMusicSettings={() => handleOpenEditor('music')}
        shouldAutoStart={shouldAutoPlayMusic}
      />

      {/* Full Feature Host / Quinceañera Customizer & Editor Modal */}
      <EditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        data={invitationData}
        onSave={handleSaveData}
        initialTab={editorInitialTab}
      />

      {/* Password Protection Authorization Modal */}
      <PasswordAuthModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
}
