import { InvitationData, MusicTrack } from '../types';

export const PRESET_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'track-once-upon-a-dream',
    title: 'Once Upon a Dream (La Bella Durmiente)',
    artist: 'Vals Real del Cuento de Hadas',
    url: '/music/once-upon-a-dream.mp3',
    type: 'preset'
  }
];

export const DEFAULT_INVITATION_DATA: InvitationData = {
  quinceaneraName: 'Danna',
  subtitle: 'MIS XV',
  titlePhrase: 'ÉRASE UNA VEZ UNA PRINCESA QUE SOÑABA CON SU CUENTO DE HADAS...',
  dedicationQuote: 'Hay momentos en la vida que son muy especiales por sí solos. Compartirlos con las personas que quieres, los convierte en momentos inolvidables. Te invito a ser parte de este sueño hecho realidad. ¡No faltes!',
  parents: {
    mother: 'Cristina Bernal',
    father: 'Carlos Bernal',
    godparents: 'Marta Bernal & José Gómez'
  },
  eventDate: '2026-10-10T20:00:00',
  dateDisplay: {
    dayOfWeek: 'SÁBADO',
    day: '10',
    month: 'OCTUBRE',
    year: '2026',
    time: '20:00 HS.'
  },
  heroPhotoUrl: '/photos/WhatsApp Image 2026-09-10 at 16.40.30.jpeg',
  venue: {
    name: 'Quinta Marbella',
    address: 'San Lorenzo',
    city: 'Paraguay',
    mapsUrl: 'https://maps.app.goo.gl/ZhaqmWH2r71aeRsX6',
    wazeUrl: 'https://maps.app.goo.gl/ZhaqmWH2r71aeRsX6',
    notes: 'Salón de eventos ambientado de ensueño. Contamos con estacionamiento y seguridad.'
  },
  whatsappRsvp: {
    phoneNumber: '0983027633',
    contactName: 'Danna / Familia Bernal',
    defaultMessage: '¡Hola Danna! Confirmo mi asistencia a tu fiesta de 15 años en Quinta Marbella.',
    deadlineText: 'Por favor confirmar asistencia antes del 1 de Octubre de 2026'
  },
  transferInfo: {
    alias: '3353897',
    entity: 'Ueno Bank',
    accountHolder: 'María Cristina Bernal',
    accountNumber: '3353897',
    ciOrRuc: '3.353.897',
    notes: 'Tu presencia es mi mayor regalo. Si deseas hacerme un presente, te comparto esta opción de regalo por transferencia:'
  },
  dressCode: {
    title: 'ELEGANTE',
    description: 'Vestimenta de gala y elegante para una noche de cuento de hadas.',
    reservedColorsNotice: 'Colores blanco y rosa reservados exclusivamente para la quinceañera',
    palette: ['#ffffff', '#f472b6']
  },
  itinerary: [
    {
      id: 'item-1',
      time: '20:00',
      title: 'Recepción & Bienvenida',
      description: 'Llegada de invitados al castillo y cóctel de bienvenida.',
      iconName: 'Sparkles'
    },
    {
      id: 'item-2',
      time: '21:00',
      title: 'Entrada Triunfal de la Princesa',
      description: 'Presentación de Danna en su noche mágica.',
      iconName: 'Crown'
    },
    {
      id: 'item-3',
      time: '21:30',
      title: 'Vals de las 15 Rosas & Brindis',
      description: 'Emotivo vals con sus seres queridos y brindis real.',
      iconName: 'Heart'
    },
    {
      id: 'item-4',
      time: '22:00',
      title: 'Cena de Gala',
      description: 'Banquete gastronómico y mesa de dulces.',
      iconName: 'Utensils'
    },
    {
      id: 'item-5',
      time: '23:30',
      title: 'Apertura de Pista & Fiesta',
      description: 'Show de luces, DJ en vivo y celebración.',
      iconName: 'Music'
    },
    {
      id: 'item-6',
      time: '02:00',
      title: 'Momento Mágico de Cierre',
      description: 'Cotillón, sorpresas y despedida de una noche inolvidable.',
      iconName: 'PartyPopper'
    }
  ],
  photos: [
    {
      id: 'photo-1',
      url: '/photos/WhatsApp Image 2026-09-10 at 16.40.30.jpeg',
      caption: 'Mis 15 Años Soñados (Con mis globos dorados)',
      category: 'quince',
      isPrimary: true,
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-2',
      url: '/photos/WhatsApp Image 2026-09-10 at 16.44.36.jpeg',
      caption: 'Mirando Hacia el Futuro con Ilusión',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-3',
      url: '/photos/WhatsApp Image 2026-09-10 at 16.47.11.jpeg',
      caption: 'Princesa Junto al Lago y la Fuente',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-4',
      url: '/photos/WhatsApp Image 2026-09-10 at 16.48.13.jpeg',
      caption: 'Deseos de Ensueño y Pastel de 15 Años',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-5',
      url: '/photos/WhatsApp Image 2026-09-10 at 17.41.07.jpeg',
      caption: 'Retrato Real de la Quinceañera',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-6',
      url: '/photos/WhatsApp Image 2026-09-10 at 17.41.46.jpeg',
      caption: 'Sonrisa Encantada Frente a las Aguas',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-7',
      url: '/photos/WhatsApp Image 2026-09-10 at 17.42.13.jpeg',
      caption: 'Tarde Mágica en la Naturaleza',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-8',
      url: '/photos/WhatsApp Image 2026-09-10 at 17.42.37.jpeg',
      caption: 'Caminos de Juventud y Recuerdos',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-9',
      url: '/photos/WhatsApp Image 2026-09-10 at 17.42.55.jpeg',
      caption: 'Mirada Soñadora en el Jardín',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-10',
      url: '/photos/WhatsApp Image 2026-09-10 at 17.44.39.jpeg',
      caption: 'Alcanzando la Cima de Mis Sueños',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-11',
      url: '/photos/WhatsApp Image 2026-09-10 at 17.48.53 (1).jpg',
      caption: 'Mis Primeros Pasos',
      category: 'quince',
      aspectRatio: 'portrait'
    },
    {
      id: 'photo-12',
      url: '/photos/WhatsApp Image 2026-09-10 at 17.48.53.jpg',
      caption: 'Mi Primer Cuento de Hadas',
      category: 'quince',
      aspectRatio: 'portrait'
    }
  ],
  selectedTrackId: 'track-once-upon-a-dream',
  themeStyle: 'rose-gold'
};
