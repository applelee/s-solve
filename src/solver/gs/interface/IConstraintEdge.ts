/** ------------------ 自定义模块 ------------------ */

import { CGManager } from '../index';
import { IConstraintVertex } from './index';
import type { ConstraintType } from '../config';
import { RelyType } from '../ConstraintEdge';

/** ------------------ 分割线 ------------------ */

export interface IConstraintEdge {

    isRely : RelyType

    isStruct : boolean

    cgm : CGManager

    get id () : number

    get type () : ConstraintType

    get target () : IConstraintVertex

    get match () : IConstraintVertex

    get multiple () : IConstraintVertex[]

    set multiple (vertices: IConstraintVertex[])

    get rely () : Set<IConstraintEdge>

    set rely (cs: Set<IConstraintEdge>)

    get sub () : Set<IConstraintEdge>

    set sub (cs: Set<IConstraintEdge>)

    deleteRely (ce: IConstraintEdge) : void

    clearRely () : void

    deleteSub (ce: IConstraintEdge) : void

    clearSub () : void

}
