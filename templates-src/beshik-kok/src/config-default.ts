export const config = {
  couple: {
    groom: 'Amirbek',
    bride: '',
    monogram: '7',
  },
  event: {
    dateISO: '2027-04-10T15:00:00',
    dateLabel: '10.04.2027',
    timeLabel: '15:00',
    kicker: 'Beshik to\'yi',
  },
  petals: {
    enabled: true,
    count: 20,
  },
} as const

export type Config = typeof config
