// const { Socket } = require('net');
import { Socket } from 'net';
const client = new Socket();

const filter = {
    name: {
        first: "ro",
        //     last: "Schaefer"
    },
    phone: "615",
    // address: {
    //     zip: '74516'
    // },
    // email: "gmail.com"

};

client.connect(8080, () => {
    console.log('Client  conneted to server :>> ');

    setTimeout(() => {
        client.write(JSON.stringify(filter));
    }, 500)
})

client.on('data', data => {
    console.log(JSON.parse(data));

});

client.on('close', () => {
    console.log('Connection closed!');
});