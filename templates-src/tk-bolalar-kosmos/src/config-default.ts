export const config = {
  couple: {
    groom: '',
    bride: 'Amira',
    monogram: '1',
  },
  event: {
    dateISO: '2027-03-02T15:00:00',
    dateLabel: '02.03.2027',
    timeLabel: '15:00',
    kicker: 'Kosmik yosh',
  },
  petals: {
    enabled: true,
    count: 10,
  },
} as const

export type Config = typeof config
