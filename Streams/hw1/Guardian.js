import { Transform } from 'stream';

export class Guardian extends Transform {
    constructor(options = {}){
        super(options);
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
        this.on('data', (chunk) => {
            //console.log('data :>> ', this.data);
            console.log('Event data transform stream');
        })

        this.on('error', (err) => {
            console.log('error :>> ', err.message);
        })

        this.on('close', () => {
            console.log('\n------ Transform on close'); //2
        });
        this.on('finish', () => {
            console.log('\n------ Transform on finish'); //1
        });
        
    }


    _transform(chunk, encoding, done) {
           done(null, chunk);
        //    this.push(new Chunk(chunk));
        //    done();
    }
}
