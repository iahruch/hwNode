import { Readable } from 'stream';

export class Ui extends Readable {
    constructor(data, options = {}){
        super(options);
        this.data = data;
        const {
            objectMode,
            highWaterMark,
            buffer,
            length,
            flowing
        } = this._readableState;

        this.init();
    }

    init() {
        this.on('data', chunk => {
            console.log('\n---');
            console.log(`chunk = ${chunk}` );
            console.log('---\n');
        });

        this.on('error', (err) => {
            console.log('error :>> ', err.message);
        })

        this.on('close', () => {
            console.log('Readable on close event');
        });
    }


    _read() {
        let source = this.constructor.name.toLowerCase();
        
        let data = this.data.shift();
        if (!data) {
            this.push(null);
        } else {
            this.push({...data, source});
        }
    }
}
