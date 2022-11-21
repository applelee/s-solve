/**
 * 图解算工具类
 */

/** ------------------ 自定义模块 ------------------ */

import { CGManager } from '@/solver';
import { SketchData } from '@/solver/gs/ConstraintVertex';
import { PrimitivesType } from '@/solver/gs/config';
import { Application, IElement, VColor, ElementUtil } from '../index';
import { ConstraintManagerData } from '@/app/command';
import { Vector3 } from 'three';
import { IConstraintVertex } from '@/solver/gs/interface';
import { PValue } from '@/solver/gs/common';

/** ------------------ 分割线 ------------------ */

export class CGUtil {
    cgm : CGManager;

    constructor (private _app: Application) {
        this.cgm = new CGManager(this);
    }

    /**
     * 添加图元
     * @param element 图元
     */
    private __addPrimitives (element: IElement) {
        const params = {
            id: element.userData.id as string,
            order: this.cgm.GeneratorID.ceateID(),
            type: element.userData.type as PrimitivesType,
            sType: element.userData.sType as PrimitivesType,
            data: element.userData.sData as SketchData,
            cgm: this.cgm as CGManager,
        };

        if (element.userData.type === PrimitivesType.POINT) {
            this.cgm.addPrimitives(params);
        }
        else {
            this.cgm.addPrimitives(params, element.userData.struct);
        }
    }

    initCGVertices () {
        this.cgm.reset();
        const elements = this._app.vscene.children;
        const constraints = this._app.cManager.constraints;

        for (const element of elements) {
            if (element.userData.type !== PrimitivesType.POINT) continue;
            this.__addPrimitives(element as IElement);
        }

        for (const element of elements) {
            if (element.userData.type === PrimitivesType.POINT) continue;
            this.__addPrimitives(element as IElement);
        }

        for (const constraint of constraints) {
            this.addConstraint(constraint);
        }

        this._app.uiUtil.elementData(this.cgm.ConstraintVertices.getVertices());
    }

    /**
     * 添加约束
     * @param type 约束类型
     * @param ids 图元id数组
     */
    addConstraint (data: ConstraintManagerData) {
        this.cgm.addConstraint(data.type, data.ids);
    }

    /**
     * 设置图元颜色
     * @param color 颜色
     * @param ids 图元id数组
     */
    setElementsColor (color: VColor, ids: string[]) {
        for (const id of ids) {
            const element = ElementUtil.findElement(id, this._app.vscene.children);
            element?.setColor(color);
        }
    }

    /**
     * 更新图元数据
     * @param datas 参数数据
     */
    updateElements () {
        for (const element of this._app.vscene.children) {
            const { type, sData } = element.userData;
            if (type === PrimitivesType.POINT) {
                const { x } = sData;
                element.update(new Vector3(x[0].v, x[1].v, 0));
            }
            else if (type === PrimitivesType.CIRCLE) {
                const { id } = element.userData;
                const cv = this.cgm.ConstraintVertices.getVertex(id) as IConstraintVertex;
                const [center] = cv.struct;
                const x = center.data.x as PValue[];
                const { r } = sData;
                element.update({
                    position: new Vector3(x[0].v, x[1].v, 0),
                    radius: r[0].v,
                });
            }
            else if (type === PrimitivesType.LINE) {
                const { id } = element.userData;
                const cv = this.cgm.ConstraintVertices.getVertex(id) as IConstraintVertex;
                const [v1, v2] = cv.struct;
                const x1 = v1.data.x as PValue[];
                const x2 = v2.data.x as PValue[];

                element.update({
                    vertices: [new Vector3(x1[0].v, x1[1].v, 0), new Vector3(x2[0].v, x2[1].v, 0)],
                });
            }
        }
    }
}
