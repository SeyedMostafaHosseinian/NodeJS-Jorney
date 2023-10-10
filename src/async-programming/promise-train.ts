console.log('\n-----promise-train file is running-------\n');

/** START example for simple promise **/
const promiseGetProducts = new Promise((resolve, reject) => {
    /** simulating an request **/
    setTimeout(() => {
        resolve(['product-1', 'product-2', 'product-3'])
    }, 3000)
})

const promiseGetBlogs = new Promise((resolve, reject) => {
    /** simulating an request **/
    setTimeout(() => {
        reject('error in get blogs')
    }, 3000)
})

promiseGetProducts
    .then(data => console.log('Products:', data))
    .catch(err => console.log(err))
promiseGetBlogs
    .then(data => console.log('Blogs:', data))
    .catch(err => console.log(err))

async function getPromiseDataByAsync(promise: Promise<any>) {
    try {
        const data = await promise;
        console.log('try block is run and resolve value is: ', data)
    } catch (err) {
        console.log('catch block is run and rejected value is: ', err)
    }
}

getPromiseDataByAsync(promiseGetBlogs);
getPromiseDataByAsync(promiseGetProducts);


/** END example for simple promise **/


/** START example for Promise.all() **/
const getUserName: Promise<any> = new Promise((resolve) => setTimeout(() => {
        resolve('mostafa')
    }, 2000)
);
const getUserAge: Promise<any> = new Promise((resolve) => setTimeout(() => {
        resolve(20)
    }, 2000)
);
const getUserJob: Promise<any> = new Promise((resolve) => setTimeout(() => {
        resolve('programmer')
    }, 2000)
);

async function getMultiplePromise() {
    const data = await Promise.all([getUserName, getUserJob, getUserAge])
    console.log('get multiple resolve promise data by Promise.all() data is: ', data)
}

getMultiplePromise()
/** END example for Promise.all() **/
