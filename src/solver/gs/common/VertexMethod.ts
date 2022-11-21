import { ConstraintType, PrimitivesType, UnaryAngleConstraint, MarkConstraint } from '../config';
import { IConstraintEdge, IConstraintVertex } from '../interface';
import { EdgeMethod } from '.';
import { RelyType } from '../ConstraintEdge';

/** ------------------ 分割线 ------------------ */

export type ConstraintEdgeParams = {
    type: ConstraintType;
    vertices: IConstraintVertex[];
    isRely?: RelyType;
}

/**
 * 约束图边类
 */
export class VertexMethod {
    /**
     * 获取当前顶点有二元约束关系的顶点数据
     * @param vertex 顶点
     * @param type 指定约束
     */
    static relationVertices (vertex: IConstraintVertex, type?: ConstraintType) : IConstraintVertex[] {
        const edges = VertexMethod.allBinaries(vertex);
        const relations = [];

        for (let i = edges.length; i--;) {
            const edge = edges[i];
            if (type && type !== edge.type) continue;

            const ids = relations.map(v => v.id);
            const other = EdgeMethod.other(edge, vertex);

            if (other && !ids.includes(other.id)) relations.push(other);
        }

        return relations;
    }

    static allBinaries (cv: IConstraintVertex, type?: ConstraintType) : IConstraintEdge[] {
        const outA = Array.from(cv.outA);
        const intoA = Array.from(cv.intoA);
        const ces = [...intoA, ...outA];

        if (!type) return ces;

        const result : IConstraintEdge[] = [];
        for (let i = ces.length; i--;) {
            const ce = ces[i];

            if (type === ce.type && !result.some(c => c.id === ce.id)) {
                result.push(ce);
            }
        }
        return result;
    }

    static hasUnary (cv: IConstraintVertex, type: ConstraintType) : boolean {
        const ces = Array.from(cv.ringA);
        return ces.some(ce => ce.type === type);
    }

    static getUnary (cv: IConstraintVertex, type: ConstraintType) : IConstraintEdge | undefined {
        const edges = Array.from(cv.ringA);

        for (let i = edges.length; i--;) {
            const edge = edges[i];

            if (edge.type === type) return edge;
        }

        return undefined;
    }

    static getUnaries (vertex: IConstraintVertex, type: ConstraintType) : IConstraintEdge[] {
        const result = [];
        const edges = Array.from(vertex.ringA);

        for (let i = edges.length; i--;) {
            const edge = edges[i];
            if (edge.type === type) result.push(edge);
        }

        return result;
    }

    /**
     * 当前顶点是否存在指定二元约束
     * @param vertex 顶点
     * @param type 约束类型
     */
    static hasBinary (vertex: IConstraintVertex, type: ConstraintType) : boolean {
        const ces = VertexMethod.allBinaries(vertex);
        return ces.some(ce => ce.type === type);
    }

    /**
     * 检测两个顶点是否存在二元约束
     * @param v1 顶点1
     * @param v2 顶点2
     */
    static twoHasBinary (v1: IConstraintVertex, v2: IConstraintVertex) : boolean {
        const relations = VertexMethod.relationVertices(v1);
        return relations.some(v => v.id === v2.id);
    }

    /**
     * 当前顶点所有指定二元约束图上关系节点
     * @param vertex 顶点
     * @param type 约束类型
     */
    static binaryVertex (vertex: IConstraintVertex, type: ConstraintType) : IConstraintVertex[] {
        const edges = VertexMethod.allBinaries(vertex);
        const result = [];

        for (let i = edges.length; i--;) {
            const edge = edges[i];
            const t = edge.target;
            const m = edge.match;

            if (edge.type === type) {
                if (t?.id === vertex.id) {
                    m && result.push(m);
                } else {
                    t && result.push(t);
                }
            }
        }

        return result;
    }

    /**
     * 获取两个顶点间所有的二元约束
     * @param v1 顶点1
     * @param v2 顶点1
     */
    static twoVertexBinaries (v1: IConstraintVertex, v2: IConstraintVertex) : IConstraintEdge[] {
        const edges = VertexMethod.allBinaries(v2);
        const result = [];

        for (let i = edges.length; i--;) {
            const edge = edges[i];
            const tTag = edge.target?.id;
            const mTag = edge.match?.id;

            if ((v1.id === tTag && v2.id === mTag) || (v1.id === mTag && v1.id === tTag)) {
                result.push(edge);
            }
        }

        return result;
    }

    /**
     * 检测两个顶点是否存在指定二元约束
     * @param v1 顶点1
     * @param v2 顶点2
     * @param type 约束类型
     */
    static hasTwoVertexBinary (v1: IConstraintVertex, v2: IConstraintVertex, type: ConstraintType) : boolean {
        const edges = VertexMethod.allBinaries(v1);
        const id = v2.id;

        for (let i = edges.length; i--;) {
            const edge = edges[i];
            const t = edge.target;
            const m = edge.match;

            if (t?.id !== id && m?.id !== id) continue;
            if (edge.type === type) return true;
        }

        return false;
    }

    /**
     * 获取两个顶点指定二元约束（单个）
     * @param v1 顶点1
     * @param v2 顶点2
     * @param type 约束类型
     */
    static twoVertexOneBinary (v1: IConstraintVertex, v2: IConstraintVertex, type: ConstraintType) : IConstraintEdge | undefined {
        const edges = VertexMethod.twoVertexBinaries(v1, v2);

        for (let i = edges.length; i--;) {
            const edge = edges[i];
            if (edge.type === type) return edge;
        }

        return undefined;
    }

    /**
     * 当前顶点的一元约束是否依赖指定约束
     * @param vertex 顶点
     * @param edge 边（约束）
     */
    static isRelyConstraint (vertex: IConstraintVertex, edge: IConstraintEdge) : boolean {
        const edges = Array.from(vertex.ringA);

        return edges.some(e => {
            if (e.isRely === RelyType.NONE) return false;
            const relies = Array.from(e.rely);
            return relies.some(ee => edge.id === ee.id);
        });
    }

    /**
     * 当前顶点是否存在依赖标注的一元约束
     * @param vertex 顶点
     */
    static hasRelyMark (vertex: IConstraintVertex) : boolean {
        const edges = Array.from(vertex.ringA);

        return edges.some(edge => {
            const relies = Array.from(edge.rely);
            return relies.some(e => {
                return e.isRely === RelyType.MARK;
            });
        });
    }

    /**
     * 当前顶点是否挂载倾角约束
     * @param vertex 顶点
     */
    static hasAngle (vertex: IConstraintVertex) : boolean {
        if (vertex.type !== PrimitivesType.LINE) return false;

        for (const v of vertex.ringA) {
            if (UnaryAngleConstraint.has(v.type)) return true;
        }

        return false;
    }

    /**
     * 当前顶点是否挂载标注约束
     * @param vertex 顶点
     */
    static hasMark (vertex: IConstraintVertex) : boolean {
        const edges = VertexMethod.allBinaries(vertex);
        return edges.some(edge => {
            return MarkConstraint.has(edge.type);
        });
    }

    /**
     * 获取一级传播域传播数量
     * @param cv 顶点
     */
    firstSpreadNum (cv: IConstraintVertex) : number {
        return VertexMethod.allBinaries(cv).length;
    }

    /**
     * 删除挂载的约束
     * @param c 约束对象
     */
    deleteConstraint (cv: IConstraintVertex, ce: IConstraintEdge) {
        cv.deleteRing(ce);
        cv.deleteA(ce);
    }
}
