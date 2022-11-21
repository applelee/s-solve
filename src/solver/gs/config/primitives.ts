export enum PrimitivesType {
    UNKNOWN = 'UNKNOWN',
    POINT = 'CPoint',
    LINE= 'CLine',
    CIRCLE = 'CCircle',
    ARC = 'CARC',
}

/** 权重 */
export const PrimitivesWeight = {
    [PrimitivesType.UNKNOWN]: 0,
    [PrimitivesType.POINT]: 1,
    [PrimitivesType.CIRCLE]: 2,
    [PrimitivesType.LINE]: 3,
    [PrimitivesType.ARC]: 3,
};

/** 图元自由度对照表 */
export const PrimitivesFreeDegree = {
    [PrimitivesType.UNKNOWN]: 0,
    [PrimitivesType.POINT]: 2,
    [PrimitivesType.LINE]: 2,
    [PrimitivesType.CIRCLE]: 3,
    [PrimitivesType.ARC]: 7,
};

/** 复合图元 */
export const CompoundInspect = new Set([
    PrimitivesType.LINE,
    PrimitivesType.CIRCLE,
]);

/** 圆 */
export const CircleInspect = new Set([
    PrimitivesType.CIRCLE,
    PrimitivesType.ARC,
]);
