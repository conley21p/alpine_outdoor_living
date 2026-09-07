# Project media

Drop files in and rebuild — the page picks them up automatically. No code
change is needed, and a section stays hidden while its folder is empty.

## before-after/

Before/after photos, shown in the "Before & After" section.
Accepted: `.webp`, `.jpg`, `.jpeg`, `.png`

Files are ordered by filename, so prefix them to control the order. The
filename also becomes the caption, minus any leading number:

    01-guest-bath.jpg      -> caption "Guest bath"
    02-master-shower.jpg   -> caption "Master shower"
    1.jpg                  -> no caption

## videos/

Walkthrough videos, shown in their own "Project Walkthroughs" section.
Accepted: `.mp4`, `.webm`, `.mov` — `.mp4` (H.264) is the safest for broad
browser support.

An image sharing a video's basename becomes its poster frame:

    01-guest-bath.mp4      the video
    01-guest-bath.jpg      its poster image

Captions work the same way as photos. Videos never autoplay and only preload
metadata, so visitors on phone plans aren't charged for a download they didn't
ask for.

Keep files reasonably small — everything here is served as static assets, so a
100 MB video is a 100 MB download for every visitor who plays it.
