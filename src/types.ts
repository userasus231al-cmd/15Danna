export interface VenueInfo {
  name: string;
  address: string;
  city: string;
  mapsUrl: string;
  wazeUrl?: string;
  notes?: string;
}

export interface WhatsappRsvpInfo {
  phoneNumber: string; // e.g. "595981123456"
  contactName: string;
  defaultMessage: string;
  deadlineText: string;
}

export interface TransferInfo {
  alias: string;
  entity: string;
  accountHolder: string;
  accountNumber?: string;
  ciOrRuc?: string;
  notes: string;
}

export interface DressCodeInfo {
  title: string;
  description: string;
  reservedColorsNotice: string;
  palette: string[];
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  iconName: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category?: 'quince' | 'childhood';
  isPrimary?: boolean;
  aspectRatio?: 'portrait' | 'square' | 'landscape';
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  type: 'preset' | 'custom' | 'synth' | 'uploaded';
}

export type ThemeStyle = 'luxury-gold' | 'rose-gold' | 'royal-emerald' | 'lavender-midnight' | 'celestial-navy';

export interface InvitationData {
  quinceaneraName: string;
  subtitle: string;
  titlePhrase: string;
  dedicationQuote: string;
  parents: {
    mother: string;
    father: string;
    godparents: string;
  };
  eventDate: string; // ISO format e.g. "2026-10-17T20:30:00"
  dateDisplay: {
    dayOfWeek: string;
    day: string;
    month: string;
    year: string;
    time: string;
  };
  heroPhotoUrl: string;
  venue: VenueInfo;
  whatsappRsvp: WhatsappRsvpInfo;
  transferInfo: TransferInfo;
  dressCode: DressCodeInfo;
  itinerary: ItineraryItem[];
  photos: GalleryPhoto[];
  selectedTrackId: string;
  customTrackUrl?: string;
  customTrackTitle?: string;
  themeStyle: ThemeStyle;
}
