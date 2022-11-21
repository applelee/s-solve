/** 高阶矩阵 */
export class HighMatrix {
    private _mtx : number[] = [1, 0, 0, 1];
    private _row : number = 2;
    private _clumn : number = 2;

    constructor (mtx?: number[], r?: number, c?: number) {
        this._mtx = mtx || this._mtx;
        this._row = r || this._row;
        this._clumn = c || this._clumn;
    }

    get r () : number {
        return this._row;
    }

    set r (r: number) {
        this._row = r;
    }

    get c () : number {
        return this._clumn;
    }

    set c (c: number) {
        this._clumn = c;
    }

    get mtx () : number[] {
        return this._mtx;
    }

    set mtx (mtx: number[]) {
        this._mtx = mtx;
    }

    get size () : number {
        return this._mtx.length;
    }

    static createUnitMatrix (rank: number) {
        const mtx = [];

        for (let i = 0; i < rank; i++) {
            for (let j = 0; j < rank; j++) {
                if (i === j) mtx.push(1);
                else mtx.push(0);
            }
        }

        return new HighMatrix(mtx, rank, rank);
    }

    multiplyScalar (num: number) : HighMatrix {
        this._mtx = this._mtx.map(v => v * num);
        return this;
    }

    divideScalar (num: number) : HighMatrix {
        this._mtx = this._mtx.map(v => v / num);
        return this;
    }

    transposeMatrix () : HighMatrix {
        const { mtx, r, c } = this;
        const newMtx = [];

        for (let i = 0; i < mtx.length; i++) {
            const row = i / c >> 0;
            const clumn = i % c;

            newMtx[clumn * r + row] = mtx[i];
        }

        this._row = c;
        this._clumn = r;

        return this;
    }

    clone () : HighMatrix {
        return new HighMatrix(Array.from(this.mtx), this.r, this.c);
    }

    /**
     * 矩阵相加
     * @param matrix1 矩阵对象1
     * @param matrix2 矩阵对象2
     */
    static add (matrix1: HighMatrix, matrix2: HighMatrix) : HighMatrix {
        if (matrix1.r !== matrix2.r || matrix1.c !== matrix2.c) {
            throw new Error('不合法，参与运算的矩阵行或列不相等');
        }

        const newMtx = [];
        for (let i = matrix1.mtx.length; i--;) {
            newMtx.unshift(matrix1.mtx[i] + matrix2.mtx[i]);
        }

        return new HighMatrix(newMtx, matrix1.r, matrix1.c);
    }

    /**
     * 矩阵相减
     * @param matrix1 矩阵对象1
     * @param matrix2 矩阵对象2
     */
    static sub (matrix1: HighMatrix, matrix2: HighMatrix) : HighMatrix {
        if (matrix1.r !== matrix2.r || matrix1.c !== matrix2.c) {
            throw new Error('不合法，参与运算的矩阵行或列不相等');
        }

        const newMtx = [];
        for (let i = matrix1.mtx.length; i--;) {
            newMtx.unshift(matrix1.mtx[i] - matrix2.mtx[i]);
        }

        return new HighMatrix(newMtx, matrix1.r, matrix1.c);
    }

    /**
     * 矩阵相乘
     * @param matrix1 矩阵对象1
     * @param matrix2 矩阵对象2
     */
    static multiply (matrix1: HighMatrix, matrix2: HighMatrix) : HighMatrix {
        if (matrix1.c !== matrix2.r) {
            throw new Error('矩阵数据不满足乘法运算');
        }

        const newMtx = [];
        const len = matrix1.r * matrix2.c;
        for (let i = 0; i < len; i++) {
            const row = i / matrix2.c >> 0;
            const clumn = i % matrix2.c;
            let value = 0;

            for (let j = 0; j < matrix1.c; j++) {
                value += matrix1.mtx[row * matrix1.c + j] * matrix2.mtx[j * matrix2.c + clumn];
            }

            newMtx[i] = value;
        }

        return new HighMatrix(newMtx, matrix2.c, matrix1.r);
    }
}
