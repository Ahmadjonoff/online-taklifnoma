export const config = {
  couple: {
    groom: 'Bobur',
    bride: 'Shahlo',
    monogram: 'B&Sh',
  },
  event: {
    dateISO: '2027-08-30T10:00:00',
    dateLabel: '30.08.2027',
    timeLabel: '10:00',
    kicker: 'Yubiley',
  },
  petals: {
    enabled: true,
    count: 14,
  },
} as const

export type Config = typeof config
