/**
 * Created by Administrador on 18/04/2017.
 */
export function MethodDecorator(target: Object, // The prototype of the class
                                propertyKey: string, // The name of the method
                                descriptor: TypedPropertyDescriptor<any>) {
    console.log("MethodDecorator called on: ", target, propertyKey, descriptor);
}


