import { IConstraintVertex } from "../../gs/interface";
import { ConstraintType, PrimitivesType } from "../../gs/config";

export type NDataType = {
    id : string,
    params: number[],
    key: number,
}

export type EquationData = {
    equation: any,
    ids: string[],
    type: ConstraintType,
    keys?: number[],
}

export class DataCollecation {
    private _paramsData : NDataType[] = [];
    private _equationData : EquationData[] = [];
    private _vertices : Set<IConstraintVertex> = new Set();

    constructor (vertices?: IConstraintVertex[]) {
        vertices && this.__init(vertices);
    }

    get size () : number {
        let size = 0;

        for (let i = this._paramsData.length; i--;) {
            size += this._paramsData[i].params.length;
        }

        return size;
    }

    get datas () : NDataType[] {
        return this._paramsData;
    }

    get paramsX () : number[] {
        const result : number[] = [];

        for (let i = 0; i < this._paramsData.length; i++) {
            Array.prototype.push.apply(result, this._paramsData[i].params);
        }
        return result;
    }

    get vertices () : IConstraintVertex[] {
        return Array.from(this._vertices);
    }

    get paramsData () : NDataType[] {
        return Array.from(this._paramsData);
    }

    get equationData () : EquationData[] {
        return Array.from(this._equationData);
    }

    private __init (vertices: IConstraintVertex[]) {
        for (const vertex of vertices) {
            this.__addParam(vertex);
        }
    }

    private __addParam (vertex: IConstraintVertex) {
        if (vertex.type === PrimitivesType.LINE) {
            const [p1, p2] = vertex.struct;
            this.addToCollect(p1);
            this.addToCollect(p2);
            return;
        }

        if (vertex.type === PrimitivesType.CIRCLE) {
            const [center] = vertex.struct;
            this.addToCollect(center);
        }

        const temps : number[] = [];

        Array.prototype.push.apply(temps, vertex.data.x?.map(p => p.v) || []);
        Array.prototype.push.apply(temps, vertex.data.r?.map(p => p.v) || []);
        Array.prototype.push.apply(temps, vertex.data.a?.map(p => p.v) || []);

        const data = {
            id: vertex.id,
            params: temps,
            key: this.size,
        };
        this._paramsData.push(data);
    }

    private __getData (id: string) {
        return this._paramsData.find(v => v.id === id);
    }

    getMinFx () {
        return (x: number[]) => {
            let result = 0;
            for (const data of this._equationData) {
                const keys : number[] = [];
                const temps = data.ids.map((id : string) => this.__getData(id)) as NDataType[];

                if (data.keys) {
                    const temp = temps[0];
                    const tempKes = [];
                    for (const k of data.keys) {
                        tempKes.push(temp.key + k);
                    }
                    Array.prototype.push.apply(keys, tempKes);
                }
                else if (data.type === ConstraintType.V_RING) {
                    const [t1, t2] = temps;
                    Array.prototype.push.apply(keys, [t1.key, t2.key]);
                }
                else if (data.type === ConstraintType.H_RING) {
                    const [t1, t2] = temps;
                    Array.prototype.push.apply(keys, [t1.key + 1, t2.key + 1]);
                }
                else if (data.type === ConstraintType.CIRCLE_CIRCLE_EQUAL) {
                    const [, t1,, t2] = temps;
                    Array.prototype.push.apply(keys, [t1.key, t2.key]);
                }
                else {
                    for (const temp of temps) {
                        const ks = Array.from(new Array(temp?.params.length), (_, i) => i + temp?.key);
                        Array.prototype.push.apply(keys, ks);
                    }
                }

                const ps = keys.map(k => x[k]);
                result += data.equation(ps);
            }
            return result;
        };
    }

    addToCollect (v1: IConstraintVertex) {
        if (!this._vertices.has(v1)) {
            this._vertices.add(v1);
            this.__addParam(v1);
        }
    }

    addEquationData (data: EquationData) {
        this._equationData.push(data);
    }
}
