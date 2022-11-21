/** ------------------ 自定义模块 ------------------ */

import { CGManager } from '../index';
import { IConstraintEdge, IConstraintVertex } from '../interface';
import { PrimitivesFreeDegree, PrimitivesType, ConstraintStateEnum } from '../config';
import { PValue } from '../common';

/** ------------------ 分割线 ------------------ */

export type SketchData = {
    x?: PValue[],
    r?: PValue[],
    a?: PValue[],
}

export type CVertexParams = {
    id : string,
    order: number,
    type : PrimitivesType,
    sType : PrimitivesType,
    data: SketchData,
    cgm : CGManager,
}

/**
 * 约束图顶点类
 */
export class ConstraintVertex implements IConstraintVertex {
    // 唯一id
    private _id : string;
    // 序号
    private _order : number;
    // 顶点类型
    private _type : PrimitivesType;
    // 结构图元类型
    private _sType : PrimitivesType;
    // 结构图元数据
    private _struct : IConstraintVertex[] = [];
    // 自由度
    private _dof : number;
    // 约束状态
    private _state : ConstraintStateEnum = ConstraintStateEnum.UNDER;
    // 入边
    private _intoA : Set<IConstraintEdge> = new Set();
    // 出边
    private _outA : Set<IConstraintEdge> = new Set();
    // 环
    private _ringA : Set<IConstraintEdge> = new Set();
    // 数据
    private _data : SketchData;

    /**
     * 约束图管理对象
     */
    public cgm : CGManager;

    constructor (params: CVertexParams) {
        this._id = params.id;
        this._order = params.order;
        this._type = params.type;
        this._sType = params.sType || PrimitivesType.UNKNOWN;
        this._dof = PrimitivesFreeDegree[this._type];
        this._data = params.data;
        this.cgm = params.cgm;
    }

    get id () : string {
        return this._id;
    }

    get order () : number {
        return this._order;
    }

    get type () : PrimitivesType {
        return this._type;
    }

    get struct () : IConstraintVertex[] {
        return this._struct;
    }

    set struct (vertices: IConstraintVertex[]) {
        this._struct = vertices;
    }

    get sType () : PrimitivesType {
        return this._sType;
    }

    set sType (type: PrimitivesType) {
        this._sType = type;
    }

    get dof () : number {
        return this._dof;
    }

    get state () : ConstraintStateEnum {
        return this._state;
    }

    set state (s: ConstraintStateEnum) {
        this._state = s;
    }

    get intoA () : Set<IConstraintEdge> {
        return this._intoA;
    }

    set intoA (data: Set<IConstraintEdge>) {
        this._intoA = data;
    }

    get outA () : Set<IConstraintEdge> {
        return this._outA;
    }

    set outA (data: Set<IConstraintEdge>) {
        this._outA = data;
    }

    get ringA () : Set<IConstraintEdge> {
        return this._ringA;
    }

    set ringA (data: Set<IConstraintEdge>) {
        this._ringA = data;
    }

    get data () : SketchData {
        return this._data;
    }

    set data (data: SketchData) {
        this._data = data;
    }

    /**
     * 添加环
     * @param edge 约束
     */
    addRingA (edge: IConstraintEdge) {
        this._ringA.add(edge);
    }

    /**
     * 删除环
     * @param edge 约束
     */
    deleteRing (edge: IConstraintEdge) {
        this._ringA.delete(edge);
    }

    /**
     * 添加入边
     * @param edge 约束
     */
    addIntoA (edge: IConstraintEdge) {
        this._intoA.add(edge);
    }

    /**
     * 添加出边
     * @param edge 约束
     */
    addOutA (edge: IConstraintEdge) {
        this._outA.add(edge);
    }

    /**
     * 删除边
     * @param edge 约束
     */
    deleteA (edge: IConstraintEdge) {
        this._intoA.delete(edge);
        this._outA.delete(edge);
    }

    /** 更新数据 */
    updateData (params: number[]) {
        if (this._type === PrimitivesType.POINT) {
            const x = this._data.x as PValue[];
            x[0].v = params[0];
            x[1].v = params[1];
        }
        else if (this._type === PrimitivesType.CIRCLE) {
            const r = this._data.r as PValue[];
            r[0].v = params[0];
        }
    }
}
