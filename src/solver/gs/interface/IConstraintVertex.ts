/** ------------------ 自定义模块 ------------------ */

import { CGManager } from '../index';
import { IConstraintEdge } from './index';
import { PrimitivesType, ConstraintStateEnum } from '../config';
import { SketchData } from '../ConstraintVertex';

/** ------------------ 分割线 ------------------ */

/**
 * 图元容器序列化接口
 */
export interface IConstraintVertexSD {
    id : string

    real : boolean

    sType : PrimitivesType
}

/** 图元容器接口 */
export interface IConstraintVertex {
    cgm : CGManager

    get id () : string

    get order () : number

    get type () : PrimitivesType

    get struct () : IConstraintVertex[]

    set struct (vertices: IConstraintVertex[])

    get sType () : PrimitivesType

    set sType (type: PrimitivesType)

    get dof () : number

    get state () : ConstraintStateEnum

    set state (s: ConstraintStateEnum)

    get intoA () : Set<IConstraintEdge>

    set intoA (data: Set<IConstraintEdge>)

    get outA () : Set<IConstraintEdge>

    set outA (data: Set<IConstraintEdge>)

    get ringA () : Set<IConstraintEdge>

    set ringA (data: Set<IConstraintEdge>)

    get data () : SketchData

    set data (data: SketchData)

    addRingA (edge: IConstraintEdge) : void

    deleteRing (edge: IConstraintEdge) : void

    addIntoA (edge: IConstraintEdge) : void

    addOutA (edge: IConstraintEdge) : void

    deleteA (edge: IConstraintEdge) : void

    updateData (params: number[]) : void
}
