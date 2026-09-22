import type { Skin } from '@core/lib/skin'
import { Schedule } from '@core/taklif/sections'

/** Kun tartibi — umumiy `Schedule` bo'limi (naqshli variant). */
export function Timeline(skin: Skin) {
  return Schedule(skin, { variant: 'ornate' })
}
