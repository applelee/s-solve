import { IMouseEvent } from "./MouseSomething";

export interface IDefaultEvent {
    onClick (ievent: IMouseEvent) : boolean

    onDoubleClick (ievent: IMouseEvent) : boolean

    onMouseDown (ievent: IMouseEvent) : boolean

    onMouseUp (ievent: IMouseEvent) : boolean

    onMouseMove (ievent: IMouseEvent) : boolean

    onDragStart (ievent: IMouseEvent) : boolean

    onDragMove (ievent: IMouseEvent) : boolean

    onDragEnd (ievent: IMouseEvent) : boolean

    onKeyUp (event: KeyboardEvent) : boolean
}
