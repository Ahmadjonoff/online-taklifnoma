export const config = {
  couple: {
    groom: 'Aziz va Dilnoza',
    bride: '',
    monogram: 'A&D',
  },
  event: {
    dateISO: '2027-05-15T19:30:00',
    dateLabel: '15.05.2027',
    timeLabel: '19:30',
    kicker: 'Tug\'ilgan kun',
  },
  petals: {
    enabled: false,
    count: 0,
  },
} as const

export type Config = typeof config
