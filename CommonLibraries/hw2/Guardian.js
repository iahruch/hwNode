import { Transform } from "stream";
import { scrypt, randomFill, createCipheriv, createSign } from 'crypto';
import { readFile } from 'fs/promises';
import path from 'path';

const algorithm = 'aes192';
const password = '1qaZxsw2@3edcVfr4';

export class Guardian extends Transform {
    constructor(opts) {
        super(opts);
        this.initListeners();
    }

    initListeners() {
        this.on('data', (chunk) => {
            console.log('------ transform');
            console.log('Event data transform stream', chunk);
            console.log('------ transform');
        })

        this.on('error', (error) => {
            console.log('ERROR: Transfor stream :>> ', error.message);
        })

    }

    async _transform(chunk, encoding, done) {

        let { name, email, password, source } = chunk;

        let newChunk = {
            meta: { source },
            payload: {
                name,
                email: await this._encryptData(email),
                password: await this._encryptData(password)
            }
        };

        try {
            const privateKey = await readFile(path.resolve('csr', 'server-key.pem'));
            const sign = createSign('SHA256');
            sign.update(JSON.stringify(newChunk.payload));
            sign.end();

            const signature = sign.sign(privateKey, 'hex');
            newChunk = {...newChunk, meta: {...newChunk.meta, signature } };

        } catch (error) {
            throw Error(error);
        }

        done(null, newChunk);
    }

    async _encryptData(data) {
        let encrypted = '';

        try {
            const { cipher, iv } = await this.initCiper();
            encrypted = cipher.update(
                JSON.stringify(data),
                'utf8',
                'hex'
            );
            encrypted += cipher.final('hex');
            return iv.toString('hex') + ":" + encrypted;

        } catch (error) {
            throw Error(error);
        }
        return encrypted;
    }

    initCiper() {
        // const key = await promisify(scrypt)(password, 'salt', 24);
        // let iv = await promisify(randomFill)(Buffer.alloc(16), 10);
        // const cipher = createCipheriv(algorithm, key, iv);
        // return cipher;
        return new Promise((resolve, reject) => {
            scrypt(password, 'salt', 24, (error, key) => {
                if (error) reject(error);

                randomFill(Buffer.alloc(16), 10, (err, iv) => {
                    if (err) throw err;
                    const cipher = createCipheriv(algorithm, key, iv);
                    resolve({ cipher, iv });
                })
            })
        })
    };

}