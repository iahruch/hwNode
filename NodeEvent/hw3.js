
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
        this.on('withdraw', this.withdraw);
        this.on('send', this.transferMoney);
        this.on('changeLimit', this.changeLimit);
    }

    replenishClienAccount(clientId, amount) {
        let isId = this._isClientIdEmpty(clientId, TypeError('Replenishment failed. Client Id is empty'));
        if (isId) {
            return;
        }

        if (amount <= 0) {
            this.emit('error', TypeError('Amount must be more than 0'))
        }

        const clientData = this._getClientData(clientId);
        clientData['balance'] += amount;

    }

    getClientBalance(clientId, func) {
        let isId = this._isClientIdEmpty(clientId, TypeError('Replenishment failed. Client Id is empty'));
        if (isId) {
            return;
        }

        const clientData = this._getClientData(clientId);
        if (!clientData) {
            this.emit('error', TypeError('Client not found'));
            return;
        }
        func(clientData['balance']);
    }

    changeLimit(clientId, func) {
        let isId = this._isClientIdEmpty(clientId, TypeError('Withdraw failed. Client Id is empty'));
        if (isId) {
            return false;
        } 

        const data = this._getClientData(clientId);
        if (!data) {
            this.emit('error', TypeError('Client not found'));
            return false;
        }

        data['limit'] = func;

    }

    withdraw(clientId, sum) {
        let isId = this._isClientIdEmpty(clientId, TypeError('Withdraw failed. Client Id is empty'));
        if (isId) {
            return false;
        }

        const clientData = this._getClientData(clientId);
        if (!clientData) {
            this.emit('error', TypeError('Client not found'));
            return false;
        }

        if(!this._checkLimit(clientData, sum)){
            this.emit('error', TypeError('Limit is exceeded!!!'));
            return;
        }


        if (clientData['balance'] < sum || sum <= 0) {
            this.emit('error', TypeError('Not enough money to withdraw or the sum cannot be equal zero or less'));
            return false;
        } else {
            clientData['balance'] -= sum;
            return true;
        }

    }

    _checkLimit(clientData, amount) {

        let currentBalance = clientData['balance'];
        let updatedBalance = clientData['balance'] - amount;

        let res = clientData['limit'](amount, currentBalance, updatedBalance);
        return res;
    }

    transferMoney(clienIdSent, clientIdGet, sum) {
        if (this.withdraw(clienIdSent, sum)) {
            this.replenishClienAccount(clientIdGet, sum)
        }
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

    _isClientIdEmpty(id, errorMsg) {
        if (!id) {
            this.emit('error', errorMsg);
            return true;
        }
        return false;
    }

}

const bank = new Bank();

const personFirstId = bank.register({
    name: 'Pitter',
    balance: 801,
    limit: amount => { return amount < 10 }
});

//bank.emit('withdraw', personFirstId, 9);

bank.emit('changeLimit', personFirstId, (amount, currentBalance,
    updatedBalance) => {
    return amount < 100 && updatedBalance > 700;
});


bank.emit('changeLimit', personFirstId, (amount, currentBalance,
    updatedBalance) => {
     return amount < 100 && updatedBalance > 700 && currentBalance > 800;
    });

bank.emit('withdraw', personFirstId, 99);

bank.emit('get', personFirstId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});
