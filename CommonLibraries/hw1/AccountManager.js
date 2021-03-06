import { Writable } from 'stream';
import { scrypt, createDecipheriv } from 'crypto';

const algorithm = 'aes192';
const passwordData = '1qaZxsw2@3edcVfr4';

export class AccountManager extends Writable {
    constructor(opts) {
        super(opts);

        this.initListeners();
    }

    initListeners() {
        this.on('drain', () => {
            //  console.log('\n------ writable on drain');
        });

        this.on('error', error => {
            console.log('ERROR: Writable stream ', error.message);
        });

        // this.on('finish', () => {
        //     //  console.log('\n------ writable on finish');
        // });
        // this.on('close', () => {
        //     //  console.log('\n------ writable on close');
        // });
    }

    async _write(chunk, encoding, done) {

        let { email, password } = chunk['payload'];

        const payload = {
            email: await this._decryptData(email),
            password: await this._decryptData(password)
        }
        const newChunk = {...chunk, payload };

        console.log('------ writable');
        console.log(newChunk);
        console.log('------ writable');
        done();
    }


    _decryptData(email) {

        return new Promise((resolve, reject) => {
            scrypt(passwordData, 'salt', 24, (error, key) => {
                if (error) reject(error);

                let [iv, data] = email.split(':');

                let ivMod = Buffer.from(iv, 'hex');

                const decipher = createDecipheriv(algorithm, key, ivMod);

                let decrypted = decipher.update(data, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                resolve(JSON.parse(decrypted));
            })
        })
    }

}