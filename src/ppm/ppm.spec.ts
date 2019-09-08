import { PPM } from "./ppm";

describe('PPM', () => {
    it('parsing works', () => {
        const ppmString = 'p3\n1 1\n256\n0 0 0 1 1 1';
        const ppm = new PPM(ppmString);
        expect(ppm.toString()).toBe(ppmString);
    });
});