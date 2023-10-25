console.log('\n-----decorators file is running-------\n');
import 'reflect-metadata';

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

const metadataKey = 'required-12';

// function addToRequiredLists(uniqueName: string) {
//     console.log('addToRequiredLists');
//     return function (target?: any, propertyKey?: string, parameterIndex?: number) {
//         const listOfRequireds = Reflect.getMetadata(metadataKey, target) || [];
//         listOfRequireds.push(uniqueName)
//         Reflect.defineMetadata(metadataKey, listOfRequireds, target, propertyKey as string);
//     }
//
// }
//
// function validate() {
//     return function (target?: any, propertyKey?: string) {
//         const listOfRequireds = Reflect.getOwnMetadata(metadataKey, target, propertyKey as string);
//         console.log(listOfRequireds);
//     }
// }


const requiredMetadataKey = Symbol('required');
const globalTarget = {};
const globalPropertyKey = 'GLOBAL_PROPERTY_KEY';

export function required() {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        console.log('propertyKey:', propertyKey)
        let requiredParameters: number[] = Reflect.getMetadata(requiredMetadataKey, target, propertyKey) || [];
        requiredParameters.push(parameterIndex);
        Reflect.defineMetadata(requiredMetadataKey, requiredParameters, target, propertyKey);
    }
}

export function validate() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let method = descriptor.value!;
        descriptor.value = function () {
            let requiredParameters: number[] = Reflect.getMetadata(requiredMetadataKey, target, propertyKey);
            console.log(requiredParameters)
            if (requiredParameters) {
                for (let parameterIndex of requiredParameters) {
                    if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                        throw new Error("Missing required argument.");
                    }
                }
            }
            return method.apply(this, arguments);
        };
    }
}

@StoreBorn()
class Car {
    @propertyDecorator()
    speed: number;

    constructor(speedArg: number) {
        this.speed = speedArg;
    }

    @validate()
    log(@required() arg1?: string, @required() arg2?: number) {
        console.log('hello from log function')
    }

    @validate()
    log2(@required() arg1?: string, @required() arg2?: number) {
        console.log('hello from log2 function')
    }
}


const myCar = new Car(200);
myCar.log('g', 12);
myCar.log2('g', 10);