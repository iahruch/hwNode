import { pipeline } from "stream";

import { Ui } from "./UI.js";
import { Guardian } from "./Guardian.js";
import { AccountManager } from './AccountManager.js';
import { Logger } from "./Logger.js";

const customers = [{
        name: 'Pitter Black',
        email: 'pblack@email.com',
        password: 'pblack_123',
    }
    // ,{
    //     name: 'Oliver White',
    //     email: 'owhite@email.com',
    //     password: 'owhite_456'
    // }
];
const opt_Ui = {
    objectMode: true
}
const ui = new Ui(customers, opt_Ui);

const opt_transform = {
    writableObjectMode: true,
    readableObjectMode: true,
    decodeStrings: false
}
const guardian = new Guardian(opt_transform);

const logger = new Logger(opt_transform);

const opt_AccountManager = {
    objectMode: true
}
const manager = new AccountManager(opt_AccountManager);

pipeline(
    ui,
    guardian,
    logger,
    manager,
    (error) => {
        console.log('Error pipilene :>> ', error);
    }

)

//ui.pipe(guardian).pipe(manager);