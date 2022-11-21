import { App } from 'vue';
import { IConstraintVertex } from '@/solver/gs/interface';

export class UIUtil {
    constructor (public vm: App) {}

    elementData (data: IConstraintVertex[]) {
        this.vm.config.globalProperties.$mitter.emit("elementData", data);
    }
}
