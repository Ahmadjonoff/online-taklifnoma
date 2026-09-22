export const config = {
  couple: {
    groom: 'Digital Summit 2027',
    bride: '',
    monogram: 'DS',
  },
  event: {
    dateISO: '2027-05-20T09:00:00',
    dateLabel: '20.05.2027',
    timeLabel: '09:00',
    kicker: 'Texnologiya sammiti',
  },
  petals: {
    enabled: false,
    count: 0,
  },
} as const

export type Config = typeof config
