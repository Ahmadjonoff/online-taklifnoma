export const config = {
  couple: {
    groom: 'Muhammad Ismoil',
    bride: '',
    monogram: '☪',
  },
  event: {
    dateISO: '2027-09-05T17:00:00',
    dateLabel: '05.09.2027',
    timeLabel: '17:00',
    kicker: 'Bayram muborak',
  },
  petals: {
    enabled: true,
    count: 14,
  },
} as const

export type Config = typeof config
