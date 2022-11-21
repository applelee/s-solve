import { IMouseEvent } from '@/app';
import { DrawCommand } from './DrawCommand';

export class DrawPoint extends DrawCommand {
    onMouseUp (ievent: IMouseEvent): boolean {
        console.log('draw point');
        this.__drawPoint(ievent.vertex);
        this._app.cgUtil.initCGVertices();
        return false;
    }

    onKeyUp () : boolean {
        console.log('out draw point');
        this._app.drawManager.cancel();
        return false;
    }
}
