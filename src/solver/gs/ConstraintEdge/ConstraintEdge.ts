/**
 * 边（约束二元组）
 */

/** ------------------ 自定义模块 ------------------ */

import { CGManager } from '../index';
import { ConstraintType } from '../config';
import { IConstraintEdge, IConstraintVertex } from '../interface';

/** ------------------ 分割线 ------------------ */

export type ConstraintEdgeParams = {
    id : number;
    type : ConstraintType;
    cvs : IConstraintVertex[];
    cgm : CGManager;
    isRely? : RelyType;
    isStruct? : boolean;
}

export enum RelyType {
    // 无依赖
    NONE = 0,
    // 普通依赖
    NORMAL = 1,
    // 标注依赖
    MARK = 2,
    // 结构依赖
    STRUCT = 3,
}

/**
 * 边类
 */
export class ConstraintEdge implements IConstraintEdge {
    // 顶点id
    private _id : number;
    // 约束类型
    private _type : ConstraintType;
    // 起点
    private _target : IConstraintVertex;
    // 终点
    private _match : IConstraintVertex;
    // 多元约束图元集合
    private _multiple : IConstraintVertex[] = [];
    // 约束依赖关系
    private _rely : Set<IConstraintEdge> = new Set();
    // 约束附属关系
    private _sub : Set<IConstraintEdge> = new Set();

    /**
     * 依赖类型 0 | 1 | 2 | 3
     * 0 无依赖
     * 1 普通依赖
     * 2 标注依赖
     * 3 结构依赖
     */
    public isRely : RelyType = RelyType.NONE;

    // 是否结构约束
    public isStruct : boolean = false;

    // 约束图管理对象
    public cgm : CGManager;

    constructor (params: ConstraintEdgeParams) {
        this._id = params.id;
        this._type = params.type;
        this._target = params.cvs[0];
        this._match = params.cvs[1];
        this.cgm = params.cgm;
        this.isRely = params.isRely || this.isRely;
        this.isStruct = params.isStruct || this.isStruct;

        this.__init(params.cvs);
    }

    get id () : number {
        return this._id;
    }

    get type () : ConstraintType {
        return this._type;
    }

    get target () : IConstraintVertex {
        return this._target;
    }

    get match () : IConstraintVertex {
        return this._match;
    }

    get multiple () : IConstraintVertex[] {
        return this._multiple;
    }

    set multiple (vertices: IConstraintVertex[]) {
        this._multiple = vertices;
    }

    get rely () : Set<IConstraintEdge> {
        return this._rely;
    }

    set rely (edges: Set<IConstraintEdge>) {
        this._rely = edges;
    }

    get sub () : Set<IConstraintEdge> {
        return this._sub;
    }

    set sub (edges: Set<IConstraintEdge>) {
        this._sub = edges;
    }

    /**
     * @name 初始化
     * @param figures 图形对象数组
     */
    private __init (vertices: IConstraintVertex[]) {
        this._rely = new Set();
        this._sub = new Set();

        /** 设置多元约束集合 */
        if (vertices.length > 2) {
            const vs = vertices.filter((_, i) => i !== 0 && i !== 1);
            this._multiple = vs;
        }

        this.__mountVertex();
    }

    /**
     * 挂载顶点
     */
    private __mountVertex () {
        if (this._target?.id === this._match?.id) {
            /** 一元约束 */
            this.__unaryMatch();
        } else {
            /** 二元约束 */
            this.__binaryMatch();
        }
    }

    /**
     * 一元约束匹配
     */
    private __unaryMatch () {
        this._match?.addRingA(this);
    }

    /**
     * 二元约束匹配
     */
    private __binaryMatch () {
        this._target?.addOutA(this);
        this._match?.addIntoA(this);
    }

    /**
     * 删除依赖约束
     */
    deleteRely (edge: IConstraintEdge) {
        this._rely.delete(edge);
    }

    /**
     * 清空依赖关系
     */
    clearRely () {
        const relies = Array.from(this._rely);

        // 清空依赖关系
        this._rely.clear();

        for (let i = relies.length; i--;) {
            const rs = relies[i];
            rs.deleteSub(this);
        }
    }

    /**
     * 删除从属关系
     * @param { IConstraintEdge } edge 边
     */
    deleteSub (edge: IConstraintEdge) {
        this._sub.delete(edge);
    }

    /**
     * 清空从属关系
     */
    clearSub () {
        this._sub.clear();
    }
}
