# image-project

Makes images look hand-traced. Given an image, it finds the edges, outlines them in black, and fills each enclosed region with that region's average color, so the result looks like a digital line drawing with flat color fills.

Written in TypeScript with no image libraries. Images are read and written as plain-text [PPM](https://netpbm.sourceforge.net/doc/ppm.html) files.

## How it works

1. **Edge detection.** For each pixel, compare the pixels on opposite sides of it (up/down, left/right, and both diagonals). If any pair differs by more than a threshold, mark the pixel as an edge.
2. **Region filling.** Flood-fill each non-edge area to find the connected region it belongs to.
3. **Coloring.** Fill each region with the root-mean-square average of the original pixels in it.

The `spread` (how far apart compared pixels are) and `limit` (the edge threshold) parameters in `simplifyImage` control how detailed the tracing is.

## Running it

Requires Node.js.

```sh
npm install
mkdir -p inputs outputs
# put one or more .ppm files in inputs/
make run     # compiles to target/ and processes every file in inputs/
make test    # runs the Jasmine specs for the PPM reader/writer
```

Each `inputs/<name>.ppm` produces `outputs/simplified_<name>.ppm`. Only plain-text PPM (`P3`) is supported. To convert a photo with ImageMagick: `magick photo.jpg -compress none inputs/photo.ppm`, and back with `magick outputs/simplified_photo.ppm result.png`.

## Project layout

```
src/main.ts          # pipeline: edge detection, region fill, coloring
src/ppm/ppm.ts       # PPM parsing, pixel access, flood fill
src/ppm/ppm.spec.ts  # tests
```
