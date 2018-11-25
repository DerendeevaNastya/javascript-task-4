'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

class EventListener {
    constructor(student, action, options = { through: 1, several: Infinity }) {
        this.student = student;
        this.action = action;
        this.through = options.through;
        this.several = options.several;
        this.count = 0;
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = new Map();

    function addListener(event, listener) {
        if (!events.has(event)) {
            events.set(event, []);
        }
        events
            .get(event)
            .push(listener);
    }

    function deleteListeners(event, listener) {
        for (const key of events.keys()) {
            if (key.startsWith(event + '.') || key === event) {
                deleteAll(key, listener);
            }
        }
    }

    function deleteAll(event, listener) {
        let newListeners = events
            .get(event)
            .filter(item => item.student !== listener.student);
        events.set(event, newListeners);
    }

    function commitEvent(event) {
        const dotEvent = event + '.';
        Array.from(events.keys())
            .filter(item => item + '.' === dotEvent || dotEvent.startsWith(item + '.'))
            .sort()
            .reverse()
            .forEach(key => {
                callAll(events.get(key));
            });
    }

    function callAll(listeners) {
        for (const event of listeners) {
            if (event.several > event.count && event.count % event.through === 0) {
                event.action.call(event.student);
            }
            event.count++;
        }
    }

    return {

        on: function (event, context, handler) {
            const listener = new EventListener(context, handler);
            addListener(event, listener);

            return this;
        },

        off: function (event, context) {
            const listener = new EventListener(context);
            deleteListeners(event, listener);

            return this;
        },

        emit: function (event) {
            commitEvent(event);

            return this;
        },

        several: function (event, context, handler, times) {
            const options = { through: 1, several: times <= 0 ? Infinity : times };
            const listener = new EventListener(context, handler, options);
            addListener(event, listener);

            return this;
        },

        through: function (event, context, handler, frequency) {
            const options = { through: frequency <= 0 ? 1 : frequency, several: Infinity };
            const listener = new EventListener(context, handler, options);
            addListener(event, listener);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
