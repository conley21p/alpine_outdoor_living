# Hero photography

Drop hero images here and rebuild — `getHeroPair()` in `src/lib/hero-media.ts`
finds them automatically, no code change required.

    Wide/Hero.jpg        desktop / landscape  (used at md and up)
    Vertical/Hero.jpg    mobile / portrait    (used below md)

Accepted extensions, in priority order: `.webp`, `.jpg`, `.jpeg`, `.png`.
The filename must be exactly `Hero.<ext>`.

Supplying only one of the two is fine — it's used for both orientations, but it
will crop on the other one.

Until a file exists here, the hero renders the illustrated fallback at
`public/hero/accessible-bathroom.svg`.

## Optional: WebP variants

If you add a `Hero.webp` next to `Hero.jpg`, the page serves the smaller WebP to
browsers that support it and preloads it. The build only emits those `<source>`
tags when the `.webp` actually exists, so a missing sibling can never produce a
broken image.
