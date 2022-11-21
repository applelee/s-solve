import { UnaryConstraint } from '../config';
import { IConstraintEdge, IConstraintVertex } from '../interface';

/** ------------------ 分割线 ------------------ */
/**
 * 约束图边类
 */
export class EdgeMethod {
    /**
     * 当前约束是否依赖某顶点的一元约束
     * @param ce 边（约束）
     * @param cv 顶点
     */
    static isRelyVertex (ce: IConstraintEdge, cv: IConstraintVertex) : boolean {
        const relies = Array.from(ce.rely);

        for (let i = relies.length; i--;) {
            const c = relies[i];

            if (!UnaryConstraint.has(c.type)) {
                if (c.target?.id === cv.id) return true;
                else if (c.match?.id === cv.id) return true;
            }
        }

        return false;
    }

    /**
     * 获取二元组另一个顶点
     * @param ce 边（约束）
     * @param cv 顶点
     */
    static other (ce: IConstraintEdge, cv: IConstraintVertex) : IConstraintVertex {
        const t = ce.target;
        const m = ce.match;

        if (t?.id === cv?.id) return m;
        else return t;
    }

    /**
     * 当前约束是否挂载指定的顶点
     * @param ce 边（约束）
     * @param cv1 顶点1
     * @param cv2 顶点2
     */
    static hasVertex (ce: IConstraintEdge, cv1: IConstraintVertex, cv2: IConstraintVertex) : boolean {
        const tId = ce.target?.id;
        const mId = ce.match?.id;

        if ((tId === cv1.id && mId === cv2.id) || (tId === cv2.id && mId === cv1.id)) return true;
        return false;
    }

    /**
     * 删除当前约束
     * @param ce0 当前约束
     * @param ce0 当前约束
     */
    static deleteSub (ce0: IConstraintEdge, ce1: IConstraintEdge) {}

    /**
     * 删除当前约束
     * @param ce 约束对象
     */
    static deleteConstraint (ce: IConstraintEdge) {
        ce.target?.outA.delete(ce);
        ce.target?.intoA.delete(ce);
        ce.target?.ringA.delete(ce);
        ce.match?.outA.delete(ce);
        ce.match?.intoA.delete(ce);
        ce.match?.ringA.delete(ce);
    }
}
