import { Transform } from 'stream';
import { DB } from './DB.js';

const base = new DB();

export class Logger extends Transform {
    constructor(options = {}) {
        super(options);

        this.init();
    }

    init() {
        this.on('data', chunk => {
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
        console.log('Transfor stream Logger (_transfor) :>> ');
        base.emit('data', chunk);
        done(null, chunk);
        //    this.push(new Chunk(chunk));
        //    done();
    }

}


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