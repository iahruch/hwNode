import { Writable } from 'stream';


export class AccountManager extends Writable {
    constructor(options = {}) {
        super(options);
        this.init();
    }

    init() {
        this.on('drain', () => {
            //  console.log('\n------ writable on drain');
        });

        this.on('error', error => {
            console.log('\n------ writable on error', error);
        });

        this.on('finish', () => {
            //  console.log('\n------ writable on finish');
        });
        this.on('close', () => {
            //  console.log('\n------ writable on close');
        });
    }

    _write(chunk, encoding, done) {
        //  console.log(typeof chunk);
        console.log('------ writable');
        console.log(chunk['payload']);
        console.log('------ writable');
        done();
    }


}