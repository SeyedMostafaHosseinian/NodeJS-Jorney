console.log('\n-----working with files file is running-------\n');

import path from 'path';
import fs from 'fs';

//dirname - The __dirname in a node script returns the path of the folder where the current JavaScript file resides
console.log('__dirname:\n', __dirname);

//filename - The __filename in Node.js returns the filename of the executed code the absolute path of the code file
console.log('__filename:\n', __filename);

//process.cwd - The process.cwd() method returns the current working directory of the Node.js process.
console.log('process.cwd():\n', process.cwd());

/** working with path **/
console.log('basename:', path.basename('d/t/my-script.ts'))
console.log('extname:', path.extname('d/t/my-script.ts'))
console.log('dirname:', path.dirname('d/t/my-script.ts'))
console.log('join:', path.join('d/t/////my-script.ts'))
console.log('parse:', path.parse('d/t/my-script.ts'))
console.log('resolve:', path.resolve('d/t/my-script.ts'))
console.log('relative:', path.relative('d/t/my-script.ts', 'o/'))
console.log('delimiter:', path.delimiter);

/** working with fs **/

/** read a file **/
function readFile() {
    fs.readFile(path.join(process.cwd(), '/src/async-programming/event-emitter.ts'), (err, data) => {
        if (data) {
            console.log('data string', data.toString())
            console.log('data json', data.toJSON())
        } else if (err) {
            console.log('err', err)
        }
    })
}
// readFile()

/** write by stream in a file **/
function writeStreamFun() {
    const writeStream = fs.createWriteStream(path.join(__dirname + '/example.txt'));
    writeStream.write(`hello this a text that writed by file stream -- date ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}\n`)
    writeStream.write(`lorem ipsum that writed by file stream -- date ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}\n`)
    writeStream.end()
}
// writeStreamFun()

/** append text to a file **/
function appendTofile() {
    fs.appendFileSync(
        path.join(__dirname + '/example.txt'),
        'hello this text appended' +
        new Date().getHours() + ':' +
        new Date().getMinutes() + ':' +
        new Date().getSeconds() +
        '--' + Math.random() + '\n'
    );
}
// appendTofile()

/** create an empty file  **/
function createFile() {
    fs.open(path.join(__dirname + '/example.txt' + Math.random() * 1000), 'w', () => {
    });
}
// createFile();

