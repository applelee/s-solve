import { Scene, Color } from 'three';
import { BaseColor, IElement } from '@/app';

export class VScene {
    private _scene : Scene;
    private _pickScene : Scene;
    private _pickMap : Map<number, IElement>;
    // 增量id
    private _incrementId : number;

    // 默认增量
    static DEFAULT_INCREMENT = 1;

    constructor () {
        this._scene = new Scene();
        this._pickScene = new Scene();
        this._pickMap = new Map();
        this._incrementId = 1;
        this._scene.background = new Color(BaseColor.WHITE);
    }

    get origin () : Scene {
        return this._scene;
    }

    get pickMap () : Map<number, IElement> {
        return this._pickMap;
    }

    get pickScene () {
        return this._pickScene;
    }

    get children () : IElement[] {
        return this._scene.children as IElement[];
    }

    addChild (element: IElement) {
        const clone : any = element.clone();
        clone.material = clone.material.clone();
        clone.material.color = new Color(this._incrementId);
        element.userData.clone = clone;

        this._pickMap.set(this._incrementId, element);
        this._scene.add(element);
        this._pickScene.add(clone);
        this._incrementId += VScene.DEFAULT_INCREMENT;
    }

    deleteChildren (elements: IElement[]) {
        for (const element of elements) {
            this._scene.remove(element);
            this._pickScene.remove(element.userData.clone as IElement);
        }
    }

    getPickData (id: number) : IElement | undefined {
        return this._pickMap.get(id);
    }

    // static findElement (id: string, elements: IElement[]) {
    //     for (const el of elements) {
    //         if (id === el.userData.id) {
    //             return el as IElement;
    //         }
    //     }
    // }

    // static findElements (ids: string[], elements: IElement[]) {
    //     const result = [];

    //     for (const id of ids) {
    //         result.push(ElementUtil.findElement(id, elements));
    //     }
    //     return result;
    // }
}
