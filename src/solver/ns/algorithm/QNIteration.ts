import { EPSILON, EPSILON_SL } from '../config';
import { FnMoreType } from '../type';
import { NumericalMethod, HighMatrix } from '../math';
import { WolfeCondition } from './LineSearch';

const INTER_COUNT = 10;

export type QNParams = {
    x0: number[],
    fn : FnMoreType,
};

export class QNIteration {
    private _fn : FnMoreType;
    private _x : HighMatrix;
    private _H : HighMatrix;
    private _g : HighMatrix;
    private _d : HighMatrix;
    private _a : number;
    private _s : HighMatrix;
    private _y : HighMatrix;

    constructor (params: QNParams) {
        this._fn = params.fn;
        this._x = new HighMatrix(params.x0, 1, params.x0.length);
        this._H = HighMatrix.createUnitMatrix(this._x.size);
        this._g = this.__getG();
        this._d = this.__getD();
        this._a = this.__getA();
        this._s = this.__getS();
        this._y = this.__getY();
    }

    get isStop () : boolean {
        let ssum = 0;

        for (const v of this._g.mtx) {
            ssum += v * v;
        }

        // console.log(ssum);
        return ssum < EPSILON_SL;
    }

    get dataX () : number[] {
        return this._x.mtx;
    }

    private __getG (nx?: HighMatrix) : HighMatrix {
        const grad = [];
        const len = this._x.size;

        for (let i = 0; i < len; i++) {
            grad.push(NumericalMethod.differential(this._fn, nx ? nx.mtx : this._x.mtx, EPSILON, i));
        }

        return new HighMatrix(grad, 1, len);
    }

    private __getD () : HighMatrix {
        const tGrad = this._g.clone().transposeMatrix();
        return HighMatrix.multiply(this._H, tGrad).multiplyScalar(-1);
    }

    private __getA () : number {
        const linesearch = new WolfeCondition({
            x0: this._x.mtx,
            fn: this._fn,
            hMtx: this._H,
        });
        const num = linesearch.run();

        return num as number;
    }

    private __getS () : HighMatrix {
        return this._d.clone().multiplyScalar(this._a);
    }

    private __getY () : HighMatrix {
        this._x = HighMatrix.add(this._x, this._s);
        const grad = this._g;
        this._g = this.__getG(this._x);

        return HighMatrix.sub(this._g, grad);
    }

    private __update () {
        this._H = this.__correctH();
        this._d = this.__getD();
        this._a = this.__getA();
        this._s = this.__getS();
        this._y = this.__getY();
    }

    private __correctH () {
        const H = this._H.clone();
        const tS = this._s.clone().transposeMatrix();
        const tY = this._y.clone().transposeMatrix();
        const syt = HighMatrix.multiply(this._s, tY).mtx[0];
        const yts = HighMatrix.multiply(tY, this._s);
        const sty = HighMatrix.multiply(tS, this._y);
        const sts = HighMatrix.multiply(tS, this._s);
        const yH = HighMatrix.multiply(this._y, H).transposeMatrix();
        const yHyt = HighMatrix.multiply(yH, tY).mtx[0];
        const Hyts = HighMatrix.multiply(H, yts);
        const styH = HighMatrix.multiply(sty, H);

        const matrix1 = sts.multiplyScalar(syt + yHyt).divideScalar(syt * syt);
        const matrix2 = HighMatrix.add(Hyts, styH).divideScalar(syt);
        const matrix3 = HighMatrix.sub(matrix1, matrix2);

        return HighMatrix.add(H, matrix3);
    }

    private __iteration () : void {
        let i = 0;

        while (i < INTER_COUNT) {
            if (this.isStop) break;

            this.__update();
            i += 1;
        }
    }

    run () {
        this.__iteration();
    }
}
