import { PPM } from "./ppm";

const ppmString = 'p3\n1 1\n256\n0 0 0 1 1 1';

describe('PPM', () => {
    it('parsing works', () => {
        const ppm = new PPM(ppmString);
        expect(ppm.toString()).toBe(ppmString);
    });

    it('duplication works', () => {
        const ppm = new PPM(ppmString);
        const other = ppm.duplicate();
        expect(ppm.toString()).toBe(other.toString());
    });
});