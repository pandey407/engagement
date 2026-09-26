// Painted ornaments cut from the theme sheet (transparent WebP, 2x). See src/assets/theme.
const files = import.meta.glob<string>('../assets/theme/*.webp', { eager: true, import: 'default' })

export type ArtName =
  | 'blossom-branch' | 'blossom-sprig' | 'border' | 'border-tile' | 'clouds' | 'corner-left' | 'corner-right'
  | 'crest-lotus' | 'divider-lotus' | 'diya' | 'drop-1' | 'drop-2' | 'frame-maroon' | 'frame-pink'
  | 'ganesh-gold' | 'ganesh-maroon' | 'ganesh-medallion' | 'garland-blossom' | 'garland-lotus'
  | 'garland-swag' | 'lantern-1' | 'lantern-2' | 'lotus-bloom' | 'lotus-bouquet' | 'lotus-bud'
  | 'lotus-pond' | 'lotus-small' | 'mandala' | 'paisley' | 'paisley-small' | 'tile'

export const art = (name: ArtName) => files[`../assets/theme/${name}.webp`]
