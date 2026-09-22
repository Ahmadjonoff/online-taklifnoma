export const config = {
  couple: {
    groom: '',
    bride: 'Kichkintoyimiz',
    monogram: '✨',
  },
  event: {
    dateISO: '2027-05-08T15:00:00',
    dateLabel: '08.05.2027',
    timeLabel: '15:00',
    kicker: 'Sunnat bayrami',
  },
  petals: {
    enabled: true,
    count: 8,
  },
} as const

export type Config = typeof config
