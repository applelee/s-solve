/** ------------------ 自定义模块 ------------------ */

import { IConstraintVertex } from '../interface';

/** ------------------ 分割线 ------------------ */

type MapType = Map<number, IConstraintVertex>;

export class ConstraintOthers {
    private _map : MapType;

    constructor () {
        this._map = new Map();
    }

    get map () : MapType {
        return this._map;
    }

    clear () {
        this.map.clear();
    }
}
