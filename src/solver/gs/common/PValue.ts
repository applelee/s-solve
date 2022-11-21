export class PValue {
    constructor (private _v: number = 0) {}

    get v () : number { return this._v; }

    set v (v: number) {
        this._v = v;
    }
}
