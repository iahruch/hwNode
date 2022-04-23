import EventEmitter from "stream";

export class DB extends EventEmitter {
    constructor(options) {
        super();
        this.db = new Set();
        this.initListeners();

    }

    initListeners() {
        this.on('data', this.writeToDb);
    }

    writeToDb(data) {
        console.log('Write to base :>> ', data);
        const newData = {
            source: data['meta'],
            payload: data['payload'],
            created: new Date
        }
        console.log('Write to base new data :>> ', newData)
    }


}

/*
При получении данных Logger должен вызывать событие у DB в результате чего база
будет сохранять у себя информацию о передаваемых данных.
{
 source: String, // откуда пришли данные
 payload: Object, // данные которые передаются
 created: Date // время записи лога в базу
}
*/