export const config = {
  couple: {
    groom: 'Rustam',
    bride: '',
    monogram: '50',
  },
  event: {
    dateISO: '2027-05-18T19:00:00',
    dateLabel: '18.05.2027',
    timeLabel: '19:00',
    kicker: 'Yubiley',
  },
  petals: {
    enabled: true,
    count: 10,
  },
} as const

export type Config = typeof config
