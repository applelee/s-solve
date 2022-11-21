import { IMouseEvent } from '@/app';
import { ConstraintType, UnaryConstraint, ConstraintAndPrimitives, PrimitivesType } from '@/solver/gs/config';
import { Selection } from './Selection';

export type ConstraintManagerData = {
    type : ConstraintType,
    ids: string[],
}

export class ConstraintManager extends Selection {
    private _type : ConstraintType = ConstraintType.UNKNOWN;
    private _constraints : ConstraintManagerData[] = [];

    get type () : ConstraintType {
        return this._type;
    }

    get constraints () : ConstraintManagerData[] {
        return this._constraints;
    }

    get selectIds () : string[] {
        return this._select.map(e => e.userData.id as string);
    }

    get selectTypes () : PrimitivesType[] {
        return this._select.map(e => e.userData.type as PrimitivesType);
    }

    get verificationSelect () : boolean {
        const [id1, id2] = this.selectIds;
        const [t1, t2] = this.selectTypes;
        let pTypes = [];
        let type;

        if (id1 === id2) return false;
        if (this.type === ConstraintType.COINCIDE) {
            type = this.__analysisCoincide(t1, t2);
        }
        else if (this.type === ConstraintType.TANGENT) {
            type = this.__analysisTangent(t1, t2);
        }
        else if (this.type === ConstraintType.EQUAL) {
            type = this.__analysisEqual(t1, t2);
        }

        if (type) {
            pTypes = ConstraintAndPrimitives[type as ConstraintType];
        }
        else {
            pTypes = ConstraintAndPrimitives[this._type];
        }

        if (!pTypes) return false;
        const [pt1, pt2] = pTypes;

        if ((t1 === pt1 && t2 === pt2) || (t1 === pt2 && t2 === pt1)) {
            return true;
        }
        return false;
    }

    private __analysisCoincide (t1: PrimitivesType, t2: PrimitivesType) {
        if (t1 === PrimitivesType.POINT && t2 === PrimitivesType.POINT) {
            return ConstraintType.POINT_COINCIDE;
        }
        else if (
            (t1 === PrimitivesType.POINT && t2 === PrimitivesType.LINE) ||
            (t1 === PrimitivesType.LINE && t2 === PrimitivesType.POINT)
        ) {
            return ConstraintType.POINT_ON_LINE;
        }
        else if (
            (t1 === PrimitivesType.POINT && t2 === PrimitivesType.CIRCLE) ||
            (t1 === PrimitivesType.CIRCLE && t2 === PrimitivesType.POINT)
        ) {
            return ConstraintType.POINT_ON_CIRCLE;
        }
        else if (
            (t1 === PrimitivesType.POINT && t2 === PrimitivesType.CIRCLE) ||
            (t1 === PrimitivesType.CIRCLE && t2 === PrimitivesType.POINT)
        ) {
            return ConstraintType.POINT_ON_CIRCLE;
        }
        else if (t1 === PrimitivesType.LINE && t2 === PrimitivesType.LINE) {
            return ConstraintType.LINE_COINCIDE;
        }
    }

    private __analysisTangent (t1: PrimitivesType, t2: PrimitivesType) {
        if (t1 === PrimitivesType.CIRCLE && t2 === PrimitivesType.CIRCLE) {
            return ConstraintType.CIRCLE_CIRCLE_TANGENT;
        }
        else if (
            (t1 === PrimitivesType.CIRCLE && t2 === PrimitivesType.LINE) ||
            (t1 === PrimitivesType.LINE && t2 === PrimitivesType.CIRCLE)
        ) {
            return ConstraintType.LINE_CIRCLE_TANGENT;
        }
    }

    private __analysisEqual(t1: PrimitivesType, t2: PrimitivesType) {
        if (t1 === PrimitivesType.LINE && t2 === PrimitivesType.LINE) {
            return ConstraintType.LINE_LINE_EQUAL;
        }
        else if (t1 === PrimitivesType.CIRCLE && t2 === PrimitivesType.CIRCLE) {
            return ConstraintType.CIRCLE_CIRCLE_EQUAL;
        }
    }

    private __changeType (type: ConstraintType) {
        this._type = type;
        this._app.drawManager.cancel();
        this._app.dragManager.cancel();
    }

    private __addConstraint () {
        if (UnaryConstraint.has(this._type)) {
            /** 一元 */
            if (this._select.length < 1) return;
            const id = this.selectIds[0];
            this.pushConstraint({
                type: this.type,
                ids: [id, id],
            });
            this.__unselectItem();
        }
        else {
            /** 二元 */
            if (this._select.length < 2) return;
            if (this.verificationSelect) {
                let type : ConstraintType;
                const [t1, t2] = this.selectTypes;
                if (this._type === ConstraintType.COINCIDE) {
                    type = this.__analysisCoincide(t1, t2) as ConstraintType;
                }
                else if (this._type === ConstraintType.TANGENT) {
                    type = this.__analysisTangent(t1, t2) as ConstraintType;
                }
                else if (this._type === ConstraintType.EQUAL) {
                    type = this.__analysisEqual(t1, t2) as ConstraintType;
                }
                else {
                    type = this._type;
                }

                if (!type) {
                    this.cancel();
                    return;
                }

                this.pushConstraint({
                    type,
                    ids: this.selectIds,
                });
            }
            this.__unselectItem();
        }
    }

    pushConstraint (data: ConstraintManagerData) {
        this._constraints.push(data);
        this._app.cgUtil.addConstraint(data);
    }

    vertical () { this.__changeType(ConstraintType.V_RING); }

    horizontal () { this.__changeType(ConstraintType.H_RING); }

    coincide () { this.__changeType(ConstraintType.COINCIDE); }

    parallel () { this.__changeType(ConstraintType.LINE_LINE_PARALLEL); }

    perpendicular () { this.__changeType(ConstraintType.LINE_LINE_PERPENDICULAR); }

    tangent () { this.__changeType(ConstraintType.TANGENT); }

    equal () { this.__changeType(ConstraintType.EQUAL); }

    onMouseUp (ievent: IMouseEvent) : boolean {
        const { picks } = ievent;
        const select = this._select.concat(picks);
        this.__selectItem(select);
        this.__addConstraint();
        return false;
    }

    onKeyUp (event: KeyboardEvent) : boolean {
        if (event.code === 'Escape') {
            this.cancel();
        }
        return false;
    }

    cancel () {
        this._type = ConstraintType.UNKNOWN;
        this.__unselectItem();
    }
}
