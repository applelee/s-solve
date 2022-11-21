import { Points, PointsMaterial, BufferGeometry, BufferAttribute, Vector3, Color } from 'three';
import { VColor } from '@/app';
import { PrimitivesType } from '@/solver/gs/config';
import { IElement } from './IElement';
import { PValue } from '@/solver/gs/common';

export type CPointParams = {
    color?: number;
    size?: number;
    position: Vector3;
    transparent?: boolean;
    opacity?: number;
};

export class VPoint extends Points<BufferGeometry, PointsMaterial> implements IElement {
    private _options : CPointParams = {
        color: VColor.DEFAULT,
        size: 6,
        position: new Vector3(),
        transparent: true,
        opacity: 1,
    };

    constructor (params: CPointParams) {
        super();

        Object.assign(this._options, params);
        this.__init();
    }

    private __init () {
        const opts = this._options;

        /** geometry */
        const geo = new BufferGeometry();
        const positionAttr = new BufferAttribute(
            new Float32Array([0, 0, 0]),
            3
        );
        geo.setAttribute('position', positionAttr);

        const color = opts.color || VColor.DEFAULT;
        const size = opts.size || 20;

        /** material */
        const material = new PointsMaterial({
            color,
            size,
            transparent: !!opts.transparent,
            opacity: opts.opacity,
            depthTest: false,
            sizeAttenuation: false,
            polygonOffset: true,
            polygonOffsetFactor: -0.1,
            polygonOffsetUnits: -1.5,
        });

        material.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                'vec4 diffuseColor = vec4( diffuse, opacity );',
                `
                if (distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) discard;
                vec4 diffuseColor = vec4( diffuse, opacity );
            `
            );
        };

        this.position.set(opts.position.x, opts.position.y, opts.position.z);
        this.geometry = geo;
        this.material = material;
        this.renderOrder = 1;
        this.matrixAutoUpdate = true;
        this.userData = {
            id: this.uuid,
            color: new Color(color),
            isSelect: false,
            type: PrimitivesType.POINT,
            struct: [],
            sData: {
                x: [new PValue(this.position.x), new PValue(this.position.y)],
            },
        };
    }

    setColor (color: number) {
        this.material.color.set(color);
        this.userData.color.set(color);
    }

    setResolution () {}

    update (params: Vector3 | any) {
        this.position.set(params.x, params.y, 0);
        this.userData.sData.x = [new PValue(params.x), new PValue(params.y)];
        this.userData.clone.position.set(params.x, params.y);
    }
}
