import { ConstraintType, PrimitivesType } from './index';

/** ------------------ 分割线 ------------------ */

/** 一元约束 */
export const UnaryConstraint = new Set([
    ConstraintType.H_RING,
    ConstraintType.V_RING,
]);

/** 线约束 */
export const LineFixConstraint = new Set([
    ConstraintType.H_RING,
    ConstraintType.V_RING,
]);

/** 一元倾角约束 */
export const UnaryAngleConstraint = new Set([
    ConstraintType.H_RING,
    ConstraintType.V_RING,
]);

/** 二元倾角约束 */
export const BinaryAngleConstraint = new Set([
    ConstraintType.POINT_POINT_H,
    ConstraintType.POINT_POINT_V,
]);

/** 二元X轴约束 */
export const BinaryXAxisConstraint = new Set([
    ConstraintType.POINT_POINT_V,
    ConstraintType.POINT_COINCIDE,
]);

/** 二元Y轴约束 */
export const BinaryYAxisConstraint = new Set([
    ConstraintType.POINT_POINT_H,
    ConstraintType.POINT_COINCIDE,
]);

/** 越远位置分量相等约束 */
export const PositionWeightConstraint = new Set([
    ConstraintType.POINT_POINT_V,
    ConstraintType.POINT_POINT_H,
]);

/** 传播因子 */
export const CommunicableConstraint = new Set([
    ConstraintType.H_RING,
    ConstraintType.V_RING,
]);

/** 点距离约束 */
export const DistanceConstraint = new Set([
    ConstraintType.POINT_POINT_H,
    ConstraintType.POINT_POINT_V,
    ConstraintType.POINT_TO_POINT,
]);

/** 二元夹角约束 */
export const IncludedAngleConstraint = new Set([
    ConstraintType.LINE_LINE_ANGLE,
    ConstraintType.LINE_LINE_PARALLEL,
    ConstraintType.LINE_LINE_PERPENDICULAR,
]);

/** 线与线距离约束 */
export const LineDistanceConstraint = new Set([
    ConstraintType.LINE_COINCIDE,
]);

/** 圆与圆距离约束 */
export const CircleDistanceConstraint = new Set([
    ConstraintType.CIRCLE_CIRCLE_TANGENT,
]);

/**
 * 相等约束
 */
export const EqualConstraint = new Set([
    ConstraintType.LINE_LINE_EQUAL,
    ConstraintType.CIRCLE_CIRCLE_EQUAL,
]);

/** 重合约束 */
export const CoincideConstraint = new Set([
    ConstraintType.POINT_COINCIDE,
    ConstraintType.POINT_ON_LINE,
    ConstraintType.POINT_ON_CIRCLE,
    ConstraintType.LINE_COINCIDE,
    ConstraintType.CIRCLE_COINCIDE,
]);

/** 完全重合约束 */
export const CCoincideConstraint = new Set([
    ConstraintType.POINT_COINCIDE,
    ConstraintType.LINE_COINCIDE,
    ConstraintType.CIRCLE_COINCIDE,
]);

/** 标注约束 */
export const MarkConstraint = new Set([
    ConstraintType.POINT_TO_POINT,
    ConstraintType.LINE_LINE_ANGLE,
]);

export const ConstraintAndPrimitives : { [key: string] : PrimitivesType[] } = {
    /** 点与点约束 */
    [ConstraintType.POINT_COINCIDE]: [PrimitivesType.POINT, PrimitivesType.POINT],
    [ConstraintType.POINT_POINT_H]: [PrimitivesType.POINT, PrimitivesType.POINT],
    [ConstraintType.POINT_POINT_V]: [PrimitivesType.POINT, PrimitivesType.POINT],
    [ConstraintType.POINT_TO_POINT]: [PrimitivesType.POINT, PrimitivesType.POINT],

    /** 点与线约束 */
    [ConstraintType.POINT_ON_LINE]: [PrimitivesType.POINT, PrimitivesType.LINE],

    /** 点与圆约束 */
    [ConstraintType.POINT_ON_CIRCLE]: [PrimitivesType.POINT, PrimitivesType.CIRCLE],

    /** 线与线约束 */
    [ConstraintType.LINE_COINCIDE]: [PrimitivesType.LINE, PrimitivesType.LINE],
    [ConstraintType.LINE_LINE_ANGLE]: [PrimitivesType.LINE, PrimitivesType.LINE],
    [ConstraintType.LINE_LINE_PARALLEL]: [PrimitivesType.LINE, PrimitivesType.LINE],
    [ConstraintType.LINE_LINE_PERPENDICULAR]: [PrimitivesType.LINE, PrimitivesType.LINE],
    [ConstraintType.LINE_LINE_EQUAL]: [PrimitivesType.LINE, PrimitivesType.LINE],

    /** 线与圆约束 */
    [ConstraintType.LINE_CIRCLE_TANGENT]: [PrimitivesType.LINE, PrimitivesType.CIRCLE],

    /** 圆与圆约束 */
    [ConstraintType.CIRCLE_COINCIDE]: [PrimitivesType.CIRCLE, PrimitivesType.CIRCLE],
    [ConstraintType.CIRCLE_CIRCLE_TANGENT]: [PrimitivesType.CIRCLE, PrimitivesType.CIRCLE],
    [ConstraintType.CIRCLE_CIRCLE_COAXIAL]: [PrimitivesType.CIRCLE, PrimitivesType.CIRCLE],
    [ConstraintType.CIRCLE_CIRCLE_EQUAL]: [PrimitivesType.CIRCLE, PrimitivesType.CIRCLE],
};
