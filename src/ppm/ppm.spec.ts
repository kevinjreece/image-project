import { PPM, Pixel } from "./ppm";

const simplePPM = 'p3\n1 1\n256\n0 0 0 1 1 1\n';

describe('PPM', () => {
    it('can be constructed from a raw ppm string', () => {
        const ppm = new PPM(simplePPM);
        expect(ppm.toString()).toBe(simplePPM);
    });

    it('can be created from another PPM', () => {
        const ppm = new PPM(simplePPM);
        const other = ppm.duplicate();
        expect(ppm.toString()).toBe(other.toString());
    });

    it('can foreach over every pixel in a square image', () => {
        const ppm = new PPM(realPPM);
        const w = ppm.width;
        let targetX = 0;
        let targetY = 0;
        let targetI = 0;
        ppm.forEachPixel((p, x, y, i) => {
            expect(p).toBe(ppm.pixels[y * w + x], 'iterating over pixels in the wrong order');
            expect(x).toBe(targetX, 'x calculation is wrong');
            expect(y).toBe(targetY, 'y calculation is wrong');
            expect(i).toBe(targetI, 'i calculation is wrong');
            targetI++;
            if (++targetX === w) {
                targetX = 0;
                targetY++;
            }
        });
    });

    it('can foreach over every pixel in a rectangle image', () => {
        const ppm = new PPM(rectanglePPM);
        const w = ppm.width;
        let targetX = 0;
        let targetY = 0;
        let targetI = 0;
        ppm.forEachPixel((p, x, y, i) => {
            expect(p).toBe(ppm.pixels[y * w + x], 'iterating over pixels in the wrong order');
            expect(x).toBe(targetX, 'x calculation is wrong');
            expect(y).toBe(targetY, 'y calculation is wrong');
            expect(i).toBe(targetI, 'i calculation is wrong');
            targetI++;
            if (++targetX === w) {
                targetX = 0;
                targetY++;
            }
        });
    });

    it('can find all pixels in section', () => {
        const ppm = new PPM(checkeredPPM);
        const actualTopLeft = ppm.getPixelsInSection(0, 0, Pixel.black());
        const expectedTopLeft: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
        checkSection(expectedTopLeft, actualTopLeft);
        const actualTopRight = ppm.getPixelsInSection(2, 0, Pixel.white());
        const expectedTopRight: [number, number][] = [[2, 0], [3, 0], [2, 1], [3, 1]];
        checkSection(expectedTopRight, actualTopRight);
        const actualBottomLeft = ppm.getPixelsInSection(0, 2, Pixel.black());
        const expectedBottomLeft: [number, number][] = [[0, 2], [1, 2], [0, 3], [1, 3]];
        checkSection(expectedBottomLeft, actualBottomLeft);
        const actualBottomRight = ppm.getPixelsInSection(2, 2, Pixel.white());
        const expectedBottomRight: [number, number][] = [[2, 2], [3, 2], [2, 3], [3, 3]];
        checkSection(expectedBottomRight, actualBottomRight);
    });
});

function checkSection(expected: [number, number][], actual: [number, number][]) {
    expected.forEach(([expectedX, expectedY]) => {
        let found = false;
        for (let [x, y] of actual) {
            if (x == expectedX && y == expectedY) {
                found = true;
            }
        }
        expect(found).toBe(true, `(${expectedX}, ${expectedY}) not found in section with (${expected[0][0]}, ${expected[0][1]})`);
    });
}

const rectanglePPM = `
    P3
    4 3
    255
    1 2 3 4 5 6 7 8 9 10 11 12
    13 14 15 16 17 18 29 20 21 22 23 24
    25 26 27 28 29 30 31 32 33 34 35 36
`;

const checkeredPPM = `
    P3
    4 4
    255
    255 255 255 255 255 255 0 0 0 0 0 0
    255 255 255 255 255 255 0 0 0 0 0 0
    0 0 0 0 0 0 255 255 255 255 255 255
    0 0 0 0 0 0 255 255 255 255 255 255
`;

const realPPM = `
    P3
    #File source: https://www.ssbwiki.com/File:Cloud_SSBU.png
    12 12
    255
    0 0 0 0 0 0 0 0 0 239 219 183 239 222 174 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 158 156 159 
    207 207 207 0 0 0 0 0 0 0 0 0 218 199 145 234 219 163 237 217 186 0 0 0 0 0 0 
    162 159 164 149 146 150 179 178 179 245 245 244 0 0 0 0 0 0 208 154 194 
    215 193 141 194 169 125 140 135 138 151 144 162 148 144 149 131 130 133 
    114 115 115 228 228 225 0 0 0 0 0 0 0 0 0 0 0 0 179 147 128 91 83 85 122 114 103 
    116 115 118 89 88 91 68 69 70 178 177 174 236 234 231 0 0 0 0 0 0 0 0 0 0 0 0 
    196 163 136 87 73 66 112 100 92 57 59 61 95 97 97 194 194 192 231 230 229 
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 125 120 119 53 57 58 46 49 51 134 134 130 
    208 205 200 235 233 231 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 101 96 123 93 82 84 
    62 59 58 127 123 125 174 169 164 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 124 116 149 
    82 79 101 43 40 48 66 69 71 69 68 84 98 94 120 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
    0 0 0 75 72 92 44 44 55 53 51 65 0 0 0 43 43 52 63 62 78 87 82 108 0 0 0 0 0 0 
    0 0 0 0 0 0 0 0 0 50 50 61 42 42 49 83 78 86 0 0 0 42 44 49 51 51 63 88 87 87 
    175 169 172 0 0 0 0 0 0 0 0 0 0 0 0 80 75 80 68 66 68 53 52 52 0 0 0 0 0 0 
    44 44 41 79 73 77 97 88 94 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
    0 0 0 0 0 0 79 70 77 95 90 94 0 0 0 0 0 0 0 0 0 
`;

`
xxoo
xxoo
ooxx
ooxx
`
