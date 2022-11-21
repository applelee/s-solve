import { EPSILON } from '../config';
import { FnOneType, FnMoreType } from '../type';
import { NumericalMethod, HighMatrix } from '../math';

const SEARCH_MAX = 20;

export type GoldenSectionParams = {
    x0: [number, number],
    fn: FnOneType,
}

export class GoldenSection {
    private _a : number;
    private _b : number;
    private _u : number;
    private _v : number;

    private _fn : FnOneType;

    static LAMBDA : number = 0.9;

    constructor (params: GoldenSectionParams) {
        this._a = params.x0[0];
        this._b = params.x0[1];
        this._u = this.__getU();
        this._v = this.__getV();
        this._fn = params.fn;
    }

    get alpha () : number {
        return (this._a + this._b) / 2;
    }

    static create (params: GoldenSectionParams) {
        return new this(params);
    }

    private __getU () : number {
        return this._b - GoldenSection.LAMBDA * (this._b - this._a);
    }

    private __getV () : number {
        return this._a + GoldenSection.LAMBDA * (this._b - this._a);
    }

    private __iterationAlpha () {
        let i = 0;

        while (i < SEARCH_MAX || this._b - this._a > EPSILON) {
            const phi0 = this._fn(this._u);
            const phi1 = this._fn(this._v);

            if (phi0 === phi1) {
                this._a = this._u;
                this._b = this._v;
            }
            else if (phi0 < phi1) {
                this._b = this._v;
                this._v = this._u;
                this._u = this.__getU();
            }
            else if (phi0 > phi1) {
                this._a = this._u;
                this._u = this._v;
                this._v = this.__getV();
            }

            i += 1;
        }
    }

    run () {
        return this.__iterationAlpha();
    }
}

const SEARCH_NUM = 20;
const SEARCH_MULTIPLE = 10;

export type WolfeConditionParams = {
    x0: number[],
    fn: FnMoreType,
    hMtx?: HighMatrix,
}

export class WolfeCondition {
    private _c1 : number = 1e-4;
    private _c2 : number = 0.9;
    private _alpha_prev : number = 0;
    private _alpha_c : number = 1;
    private _x: HighMatrix;
    private _grad : HighMatrix;
    private _direct : HighMatrix;

    private _fn : FnMoreType;
    private _H : HighMatrix;

    constructor (params: WolfeConditionParams) {
        this._fn = params.fn;
        this._x = new HighMatrix(params.x0, 1, params.x0.length);
        this._H = params.hMtx || HighMatrix.createUnitMatrix(this._x.size);
        this._grad = this.__getGradient();
        this._direct = this.__getDirect();
    }

    private __getGradient (nextData?: number[]) : HighMatrix {
        const len = this._x.size;
        const data = [];

        for (let i = 0; i < len; i++) {
            data.push(NumericalMethod.differential(this._fn, nextData || this._x.mtx, EPSILON, i));
        }

        return new HighMatrix(data, 1, len);
    }

    private __getDirect (mtx?: number[]) : HighMatrix {
        const tGrad = new HighMatrix(mtx || this._grad.mtx, 1, this._x.size).transposeMatrix();
        return HighMatrix.multiply(this._H, tGrad).multiplyScalar(-1);
    }

    private __armijoCondition (alpha: number) : boolean {
        return this.__fun(alpha) <= this.__fun(0) + this._c1 * alpha * this.__dfun(0);
    }

    private __curvatureCondition (alpha: number) {
        return Math.abs(this.__dfun(alpha)) <= -this._c2 * this.__dfun(0);
    }

    private __fun (alpha: number) : number {
        const data = [];

        for (let i = 0; i < this._x.size; i++) {
            data[i] = this._x.mtx[i] + alpha * this._direct.mtx[i];
        }

        return this._fn(data);
    }

    private __dfun (alpha: number) : number {
        const data = [];

        for (let i = 0; i < this._x.size; i++) {
            data[i] = this._x.mtx[i] + alpha * this._direct.mtx[i];
        }

        const grad = this.__getGradient(data);
        const tDirect = this._direct.clone().transposeMatrix();

        return HighMatrix.multiply(grad, tDirect).mtx[0];
    }

    private __chooseAlpha (alpha_l: number, alpha_h: number) : number {
        return (alpha_l + alpha_h) / 2;
    }

    private __zoomAlpha (alpha_l: number, alpha_h: number) {
        let j = 0;
        let alpha_m = 0;

        while (j < SEARCH_MAX) {
            alpha_m = this.__chooseAlpha(alpha_l, alpha_h);

            if (
                !this.__armijoCondition(alpha_m) ||
                this.__fun(alpha_m) >= this.__fun(alpha_l)
            ) {
                alpha_h = alpha_m;
            }
            else {
                if (this.__curvatureCondition(alpha_m)) {
                    return alpha_m;
                }
                if (this.__dfun(alpha_m) * (alpha_h - alpha_l) >= 0) {
                    alpha_h = alpha_l;
                }

                alpha_l = alpha_m;
            }

            j += 1;
        }

        return alpha_m;
    }

    private __searchAlpha () {
        let i = 0;

        while (true) {
            const max = Math.pow(SEARCH_MULTIPLE, ((i / SEARCH_NUM) << 0) + 1);

            if (
                !this.__armijoCondition(this._alpha_c) ||
                (this.__fun(this._alpha_c) >= this.__fun(this._alpha_prev) && i > 1)
            ) {
                return this.__zoomAlpha(this._alpha_prev, this._alpha_c);
            }

            if (this.__curvatureCondition(this._alpha_c)) {
                return this._alpha_c;
            }

            if (this.__dfun(this._alpha_c) >= 0) {
                return this.__zoomAlpha(this._alpha_c, this._alpha_prev);
            }

            this._alpha_prev = this._alpha_c;
            this._alpha_c = this.__chooseAlpha(this._alpha_c, max);

            i += 1;
        }
    }

    run () {
        const alpha = this.__searchAlpha() as number;
        return alpha;
    }
}
