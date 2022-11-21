import { EPSILON } from "../../config";

export class GeometryCircle {
    static centerPPR (v1: number[], v2: number[], r: number) : number[][] {
        const center1 : number[] = [];
        const center2 : number[] = [];
        let M = v2[0] - v1[0];
        M = M === 0 ? EPSILON : M;
        const k = (v2[1] - v1[1]) / M;

        if (k === 0) {
            center1[0] = (v1[0] + v2[0]) / 2;
            center1[1] = v1[1] + Math.sqrt(r * r - (v1[0] - v2[0]) ** 2 / 4);
            center2[0] = (v1[0] + v2[0]) / 2;
            center2[1] = v2[1] - Math.sqrt(r * r - (v1[0] - v2[0]) ** 2 / 4);
        }
        else {
            const k_v = -1.0 / k;
            const mid_x = (v1[0] + v2[0]) / 2;
            const mid_y = (v1[1] + v2[1]) / 2;
            const a = 1 + k_v * k_v;
            const b = -2 * mid_x - k_v * k_v * (v1[0] + v2[0]);
            const c = mid_x ** 2 + ((k_v ** 2) * (v1[0] + v2[0]) ** 2) / 4 - (r ** 2 - ((mid_x - v1[0]) ** 2 + (mid_y - v1[0]) ** 2));

            center1[0] = (-1.0 * b + Math.sqrt(Math.abs(b * b - 4 * a * c))) / (2 * a);
            center1[1] = k_v * center1[0] - k_v * mid_x + mid_y;
            center2[0] = (-1.0 * b - Math.sqrt(Math.abs(b * b - 4 * a * c))) / (2 * a);
            center2[1] = k_v * center2[0] - k_v * mid_x + mid_y;
        }

        return [center1, center2];
    }

    static centerPPP (v1: number[], v2: number[], v3: number[]) : number[] {
        const v1s = v1[0] ** 2 + v1[1] ** 2;
        const v2s = v2[0] ** 2 + v2[1] ** 2;
        const v3s = v3[0] ** 2 + v3[1] ** 2;
        const A = v1[0] * (v2[1] - v3[1]) - v1[1] * (v2[0] - v3[0]) + v2[0] * v3[1] - v3[0] * v2[1];
        const B = v1s * (v3[1] - v2[1]) + v2s * (v1[1] - v3[1]) + v3s * (v2[1] - v1[1]);
        const C = v1s * (v2[0] - v3[0]) + v2s * (v3[0] - v1[0]) + v3s * (v1[0] - v2[0]);
        return [-B / (2 * A + EPSILON), -C / (2 * A + EPSILON)];
    }
}
