import { Application } from '@/app';
import { App } from 'vue';

export class CanvasUtils {
    app! : Application;
    api! : { [key : string] : any };

    constructor (vm: App, root: HTMLElement, win: any) {
        if (!root) return;

        this.app = Application.create({
            canvas: root,
            width: win.innerWidth,
            height: win.innerHeight,
            vm,
        });
        this.api = this.__getApi();

        this.__eventHandle();
    }

    private __getApi () : any {
        return {
            /** 绘制 */
            drawPoint: () => {
                this.app.drawManager.drawPoint();
            },
            drawLine: () => {
                this.app.drawManager.drawLine();
            },
            drawCircle: () => {
                this.app.drawManager.drawCircle();
            },
            drawArc: () => {
                this.app.drawManager.drawArc();
            },
            drawRectangle1: () => {
                this.app.drawManager.drawRectangle();
            },

            vertical: () => {
                this.app.cManager.vertical();
            },
            horizontal: () => {
                this.app.cManager.horizontal();
            },
            coincide: () => {
                this.app.cManager.coincide();
            },
            tangent: () => {
                this.app.cManager.tangent();
            },
            parallel: () => {
                this.app.cManager.parallel();
            },
            perpendicular: () => {
                this.app.cManager.perpendicular();
            },
            equal: () => {
                this.app.cManager.equal();
            },
        };
    }

    private __eventHandle () {
        window.addEventListener('resize', () => {
            this.app.updateCanvas(window.innerWidth, window.innerHeight);
        });
    }
}
