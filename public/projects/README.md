# Project media

Drop files in and rebuild; the page picks them up automatically. No code
change is needed, and a section stays hidden while its folder is empty.

## before-after/

Before/after photos, shown in the "Before & After" section.
Accepted: `.webp`, `.jpg`, `.jpeg`, `.png`

Files are ordered by filename, so prefix them to control the order. The
filename also becomes the caption, minus any leading number:

    01-guest-bath.jpg      -> caption "Guest bath"
    02-master-shower.jpg   -> caption "Master shower"
    1.jpg                  -> no caption

## gallery/

Project photos, shown as a tap-to-enlarge grid in the "Our Work" section.
Accepted: `.webp`, `.jpg`, `.jpeg`, `.png`. Ordering and captions work the
same way as before/after photos, and the caption doubles as the alt text.

Put a smaller copy (about 640px on the long edge) with the same filename in
`gallery/thumbs/` and the grid loads that instead of the full photo. Without
one, the grid falls back to the full-size file.

Phone photos need converting before they go in: browsers other than Safari
can't show `.heic`, and iPhone files are 2 to 4 MB each. Export at about 1600px
on the long edge and strip location data, since these are clients' homes.

## videos/

Walkthrough videos, shown under the photos in the "Our Work" section.
Accepted: `.mp4`, `.webm`, `.mov`. `.mp4` (H.264) is the safest for broad
browser support.

An image sharing a video's basename becomes its poster frame:

    01-guest-bath.mp4      the video
    01-guest-bath.jpg      its poster image

Captions work the same way as photos. Videos never autoplay and only preload
metadata, so visitors on phone plans aren't charged for a download they didn't
ask for.

Keep files reasonably small. Everything here is served as static assets, so a
100 MB video is a 100 MB download for every visitor who plays it.
