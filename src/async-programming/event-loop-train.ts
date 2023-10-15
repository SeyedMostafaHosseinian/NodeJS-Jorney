console.log('\n-----event-loop-train file is running-------\n');

/**
 * guess order of running following callbacks:
 * see following links
 * @see {@link https://www.builder.io/blog/visual-guide-to-nodejs-event-loop}
 * @see {@link https://www.red-gate.com/simple-talk/development/javascript/microtask-queues-in-node-js-event-loop/#:~:text=Microtask}
 **/

//micro task - Promise Queue
Promise.resolve('').then(() => {
    console.log('callback run in Promise')
})
//micro task - nextTickQueue
process.nextTick(() => {
    console.log('callback run in process.nextTick()')
})
//macro task - check queue
setImmediate(() => {
    console.log('callback run into setImmediate');
})
//macro task - timer queue
setTimeout(() => {
    console.log('callback run into setTimeout');
}, 0)
