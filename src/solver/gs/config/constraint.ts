export enum ConstraintType {

    /** unknown 未设定约束状态 */
    UNKNOWN = 'UNKNOWN',

    // 水平约束
    H_RING = 'H_RING',
    // 垂直约束
    V_RING = 'V_RING',

    // 重合约束
    COINCIDE = 'COINCIDE',
    // 相切
    TANGENT = 'TANGENT',
    // 点重合约束
    POINT_COINCIDE = 'POINT_COINCIDE',
    // 点与点角度约束
    // 点与点水平约束
    POINT_POINT_H = 'POINT_POINT_H',
    // 点与点垂直约束
    POINT_POINT_V = 'POINT_POINT_V',
    // 点与点距离约束（欧氏距离）
    POINT_TO_POINT = 'POINT_TO_POINT',
    // 点在线上约束
    POINT_ON_LINE = 'POINT_ON_LINE',
    // 点在圆上约束
    POINT_ON_CIRCLE = 'POINT_ON_CIRCLE',
    // 线与线角度约束
    LINE_LINE_ANGLE = 'LINE_LINE_ANGLE',
    // 线与线平行约束
    LINE_LINE_PARALLEL = 'LINE_LINE_PARALLEL',
    // 线与线垂直约束
    LINE_LINE_PERPENDICULAR = 'LINE_LINE_PERPENDICULAR',
    // 线重合约束
    LINE_COINCIDE = 'LINE_COINCIDE',
    // 线圆相切约束
    LINE_CIRCLE_TANGENT = 'LINE_CIRCLE_TANGENCY',
    // 圆重合约束
    CIRCLE_COINCIDE = 'CIRCLE_COINCIDE',
    // 圆圆相切约束
    CIRCLE_CIRCLE_TANGENT = 'CIRCLE_CIRCLE_TANGENT',
    // 同心圆约束
    CIRCLE_CIRCLE_COAXIAL = 'CIRCLE_CIRCLE_COAXIAL',

    EQUAL = 'EQUAL',
    // 线段距离相等约束
    LINE_LINE_EQUAL = 'LINE_LINE_EQUAL',
    // 圆半径相等约束
    CIRCLE_CIRCLE_EQUAL = 'CIRCLE_CIRCLE_EQUAL',

}
