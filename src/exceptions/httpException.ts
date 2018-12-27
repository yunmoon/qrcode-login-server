class BaseError extends Error{
    constructor (public statusCode: number, public message: string) {
        super(message)
        Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export class HttpRequestError extends BaseError{
    constructor(public message: string){
        super(400, message)
    }

}

export class HttpNotFoundError extends BaseError{
    constructor(public message: string){
        super(404, message)
    }
}

export class HttpServerError extends BaseError{
    constructor(public message: string){
        super(500, message)
    }
}
