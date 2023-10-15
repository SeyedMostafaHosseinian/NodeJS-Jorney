console.log('\n-----event-emitter file is running-------\n');

import EventEmitter from 'events';

const event = new EventEmitter();

//listener
function increaseListener(...values: []) {
    console.log('increaseListener', 'value:', values)
};

//listener
function increaseListenerOnce(...values: []) {
    console.log('increaseListener fort Once Time', 'value:', values)
};

//listening on increase event
event.on('increase', increaseListener)
//listening on increase event for once time
event.once('increase', increaseListenerOnce)

setInterval(() => {
//emitting
    event.emit('increase', Math.random()* 10, 12, 14, 15, 18, 20);
}, 50)

//removing a listener
setTimeout(() => {
    event.off('increase', increaseListener)
}, 5000);
//or removing by removeListener function
// setTimeout(() => {
//     event.removeListener('increase', increaseListener)
// }, 1000)
