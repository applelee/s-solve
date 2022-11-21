/** ------------------ 自定义模块 ------------------ */

import { IConstraintVertex } from '../interface';

/** ------------------ 分割线 ------------------ */

type MapType = Map<string, IConstraintVertex>;

export class ConstraintVertices {
    private _map : MapType;

    constructor () {
        this._map = new Map();
    }

    get map () : MapType {
        return this._map;
    }

    /**
     * 插入顶点
     * @param vertex 约束图顶点
     */
    addVertex (vertex: IConstraintVertex) {
        this._map.set(vertex.id, vertex);
    }

    /**
     * 批量插入顶点
     * @param vertices 顶点数组
     */
    addVertices (vertices: IConstraintVertex[]) {
        for (let i = vertices.length; i--;) {
            this.addVertex(vertices[i]);
        }
    }

    /**
     * 判断顶点是否存在
     * @param id 顶点数据tag
     */
    hasVertex (id: string) : boolean {
        return this._map.has(id);
    }

    /**
     * 获取顶点
     * @param id 顶点数据tag
     */
    getVertex (id: string) : IConstraintVertex | undefined {
        return this._map.get(id);
    }

    /**
     * 批量获取顶点
     * @param ids 顶点数据ids数组
     */
    getVertices (ids?: string[]) : IConstraintVertex[] {
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
     * 删除顶点
     * @param id 顶点数据id
     */
    deleteVertex (id: string) {
        this._map.delete(id);
    }

    /**
     * 批量删除顶点
     * @param ids 顶点数据ids
     */
    deleteVertices (ids?: string[]) {
        if (!ids) return this.clear();

        for (const tag of ids) {
            this.deleteVertex(tag);
        }
    }

    /**
     * 清空数据
     */
    clear () {
        this._map.clear();
    }
}
