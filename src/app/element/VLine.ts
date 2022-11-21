import { Color, Vector2, Vector3 } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';

import { VColor } from '@/app';
import { PrimitivesType } from '@/solver/gs/config';
import { IElement } from './IElement';
import { PValue } from '@/solver/gs/common';

export type LineParams = {
    color?: number,
    /** 线宽 */
    linewidth?: number,
    /** 顶点数组 */
    vertices?: Vector3[],
}

export class VLine extends Line2 implements IElement {
    private _options = {
        color: VColor.DEFAULT,
        linewidth: 1.4,
        vertices: [new Vector3(), new Vector3()],
    };

    constructor (params: LineParams = {}) {
        super();

        Object.assign(this._options, params);
        this.__init();
    }

    private __init () {
        const material = this.material;
        const [v1, v2] = this._options.vertices;

        material.color.set(this._options.color);
        this.material.linewidth = this._options.linewidth;
        this.userData = {
            id: this.uuid,
            color: new Color(this._options.color),
            type: PrimitivesType.LINE,
            struct: [],
            sData: {
                x: [new PValue(v1.x), new PValue(v1.y), new PValue(v2.x), new PValue(v2.y)],
            },
        };

        this.__setLineVertices(this._options.vertices);
    }

    private __setLineVertices (vertices: Vector3[]) {
        const positions : number[] = [];

        for (const v of vertices) {
            positions.push(v.x, v.y, v.z);
        }
        this.geometry.setPositions(positions);
        this.userData.sData.x = [new PValue(vertices[0].x), new PValue(vertices[0].y), new PValue(vertices[1].x), new PValue(vertices[1].y)];
        this.computeLineDistances();
    }

    setColor (color: number) {
        this.material.color.set(color);
        this.userData.color.set(color);
    }

    setResolution (width: number, height: number) {
        this.material.resolution = new Vector2(width, height);
    }

    update (params: LineParams | any) {
        this.__setLineVertices(params.vertices);
    }
}
