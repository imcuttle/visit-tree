/**
 * Visit tree by pre or post DFS
 * @author imcuttle
 */

const castArray = require('./castArray')

function walkCtx(ctx, walk) {
  while (ctx) {
    walk(ctx)
    ctx = ctx.parentCtx
  }
}

function getPaths(srcCtx) {
  const paths = []
  walkCtx(srcCtx, ctx => {
    if (ctx.parent) {
      paths.unshift(ctx.index)
    }
  })
  return paths
}

function getParents(srcCtx) {
  const parents = []
  walkCtx(srcCtx, ctx => {
    if (ctx.parent) {
      parents.unshift(ctx.parent)
    }
  })
  return parents
}

function walkNodeInner(node, walk, ctx, options = {}) {
  const { path = 'children', order = 'pre', state } = options
  let status
  ctx = Object.assign(
    {
      index: 0,
      depth: 1,
      parent: null,
      parentCtx: null
    },
    ctx,
    {
      node,
      state,
      get status() {
        return status
      },
      skip: () => {
        status = 'skip'
      },
      break: () => {
        status = 'break'
      },
      insertByIndex(index, nodes) {
        if (ctx.parent) {
          ctx.parent[path].splice(index, 0, ...nodes)
          return true
        }
      },
      insertBefore(...nodes) {
        return this.insertByIndex(ctx.index, nodes)
      },
      insert(...nodes) {
        return this.insertByIndex(ctx.index + 1, nodes)
      },
      remove() {
        if (ctx.parent) {
          if (typeof ctx.parent[path].splice === 'function') {
            return ctx.parent[path].splice(ctx.index, 1)
          }
          return delete ctx.parent[path]
        }
      },
      replace(node) {
        if (this.remove()) {
          if (ctx.parent[path] && typeof ctx.parent[path].splice === 'function') {
            return this.insertBefore(node)
          }

          ctx.parent[path] = node
          return true
        }
      },
      get paths() {
        return getPaths(ctx)
      },
      get parents() {
        return getParents(ctx)
      }
    }
  )
  if (!node) {
    return
  }

  if (order === 'pre') {
    walk(node, ctx)
    if (status) {
      return status
    }
  }

  const nodes = [].slice.apply(castArray(node[path] || []))
  let i = 0
  while (nodes.length) {
    const childNode = nodes.shift()
    let returnStatus = walkNodeInner(
      childNode,
      walk,
      {
        ...ctx,
        index: i,
        parent: node,
        parentCtx: ctx,
        depth: ctx.depth + 1
      },
      options
    )
    if ('break' === returnStatus) {
      return returnStatus
    }
    i++
  }

  if (order === 'post') {
    walk(node, ctx)
    if (status) {
      return status
    }
  }
}

function walkTree(node, walk, options) {
  walkNodeInner(node, walk, null, options)
}

module.exports = walkTree
