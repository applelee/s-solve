import { EPSILON } from "../../config";

export class GeometryVector {
    static pointToPoint (v1: number[], v2: number[]) {
        return Math.sqrt((v2[0] - v1[0]) ** 2 + (v2[1] - v1[1]) ** 2);
    }

    static aspect (v1: number[], v2: number[], v3: number[]) : number {
        const F = [v1[0] - v2[0], v1[1] - v2[1]];
        const S = [v2[0] - v3[0], v2[1] - v3[1]];
        return F[0] * S[1] - F[1] * S[0];
    }

    static thetaPPPP (v1: number[], v2: number[], v3: number[], v4: number[]) {
        const A = [v2[0] - v1[0], v2[1] - v1[1]];
        const B = [v4[0] - v3[0], v4[1] - v3[1]];
        const len1 = Math.sqrt(A[0] ** 2 + A[1] ** 2);
        const len2 = Math.sqrt(B[0] ** 2 + B[1] ** 2);
        const dot = A[0] * B[0] + A[1] * B[1];
        let M = len1 * len2;

        if (isNaN(M) || M === 0) {
            M = EPSILON;
        };
        let cosA = dot / M;

        if (cosA < -1) {
            cosA = -1;
        }
        else if (cosA > 1) {
            cosA = 1;
        }
        return Math.acos(cosA);
    }

    static unitVector (v: number[]) {
        const len = Math.sqrt(v[0] ** 2 + v[1] ** 2);
        if (len === 0) return [0, 0];
        return [v[0] / len, v[1] / len];
    }
}
