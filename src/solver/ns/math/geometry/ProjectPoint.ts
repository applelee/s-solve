export class ProjectPoint {
    static pointToLine2D (p0: number[], p1: number[], p2: number[]) : number[] {
        const P = [p0[0] - p1[0], p0[1] - p1[1]];
        const Q = [p2[0] - p1[0], p2[1] - p1[1]];
        const slen = Q[0] ** 2 + Q[1] ** 2;
        const dot = P[0] * Q[0] + P[1] * Q[1];

        return [Q[0] * (dot / slen) + p1[0], Q[1] * (dot / slen) + p1[1]];
    }
}
