export const config = {
  couple: {
    groom: 'Lumina Beauty Clinic',
    bride: '',
    monogram: 'L',
  },
  event: {
    dateISO: '2027-05-01T11:00:00',
    dateLabel: '01.05.2027',
    timeLabel: '11:00',
    kicker: 'Yubiley',
  },
  petals: {
    enabled: false,
    count: 0,
  },
} as const

export type Config = typeof config
