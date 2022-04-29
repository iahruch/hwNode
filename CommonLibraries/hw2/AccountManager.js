import { Writable } from 'stream';
import { scrypt, createDecipheriv, createVerify } from 'crypto';
import { readFile } from 'fs/promises';
import path from 'path';


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
        try {
            let isVerify = await this._isModify(chunk);
            if (isVerify) {
                let { name, email, password } = chunk['payload'];
                const payload = {
                    name,
                    email: await this._decryptData(email),
                    password: await this._decryptData(password)
                }

                console.log('------ writable');
                console.log(payload);
                console.log('------ writable');

            } else {
                throw Error(Error('Object modified'));

            }
        } catch (error) {
            throw Error(error);
        }

        done();
    }

    async _isModify(chunk) {
        const { meta: { signature }, payload } = chunk;
        const verify = createVerify('SHA256');
        verify.update(JSON.stringify(payload));
        verify.end();
        let publicKey = '';
        try {
            publicKey = await readFile(path.resolve('csr', 'serve-cert.pem'));
        } catch (error) {
            throw Error(error);
        }
        return verify.verify(publicKey, signature, 'hex'); // true 
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