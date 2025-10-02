export abstract class CustomError extends Error {
    abstract readonly statusCode: number;
    abstract readonly type: string;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
        this.name = this.name.constructor.name
    }

    abstract serializeErrors(): {
        message: string;
        field?: string
    }[];
}