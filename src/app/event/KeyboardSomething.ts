import { Application } from '@/app';
import { PrimitivesType } from '@/solver/gs/config';

export const KeyboardInput = {
    KeyUp: 'keyup',
};

export class KeyboardSomething {
    private _app : Application;

    constructor (app : Application) {
        this._app = app;
        this.__init();
    }

    static create (app : Application) : KeyboardSomething {
        return new this(app);
    }

    private __init () {
        const keyTypes = Object.values(KeyboardInput);

        for (const type of keyTypes) {
            window.addEventListener(type, this);
        }
    }

    handleEvent (event: KeyboardEvent) {
        const drawState = this._app.drawManager.state as any;
        const dragManager = this._app.dragManager as any;
        const cManager = this._app.cManager as any;

        if (drawState) {
            drawState.onKeyUp(event);
        }
        else if (cManager.type !== PrimitivesType.UNKNOWN) {
            this._app.cManager.onKeyUp(event);
        }
        else {
            dragManager.onKeyUp(event);
        }

        // 渲染
        this._app.onceRender();
    }
}
