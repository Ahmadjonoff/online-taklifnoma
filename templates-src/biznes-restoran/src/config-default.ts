export const config = {
  couple: {
    groom: 'Osh Vokzal',
    bride: '',
    monogram: 'OV',
  },
  event: {
    dateISO: '2027-04-05T12:00:00',
    dateLabel: '05.04.2027',
    timeLabel: '12:00',
    kicker: 'Restoran ochilishi',
  },
  petals: {
    enabled: false,
    count: 0,
  },
} as const

export type Config = typeof config
