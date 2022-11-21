import { GeometryVector } from "../math/geometry";
import { FnMoreType } from "../type";

export class InclinationEquation {
    static lineLine (a: number = 0) : FnMoreType {
        return (x: number[]) => {
            const v1 = [x[0], x[1]];
            const v2 = [x[2], x[3]];
            const v3 = [x[4], x[5]];
            const v4 = [x[6], x[7]];
            const theta = GeometryVector.thetaPPPP(v1, v2, v3, v4);
            return (theta - a) ** 2;
        };
    }
}
