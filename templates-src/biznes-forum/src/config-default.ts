export const config = {
  couple: {
    groom: 'Tech Forum 2027',
    bride: '',
    monogram: 'TF',
  },
  event: {
    dateISO: '2027-04-15T10:00:00',
    dateLabel: '15.04.2027',
    timeLabel: '10:00',
    kicker: 'Biznes konferensiya',
  },
  petals: {
    enabled: false,
    count: 0,
  },
} as const

export type Config = typeof config
