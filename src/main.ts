import * as fs from 'fs';
import {PPM, Pixel} from './ppm/ppm';

function readFiles(dirname: string, fileType: string, onFileContent: (filename: string, content: string) => void, onError: (error: NodeJS.ErrnoException) => void) {
    fs.readdir(dirname, (err, filenames) => {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(filename => {
            if (filename.endsWith(fileType)) {
                console.log(`reading file: ${filename}`)
                fs.readFile(dirname + filename, 'utf-8', function (err, content) {
                    if (err) {
                        onError(err);
                        return;
                    }
                    onFileContent(filename, content);
                });
            }
        });
    });
}

var data: {[id: string]: string} = {};
readFiles('inputs/', '.ppm', function (filename, content) {
    data[filename] = content;
    const ppm = new PPM(content);

    const simplified = simplifyImage(ppm);
    fs.writeFile('outputs/simplified_' + filename, simplified.toString(), (err: NodeJS.ErrnoException | null) => {
        if (!!err) {
            console.error('error writing to file: ', err);
        }
    });
}, function (err) {
    throw err;
});

function invertImage(original: PPM): PPM {
    const inverted = original.duplicate();

    original.forEachPixel((p, x, y, i) => {
        inverted.pixels[i] = p.invert();
    });

    return inverted;
}

function greyscaleImage(original: PPM): PPM {
    const newImage = original.duplicate();

    original.forEachPixel((p, x, y, i) => {
        const avg = Math.floor((p.r + p.g + p.b) / 3);
        newImage.pixels[i] = new Pixel(avg, avg, avg);
    });

    return newImage;
}

function simplifyImage(original: PPM, spread: number = 1, limit: number = 100): PPM {
    const tracedImage = original.duplicate();
    const w = original.width;
    const h = original.height;

    original.forEachPixel((p, x, y, i) => {
        if (x < spread || x >= w - spread || y < spread || y >= h - spread) {
            tracedImage.pixels[i] = Pixel.black();
        } else {
            const u = original.getPixelByCoord(x, y - spread);
            const d = original.getPixelByCoord(x, y + spread);
            const l = original.getPixelByCoord(x - spread, y);
            const r = original.getPixelByCoord(x + spread, y);
            const ul = original.getPixelByCoord(x - spread, y - spread);
            const ur = original.getPixelByCoord(x + spread, y - spread);
            const dl = original.getPixelByCoord(x - spread, y + spread);
            const dr = original.getPixelByCoord(x + spread, y + spread);

            if (u.diff(d) > limit || l.diff(r) > limit || ul.diff(dr) > limit || ur.diff(dl) > limit) {
                tracedImage.pixels[i] = Pixel.black();
            } else {
                tracedImage.pixels[i] = Pixel.white();
            }
        }
    });

    const coloredImage = tracedImage.duplicate();

    coloredImage.forEachPixel((p, x, y, i) => {
        if (!p.equals(Pixel.white())) {
            return;
        }
        console.log('coloring pixel: ', x, ', ', y);
        const section = coloredImage.getPixelsInSection(x, y);
        section.forEach(([pX, pY]: [number, number]) => {
            let pixel = original.getPixelByCoord(x, y);
            pixel = pixel.equals(Pixel.white()) ? new Pixel(1, 1, 1) : pixel;
            coloredImage.setPixelByCoord(pX, pY, pixel.duplicate());
        });
    });

    return coloredImage;
}