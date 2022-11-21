import { ArcCurve, Vector3, Vector2, Color } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';

import { VColor, ElementUtil } from '@/app';
import { PrimitivesType } from '@/solver/gs/config';
import { GeometryVector } from '@/solver/ns';
import { IElement } from './IElement';
import { PValue } from '@/solver/gs/common';
// import { GeometryVector } from '@/solver';

export type CircleParams = {
    position?: Vector3,
    radius?: number,
    startAngle?: number,
    endAngle?: number,
    clockwise?: boolean,
    center?: IElement,
}

export class VCircle extends Line2 implements IElement {
    private _options = {
        position: new Vector3(),
        radius: 5,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        clockwise: false,
        color: VColor.DEFAULT,
        linewidth: 1.6,
    };

    constructor (params: CircleParams) {
        super();

        Object.assign(this._options, params);
        this.__init();
    }

    get options () { return this._options; }

    private __init () {
        this.material.color.set(this._options.color);
        this.material.linewidth = this._options.linewidth;
        this.userData = {
            id: this.uuid,
            color: new Color(this._options.color),
            isSelect: false,
            type: PrimitivesType.CIRCLE,
            struct: [],
            sData: {
                r: [new PValue(this._options.radius)],
            },
        };

        const arc = this.__getArc();
        const vertices = this.__getVertices(arc);
        this.__setLineVertices(vertices);
    }

    private __getArc () {
        const opts = this._options;

        return new ArcCurve(
            opts.position.x,
            opts.position.y,
            opts.radius,
            opts.startAngle,
            opts.endAngle,
            opts.clockwise,
        );
    }

    private __getVertices (arc: ArcCurve) : Vector3[] {
        // const opts = this._options;

        // const angleS = Math.ceil(opts.startAngle * 180 / Math.PI);
        // const angleE = Math.ceil(opts.endAngle * 180 / Math.PI);
        // let angle2;

        // if (opts.clockwise) {
        //     if (angleS < 0 && angleE < 0) {
        //         angle2 = Math.abs(angleE + angleS);
        //     }
        //     else {
        //         angle2 = Math.abs(angleE - angleS);
        //     }
        // }
        // else {
        //     angle2 = 360 - Math.abs(angleE - angleS);
        // }

        // const radian = Math.abs(opts.endAngle - opts.startAngle);
        // const angle = Math.ceil(radian * 180 / Math.PI);

        // console.log(angleS, angleE,');
        // console.log(opts.clockwise, angle, angle2);
        const points = arc.getPoints(120);
        return points.map(p => new Vector3(p.x, p.y, 0));
    }

    private __setLineVertices (vertices: Vector3[]) {
        const positions : number[] = [];

        for (const v of vertices) {
            positions.push(v.x, v.y, v.z);
        }

        this.geometry.setPositions(positions);
        this.computeLineDistances();
    }

    private __updateStruct (params: CircleParams | any) {
        const opt = this._options;
        const struct = this.userData.struct;
        const radius = params.radius;
        const [, p1, p2] = ElementUtil.findElements(struct, this.parent?.children as IElement[]);
        const oldR = GeometryVector.pointToPoint([p1!.position.x, p1!.position.y], [opt.position.x, opt.position.y]);
        const n1 = GeometryVector.unitVector([p1!.position.x - opt.position.x, p1!.position.y - opt.position.y]);
        const n2 = GeometryVector.unitVector([p2!.position.x - opt.position.x, p2!.position.y - opt.position.y]);
        const nR = radius - oldR;
        const nv1 = [nR * n1[0], nR * n1[1]];
        const nv2 = [nR * n2[0], nR * n2[1]];

        p1?.update(new Vector3(nv1[0] + p1.position.x, nv1[1] + p1.position.y, 0));
        p2?.update(new Vector3(nv2[0] + p2.position.x, nv2[1] + p2.position.y, 0));
    }

    setColor (color: number) {
        this.material.color.set(color);
        this.userData.color.set(color);
    }

    setResolution (width: number, height: number) {
        this.material.resolution = new Vector2(width, height);
    }

    update(params: CircleParams | any) {
        Object.assign(this._options, params);

        if (this.userData.type === PrimitivesType.ARC) {
            if (!params.radius) return;
            this.__updateStruct(params);
        }

        const arc = this.__getArc();
        const vertices = this.__getVertices(arc);

        if (params.radius) {
            this.userData.sData.r[0].v = params.radius;
        }
        this.__setLineVertices(vertices);
    }
}
