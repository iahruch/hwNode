import path from 'path';
import EventEmitter, { pipeline } from 'stream';
import { access } from 'fs/promises';
import { F_OK, R_OK, createReadStream, createWriteStream } from 'fs';
import zlib from 'zlib';


export class Archiver extends EventEmitter {
    constructor(algorithm, opts = {}) {
        super(opts);
        this.algorithm = algorithm;

        this.accessAlg = new Set(['gzip', 'deflate']);
    }

    initListeners() {
        this.on('error', (error) => {
            console.error("Error >> ", error);
        });
        this.on('close', () => {
            console.log('Stream is closed :>> ');
        })
    }

    async create(filePath) {
        console.log('Method create :>> ');
        try {
            await access(filePath, F_OK | R_OK);
        } catch (error) {
            throw TypeError('File don\'t exist');
        }

        if (!this._isEmptyOptAlgoritm()) {
            throw TypeError('Algorithm is empty');
        }

        const { algorithm } = this.algorithm;

        if (this.accessAlg.has(algorithm)) {

            const methodArch = (/\bgzip\b/.test(algorithm)) ? 'createGzip' : 'createDeflate';

            pipeline(
                createReadStream(filePath),
                zlib[methodArch](),
                createWriteStream(filePath + '.zip'),
                (err) => {
                    console.log('Error pipeline :>> ', err);
                }
            )
        } else {
            throw TypeError('Transferred algorithm is not available for archiving');
        }

    }

    _isEmptyOptAlgoritm() {
        for (let property in this.algorithm) {
            return true;
        }
        return false;
    }


}
const opt_algorithm = {
    algorithm: 'gzip'
}
const archiver = new Archiver(opt_algorithm);
archiver.create(path.resolve('comments.csv'));