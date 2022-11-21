import { Vector3 } from 'three';

import { VPoint, VCircle, IMouseEvent } from '@/app';
import { PrimitivesType } from '@/solver/gs/config';
import { DrawCircle } from './DrawCircle';
import { GeometryVector, GeometryCircle } from '@/solver';

export class DrawArc extends DrawCircle {
    private _current : number = 0;
    private _first? : VPoint;
    private _second? : VPoint;

    private __drawArc (vertex: Vector3) {
        if (!this._center) {
            this._center = this.__drawPoint(vertex);
            this._first = this.__drawPoint(vertex);
            this._second = this.__drawPoint(vertex);
            this._current = 1;
            this._preview.push(this._center, this._first, this._second);
        }

        const radius = 0;
        this._circle = new VCircle({
            position: vertex,
            radius,
        });
        this._circle.setResolution(this._app.vcamera.width, this._app.vcamera.height);

        /** 结构关系 */
        this._center.userData.sType = PrimitivesType.ARC;
        this._first!.userData.sType = PrimitivesType.ARC;
        this._second!.userData.sType = PrimitivesType.ARC;
        this._circle.userData.sType = PrimitivesType.ARC;
        this._circle.userData.type = PrimitivesType.ARC;
        this._center.userData.struct.push(this._circle.userData.id);
        this._first!.userData.struct.push(this._circle.userData.id);
        this._second!.userData.struct.push(this._circle.userData.id);
        this._circle.userData.struct.push(this._center.userData.id, this._first!.userData.id, this._second!.userData.id);

        this._preview.push(this._circle);

        /** 添加图元 */
        this._app.vscene.addChild(this._circle);
        this._app.cgUtil.initCGVertices();
    }

    protected __update (vertex: Vector3) {
        if (!this._current) return;

        const opt = this._circle?.options;
        const v1 = [this._first!.position.x, this._first!.position.y];
        let v2 = [vertex.x, vertex.y];
        let center = [];
        let radius = 0;
        let clockwise = false;

        if (this._current === 1) {
            const theta = 75 * Math.PI / 180;
            const b = GeometryVector.pointToPoint(v1, v2) / 2;
            radius = b / Math.cos(theta);
            const [c1, c2] = GeometryCircle.centerPPR(v1, v2, radius);
            const aspect = GeometryVector.aspect(v1, c1, v2);
            center = aspect > 0 ? c1 : c2;

            clockwise = true;
            radius = GeometryVector.pointToPoint(v2, center);
            this._center?.update(new Vector3(center[0], center[1], 0));
            this._second?.update(vertex);
        }
        else {
            v2 = [this._second!.position.x, this._second!.position.y];
            const x3 = [vertex.x, vertex.y];
            center = GeometryCircle.centerPPP(v1, v2, x3);

            radius = GeometryVector.pointToPoint(center, x3);
            this._center?.update(new Vector3(center[0], center[1], 0));
        }

        const startAngle = Math.atan2(v1[1] - center[1], v1[0] - center[0]);
        const endAngle = Math.atan2(v2[1] - center[1], v2[0] - center[0]);
        const aspect = GeometryVector.aspect(v1, [vertex.x, vertex.y], v2);

        if (aspect < 0) {
            clockwise = true;
        }

        this._circle?.update({
            clockwise,
            startAngle,
            endAngle,
            position: new Vector3(this._center!.position.x, this._center!.position.y, 0),
            radius: radius || GeometryVector.pointToPoint([vertex.x, vertex.y], [opt?.position.x as number, opt?.position.y as number]),
        });
    }

    onMouseUp (ievent: IMouseEvent) : boolean {
        const { vertex } = ievent;

        if (!this._circle) {
            this.__drawArc(vertex);
        }
        else if (this._current === 1) {
            this._current = 2;
        }
        else {
            this.__update(vertex);
            this._center = undefined;
            this._circle = undefined;
            this._first = undefined;
            this._second = undefined;
            this._current = 0;
            this._preview = [];
        }

        return false;
    }

    onMouseMove(ievent: IMouseEvent) : boolean {
        this.__update(ievent.vertex);
        return false;
    }

    onKeyUp () : boolean {
        console.log('out draw circle');
        this.deletePreview();
        this._app.drawManager.cancel();
        return false;
    }
}
