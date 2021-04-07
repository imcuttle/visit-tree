/**
 * Visit tree by pre or post DFS
 * @author imcuttle
 */

declare namespace visitTree {
  export interface IOptions {
    path?: string
    state?: any
  }

  export type IVisit<T> = (node: T, ctx: Context<T>) => void
}

declare function visitTree<T>(
  node: any,
  preVisit: visitTree.IVisit<T>,
  postVisit?: visitTree.IVisit<T>,
  options?: visitTree.IOptions
): void

declare function visitTree<T>(node: T, preVisit: visitTree.IVisit<T>, options?: visitTree.IOptions): Promise<void>

export default visitTree

export function sync<T>(node: T, preVisit: visitTree.IVisit<T>, options?: visitTree.IOptions): void
export function sync<T>(
  node: T,
  preVisit: visitTree.IVisit<T>,
  postVisit?: visitTree.IVisit<T>,
  options?: visitTree.IOptions
): void

export function walkParentCtx<T>(ctx: Context<T>, walk: (ctx: Context<T>) => void): void
export function getParents<T>(ctx: Context<T>): T[]
export function getPaths(ctx: Context<any>): number[]

export class Context<T> {
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
  node: T
  readonly status: 'skip' | 'break' | null
  skip: () => void
  break: () => void
  insertByIndex: (index: number, nodes: T[]) => boolean
  insertBefore: (...nodes: T[]) => boolean
  insert: (...nodes: T[]) => boolean
  remove: () => boolean
  replace: (node: T) => boolean
}
