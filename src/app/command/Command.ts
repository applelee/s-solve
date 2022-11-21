import { Application, IDefaultEvent, IMouseEvent } from "@/app";

export class Command implements IDefaultEvent {
    protected _app : Application;

    constructor (app: Application) {
        this._app = app;
    }

    onClick (ievent: IMouseEvent) : boolean { return false; }

    onDoubleClick(ievent: IMouseEvent): boolean { return false; }

    onMouseDown (ievent: IMouseEvent) : boolean { return false; }

    onMouseUp (ievent: IMouseEvent) : boolean { return false; }

    onMouseMove (ievent: IMouseEvent) : boolean { return false; }

    onDragStart (ievent: IMouseEvent) : boolean { return false; }

    onDragMove (ievent: IMouseEvent) : boolean { return false; }

    onDragEnd (ievent: IMouseEvent) : boolean { return false; }

    onKeyUp (event: KeyboardEvent) : boolean { return false; }
}
