class TimersManager {
    constructor() {
        this.timers = [];
        this.idsTimer = {};
        this.logs = [];
    }

    add(obj, ...args) {
        this._isValidObj(obj);
        obj._log = this._log.bind(this);
        let t = {...obj, args}
        this.timers.push(t);
        return this;
    }

    start() {
       this.timers.forEach(  timer => {
           if(timer.interval) {
               let id = setInterval(timer._log, timer.delay, timer);
               this.idsTimer[timer.name] = id;
           }else {
               let id = setTimeout(timer.log, timer.delay, timer);
               this.idsTimer[timer.name] = id;
           }
       })
    }


    stop() {
        Object.values(this.idsTimer).forEach( idTimer => {
           this._stopTimer(idTimer);
        })
        this.timers = [];
        this.idsTimer = {};
        //console.log(this.logs);
    }

    pause(timerId) {
        this._stopTimer(this.idsTimer[timerId]);
    }

    resume(obj) {
        this.add(obj);
        this.start();
    }

    print() {
       console.log(this.logs);
    }

    _log(timer) {
        const out = timer.job(...timer.args);
        const created = new Date();
        const logObject = { name: timer.name, in: timer.args, out, created };
        this.logs.push(logObject);
    }
    _stopTimer(id) {
        if(id.repeat) {
            clearInterval(id);
        }else {
            clearTimeout(id);
        }
    }
    _isValidObj({name, delay, interval, job}) {
        if(!name && typeof name !== "string") {
            throw new Error("Timer's name is incorrect");
        }
        if(!delay && typeof delay !== "number" || !(delay > 0 && delay < 5000)) {
            throw new Error("Type delay is incorrect");
        }

        if(!interval && typeof interval !== "boolean") {
            throw new Error("Type interval must be bool");
        }

        if(!job && typeof job !== "function") {
            throw new Error("Job must be a function");
        }
    }
}
const manager = new TimersManager();

const t1 = {
    name: 't1',
    delay: 1000,
    interval: true,
    job: () => { console.log('t1') }
};
const t2 = {
    name: 't2',
    delay: 1000,
    interval: true,
    job: (a, b) => (a + b)
};

//manager.add(t1);
manager.add(t2, 1, 2);
manager.start()

setTimeout(() => {
    manager.stop();
    manager.print();
},4000);

// setTimeout( () => {manager.pause('t1');},2000);
// setTimeout( () => {manager.resume(t1)},10000);
// setTimeout(() => {manager.stop()},15000)
//
