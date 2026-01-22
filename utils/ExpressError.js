class ExpressError extends Eror {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    } 
}

module.exports = ExpressError;