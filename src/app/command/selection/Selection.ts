import { Color } from "three";
import { IMouseEvent, IElement, VColor } from "@/app";
import { Command } from '../Command';
// import { IConstraintVertex } from "@/solver/gs/interface";

export class Selection extends Command {
    protected _over : IElement[] = [];
    protected _select : IElement[] = [];

    protected __overItem (picks: IElement[]) {
        for (const v of this._over) {
            if (v.userData.isSelect) {
                v.material.color.setHex(VColor.VRED);
                continue;
            };

            v.material.color = (v.userData.color as Color).clone();
        }

        this._over = picks.length > 0 ? [picks[0]] : [];
        if (this._over.length < 1) return;

        for (const v of this._over) {
            v.material.color.setHex(VColor.PINK);
        }
    }

    protected __selectItem (picks: IElement[]) {
        for (const v of this._select) {
            const data = (v as any);
            data.material.color = data.userData.color.clone();
            data.userData.isSelect = false;
        }

        this._select = picks;
        if (this._select.length < 1) return;

        for (const v of this._select) {
            v.material.color.setHex(VColor.VRED);
            v.userData.isSelect = true;
        }
    }

    protected __unselectItem () {
        for (const v of this._select) {
            const data = (v as any);
            data.material.color = data.userData.color.clone();
            data.userData.isSelect = false;
        }

        this._select = [];
        this._app.onceRender();
    }

    protected __deleteSelectItem () {
        this._app.vscene.deleteChildren(this._select);
        this._select = [];
    }

    onMouseUp (ievent: IMouseEvent) : boolean {
        const { picks } = ievent;
        const temps : IElement[] = picks[0] ? [picks[0]] : [];
        // const data = this._app.cgUtil.cgm.ConstraintVertices.getVertex(picks[0].userData.id as string) as IConstraintVertex;

        this.__selectItem(temps);
        // this._app.uiUtil.selectHandle([data]);
        return false;
    }

    onMouseMove (ievent: IMouseEvent) : boolean {
        const { picks } = ievent;
        const temps : IElement[] = picks[0] ? [picks[0]] : [];
        // const data = this._app.cgUtil.cgm.ConstraintVertices.getVertex(picks[0].userData.id as string) as IConstraintVertex;

        this.__overItem(temps);
        // this._app.uiUtil.selectHandle([data]);
        return false;
    }
}
