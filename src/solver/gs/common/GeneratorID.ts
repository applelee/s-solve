/**
 * id生成器
 */

/** ------------------ 分割线 ------------------ */

export class GeneratorID {
    private _id : number;

    constructor (count?: number) {
        this._id = count || 1;
    }

    get id () : number {
        return this._id;
    }

    set id (count: number) {
        this._id = count;
    }

    ceateID () : number {
        const temp = this._id;
        this._id += 1;
        return temp;
    }

    resetID (count?: number) {
        this._id = count || 1;
    }
}
