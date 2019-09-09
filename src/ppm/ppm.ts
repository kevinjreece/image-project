export class Pixel {
    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number,
    ) {}

    public invert(): Pixel {
        return new Pixel(255 - this.r, 255 - this.g, 255 - this.b);
    }

    public diff(other: Pixel): number {
        return Math.abs(this.r - other.r) +
            Math.abs(this.g - other.g) +
            Math.abs(this.b - other.b);
    }

    public toString(): string {
        return `${this.r} ${this.g} ${this.b}`;
    }

    public equals(other: Pixel): boolean {
        return this.r === other.r &&
            this.g === other.g &&
            this.b === other.b;
    }

    /*
        STATIC FUNCTIONS
    */

    static fromArray(rgb: [number, number, number]): Pixel {
        return new Pixel(rgb[0], rgb[1], rgb[2]);
    }

    static black(): Pixel {
        return new Pixel(0, 0, 0);
    }

    static white(): Pixel {
        return new Pixel(255, 255, 255);
    }
}

export class PPM {
    public type: string;
    public width: number;
    public height: number;
    public maxNum: number;
    public pixels: Pixel[];

    constructor(raw: string) {
        const lines = raw.split(/\r?\n/);
        const filteredLines = lines.filter(line => !line.trim().startsWith('#')).filter(line => !!line);
        const symbols: string[] = [];
        filteredLines.forEach(line => {
            line.match(/\S+/g)!.forEach(str => symbols.push(str));
        });

        if (symbols.length < 7 || (symbols.length - 4) % 3 != 0) {
            console.error('ERROR IN FORMAT');
            console.error('*** number of symbols: ', symbols.length);
            throw new Error('incorrectly formatted PPM content');
        }
        this.type = symbols[0];
        this.width = +symbols[1];
        this.height = +symbols[2];
        this.maxNum = +symbols[3];
        this.pixels = [];

        for (let i = 4; i < symbols.length; i += 3) {
            this.pixels.push(Pixel.fromArray(symbols.slice(i, i + 3).map(a => +a) as [number, number, number]));
        }
    }

    public getPixelByCoord(x: number, y: number): Pixel {
        const p = this.pixels[y * this.width + x];
        if (!p) {
            console.error('error getting pixel for x,y:', x, y);
        }
        return p;
    }

    public forEachPixel(func: (p: Pixel, x: number, y: number, i: number) => void): void {
        this.pixels.forEach((p, i) => {
            func(p, i % this.width, Math.floor(i / this.height), i);
        });
    }

    public toString(): string {
        return this.type + '\n' +
            this.width + ' ' + this.height + '\n' +
            this.maxNum + '\n' +
            this.pixels.map(p => p.toString()).join(' ') + '\n';
    }

    public duplicate(): PPM {
        return new PPM(this.toString());
    }
}