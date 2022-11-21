/** ------------------ 自定义模块 ------------------ */

import { ConstraintVertices, ConstraintEdges, ConstraintOthers } from './ConstraintGraphic';
import { ConstraintType, PrimitivesType, UnaryConstraint } from './config';
import { IConstraintVertex } from './interface';
import { ConstraintEdge } from './ConstraintEdge';
import { GeneratorID } from './common';

import { NumericalSolution } from '../ns';
import { CGUtil } from '@/app';
import { ConstraintVertex, CVertexParams } from './ConstraintVertex';

/** ------------------ 分割线 ------------------ */

export class CGManager {
    private _ConstraintVertices : ConstraintVertices;
    private _ConstraintEdges : ConstraintEdges;
    private _ConstraintOthers : ConstraintOthers;
    private _GeneratorID : GeneratorID;

    constructor (public cgUtil : CGUtil) {
        this._ConstraintVertices = new ConstraintVertices();
        this._ConstraintEdges = new ConstraintEdges();
        this._ConstraintOthers = new ConstraintOthers();
        this._GeneratorID = new GeneratorID();
    }

    get ConstraintVertices () : ConstraintVertices {
        return this._ConstraintVertices;
    }

    get ConstraintEdges () : ConstraintEdges {
        return this._ConstraintEdges;
    }

    get ConstraintOthers () : ConstraintOthers {
        return this._ConstraintOthers;
    }

    get GeneratorID () : GeneratorID {
        return this._GeneratorID;
    }

    /**
     * 约束重复校验
     * @param type 约束类型
     * @param vertices 约束图顶点数据
     */
    private __repeatVerification (type: ConstraintType, vertices: IConstraintVertex[]) : boolean {
        const id0 = vertices[0].id;
        const id1 = vertices[1].id;

        for (const [, ce] of this._ConstraintEdges.map) {
            const tId = ce.target.id;
            const mId = ce.match.id;

            if (type === ce.type) {
                if ((id0 === tId && id1 === mId) || (id1 === tId && id0 === mId)) {
                    return true;
                }
            }
        }

        return false;
    }

    /** 结构约束 */
    private __structConstraint (vertex: IConstraintVertex) {
        const { id, type, struct } = vertex;

        if (struct.length < 1) return;
        if (type === PrimitivesType.LINE) {
            this.addConstraint(ConstraintType.POINT_ON_LINE, [struct[0].id, id], true);
            this.addConstraint(ConstraintType.POINT_ON_LINE, [struct[1].id, id], true);
        }
    }

    /**
     * 添加图元到约束图
     * @param params 顶点数据
     * @param structIds 结构图元id
     */
    addPrimitives (params: CVertexParams, structIds?: string[]) {
        const vertex = new ConstraintVertex(params);
        vertex.cgm = this;
        this._ConstraintVertices.addVertex(vertex);

        if (!structIds || vertex.type === PrimitivesType.POINT) return;
        const struct = structIds.map(id => {
            const v = this._ConstraintVertices.getVertex(id) as IConstraintVertex;
            if (!v) return v;
            v.sType = vertex.sType;
            return v;
        });
        if (struct.some(cv => !cv)) return;

        vertex.struct = struct;

        for (let i = 0; i < struct.length; i++) {
            const v = struct[i];
            v.struct.push(vertex);
        }

        this.__structConstraint(vertex);
    }

    /**
     * 添加约束到约束图
     * @param type 约束类型
     * @param ids 约束图顶点id数组
     */
    addConstraint (type: ConstraintType, ids: string[], isStruct: boolean = false) {
        const cvs = ids.map(id => this._ConstraintVertices.getVertex(id) as IConstraintVertex);

        if (this.__repeatVerification(type, cvs)) return;

        const edge = new ConstraintEdge({
            id: this.GeneratorID.ceateID(),
            type,
            cvs,
            cgm: this,
            isStruct,
        });
        edge.cgm = this;
        this._ConstraintEdges.addEdge(edge);

        if (!isStruct) {
            if (
                !UnaryConstraint.has(edge.type) ||
                edge.type === ConstraintType.V_RING ||
                edge.type === ConstraintType.H_RING
            ) {
                this.numericalSolution();
            }
        }
    }

    numericalSolution () {
        const datas = NumericalSolution.create(this).solve();

        for (const data of datas) {
            const cv = this._ConstraintVertices.getVertex(data.id);
            cv?.updateData(data.params);
        }
        this.cgUtil.updateElements();
    }

    reset () {
        this._ConstraintVertices.clear();
        this._ConstraintEdges.clear();
        this._ConstraintOthers.clear();
        this._GeneratorID.resetID();
    }
}
