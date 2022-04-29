import { Readable } from 'stream';


export class Ui extends Readable {
    constructor(opts, data) {
        super(opts);
        this.data = data;

        this.initObj = {
            name: String,
            email: String,
            password: String
        }
        this.initMap = new Map(Object.entries(this.initObj));

        this.initListeners();
    }
    initListeners() {
        this.on('data', chunk => {
            console.log('------ readable');
            console.log('Readable stream :>> ', chunk);
            console.log('------ readable');
        })
        this.on('error', error => {
            console.log('ERROR: Readable stream  :>> ', error.message);
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
                this.destroy(`Properties ${key} is not a property of initial object or property can be a string`);
                isResult = false;
            }
        });
        return isResult;
    }
}