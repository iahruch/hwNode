const net = require('net');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const HOSTNAME = 'localhost';

const server = net.createServer();

const initData = {
    name: 'object',
    first: 'string',
    last: 'string',
    phone: 'string',
    address: 'object',
    zip: 'string',
    city: 'string',
    country: 'string',
    street: 'string',
    email: 'string'
};
const interfaceObj = new Map(Object.entries(initData));

server.on('connection', socket => {
    socket.setEncoding('utf-8');
    console.log('Client is connected :>> ');

    socket.on('data', async data => {
        let isValid = _checkDataType(JSON.parse(data));

        if (!isValid) {
            throw TypeError('Data have invalid data');
        }

        try {
            await _searchData(JSON.parse(data));
        } catch (error) {

        }


    })

    socket.on('end', () => {
        console.log('Client ended :>>');
    });

    socket.on('close', () => {
        console.log('Client closed :>>');
    });

    socket.on('error', error => {
        console.log('Error :>> ', error);
    })
});

const _searchData = async(data) => {

    fs.readFile(path.join(__dirname, 'users.json'), 'utf-8', (error, usersData) => {
        console.log('path.join(__dirname :>> ', path.join(__dirname, 'users.js'));
        console.log('object data :>> ', usersData);
    })
}
const _checkDataType = (data) => {
    let res = true;

    for (const [key, value] of Object.entries(data)) {

        if (interfaceObj.has(key)) {

            if (typeof value === 'object') {

                for (const [key1, value1] of Object.entries(value)) {
                    if (interfaceObj.get(key1) !== typeof value1) {
                        res = false;
                        break;
                    }
                }
            } else {
                if (interfaceObj.get(key) !== typeof value) {
                    res = false;
                    break;
                }
            }
        } else {
            res = false;
            break;
        }
    }
    return res;
}

// name: {
//     first: "Ron",
//     last: "McLaughlin"
// }

server.listen(PORT, HOSTNAME, () => {
    console.log('Server has started :>> ');
});