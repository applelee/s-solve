import { Vector3 } from 'three';
import { IMouseEvent } from '@/app';
import { DrawCommand } from './DrawCommand';
import { PrimitivesType } from '@/solver/gs/config';
import { IConstraintVertex } from '@/solver/gs/interface';

/** 两点矩形 */
export class DrawRectangle extends DrawCommand {
    private _first? : Vector3;
    private _second? : Vector3;

    get vertices () : Vector3[] {
        const f = this._first;
        const s = this._second;

        if (!f || !s) return [];

        return [f, new Vector3(s.x, f.y, 0), s, new Vector3(f.x, s.y, 0)];
    }

    private __drawRectangle (vertex: Vector3) {
        if (!this._first) {
            this._first = vertex;
        }
        this._second = vertex;

        if (this.vertices.length > 0) {
            const len = this.vertices.length;
            for (let i = 0; i < len; i++) {
                const current = this.vertices[i];
                const j = i + 1 < len ? i + 1 : 0;
                const next = this.vertices[j];
                const point = this.__drawPoint(current);
                const line = this.__drawLine(current, next);

                point.userData.sType = PrimitivesType.LINE;
                line.userData.sType = PrimitivesType.LINE;

                this._preview.push(point);
                this._preview.push(line);
            }

            this._app.cgUtil.initCGVertices();
        }
    }

    private __updataRectangle (vertex: Vector3) {
        const p0 = this._preview[0];
        const p1 = this._preview[1];
        const p2 = this._preview[2];
        const p3 = this._preview[3];
        const p4 = this._preview[4];
        const p5 = this._preview[5];
        const p6 = this._preview[6];
        const p7 = this._preview[7];

        const x0 = p0.userData.sData.x;
        const x2 = p2.userData.sData.x;
        const x4 = p4.userData.sData.x;
        const x6 = p6.userData.sData.x;

        x2[0].v = vertex.x;
        x4[0].v = vertex.x;
        x4[1].v = vertex.y;
        x6[1].v = vertex.y;

        p1.update({
            vertices: [new Vector3(x0[0].v, x0[1].v, 0), new Vector3(x2[0].v, x2[1].v, 0)],
        });
        p2.update(new Vector3(x2[0].v, x2[1].v, 0));
        p3.update({
            vertices: [new Vector3(x2[0].v, x2[1].v, 0), vertex],
        });
        p4.update(new Vector3(x4[0].v, x4[1].v, 0));
        p5.update({
            vertices: [vertex, new Vector3(x6[0].v, x6[1].v, 0)],
        });
        p6.update(new Vector3(x6[0].v, x6[1].v, 0));
        p7.update({
            vertices: [new Vector3(x6[0].v, x6[1].v, 0), new Vector3(x0[0].v, x0[1].v, 0)],
        });
    }

    private __createStruct () {
        const id0 = this._preview[0].userData.id as string;
        const id1 = this._preview[1].userData.id as string;
        const id2 = this._preview[2].userData.id as string;
        const id3 = this._preview[3].userData.id as string;
        const id4 = this._preview[4].userData.id as string;
        const id5 = this._preview[5].userData.id as string;
        const id6 = this._preview[6].userData.id as string;
        const id7 = this._preview[7].userData.id as string;

        this._preview[0].userData.struct = [id7, id1];
        this._preview[1].userData.struct = [id0, id2];
        this._preview[2].userData.struct = [id1, id3];
        this._preview[3].userData.struct = [id2, id4];
        this._preview[4].userData.struct = [id3, id5];
        this._preview[5].userData.struct = [id4, id6];
        this._preview[6].userData.struct = [id5, id7];
        this._preview[7].userData.struct = [id6, id0];

        const len = this._preview.length;

        for (let i = 0; i < len; i++) {
            const prev = i === 0 ? len - 1 : i - 1;
            const next = i === len - 1 ? 0 : i + 1;
            const pId = this._preview[prev].userData.id as string;
            const id = this._preview[i].userData.id as string;
            const nId = this._preview[next].userData.id as string;
            const pv = this._app.cgUtil.cgm.ConstraintVertices.getVertex(pId) as IConstraintVertex;
            const cv = this._app.cgUtil.cgm.ConstraintVertices.getVertex(id) as IConstraintVertex;
            const nv = this._app.cgUtil.cgm.ConstraintVertices.getVertex(nId) as IConstraintVertex;

            this._preview[i].userData.relations = [pId, nId];
            cv.struct = [pv, nv];
        }
    }

    onMouseUp (ievent: IMouseEvent) : boolean {
        console.log('draw rectangle');
        if (!this._first) {
            this.__drawRectangle(ievent.vertex);
        }
        else {
            this.__createStruct();
            this._first = undefined;
            this._second = undefined;
            this._preview = [];
        }
        return false;
    }

    onMouseMove (ievent: IMouseEvent): boolean {
        if (this._first) {
            this.__updataRectangle(ievent.vertex);
        }
        return false;
    }

    onKeyUp () : boolean {
        console.log('out draw line');
        this._app.drawManager.cancel();
        if (this._preview.length > 0) {
            this.deletePreview();
        }
        return false;
    }
}
