export class ErrorCatch {
    static catchHandle (fn: { () : any }) {
        try {
            fn();
        }
        catch (e) {
            console.error(e);
        }
    }
}
