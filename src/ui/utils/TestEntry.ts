import * as dat from 'dat.gui';
import { Application } from '@/app';

export class TestEntry {
    app! : Application;

    init () {
        const rootElement = document.getElementById('app');
        if (!rootElement) return;

        this.__initGUI();
        this.__etcFunc();
    }

    static run () {
        new TestEntry().init();
    }

    private __initGUI () {
        const gui = new dat.GUI();
        const fns = this.__getFns();

        const draw = gui.addFolder('基础图元');
        draw.open();
        draw.add(fns, 'drawPoint').name('点');
        draw.add(fns, 'drawLine').name('线');
        draw.add(fns, 'drawCircle').name('圆');
        draw.add(fns, 'drawRectangle').name('矩形');

        const constraint = gui.addFolder('约束');
        constraint.open();
        constraint.add(fns, 'vertical').name('竖直约束');
        constraint.add(fns, 'horizontal').name('水平约束');
        constraint.add(fns, 'coincide').name('重合约束');
        constraint.add(fns, 'pointOnLine').name('点在线上');
        constraint.add(fns, 'pointOnCircle').name('点在圆上');
        constraint.add(fns, 'lineCircleTangent').name('线圆相切');
        constraint.add(fns, 'circleCircleTangent').name('圆圆相切');
    }

    private __getFns () : any {
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
            drawRectangle: () => {
                this.app.drawManager.drawRectangle();
            },

            /** 约束 */
            vertical: () => {
                this.app.cManager.vertical();
            },
            horizontal: () => {
                this.app.cManager.horizontal();
            },
            coincide: () => {
                this.app.cManager.coincide();
            },
        };
    }

    private __etcFunc () {
        window.addEventListener('resize', () => {
            this.app.updateCanvas(window.innerWidth, window.innerHeight);
        });
    }
}
