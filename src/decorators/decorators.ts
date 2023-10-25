console.log('\n-----decorators file is running-------\n');

//class decorator
function StoreBorn() {
    return function <T extends { new(...args: any[]): {} }>(ctr: T) {
        return class extends ctr {
            _createdAt = new Date().toUTCString()

            constructor(...args: any[]) {
                super(...args);
                console.log(`Class [${ctr.name}] is instantiated in [${this._createdAt}]`)
            }
        }
    }
}


function propertyDecorator() {
    return function (target?: any, propertyKey?: string) {
        console.log('----------property decorator-----')
        console.log(target)
        console.log(propertyKey)
    }
}

function parameterDecorator() {
    console.log('----------parameter decorator-----')
    return function (target?: any, propertyKey?: string, parameterIndex?: number) {
        console.log(target)
        console.log(propertyKey)
    }
}

function methodDecorator(replaceDecoratorFunction: boolean) {
    console.log('------method decorator-------')
    return function (target?: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
        console.log('------method decorator----target:', target);
        console.log('------method decorator----propertyKey:', propertyKey);
        console.log('------method decorator----descriptor:', descriptor);

        if (descriptor && replaceDecoratorFunction) {
            descriptor.value = () => console.log('hello i am new function structure')
            descriptor.value();
        }
    }
}

@StoreBorn()
class Car {
    @propertyDecorator()
    speed: number;

    constructor(speedArg: number) {
        this.speed = speedArg;
    }

    @methodDecorator(true)
    log(@parameterDecorator() mes: string) {
        console.log('hello from log function')
    }
}


const myCar = new Car( 200);
myCar.log('g');