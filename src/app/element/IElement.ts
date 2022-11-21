import { BufferGeometry, Color, Material, Object3D } from "three";

import { PrimitivesType } from '@/solver/gs/config';
import { SketchData } from "@/solver/gs/ConstraintVertex";

interface IMaterial extends Material {
    color : Color;
}

export type UserDataType = {
    id? : string;
    color? : Color,
    type? : PrimitivesType,
    isSelect? : boolean,
    sType? : PrimitivesType,
    struct? : string[],
    clone? : IElement,
    sData? : SketchData,
}

export interface IElement extends Object3D {
    material : IMaterial;

    geometry : BufferGeometry;

    setColor (color: number) : void;

    setResolution (width: number, height: number) : void;

    update (params: any) : void;
}
