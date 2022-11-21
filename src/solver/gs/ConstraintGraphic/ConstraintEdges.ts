/** ------------------ 自定义模块 ------------------ */

import { IConstraintEdge } from '../interface';

/** ------------------ 分割线 ------------------ */

type MapType = Map<number, IConstraintEdge>;

export class ConstraintEdges {
    private _map : MapType;

    constructor () {
        this._map = new Map();
    }

    get map () : MapType {
        return this._map;
    }

    /**
     * 插入边
     * @param edge 约束二元组
     */
    addEdge (edge: IConstraintEdge) {
        this._map.set(edge.id, edge);
    }

    /**
     * 批量插入边
     * @param edges 约束二元组数组
     */
    addEdges (edges: IConstraintEdge[]) {
        for (let i = edges.length; i--;) {
            this.addEdge(edges[i]);
        }
    }

    /**
     * 获取边
     * @param id 约束id
     */
    getEdge (id: number) : IConstraintEdge | undefined {
        return this._map.get(id);
    }

    /**
     * 批量获取顶点
     * @param ids 顶点数据id数组
     */
    getEdges (ids?: number[]) : IConstraintEdge[] {
        if (!ids) return [...this._map.values()];

        const result = [];
        const values = [...this._map.values()];

        for (let i = values.length; i--;) {
            const value = values[i];
            if (ids.includes(value.id)) result.push(value);
        }
        return [...this._map.values()];
    }

    /**
     * 删除边
     * @param id 约束id
     */
    deleteEdge (id: number) {
        this._map.delete(id);
    }

    /**
     * 批量删除边
     * @param ids 约束id数组
     */
    deleteEdges (ids?: number[]) {
        if (!ids) return this.clear();

        for (const id of ids) {
            this.deleteEdge(id);
        }
    }

    /**
     * 清空数据
     */
    clear () {
        this._map.clear();
    }
}
