/**
 * Visit tree by pre or post DFS
 * @author imcuttle
 */

interface IContext<T> {
  index: number
  depth: number
  parent: T | null
  parentCtx: IContext<T> | null
  parents: T[]
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

interface IOptions {
  order?: 'pre' | 'post'
  path?: string
  state?: any
}

type IVisit<T> = (node: T, ctx: IContext<T>) => void

type visitTree<T> = (node: any, visit: IVisit<T>, options: IOptions) => void

export = visitTree
