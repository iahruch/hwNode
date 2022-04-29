import { pipeline } from "stream";

import { Ui } from "./Ui.js";
import { Guardian } from "./Guardian.js";
import { AccountManager } from "./AccountManager.js";

const customers = [{
        name: 'Pitter Black',
        email: 'pblack@email.com',
        password: 'pblack_123'
    }
    // ,
    // {
    //     name: 'Oliver White',
    //     email: 'owhite@email.com',
    //     password: 'owhite_456'
    // }
];

const opts_r = {
    objectMode: true
}
const ui = new Ui(opts_r, customers);

const opt_t = {
    writableObjectMode: true,
    readableObjectMode: true,
    decodeStrings: false
}
const guardian = new Guardian(opt_t);

const opts_w = {
    objectMode: true
};
const manager = new AccountManager(opts_w);

pipeline(
    ui,
    guardian,
    manager,
    error => {
        console.log('Error: pipeline :>> ', error);
    }
)