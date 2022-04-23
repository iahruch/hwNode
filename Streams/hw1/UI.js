import { stringify } from 'querystring';
import { Readable } from 'stream';

export class Ui extends Readable {
    constructor(data, options = {}) {
        super(options);
        this.data = data;

        this.init();

        this.initObj = {
            name: String,
            email: String,
            password: String
        }
        this.initMap = new Map(Object.entries(this.initObj));
    }

    init() {
        this.on('data', chunk => {
            console.log('Readble strem event :>>  data');
        });

        this.on('error', (err) => {
            console.log('Error event Readable stream:>> ', err);
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
            if (this._checkData(data)) {
                this.push({...data, source });
            }
        }
    }

    _checkData(obj) {
        let map = new Map(Object.entries(obj));
        let isResult = true;

        map.forEach((value, key, map) => {
            if (!this.initMap.has(key) || (typeof value !== 'string')) {
                this.destroy(`Properties ${key} is not a property of initial object`);
                isResult = false;
            }
        });
        return isResult;
    }
}

// {
//     name: 'Pitter Black',
//     email: 'pblack@email.com',
//     password: 'pblack_123'
// }