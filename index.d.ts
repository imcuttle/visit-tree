/**
 * Visit tree by pre or post DFS
 * @author imcuttle
 */

declare namespace visitTree {
  export interface IContext<T> {
    index: number
    depth: number
    parent: T | null
    parentCtx: IContext<T> | null
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
    remove: () => T[] | boolean
    replace: (node: T) => boolean
  }

  export interface IOptions {
    path?: string
    state?: any
  }

  export type IVisit<T> = (node: T, ctx: IContext<T>) => void
}

declare function visitTree<T>(
  node: any,
  preVisit: visitTree.IVisit<T>,
  postVisit?: visitTree.IVisit<T>,
  options?: visitTree.IOptions
): void

declare function visitTree<T>(node: T, preVisit: visitTree.IVisit<T>, options?: visitTree.IOptions): void

export = visitTree
