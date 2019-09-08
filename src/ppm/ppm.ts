class Pixel {
    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number,
    ) {}

    public toString(): string {
        return `${this.r} ${this.g} ${this.b}`;
    }

    public equals(other: Pixel): boolean {
        return this.r === other.r &&
            this.g === other.g &&
            this.b === other.b;
    }

    static fromArray(rgb: [number, number, number]): Pixel {
        return new Pixel(rgb[0], rgb[1], rgb[2]);
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
        const symbols = ([] as string[]).concat(...filteredLines.map(line => line.match(/\S+/g)!));

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

    public forEachPixel(func: (p: Pixel, x: number, y: number) => void): void {
        this.pixels.forEach((p, i) => {
            func(p, i % this.width, Math.floor(i / this.height));
        });
    }

    public toString(): string {
        return this.type + '\n' +
            this.width + ' ' + this.height + '\n' +
            this.maxNum + '\n' +
            this.pixels.map(p => p.toString()).join(' ');
    }

    public duplicate(): PPM {
        return new PPM(this.toString());
    }
}