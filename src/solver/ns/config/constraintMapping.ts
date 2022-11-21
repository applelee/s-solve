import { ConstraintType } from "@/solver/gs/config";
import { DistanceEquation, InclinationEquation } from "../equation";

type MapType = { [key: string] : any };

export const constraintMapping : MapType = {
    [ConstraintType.V_RING]: DistanceEquation.equal,
    [ConstraintType.H_RING]: DistanceEquation.equal,
    [ConstraintType.POINT_TO_POINT]: DistanceEquation.pointToPoint,
    [ConstraintType.POINT_COINCIDE]: DistanceEquation.pointToPoint,
    [ConstraintType.POINT_ON_CIRCLE]: DistanceEquation.pointToCircle,
    [ConstraintType.POINT_ON_LINE]: DistanceEquation.pointToLine,
    [ConstraintType.LINE_CIRCLE_TANGENT]: DistanceEquation.circleToLine,
    [ConstraintType.CIRCLE_CIRCLE_TANGENT]: DistanceEquation.circleToCircle,
    [ConstraintType.LINE_LINE_EQUAL]: DistanceEquation.lenEqual,
    [ConstraintType.CIRCLE_CIRCLE_EQUAL]: DistanceEquation.equal,
    [ConstraintType.LINE_LINE_PARALLEL]: InclinationEquation.lineLine,
    [ConstraintType.LINE_LINE_PERPENDICULAR]: InclinationEquation.lineLine,
};
