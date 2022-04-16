


class Bank {
    constructor() {

        this.personsData = new Map();
    }

    async register(person) {
        const { randomUUID } = await import('crypto');
        let isPerson = this._checkPeson(person);

        if (isPerson) {
            console.log(`Person with name ${person.name} already exist`);
            return;
        }

        this.personsData.set(randomUUID(), new Map(Object.entries(person)));
        this._showData();
    }


    _checkPeson(person) {
        let response = false;
        // for (let obj of this.personsData.values()) {
        //     console.log('1', obj);
        //     if (obj.get("name") === person.name) {
        //         return true;
        //     }
        // }
        this.personsData.forEach((valueObj, key, map) => {
            if (valueObj.get("name") === person.name) {
                response = true;
             }
        });
        return response;
    }

    _showData() {
        console.log('perosonsData :>> ', this.personsData);
    }


}

const bank = new Bank();



const personId = bank.register({
    name: 'Pitter',
    balance: 100
});
const personId1 = bank.register({
    name: 'Pitter J',
    balance: 101
});

// bank.emit('add', personId, 20);

// bank.emit('get', personId, (balance) => {
//     console.log(`I have ${balance}₴`); // I have 120₴
// });

// bank.emit('withdraw', personId, 50);

// bank.emit('get', personId, (balance) => {
//     console.log(`I have ${balance}₴`); // I have 70₴
// })