import { EPSILON } from "../config";
import { FnMoreType } from "../type";

export class DistanceEquation {
    static constraint (d: number[]) : FnMoreType {
        return (x: number[]) => {
            let result = 0;
            for (let i = d.length; i--;) {
                result += (x[i] - d[i]) ** 2;
            }
            return result;
        };
    }

    static equal () : FnMoreType {
        return (x: number[]) => (x[0] - x[1]) ** 2;
    }

    static lenEqual () {
        return (x: number[]) => {
            const dist1 = Math.sqrt((x[2] - x[0]) ** 2 + (x[3] - x[1]) ** 2);
            const dist2 = Math.sqrt((x[6] - x[4]) ** 2 + (x[7] - x[5]) ** 2);
            return (dist1 - dist2) ** 2;
        };
    }

    static pointToPoint (d: number = 0) : FnMoreType {
        return (x: number[]) => (Math.sqrt((x[0] - x[2]) ** 2 + (x[1] - x[3]) ** 2) - d) ** 2;
    }

    static pointToCircle (d: number = 0) : FnMoreType {
        return (x: number[]) => (Math.sqrt((x[0] - x[2]) ** 2 + (x[1] - x[3]) ** 2) - x[4] - d) ** 2;
    }

    static pointToLine (d: number = 0) : FnMoreType {
        return (x: number[]) => {
            const A = x[5] - x[3];
            const B = x[2] - x[4];
            const C = x[4] * x[3] - x[2] * x[5];
            let M = Math.sqrt(A * A + B * B);
            if (isNaN(M) || M === 0) {
                M = EPSILON;
            };
            return (Math.abs(A * x[0] + B * x[1] + C) / M - d) ** 2;
        };
    }

    static circleToCircle (d: number = 0) : FnMoreType {
        return (x: number[]) => (Math.sqrt((x[0] - x[3]) ** 2 + (x[1] - x[4]) ** 2) - x[2] - x[5] - d) ** 2;
    }

    static circleToLine (d: number = 0) : FnMoreType {
        return (x: number[]) => {
            const A = x[6] - x[4];
            const B = x[3] - x[5];
            const C = x[5] * x[4] - x[3] * x[6];
            let M = Math.sqrt(A * A + B * B);
            if (isNaN(M) || M === 0) {
                M = EPSILON;
            };
            return (Math.abs(A * x[0] + B * x[1] + C) / Math.sqrt(A * A + B * B) - x[2] - d) ** 2;
        };
    }

    static lineToLine (d: number = 0) : FnMoreType {
        return (x: number[]) => {
            return 0;
        };
    }
}
