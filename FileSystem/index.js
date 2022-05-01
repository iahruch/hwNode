import path from 'path';
import EventEmitter from 'stream';
import { access, readFile, writeFile } from 'fs/promises';
import { constants } from 'fs';
import { EOL } from 'os';

export class Json2csv extends EventEmitter {
    constructor(filePath, opts = {}) {
        super(opts);
        this.filePath = filePath;
        this.initListeners();
    }

    initListeners() {
        this.on('error', (error) => {
            console.error("Error >> ", error);
        })
    }

    async create() {
        console.log('object :>> ', this.filePath);

        try {
            await access(this.filePath, constants.F_OK | constants.R_OK);
            console.log('Can access');
        } catch {
            throw Error('File does not exist or file cannot be read');
        }


        let isHeaders = true;
        let delimiter = ';';
        let csvStr = '';

        try {
            const fileData = await readFile(this.filePath, { encoding: 'utf-8' });
            const data = JSON.parse(fileData);

            data.forEach(obj => {
                let tempStr = '';

                if (isHeaders) {
                    Object.keys(obj).forEach(key => {
                        csvStr = csvStr + key + delimiter;
                    })
                    csvStr = csvStr.slice(0, csvStr.length - 1) + EOL;
                    isHeaders = false;
                }

                Object.entries(obj).forEach(([key, val]) => {
                    tempStr = tempStr + JSON.stringify(val) + delimiter;
                })

                csvStr = csvStr + tempStr.slice(0, tempStr.length - 1) + EOL;
            })

        } catch (error) {
            throw Error('File has not been read');
        }
        try {
            await writeFile(path.resolve('comments.csv'), csvStr);
            console.log('Fale has been written :>> ');
        } catch (error) {
            throw Error('File has not been written');
        }



    }
}
const json2csv = new Json2csv(path.resolve('comments.json'));
json2csv.create();