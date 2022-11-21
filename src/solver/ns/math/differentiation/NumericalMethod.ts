import { FnMoreType } from '../../type';

/** ------------------ 分割线 ------------------ */

export class NumericalMethod {
    /** 割线 */
    static differential (fn: FnMoreType, x: number[], h: number, key?: number) : number {
        const nx = key === undefined ? x.map(n => n + h) : x.map((n, i) => i === key ? n + h : n);
        return (fn(nx) - fn(x)) / h;
    }

    /** 弦切 */
    static differential2 (fn: FnMoreType, x: number[], h: number, key?: number) : number {
        const nx1 = key === undefined ? x.map(n => n + h) : x.map((n, i) => i === key ? n + h : n);
        const nx2 = key === undefined ? x.map(n => n - h) : x.map((n, i) => i === key ? n - h : n);
        return (fn(nx1) - fn(nx2)) / (2 * h);
    }
}
