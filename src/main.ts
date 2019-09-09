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

    const greyscale = greyscaleImage(ppm);
    fs.writeFile('outputs/simple_' + filename, greyscale.toString(), (err: NodeJS.ErrnoException | null) => {
        if (!!err) {
            console.error('error writing to file: ', err);
        }
    });

    const inverted = invertImage(ppm);
    fs.writeFile('outputs/inverted_' + filename, inverted.toString(), (err: NodeJS.ErrnoException | null) => {
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

function greyscaleImage(original: PPM, spread: number = 5, limit: number = 50): PPM {
    const newImage = original.duplicate();

    original.forEachPixel((p, x, y, i) => {
        const avg = Math.floor((p.r + p.g + p.b) / 3);
        newImage.pixels[i] = new Pixel(avg, avg, avg);
    });

    return newImage;
}

// function simplifyImage(original: PPM, spread: number = 5, limit: number = 50): PPM {
// }