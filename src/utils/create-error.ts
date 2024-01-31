export const newError = (message: string) => {
    const err = new Error()
    err.message = message;
    return err;
}
