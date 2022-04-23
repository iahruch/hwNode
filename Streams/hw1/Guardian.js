import { Transform } from 'stream';

export class Guardian extends Transform {
    constructor(options = {}) {
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
            // console.log('Event data transform stream');
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
        let email = this._convertStrToHex(chunk['email']);
        let password = this._convertStrToHex(chunk['password']);
        let modchunk = {
            meta: chunk['source'],
            payload: {email, password}

        }
        done(null, modchunk);
        //    this.push(new Chunk(chunk));
        //    done();
    }

    _convertStrToHex(str) {
        return Buffer.from(str, 'utf8').toString('hex');
    }
    
}


const convert = (from, to) => str => Buffer.from(str, from).toString(to)
const utf8ToHex = convert('utf8', 'hex')
const hexToUtf8 = convert('hex', 'utf8')
// // Было
// {
//     name: 'Pitter Black',
//     email: 'pblack@email.com',
//     password: 'pblack_123'
// }
// // Стало
// {
//     meta: {
//         source: 'ui'
//     },
//     payload: {
//         name: 'Pitter Black',

//         email: '70626c61636b40656d61696c2e636f6d',
//         password: '70626c61636b5f313233'
//     }
// }
