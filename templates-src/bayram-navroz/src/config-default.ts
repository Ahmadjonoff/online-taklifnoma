export const config = {
  couple: {
    groom: 'Karimovlar oilasi',
    bride: '',
    monogram: 'K',
  },
  event: {
    dateISO: '2027-06-12T13:00:00',
    dateLabel: '12.06.2027',
    timeLabel: '13:00',
    kicker: 'Navro\'z muborak',
  },
  petals: {
    enabled: true,
    count: 8,
  },
} as const

export type Config = typeof config
