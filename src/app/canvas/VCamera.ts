import { OrthographicCamera, Vector3 } from 'three';

export class VCamera {
    private _camera : OrthographicCamera;
    private _width: number;
    private _height: number;

    constructor (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._camera = new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -100, 100);
    }

    static create (width: number, height: number) {
        return new this(width, height);
    }

    get origin () : OrthographicCamera {
        return this._camera;
    }

    get width () : number {
        return this._width;
    }

    get height () : number {
        return this._height;
    }

    update (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._camera.left = -width / 2;
        this._camera.right = width / 2;
        this._camera.top = height / 2;
        this._camera.bottom = -height / 2;
        this._camera.updateProjectionMatrix();
    }

    transformXY (x: number, y: number) : Vector3 {
        const hWidth = this._width / 2;
        const hHeight = this._height / 2;
        return new Vector3(x - hWidth, -y + hHeight, 0);
    }
}
