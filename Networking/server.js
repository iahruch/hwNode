import net from 'net';
import * as path from 'path';
import { access, readFile } from 'fs/promises';
import { constants } from 'fs';
import { json } from 'stream/consumers';



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
            const resultSearch = await _searchData(JSON.parse(data));
            socket.write(JSON.stringify(resultSearch));
        } catch (error) {
            throw TypeError('Something wrong');
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

const _searchData = async(searchData) => {
    let usersData = [];
    let filterArr = [];
    try {
        await access(path.resolve('users.json'), constants.F_OK);
        console.log('can access');
    } catch (error) {
        throw Error('File don\'t exist or can\'t be read');
    }

    try {
        usersData = await readFile(path.resolve('users.json'), { encoding: 'utf-8' });
        //  console.log('object usersData :>> ', JSON.parse(usersData));

        filterArr = JSON.parse(usersData).filter(elem => {
            let map = new Map(Object.entries(elem));

            const resultArr = [];
            for (const [key, value] of Object.entries(searchData)) {

                if (map.has(key) && typeof value !== 'object') {

                    let regexp = new RegExp(value, "gi");
                    resultArr.push(regexp.test(map.get(key)));

                } else if (map.has(key) && typeof value === 'object') {

                    const valueMap = new Map(Object.entries(map.get(key)));

                    for (const [keyNest, valueNest] of Object.entries(value)) {
                        if (valueMap.has(keyNest)) {
                            let regexp = new RegExp(valueNest, "gi");
                            resultArr.push(regexp.test(valueMap.get(keyNest)));
                        }
                    }
                }
            } //end for

            let isSearch = resultArr.every(i => i === true);
            return isSearch ? true : false;
        });
    } catch (error) {
        throw Error('File can\'t be read');
    }
    return filterArr;
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


server.listen(PORT, HOSTNAME, () => {
    console.log('Server has started :>> ');
});