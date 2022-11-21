import { Application } from '@/app';
import { WebGLRenderer, WebGLRenderTarget } from 'three';

export class VRenderer {
    private _app : Application;
    private _pickData : Map<number, number>;
    private _renderer : WebGLRenderer;
    private _renderTarget : WebGLRenderTarget;
    private _pixelBuffer : Uint8Array;
    private _loopStart : boolean;

    static RADUIS = 5;

    constructor (app: Application) {
        this._app = app;
        const { width, height } = app.vcamera;
        this._loopStart = false;
        this._pickData = new Map();
        this._renderTarget = new WebGLRenderTarget(width, height);
        this._renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this._renderer.setSize(width, height);

        const length = VRenderer.RADUIS * 2 + 1;
        this._pixelBuffer = new Uint8Array(length * length * 4);
    }

    static create (app: Application) : VRenderer {
        return new this(app);
    }

    get domElement () : HTMLElement {
        return this._renderer.domElement;
    }

    get origin () : WebGLRenderer {
        return this._renderer;
    }

    get pixelRatio() {
        return this._renderer.getPixelRatio();
    }

    private __pickRender () {
        this._renderer.setRenderTarget(this._renderTarget);
        this._renderer.render(this._app.vscene.pickScene, this._app.vcamera.origin);
        this._renderer.setRenderTarget(null);
    }

    render () {
        this._renderer.render(this._app.vscene.origin, this._app.vcamera.origin);
    }

    update (width: number, height: number) {
        this._renderer.setSize(width, height);
        this._renderTarget.setSize(width, height);
    }

    /** GPU拾取 */
    getIds(x0: number, y0: number) {
        if (this._loopStart) return this._pickData;

        this._loopStart = true;
        const buff = this._pixelBuffer;
        const px = this.pixelRatio;
        const x = x0 * px;
        const y = (this._renderTarget.height - y0) * px;
        const r = VRenderer.RADUIS * px;
        const xMin = Math.max(x - r - px, 0);
        const xMax = Math.min(x + r, this._renderTarget.width);
        const yMin = Math.max(y - r - px, 0);
        const yMax = Math.min(y + r, this._renderTarget.height);
        const width = xMax - xMin;
        const height = yMax - yMin;

        this.__pickRender();
        this._renderer.readRenderTargetPixels(this._renderTarget, xMin, yMin, width, height, buff);

        const ret = new Map<number, number>();

        let i = 0;
        for (let py = yMin; py < yMax; py++) {
            for (let px = xMin; px < xMax; px++, i += 4) {
                const id = (buff[i] << 16) | (buff[i + 1] << 8) | buff[i + 2];

                if (!id) continue;

                const d = Math.abs(px - x) + Math.abs(py - y);
                const d0 = ret.get(id);

                if (d0 === undefined || d0 > d) {
                    ret.set(id, d);
                }
            }
        }
        this._pickData = ret;
        this._loopStart = false;

        return ret;
    }
}
