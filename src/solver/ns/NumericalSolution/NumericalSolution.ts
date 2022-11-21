import { CGManager } from "@/solver/gs";
import { ConstraintType, PrimitivesType, PrimitivesWeight, UnaryConstraint } from "@/solver/gs/config";
import { IConstraintEdge } from "@/solver/gs/interface";
import { QNIteration } from "../algorithm";
import { constraintMapping } from "../config";
import { DataCollecation } from './DataCollecation';

export class NumericalSolution {
    private _cgm : CGManager;
    private _dataCollect : DataCollecation = new DataCollecation();

    constructor (cgm: CGManager) {
        this._cgm = cgm;
    }

    static create (cgm: CGManager) {
        return new this(cgm);
    }

    private __updateData (newData: number[]) {
        let count = 0;

        for (const data of this._dataCollect.paramsData) {
            for (let i = 0; i < data.params.length; i++) {
                data.params[i] = newData[count];
                count += 1;
            }
        }
    }

    solve () {
        const ces = this._cgm.ConstraintEdges.getEdges();
        const queue = ces.filter(ce => !ce.isStruct);

        this.analysisQueue(queue);
        this.calculationLeastSquare();
        return this._dataCollect.datas;
    }

    analysisQueue (ces: IConstraintEdge[]) {
        const queue = ces.filter(c => !UnaryConstraint.has(c.type) || c.type === ConstraintType.V_RING || c.type === ConstraintType.H_RING);

        for (let i = 0; i < queue.length; i++) {
            const ce = queue[i];
            const target = ce.target;
            const match = ce.match;
            let ids : string[] = [];

            const tIds : string[] = [];
            const mIds : string[] = [];

            if (target.type === PrimitivesType.LINE) {
                Array.prototype.push.apply(tIds, target.struct.map(v => v.id));
            }
            else if (target.type === PrimitivesType.CIRCLE) {
                Array.prototype.push.apply(tIds, target.struct.map(v => v.id).concat([target.id]));
            }
            else tIds.push(target.id);

            if (match.type === PrimitivesType.LINE) {
                Array.prototype.push.apply(mIds, match.struct.map(v => v.id));
            }
            else if (match.type === PrimitivesType.CIRCLE) {
                Array.prototype.push.apply(mIds, match.struct.map(v => v.id).concat([match.id]));
            }
            else mIds.push(match.id);

            if (target.id === match.id) {
                ids = tIds;
            }
            else {
                if (PrimitivesWeight[target.type] < PrimitivesWeight[match.type]) {
                    ids = tIds.concat(mIds);
                }
                else {
                    ids = mIds.concat(tIds);
                }
            }

            let alpha = 0;

            if (ce.type === ConstraintType.LINE_LINE_PERPENDICULAR) {
                alpha = Math.PI / 2;
            }
            else if (ce.type === ConstraintType.LINE_LINE_PARALLEL) {
                alpha = Math.PI;
            }

            this._dataCollect.addEquationData({
                equation: constraintMapping[ce.type](alpha),
                type: ce.type,
                ids,
            });

            this._dataCollect.addToCollect(target);
            this._dataCollect.addToCollect(match);
        }
    }

    calculationLeastSquare () {
        const params = this._dataCollect.paramsX;
        const minFx = this._dataCollect.getMinFx();

        const qn = new QNIteration({
            x0: params,
            fn: minFx,
        });
        qn.run();

        // console.log(qn);

        this.__updateData(qn.dataX);
    }
}
