import { Ui } from "./UI.js";
import { Guardian } from "./Guardian.js";
import { AccountManager } from './AccountManager.js';
import { pipeline } from "stream";

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

const opt_Guardian = {
    writableObjectMode: true,
    readableObjectMode: true,
    decodeStrings: false
}
const guardian = new Guardian(opt_Guardian);

const opt_AccountManager = {
    objectMode: true
}
const manager = new AccountManager(opt_AccountManager);

pipeline(
    ui,
    guardian,
    manager,
    (error) => {
        console.log('Error pipilene :>> ', error);
    }

)

//ui.pipe(guardian).pipe(manager);