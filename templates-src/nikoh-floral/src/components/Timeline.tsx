import type { Skin } from '@core/lib/skin'
import { Schedule } from '@core/taklif/sections'

/** Kun tartibi — umumiy `Schedule` bo'limi (yumshoq, tekis variant). */
export function Timeline(skin: Skin) {
  return Schedule(skin, { variant: 'plain' })
}
