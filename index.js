/**
 * Visit tree by pre or post DFS
 * @author imcuttle
 */

const castArray = require('./castArray')
const Context = require('./context')

function walkParentCtx(ctx, walk) {
  while (ctx) {
    walk(ctx)
    ctx = ctx.parentCtx
  }
}

function getPaths(srcCtx) {
  const paths = []
  walkParentCtx(srcCtx, ctx => {
    if (ctx.parent) {
      paths.unshift(ctx.index)
    }
  })
  return paths
}

function getParents(srcCtx) {
  const parents = []
  walkParentCtx(srcCtx, ctx => {
    if (ctx.parent) {
      parents.unshift(ctx.parent)
    }
  })
  return parents
}

function walkNodeInner(node, preWalk, postWalk, ctx, options = {}) {
  const { path = 'children', state } = options
  ctx = new Context(
    Object.assign(
      {
        index: 0,
        depth: 1,
        status: null,
        parent: null,
        parentCtx: null
      },
      ctx,
      {
        node
      }
    ),
    options
  )
  if (!node) {
    return
  }

  if (!ctx.paths) {
    ctx.paths = getPaths(ctx)
  } else {
    ctx.paths = ctx.paths.concat(ctx.index)
  }

  if (!ctx.parents) {
    ctx.parents = getParents(ctx)
  } else {
    ctx.parents = ctx.parents.concat(ctx.parent)
  }

  // ctx.paths = ctx.paths || getPaths(ctx)
  preWalk(node, ctx)
  if (ctx.status) {
    return ctx.status
  }

  const nodes = [].slice.apply(castArray(ctx.children || []))
  let i = 0
  while (nodes.length) {
    const childNode = nodes.shift()
    let returnStatus = walkNodeInner(
      childNode,
      preWalk,
      postWalk,
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

  postWalk(node, ctx)
  if (ctx.status) {
    return ctx.status
  }
}

const noop = () => {}
function walkTree(node, preWalk, postWalk, options) {
  if (typeof postWalk !== 'function') {
    options = postWalk
    postWalk = noop
  }

  walkNodeInner(node, preWalk || noop, postWalk || noop, null, options)
}

module.exports = walkTree
module.exports.default = walkTree
module.exports.walkParentCtx = walkParentCtx
module.exports.Context = Context
module.exports.getParents = getParents
module.exports.getPaths = getPaths
