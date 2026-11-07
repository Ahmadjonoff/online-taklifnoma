/**
 * Scroll xoreografiyasi sozlamasi — shablonning `config.motion` maydoni.
 *
 * Taklifnoma ochilgandan keyin mehmon pastga aylantirganda:
 *   - orqa fon «sahna»lari almashadi (tus + bezak: yulduzlar, nur, arkalar…)
 *   - bo'limlar turli effekt bilan kirib keladi (`fx`)
 *   - chiqib ketayotgan bo'lim yengil 3D buklanadi (`fold`)
 *   - fonda zarrachalar uchadi, scroll tezligiga qarab chuqurlik bilan siljiydi
 *
 * Barcha ranglar palitradagi CSS o'zgaruvchilardan olinadi — mijoz tanlagan
 * rang fon sahnalariga ham avtomatik tushadi.
 */

/** Fon sahnasining tusi — `--color-paper` ga qaysi rang aralashtiriladi. */
export type SceneTone = 'paper' | 'gold' | 'wine' | 'blush' | 'sage' | 'deep'

/** Fon bezagi (CSS va SVG maska bilan chiziladi, rasm fayl yo'q). */
export type BackdropArt = 'stars' | 'rays' | 'arches' | 'girih' | 'bokeh' | 'moon' | 'none'

export type MotionScene = {
  /**
   * Sahna shu bo'limdan boshlanadi. Bir nechta kalit berilsa — birinchisi
   * (mijoz ba'zi bo'limlarni o'chirib qo'ygan bo'lishi mumkin). Hech biri
   * bo'lmasa, sahna o'tkazib yuboriladi.
   */
  from: string | string[]
  tone: SceneTone
  art?: BackdropArt
}

/** Bo'lim ichidagi `Reveal` elementlari qanday kirib keladi. */
export type SectionFx = 'rise' | 'zoom' | 'tilt' | 'blur' | 'slide' | 'mask' | 'flip'

/** Fon sahnalari orasidagi o'tish. */
export type SceneTransition = 'fade' | 'iris' | 'wipe' | 'sweep'

export type Particles = 'petals' | 'dust' | 'lanterns' | 'stars' | 'none'

export type MotionConfig = {
  transition: SceneTransition
  scenes: MotionScene[]
  /** Bo'lim kaliti → kirish effekti. Berilmagani — `rise`. */
  fx?: Record<string, SectionFx>
  particles?: Particles
  /** Chiqib ketayotgan bo'lim orqaga buklanadi (3D varaq effekti). */
  fold?: boolean
}
