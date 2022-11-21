import { Raycaster, Vector2, Vector3 } from 'three';

import { Application, IElement } from '@/app';
import { PrimitivesType } from '@/solver/gs/config';

const enum MouseEventType {
    MouseDown = "MouseDown",
    MouseUp = "MouseUp",
    MouseMove = "MouseMove",
    MouseDragMove = "MouseDragMove",
    MouseDragStart = "MouseDragStart",
    MouseDragEnd = "MouseDragEnd",
    MouseDragCancel = "MouseDragCancel",
    MouseClick = 'MouseClick',
    MouseDblClick = 'MouseDblClick',
}

const MouseInput = {
    MouseDown: 'mousedown',
    MouseUp: 'mouseup',
    MouseMove: 'mousemove',
};

enum MouseState {
    UP = 'UP',
    DOWN = 'DOWN',
    DRAG = 'DRAG',
};

type MapType = { [key: string]: string };

const MouseEventMap : MapType = {
    [MouseEventType.MouseDown]: "onMouseDown",
    [MouseEventType.MouseUp]: "onMouseUp",
    [MouseEventType.MouseMove]: "onMouseMove",
    [MouseEventType.MouseClick]: "onClick",
    [MouseEventType.MouseDblClick]: "onDoubleClick",
    [MouseEventType.MouseDragMove]: "onDragMove",
    [MouseEventType.MouseDragStart]: "onDragStart",
    [MouseEventType.MouseDragEnd]: "onDragEnd",
    [MouseEventType.MouseDragCancel]: "onDragCancel",
};

const tickTime = 64;

export type IMouseEvent = {
    vertex: Vector3
    picks: IElement[]
}

export class MouseSomething {
    private _app : Application;
    private _lastClickTime : number = 0;
    private _lastMoveTime : number = 0;
    private _mouseState : MouseState = MouseState.UP;

    private _ray = new Raycaster();

    constructor (app: Application) {
        this._app = app;
        this.__init();
    }

    private __init () {
        const mouseTypes = Object.values(MouseInput);

        for (const type of mouseTypes) {
            this._app.canvas.addEventListener(type, this);
        }
    }

    private __triggerEvent (type: MouseEventType, event: MouseEvent) {
        const fnName = MouseEventMap[type];
        const map = this._app.vrenderer.getIds(event.offsetX, event.offsetY);
        const items: { ve: IElement, sn: number }[] = [];

        for (const [id, d] of map.entries()) {
            const ve = this._app.vscene.getPickData(id);

            if (!ve) continue;
            items.push({ ve, sn: d });
        }

        items.sort((a, b) => b.sn - a.sn);
        const pointTemp = items.filter(item => item.ve.userData.type === PrimitivesType.POINT);
        const etcTemp = items.filter(item => item.ve.userData.type !== PrimitivesType.POINT);
        const picks = pointTemp.concat(etcTemp).map(_ => _.ve);
        const drawState = this._app.drawManager.state as any;
        const dragManager = this._app.dragManager as any;
        const cManager = this._app.cManager as any;
        const vertex = this._app.vcamera.transformXY(event.offsetX, event.offsetY);

        if (drawState) {
            drawState[fnName]({ vertex });
        }
        else if (cManager.type !== PrimitivesType.UNKNOWN) {
            cManager[fnName]({ vertex, picks });
        }
        else {
            dragManager[fnName]({ vertex, picks });
        }
    }

    handleEvent (event: MouseEvent) {
        const { type } = event;

        // 不处理右键
        if (event.button === 2) return;

        if (this._mouseState === MouseState.UP) {
            const now = Date.now();

            if (type === MouseInput.MouseDown) {
                if (now - this._lastClickTime > tickTime) {
                    this.__triggerEvent(MouseEventType.MouseDblClick, event);
                    this._lastClickTime = now;
                }
                else {
                    this.__triggerEvent(MouseEventType.MouseClick, event);
                }

                this._mouseState = MouseState.DOWN;
            }
            else if (type === MouseInput.MouseMove) {
                if (!this._app.drawManager.state) {
                    if (now - this._lastMoveTime > tickTime) {
                        this.__triggerEvent(MouseEventType.MouseMove, event);
                        this._lastMoveTime = now;
                    }
                }
                else {
                    this.__triggerEvent(MouseEventType.MouseMove, event);
                }
            }
        }
        else if (this._mouseState === MouseState.DOWN) {
            if (type === MouseInput.MouseUp) {
                this.__triggerEvent(MouseEventType.MouseUp, event);

                this._mouseState = MouseState.UP;
            }
            else if (type === MouseInput.MouseMove) {
                this.__triggerEvent(MouseEventType.MouseDragStart, event);

                this._mouseState = MouseState.DRAG;
            }
        }
        else if (this._mouseState === MouseState.DRAG) {
            if (type === MouseInput.MouseUp) {
                this.__triggerEvent(MouseEventType.MouseDragEnd, event);

                this._mouseState = MouseState.UP;
            }
            else if (type === MouseInput.MouseMove) {
                this.__triggerEvent(MouseEventType.MouseDragMove, event);
            }
        }

        // 渲染
        this._app.onceRender();
    }

    /** 射线 */
    rayHandle (event: MouseEvent) {
        const { width, height } = this._app.vcamera;
        const pointer = new Vector2();

        pointer.x = (event.offsetX / width) * 2 - 1;
        pointer.y = -(event.offsetY / height) * 2 + 1;

        this._ray.setFromCamera(pointer, this._app.vcamera.origin);
        const intersects = this._ray.intersectObjects(this._app.vscene.origin.children);

        // console.log(intersects);
        return intersects;
    }
}
