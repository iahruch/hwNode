class TimersManager {
    constructor() {
        this.timers = [];
        this.idsTimer = {};
    }

    add(obj, ...args) {
        this._isValidObj(obj);
        this.timers.push({...obj, args});
        return this;
    }

    start() {
       this.timers.forEach( ({name, delay, interval, job, args }) => {
           if(interval) {
              let id = setInterval(job, delay, ...args);
              this.idsTimer[name] = id;
           }else {
               let id = setTimeout(job, delay, ...args);
               this.idsTimer[name] = id;
           }
       })
    }

    stop() {
        Object.values(this.idsTimer).forEach( idTimer => {
           this._stopTimer(idTimer);
        })
        this.timers = [];
        this.idsTimer = {};

    }

    pause(timerId) {
        console.log(timerId);
        this._stopTimer(this.idsTimer[timerId]);
    }

    resume(obj) {
        this.add(obj);
        this.start();
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
    delay: 3000,
    interval: false,
    job: (a, b) => { console.log("t2 = ", a + b)}
};

manager.add(t1);
manager.add(t2, 1, 2);
manager.start()
//manager.showVal();
setTimeout(() => {manager.stop()},6000)
setTimeout( () => {manager.pause('t1');},2000);
setTimeout( () => {manager.resume(t1)},10000);
setTimeout(() => {manager.stop()},15000)

