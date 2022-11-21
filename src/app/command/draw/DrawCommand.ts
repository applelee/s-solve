import { Vector3 } from 'three';
import { IElement, VPoint, VLine } from '@/app/element';
import { Command } from '../Command';

export class DrawCommand extends Command {
    protected _preview : IElement[] = [];

    protected __drawPoint (vertex: Vector3) : VPoint {
        const point = new VPoint({
            position: vertex,
        });

        this._app.vscene.addChild(point);
        return point;
    }

    protected __drawLine (start: Vector3, end: Vector3) : VLine {
        const line = new VLine({
            vertices: [start, end],
        });

        line.setResolution(this._app.vcamera.width, this._app.vcamera.height);
        this._app.vscene.addChild(line);
        return line;
    }

    deletePreview () {
        this._app.vscene.deleteChildren(this._preview);
        this._preview = [];

        this._app.cgUtil.initCGVertices();
    }
}
