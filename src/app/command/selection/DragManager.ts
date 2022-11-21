import { IMouseEvent, ElementUtil } from '@/app';
import { IElement, VCircle } from '@/app/element';
import { GeometryVector, ProjectPoint } from '@/solver';
import { CircleInspect, ConstraintStateEnum, PrimitivesType } from '@/solver/gs/config';
import { Vector3 } from 'three';
import { Selection } from './Selection';

export class DragManager extends Selection {
    private _dragItem? : IElement;
    private _startVertex : Vector3 = new Vector3();

    private __updatePoint (item: IElement, vertex: Vector3) {
        const allElement = this._app.vscene.children;
        const struct = item.userData.struct as string[];
        const elements = ElementUtil.findElements(struct, allElement) as IElement[];

        for (const element of elements) {
            if (element.userData.type === PrimitivesType.CIRCLE) {
                element.update({
                    position: vertex,
                });
            }
            else if (element.userData.type === PrimitivesType.LINE) {
                const id = element.userData.id;
                const rs = element.userData.struct as string[];
                const [p1, p2] = ElementUtil.findElements(rs, allElement) as IElement[];
                const cv = this._app.cgUtil.cgm.ConstraintVertices.getVertex(id);
                const x1 = p1.userData.sData.x;
                const x2 = p2.userData.sData.x;
                let vertices : Vector3[] = [];

                if (item === p1) {
                    if (cv?.state === ConstraintStateEnum.COMPLETE || cv?.state === ConstraintStateEnum.OVER) {
                        const pp = ProjectPoint.pointToLine2D([vertex.x, vertex.y], [x1[0].v, x1[1].v], [x2[0].v, x2[1].v]);
                        vertices = [new Vector3(pp[0], pp[1], 0), new Vector3(x2[0].v, x2[1].v, 0)];

                        vertex.x = pp[0];
                        vertex.y = pp[1];
                    }
                    else {
                        vertices = [vertex, new Vector3(x2[0].v, x2[1].v, 0)];
                    }
                    element.update({
                        vertices,
                    });
                }
                else if (item === p2) {
                    if (cv?.state === ConstraintStateEnum.COMPLETE || cv?.state === ConstraintStateEnum.OVER) {
                        const pp = ProjectPoint.pointToLine2D([vertex.x, vertex.y], [x1[0].v, x1[1].v], [x2[0].v, x2[1].v]);
                        vertices = [new Vector3(x1[0].v, x1[1].v, 0), new Vector3(pp[0], pp[1], 0)];

                        vertex.x = pp[0];
                        vertex.y = pp[1];
                    }
                    else {
                        vertices = [new Vector3(x1[0].v, x1[1].v, 0), vertex];
                    }
                    element.update({
                        vertices,
                    });
                }
            }
        }

        item.update(vertex);
    }

    private __updateLine (item: IElement, vertex: Vector3) {
        const struct = item.userData.struct as string[];
        const elements = ElementUtil.findElements(struct, this._app.vscene.children) as IElement[];
        const positions = elements.map(e => e.position.clone());
        const dragVertex = new Vector3().subVectors(vertex, this._startVertex);
        positions.map(v => v.add(dragVertex));

        for (let i = 0; i < elements.length; i++) {
            // elements[i].update(positions[i]);
            this.__updatePoint(elements[i], positions[i]);
        }

        item.update({
            vertices: positions,
        });
        this._startVertex.add(dragVertex);
    }

    private __updateCircle (item: IElement, vertex: Vector3) {
        const opt = (item as VCircle).options;
        const radius = GeometryVector.pointToPoint([vertex.x, vertex.y], [opt.position.x, opt.position.y]);

        item.update({
            radius,
        });
    }

    private __updateConstraintData () {
        this._app.cgUtil.cgm.numericalSolution();
    }

    onKeyUp (event: KeyboardEvent) : boolean {
        if (event.code === 'Escape') {
            this.__unselectItem();
        }
        else if (event.code === 'Delete') {
            this.__deleteSelectItem();
        }
        return false;
    }

    onDragStart (ievent: IMouseEvent) : boolean {
        const item = ievent.picks[0];
        this._startVertex = ievent.vertex;

        if (item) {
            this._dragItem = item;
        }
        return false;
    }

    onDragMove (ievent: IMouseEvent) : boolean {
        const { vertex } = ievent;
        const item = this._dragItem as IElement;
        if (!item) return false;
        const type = item.userData.type;
        const cvsMap = this._app.cgUtil.cgm.ConstraintVertices;
        const cv = cvsMap.getVertex(item.userData.id as string);

        if (cv?.state === ConstraintStateEnum.COMPLETE) return false;
        if (type === PrimitivesType.POINT) {
            this.__updatePoint(item, vertex);
        }
        else if (type === PrimitivesType.LINE) {
            this.__updateLine(item, vertex);
        }
        else if (CircleInspect.has(type)) {
            this.__updateCircle(item, vertex);
        }

        setTimeout(() => this.__updateConstraintData(), 250);
        return false;
    }

    onDragEnd () {
        this._dragItem = undefined;
        this._startVertex = new Vector3();
        return false;
    }

    cancel () {
        this.__unselectItem();
    }
}
