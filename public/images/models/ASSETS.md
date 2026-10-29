# Visual Asset Manifest

Tracks the origin and license of every photo used under `public/images/models/`.
Last updated: 2026-10-29.

## Replaced this pass (hero images)

All five were replaced because the originals showed the same amateur "car-spotter"
dealer-lot aesthetic (visible competing dealer signage, other cars, UK/German plates in
a parking lot) — not just the M4 hero that was originally flagged. All replacements are
sourced from Pexels, verified photo-by-photo to depict the correct model, cropped from
their original portrait orientation to a 1920×1200 landscape crop to match this site's
existing `object-fit: cover` usage, and re-encoded as JPEG.

| File | Model shown | Source | License | Notes |
|---|---|---|---|---|
| `m2-hero.jpg` | BMW M2 (G87), red, "M2" badge visible on grille | https://www.pexels.com/photo/red-bmw-m2-on-forest-road-16119692/ | [Pexels License](https://www.pexels.com/license/) — free for commercial use, modification permitted, no attribution required | Cropped to remove a partial sponsor-sticker banner at the top of the original frame |
| `m3-hero.jpg` | BMW M3 (G80), blue, parking garage | https://images.pexels.com/photos/20813211/pexels-photo-20813211.jpeg (captioned "Blue BMW M3 in Istanbul" on Pexels; exact photo-page slug not captured, image ID 20813211 is unambiguous) | Pexels License | — |
| `m4-hero.jpg` | BMW M4 (G82), matte black, "M4" badge + kidney grille visible | https://www.pexels.com/photo/black-m4-cobblestone-driveway-12069928/ | Pexels License | — |
| `m5-hero.jpg` | BMW M5, white, "///M" badge on grille | https://www.pexels.com/photo/white-bmw-m5-16475237/ | Pexels License | Grille proportions (large, dark, vertically merged) are consistent with the current G90 generation vs. the smaller G30-era grille, but Pexels doesn't label generation in its metadata — this is a visual read, not a confirmed spec match |
| `m8-hero.jpg` | BMW M8 Gran Coupe, matte blue/purple wrap | https://www.pexels.com/photo/luxury-bmw-m8-parked-in-modern-urban-garage-29130255/ | Pexels License | Car is in a non-stock wrap color; body and badging confirmed as M8. **Searched again specifically for a stock-color M8** (2026-10-29): found one verified stock-white M8 Gran Coupe — https://images.pexels.com/photos/27525948/pexels-photo-27525948.jpeg (rear 3/4, dusk, Erbil) — but no stock-color front-angle shot exists on Pexels. Kept the wrapped front shot as primary since it matches the dramatic front-end/moody-lighting treatment used for all 4 other models; the stock-color alternative is a flatter-lit rear angle that would break that visual consistency. Swap to the alternative if color-accuracy should outrank cross-card consistency. |

**License summary (verified by fetching pexels.com/license/ directly):** commercial use,
modification, and redistribution-as-part-of-a-larger-work are all permitted; attribution
is appreciated but not required. Restrictions: don't resell unaltered copies as
prints/posters, don't use the images as a trademark/business name, don't imply brand
endorsement. None of this blocks use here.

**Known caveat:** these photos show visible BMW badges/grilles (trademarks owned by BMW
AG). Pexels' own terms don't block this kind of editorial/demonstrative use, and it's
standard practice across these libraries, but it is not the same as a trademark
clearance from BMW. Worth knowing if this project is ever used beyond a personal/demo
site.

## Kept as-is (not replaced this pass)

`m2-interior.jpg`, `m4-interior.jpg`, `m4-engine.jpg`, `m5-detail.jpg` — tight interior
and engine-bay crops where the dealer-lot context isn't visible; judged acceptable
quality already. `m2-rear.jpg`, `m3-front.jpg`, `m3-rear.jpg`, `m5-rear.jpg`,
`m8-rear.jpg`, `m8-side.jpg` and all `overviewImage` uses — lower-visibility slots
(ModelPage's `overviewImage` renders at 25% opacity with a grayscale filter and heavy
gradient fade, so the original photos' background context isn't perceptible there).
Original source/license for these pre-existing files is undocumented — unknown
provenance, flagged here rather than assumed safe.

## Video hero — not used

Researched Pexels and Pixabay for free BMW M-series video footage. Found only three
BMW M3 clips (not M4, which is what the homepage hero needs) with no verified strong
option. Per the brief's explicit fallback instruction, used a strong static image
instead of delaying on an open-ended video search. Revisit if a verified, correctly-
modeled, legally-clear M4 clip is found later.
