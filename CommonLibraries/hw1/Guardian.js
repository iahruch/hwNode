import { Transform } from "stream";
import { scrypt, randomFill, createCipheriv } from 'crypto';
import { promisify } from 'util';


const algorithm = 'aes192';
const password = '1qaZxsw2@3edcVfr4';

export class Guardian extends Transform {
    constructor(opts) {
        super(opts);
        this.initListeners();
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


    initListeners() {
        this.on('data', (chunk) => {
            console.log('------ transform');
            console.log('Event data transform stream', chunk);
            console.log('------ transform');
        })

        this.on('error', (error) => {
            console.log('ERROR: Transfor stream :>> ', error.message);
        })

        // this.on('close', () => {
        //     // console.log('\n------ Transform on close'); //2
        // });
        // this.on('finish', () => {
        //     // console.log('\n------ Transform on finish'); //1
        // });
    }

    async _transform(chunk, encoding, done) {
        console.log('Transfor stream Guardian (_transfor) :>> ');
        let { name, email, password, source } = chunk;

        const newChunk = {
            meta: { source },
            payload: {
                name,
                email: await this._encryptData(email),
                password: await this._encryptData(password)
            }
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

}