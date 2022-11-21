import { Vector3 } from 'three';

import { VPoint, VCircle, IMouseEvent } from '@/app';
import { PrimitivesType } from '@/solver/gs/config';
import { DrawCommand } from './DrawCommand';
import { GeometryVector } from '@/solver';

export class DrawCircle extends DrawCommand {
    protected _center? : VPoint;
    protected _circle? : VCircle;

    private __drawCircle (vertex: Vector3) {
        if (!this._center) {
            this._center = this.__drawPoint(vertex);
            this._preview.push(this._center);
        }

        const radius = 0;
        this._circle = new VCircle({
            position: vertex,
            radius,
        });
        this._circle.setResolution(this._app.vcamera.width, this._app.vcamera.height);

        /** 结构关系 */
        this._center.userData.sType = PrimitivesType.CIRCLE;
        this._circle.userData.sType = PrimitivesType.CIRCLE;
        this._center.userData.struct.push(this._circle.userData.id);
        this._circle.userData.struct.push(this._center.userData.id);

        this._preview.push(this._circle);

        /** 添加图元 */
        this._app.vscene.addChild(this._circle);
        this._app.cgUtil.initCGVertices();
    }

    protected __update (vertex: Vector3) {
        const opt = this._circle?.options;

        this._circle?.update({
            radius: GeometryVector.pointToPoint([vertex.x, vertex.y], [opt?.position.x as number, opt?.position.y as number]),
        });
    }

    onMouseUp (ievent: IMouseEvent) : boolean {
        console.log('draw circle');
        const { vertex } = ievent;

        // this.__drawCircle(event);
        if (!this._circle) {
            this.__drawCircle(vertex);
        }
        else {
            this.__update(vertex);
            this._center = undefined;
            this._circle = undefined;
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
