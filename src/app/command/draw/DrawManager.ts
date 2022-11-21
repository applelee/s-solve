import { Application } from '@/app';
import { DrawCommand } from './DrawCommand';
import { DrawPoint } from './DrawPoint';
import { DrawLine } from './DrawLine';
import { DrawCircle } from './DrawCircle';
import { DrawArc } from './DrawArc';
import { DrawRectangle } from './DrawRectangle';

export class DrawManager {
    private _app : Application;
    private _state? : DrawCommand;

    constructor (app: Application) {
        this._app = app;
    }

    static create (app: Application) : DrawManager {
        return new this(app);
    }

    get state () : DrawCommand | undefined {
        return this._state;
    }

    private __changeState (draw: DrawCommand) {
        this._state = draw;
        this._app.dragManager.cancel();
        this._app.cManager.cancel();
    }

    drawPoint () {
        this.__changeState(new DrawPoint(this._app));
    }

    drawLine () {
        this.__changeState(new DrawLine(this._app));
    }

    drawCircle () {
        this.__changeState(new DrawCircle(this._app));
    }

    drawArc () {
        this.__changeState(new DrawArc(this._app));
    }

    drawRectangle () {
        this.__changeState(new DrawRectangle(this._app));
    }

    cancel () {
        this._state = undefined;
    }
}
