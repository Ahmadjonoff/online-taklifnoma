export const config = {
  couple: {
    groom: 'Madina Yusupova',
    bride: '',
    monogram: 'MY',
  },
  event: {
    dateISO: '2027-06-25T17:00:00',
    dateLabel: '25.06.2027',
    timeLabel: '17:00',
    kicker: 'Sunnat kechasi',
  },
  petals: {
    enabled: false,
    count: 0,
  },
} as const

export type Config = typeof config
