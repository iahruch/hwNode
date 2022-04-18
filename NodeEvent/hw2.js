
import { randomUUID } from 'crypto'
import EventEmitter from 'events';

class Bank extends EventEmitter {
    constructor() {
        super();
        this.personsData = new Map();
        this.initListeners();
    }

    initListeners() {
        this.on("add", this.replenishClienAccount);
        this.on('error', this.handleError);
        this.on('get', this.getClientBalance);
        this.on('withdraw', this.withdraw)
    }

    replenishClienAccount(clientId, amount) {
        if (!clientId) {
            this.emit('error', TypeError('Replenishment failed. Client Id is empty'))
        }

        if (amount <= 0) {
            this.emit('error', TypeError('Amount must be more than 0'))
        }

        const clientData = this._getClientData(clientId);
        clientData['balance'] += amount;

    }

    getClientBalance(clientId, func) {
        if (!clientId) {
            this.emit('error', TypeError('Replenishment failed. Client Id is empty'));
            return;
        }
        
        const clientData = this._getClientData(clientId);
        if(!clientData) {
            this.emit('error', TypeError('Client not found'));
            return;
        }
        func(clientData['balance']);
    }

    withdraw(clientId, sum) {
        if (!clientId) {
            this.emit('error', TypeError('Replenishment failed. Client Id is empty'));
            return;
        }

        const clientData = this._getClientData(clientId);
        if(!clientData) {
            this.emit('error', TypeError('Client not found'));
            return;
        }
        
        if( clientData['balance'] < sum || sum <=0) {
            this.emit('error', TypeError('Not enough money to withdraw or the sum cannot be equal zero or less'));
            return;
        }
        clientData['balance'] -=sum;

    }

    register(person) {
        let isPerson = this._checkPeson(person);

        if (isPerson) {
            console.log(`Person with name ${person.name} already exist`);
            return;
        }

        let personalId = randomUUID();
        this.personsData.set(personalId, person);
        //this._showData();
        return personalId;
    }

    handleError(error) {
        console.log('Error :>> ', error.message);
    }

    _checkPeson(person) {
        let response = false;
        // for (let obj of this.personsData.values()) {
        //     if (obj.get("name") === person.name) {
        //         return true;
        //     }
        // }
        this.personsData.forEach((valueObj, key, map) => {
            if (valueObj["name"] === person.name) {
                response = true;
            }
        });
        return response;
    }

    _getClientData(id) {
        const clientData = this.personsData.get(id);
        return clientData;
    }

}

const bank = new Bank();

const personId = bank.register({
    name: 'Pitter',
    balance: 100
});
//console.log('personId :>> ', personId);

bank.emit('add', personId, 50);

bank.emit('get', personId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});

bank.emit('withdraw', personId, 10);

bank.emit('get', personId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});
