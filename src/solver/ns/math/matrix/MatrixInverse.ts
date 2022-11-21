/**
 * 任意阶矩阵求逆
 * 低阶矩阵的逆可以单独提列出来，以减少计算步骤
 */

import { HighMatrix } from './HighMatrix';

export class MatrixInverse {
    static inverse (hm: HighMatrix) {
        try {
            MatrixInverse.inverseVerify(hm);
            return MatrixInverse.inverseT(hm);
        } catch (e) {
            return MatrixInverse.moorePenroseInverse(hm);
        }
    }

    static inverseT (hm: HighMatrix) : HighMatrix {
        try {
            MatrixInverse.inverseVerify(hm);
        } catch (e) {
            console.error(e);
        }

        return MatrixInverse.etInverse(hm);
    }

    static inverseA (hm: HighMatrix) {
        const { mtx, r } = hm;

        try {
            MatrixInverse.inverseVerify(hm);
        } catch (e) {
            console.error(e);
        }

        // 判断一阶矩阵
        if (r === 1) return new HighMatrix([1 / mtx[0]], r, r);

        const det = MatrixInverse.matrixPolynomial(mtx, r);
        const aMtx = MatrixInverse.accompanyMatrix(hm).mtx;
        const iMtx = [];

        for (let i = 0; i < aMtx.length; i++) {
            iMtx[i] = aMtx[i] / det;
        }

        return new HighMatrix(iMtx, r, r);
    }

    /**
     * 矩阵初等行变换求逆（此方法要提前校验可逆性）
     */
    private static etInverse (hm: HighMatrix) : HighMatrix {
        const { r, c } = hm;
        const mtx = [...hm.mtx];
        const augmented = [];

        /** 生成增广矩阵扩增矩阵部分 */
        for (let i = 0; i < mtx.length; i++) {
            const row = i / c >> 0;
            const clumn = i % r;

            if (row === clumn) augmented.push(1);
            else augmented.push(0);
        }

        /** 初等行变换操作生成逆矩阵 */
        for (let i = 0; i < mtx.length; i += c) {
            const row = i / c >> 0;
            const clumn = row;
            const first = mtx[i + clumn];

            /** 换行判断保证n行n列值不为0 */
            if (first === 0) {
                let tRow = row;

                for (let j = (row + 1) * c; j < mtx.length; j += c) {
                    const rowS = j / c >> 0;
                    const firstS = mtx[j + clumn];

                    if (firstS === 0) continue;

                    tRow = rowS;
                    break;
                }

                if (row !== tRow) {
                    const tF = tRow * c;

                    for (let k = 0; k < c; k++) {
                        const temp1 = mtx[i + k];
                        mtx[i + k] = mtx[tF + k];
                        mtx[tF + k] = temp1;

                        const temp2 : number = augmented[i + k];
                        augmented[i + k] = augmented[tF + k];
                        augmented[tF + k] = temp2;
                    }
                }
            }

            const newF = mtx[i + clumn];
            // 如果当前列值为0，则进入下次循环
            if (newF === 0) continue;

            if (newF !== 1) {
                /** 当前列值不为1时，利用行乘任意值不变原则使m行n列值为1 */
                const multiplier = 1 / newF;

                for (let j = i; j < i + c; j++) {
                    mtx[j] *= multiplier;
                    augmented[j] *= multiplier;
                }
            }

            /** 行乘任意值加到任意一行不变原则使n行n-1列为0 */
            for (let j = 0; j < mtx.length; j += c) {
                const cR = j / c >> 0;
                const value = mtx[j + clumn];

                // 排除基本行
                if (cR === row) continue;
                // 如果已经为0则不执行后续
                if (value === 0) continue;

                const multiplier = -value;
                for (let k = 0; k < c; k++) {
                    mtx[j + k] += mtx[i + k] * multiplier;
                    augmented[j + k] += augmented[i + k] * multiplier;
                }
            }
        }

        return new HighMatrix(augmented, r, c);
    }

    /**
     * 获取矩阵多项式
     * @param mtx 矩阵数据
     * @param n nxn矩阵
     */
    static matrixPolynomial (mtx: number[], n: number) : number {
        if (n * n !== mtx.length) {
            throw new Error('不合法，要求为方矩阵');
        }
        if (n === 0) return 0;
        if (n === 1) return mtx[0];

        const recursion = (mtx: number[], n: number) : number => {
            const r = 0;
            let result = 0;

            for (let i = 0; i < n; i++) {
                const subMtx = mtx.filter((_, k) => {
                    return k >= n && k % n !== i;
                });

                result += Math.pow(-1, r + i) * mtx[i] * (subMtx.length === 1 ? subMtx[0] : recursion(subMtx, n - 1));
            }

            return result;
        };

        return recursion(mtx, n);
    }

    /**
     * 方矩阵的伴随矩阵（通常确定矩阵可逆后使用）
     */
    private static accompanyMatrix (hm: HighMatrix) : HighMatrix {
        try {
            MatrixInverse.inverseVerify(hm);
        } catch (e) {
            console.error(e);
        }

        const n = hm.r;
        const { mtx } = hm;

        if (n < 2) return new HighMatrix([...mtx], n, n);
        if (n === 2) {
            return new HighMatrix([
                mtx[3], -mtx[1],
                -mtx[2], mtx[0],
            ], 2, 2);
        }

        const aMtx = [];
        for (let i = 0; i < mtx.length; i++) {
            /** 所在行列 */
            const r = i / n >> 0;
            const c = i % n;

            const subMtx = mtx.filter((_, k) => {
                return (k / n >> 0) !== c && k % n !== r;
            });
            aMtx.push(Math.pow(-1, r + c) * MatrixInverse.matrixPolynomial(subMtx, n - 1));
        }

        return new HighMatrix(aMtx, n, n);
    }

    /**
     * 矩阵的满秩分解（可分解任意非0矩阵）
     */
    private static fullRankDecomposition (hm: HighMatrix) : HighMatrix[] {
        // 获取矩阵最简形式
        const simplestMatrix = MatrixInverse.etSimplest(hm);

        // 生成列满秩与行满秩矩阵
        return MatrixInverse.bcFullRank(hm, simplestMatrix);
    }

    /**
     * 矩阵初等行变换获取矩阵最简形（任意矩阵）
     */
    private static etSimplest (hm: HighMatrix) : HighMatrix {
        const { r, c } = hm;
        const mtx = [...hm.mtx];
        let clumn = 0;

        /** 初等行变换操作生成逆矩阵 */
        for (let i = 0; i < mtx.length;) {
            const row = i / c >> 0;
            const first = mtx[i];

            /** 换行判断保证m行n列值不为0 */
            if (first === 0) {
                let tRow = row;

                /** 找出当前列不为0的行 */
                for (let j = (row + 1) * c; j < mtx.length; j += c) {
                    const rowS = j / c >> 0;
                    const firstS = mtx[j + clumn];

                    if (firstS === 0) continue;

                    tRow = rowS;
                    break;
                }

                if (row !== tRow) {
                    /** 检测到当前列有非0值，则换行操作 */
                    const tF = tRow * c;
                    const start = row * c;

                    for (let k = 0; k < c; k++) {
                        const temp = mtx[start + k];
                        mtx[start + k] = mtx[tF + k];
                        mtx[tF + k] = temp;
                    }
                }
                else {
                    /** 如果当前列都为0，则进入下一次循环 */
                    i++;
                    clumn++;
                    continue;
                }
            }

            const newF = mtx[i];
            if (newF !== 1) {
                /** 当前列值不为1时，利用行乘任意值不变原则使m行n列值为1 */
                const multiplier = 1 / newF;
                const start = row * c;

                for (let j = start; j < start + c; j++) {
                    mtx[j] *= multiplier;
                }
            }

            /** 行乘任意值加到任意一行不变原则使m行n列为0 */
            for (let j = 0; j < mtx.length; j += c) {
                const cR = j / c >> 0;
                const value = mtx[j + clumn];

                // 排除当前行
                if (cR === row) continue;
                // 如果已经为0则不执行后续
                if (value === 0) continue;

                const multiplier = -value;

                // console.log(multiplier, j, clumn)
                for (let k = 0; k < c; k++) {
                    mtx[j + k] += mtx[row * c + k] * multiplier;
                }
            }

            i += c + 1;
            clumn++;
        }
        return new HighMatrix(mtx, r, c);
    }

    /**
     * 获取行、列满秩
     * @param origin 原始矩阵
     * @param simplestMatrix 要求为矩阵的最简形式
     */
    private static bcFullRank (origin: HighMatrix, simplestMatrix: HighMatrix) : HighMatrix[] {
        let { r, c } = simplestMatrix;
        const { mtx } = origin;
        const bFullRank = [];
        const cFullRank = [...simplestMatrix.mtx];
        const rankMap = [];

        /** 生成行满秩矩阵与列满秩列映射 */
        for (let i = 0; i < cFullRank.length;) {
            const row = i / c >> 0;
            const clumn = i % c;
            const first = cFullRank[i];

            if (first !== 0) {
                rankMap.push(clumn);
                i = (row + 1) * c;
            }
            else {
                if (clumn !== c - 1) {
                    i++;
                }
                else {
                    /** 删除为0的行 */
                    i -= c - 1;
                    r--;
                    cFullRank.splice(i, c);
                }
            }
        }

        /** 根据行满秩列映射生成列满秩 */
        for (let i = 0; i < mtx.length; i++) {
            const clumn = i % origin.c;

            if (rankMap.includes(clumn)) {
                bFullRank.push(mtx[i]);
            }
        }

        return [
            new HighMatrix(bFullRank, origin.r, rankMap.length),
            new HighMatrix(cFullRank, r, c),
        ];
    }

    /**
     * 左逆
     * @param mh 满秩或列满秩矩阵
     */
    private static letInverse (mh: HighMatrix) : HighMatrix {
        const tMatrix = mh.transposeMatrix();
        const inverse = MatrixInverse.inverseA(HighMatrix.multiply(tMatrix, mh));
        return HighMatrix.multiply(inverse, tMatrix);
    }

    /**
     * 右逆
     * @param matrix 满秩或行满秩矩阵
     */
    private static rightInverse (hm: HighMatrix) : HighMatrix {
        const tMatrix = hm.transposeMatrix();
        const inverse = MatrixInverse.inverseA(HighMatrix.multiply(hm, tMatrix));
        return HighMatrix.multiply(tMatrix, inverse);
    }

    /**
     * 摩尔.彭诺斯（M-P）广义逆
     */
    private static moorePenroseInverse (hm: HighMatrix) : HighMatrix {
        const [B, C] = MatrixInverse.fullRankDecomposition(hm);
        const rightInverse = MatrixInverse.rightInverse(C);
        const leftInverse = MatrixInverse.letInverse(B);

        return rightInverse && leftInverse && HighMatrix.multiply(rightInverse, leftInverse);
    }

    /**
     * 矩阵可逆性校验
     * @param matrix 矩阵
     */
    static inverseVerify (matrix: HighMatrix) {
        const { r, c, mtx } = matrix;

        // if (r === 0 || c === 0) throw new Error('不合法，矩阵没有数据')
        if (r !== c) throw new Error('不合法，要求为方矩阵');
        if (r * c !== mtx.length) throw new Error('矩阵数据异常');
        if (MatrixInverse.matrixPolynomial(mtx, r) === 0) throw new Error('奇异矩阵不可逆');
    }
}
