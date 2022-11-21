import { VScene, VCamera, VRenderer } from './canvas';
import { KeyboardSomething, MouseSomething } from './event';
import { DrawManager, DragManager, ConstraintManager } from './command';
import { CGUtil } from './utils';
import { App } from 'vue';
import { UIUtil } from '@/ui/utils';
import { ErrorCatch } from './common';

export type ApplicationParams = {
    canvas: HTMLElement,
    width: number;
    height: number;
    vm: App,
}

export class Application {
    protected _animationId : number = 0;

    canvas: HTMLElement;
    vscene : VScene;
    vcamera : VCamera;
    vrenderer : VRenderer;

    drawManager : DrawManager;
    dragManager : DragManager;
    cManager : ConstraintManager;
    cgUtil : CGUtil;
    uiUtil : UIUtil;

    mouseSomething: MouseSomething;
    keyboardSomething: KeyboardSomething;

    constructor (params: ApplicationParams) {
        this.canvas = params.canvas;
        this.vscene = new VScene();
        this.vcamera = new VCamera(params.width, params.height);
        this.vrenderer = new VRenderer(this);

        this.drawManager = new DrawManager(this);
        this.dragManager = new DragManager(this);
        this.cManager = new ConstraintManager(this);
        this.cgUtil = new CGUtil(this);
        this.uiUtil = new UIUtil(params.vm);

        this.mouseSomething = new MouseSomething(this);
        this.keyboardSomething = new KeyboardSomething(this);

        ErrorCatch.catchHandle(() => {
            this.__init();
        });
    }

    static create (attr: ApplicationParams) {
        return new this(attr);
    }

    protected __init () {
        this.canvas.append(this.vrenderer.domElement);

        // 屏蔽右键
        document.addEventListener('contextmenu', e => e.preventDefault());

        this.onceRender();

        // this.test();
    }

    onceRender () {
        this.vrenderer.render();
    }

    loopRender () {
        const animation = () => {
            this._animationId = requestAnimationFrame(animation);
            this.onceRender();
        };
        animation();
    }

    stopLoopRender (id?: number) {
        cancelAnimationFrame(id || this._animationId);
    }

    updateCanvas (width: number, height: number) {
        this.vcamera.update(width, height);
        this.vrenderer.update(width, height);
    }
}
