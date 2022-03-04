/**
 * Visit tree by pre or post DFS
 * @author imcuttle
 */

declare namespace visitTree {
  export interface IOptions<S = any> {
    path?: string
    state?: S
  }

  export type IVisit<T, S = any> = (node: T, ctx: Context<T, S>) => void
}

declare function visitTree<T, S = any>(
  node: T,
  preVisit: visitTree.IVisit<T, S>,
  postVisit?: visitTree.IVisit<T, S>,
  options?: visitTree.IOptions<S>
): void

declare function visitTree<T, S>(
  node: T,
  preVisit: visitTree.IVisit<T, S>,
  options?: visitTree.IOptions<S>
): Promise<void>

export default visitTree

export function sync<T, S>(node: T, preVisit: visitTree.IVisit<T, S>, options?: visitTree.IOptions<S>): void
export function sync<T, S>(
  node: T,
  preVisit: visitTree.IVisit<T, S>,
  postVisit?: visitTree.IVisit<T, S>,
  options?: visitTree.IOptions<S>
): void

export function walkParentCtx<T>(ctx: Context<T>, walk: (ctx: Context<T>) => void): void
export function getParents<T>(ctx: Context<T>): T[]
export function getPaths(ctx: Context<any>): number[]

export class Context<T, S = any> {
  constructor(props?: any, opts?: any)
  public opts: any

  index: number
  depth: number
  parent: T | null
  parentCtx: Context<T> | null
  parents: T[]
  readonly children: T[]
  paths: number[]
  state: any
  globalState: S
  node: T
  readonly status: 'skip' | 'break' | null
  skip: () => void
  break: () => void
  continue: () => void
  insertByIndex: (index: number, nodes: T[]) => boolean
  insertBefore: (...nodes: T[]) => boolean
  insert: (...nodes: T[]) => boolean
  remove: () => boolean
  replace: (node: T) => boolean
}
