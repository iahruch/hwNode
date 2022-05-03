import path from 'path';
import EventEmitter, { pipeline } from 'stream';
import { access } from 'fs/promises';
import { F_OK, R_OK, createReadStream, createWriteStream } from 'fs';
import zlib from 'zlib';


export class Archiver extends EventEmitter {
    constructor(opts = {}) {
        super(opts);

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
            await this._isFileExict(filePath);
        } catch (error) {
            throw error;
        }

        pipeline(
            createReadStream(filePath),
            zlib.createGzip(),
            createWriteStream(filePath + '.zip'),
            (err) => {
                console.log('Error pipeline :>> ', err);
            }
        )
    }

    async unpack(filePath) {
        console.log('Method unpack :>> ');
        try {
            await this._isFileExict(filePath);
        } catch (error) {
            throw error;
        }

        pipeline(
            createReadStream(filePath),
            zlib.createGunzip(),
            createWriteStream(path.resolve('commentsCopy.csv')),
            (err) => {
                console.log('Error pipeline :>> ', err);
            }
        )
    }

    async _isFileExict(filePath) {
        try {
            await access(filePath, F_OK | R_OK);
            return true;
        } catch (error) {
            throw Error("File does't exist");
        }
    }

}
const archiver = new Archiver();
// archiver.create(path.resolve('comments.csv'));
archiver.unpack(path.resolve('comments.csv.zip'));