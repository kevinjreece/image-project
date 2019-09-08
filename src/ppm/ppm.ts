class Pixel {
    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number,
    ) {}

    public toString(): string {
        return `${this.r} ${this.g} ${this.b}`;
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
        const filteredLines = lines.filter(line => !line.startsWith('#'));
        const symbols = ([] as string[]).concat(...filteredLines.map(line => line.match(/\S+/g)!));

        if (symbols.length < 7 || (symbols.length - 4) % 3 != 0) {
            // throw new Error('incorrectly formatted PPM content');
            console.log('error in format: ');
            console.log('number of symbols: ', symbols.length);
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