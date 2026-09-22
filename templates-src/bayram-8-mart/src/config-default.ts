export const config = {
  couple: {
    groom: '',
    bride: 'Nilufar',
    monogram: 'N',
  },
  event: {
    dateISO: '2027-06-20T15:00:00',
    dateLabel: '20.06.2027',
    timeLabel: '15:00',
    kicker: '8-mart',
  },
  petals: {
    enabled: true,
    count: 10,
  },
} as const

export type Config = typeof config
