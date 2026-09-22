export const config = {
  couple: {
    groom: '',
    bride: 'Zulfiya',
    monogram: '✨',
  },
  event: {
    dateISO: '2027-07-12T16:00:00',
    dateLabel: '12.07.2027',
    timeLabel: '16:00',
    kicker: 'Beshik to\'yi',
  },
  petals: {
    enabled: true,
    count: 12,
  },
} as const;

export type Config = typeof config;
