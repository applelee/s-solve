import { Vector3 } from 'three';

import { VPoint, VLine, IMouseEvent } from '@/app';
import { PrimitivesType } from '@/solver/gs/config';
import { DrawCommand } from './DrawCommand';

export class DrawLine extends DrawCommand {
    private _start? : VPoint;
    private _line? : VLine;
    private _end? : VPoint;

    private __drawLinesegment (vertex: Vector3) {
        this._preview = [];

        if (!this._end) {
            this._start = this.__drawPoint(vertex);
            this._preview.push(this._start);
        }
        else {
            this._start = this._end;
        }
        this._end = this.__drawPoint(vertex);
        this._line = this.__drawLine(this._start.position, this._end.position);

        /** 结构关系 */
        this._start.userData.sType = PrimitivesType.LINE;
        this._end.userData.sType = PrimitivesType.LINE;
        this._line.userData.sType = PrimitivesType.LINE;
        this._start.userData.struct.push(this._line.userData.id);
        this._end.userData.struct.push(this._line.userData.id);
        this._line.userData.struct.push(this._start.userData.id);
        this._line.userData.struct.push(this._end.userData.id);

        this._preview.push(this._end, this._line);
        this._app.cgUtil.initCGVertices();
    }

    private __update (vertex: Vector3) {
        const position = (this._start as VPoint).position;
        this._end?.update(new Vector3(vertex.x, vertex.y, 0));
        this._line?.update({
            vertices: [new Vector3(position.x, position.y, 0), new Vector3(vertex.x, vertex.y, 0)],
        });
    }

    onMouseUp (ievent: IMouseEvent) : boolean {
        console.log('draw line');
        this.__drawLinesegment(ievent.vertex);

        return false;
    }

    onMouseMove (ievent: IMouseEvent): boolean {
        this._end && this.__update(ievent.vertex);
        return false;
    }

    onKeyUp () : boolean {
        console.log('out draw line');
        this._start?.userData.struct.splice(1, 1);
        this.deletePreview();
        this._app.drawManager.cancel();
        return false;
    }
}
