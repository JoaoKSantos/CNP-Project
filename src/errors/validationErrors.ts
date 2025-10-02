import { CustomError } from "./CustomError.js";

export class validaErrors extends CustomError {
    readonly statusCode = 400;
    readonly type = 'validaErrors';

    constructor(public errors: {message: string; field: string}[]) {
        super('Erro da validação de dados da requisição')

        Object.setPrototypeOf(this, validaErrors.prototype)
    }

    serializeErrors() {
        return this.errors.map(err => {
            return {
                message: err.message,
                field: err.field
            }
        })
    }
}