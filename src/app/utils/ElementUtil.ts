import { IElement } from '../element';

export class ElementUtil {
    static findElement (id: string, elements: IElement[]) {
        for (const el of elements) {
            if (id === el.userData.id) {
                return el as IElement;
            }
        }
    }

    static findElements (ids: string[], elements: IElement[]) {
        const result = [];

        for (const id of ids) {
            result.push(ElementUtil.findElement(id, elements));
        }
        return result;
    }
}
