'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

class EventListener {
    constructor(student, action, through = 1, several = Infinity) {
        this.student = student;
        this.action = action;
        this.through = through;
        this.several = several;
        this.count = 0;
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = new Map();

    function addListener(event, listener) {
        if (!events.has(event)) {
            events.set(event, []);
        }
        events.get(event).push(listener);
    }

    function deleteListeners(event, listener) {
        for (let key of events.keys()) {
            if (key.startsWith(event + '.') || key === event) {
                deleteAll(key, events.get(key), listener);
            }
        }
    }

    function deleteAll(event, listeners, listener) {
        let newListeners = [];
        for (let l of listeners) {
            if (l.student !== listener.student) {
                newListeners.push(l);
            }
        }
        events.set(event, newListeners);
    }

    function commitEvent(event) {
        let dotEvent = event + '.';
        let keys = [];
        for (let e of events.keys()) {
            if (e + '.' === dotEvent || dotEvent.startsWith(e + '.')) {
                keys.push(e);
            }
        }
        for (let e of keys.sort().reverse()) {
            callAll(events.get(e));
        }
    }

    function callAll(listeners) {
        for (let e of listeners) {
            if (e.several > e.count && e.count % e.through === 0) {
                e.action.call(e.student);
            }
            e.count++;
        }
    }

    return {

        on: function (event, context, handler) {
            let listener = new EventListener(context, handler);
            addListener(event, listener);

            return this;
        },

        off: function (event, context) {
            let listener = new EventListener(context);
            deleteListeners(event, listener);

            return this;
        },

        emit: function (event) {
            commitEvent(event);

            return this;
        },

        several: function (event, context, handler, times) {
            let listener = new EventListener(context, handler, 1, times <= 0 ? Infinity : times);
            addListener(event, listener);

            return this;
        },

        through: function (event, context, handler, frequency) {
            let listener = new EventListener(context, handler,
                frequency <= 0 ? 1 : frequency, Infinity);
            addListener(event, listener);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
