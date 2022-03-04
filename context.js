module.exports = class VisitContext {
  constructor(props, opts) {
    this.opts = Object.assign(
      {
        path: 'children'
      },
      opts
    )
    this.assign(
      {
        index: 0,
        depth: 1,
        parent: null,
        node: null,
        status: null,
        parentCtx: null
      },
      props,
      {
        state: {}
      }
    )
  }

  assign(...props) {
    Object.assign(this, ...props)
  }

  get children() {
    return this.node && this.node[this.opts.path]
  }

  get globalState() {
    return this.opts.state
  }
  set globalState(val) {
    this.opts.state = val
  }

  skip() {
    this.status = 'skip'
  }
  break() {
    this.status = 'break'
  }
  continue() {
    this.status = null
  }
  insertByIndex(index, nodes) {
    if (this.parent) {
      this.parent[this.opts.path].splice(index, 0, ...nodes)
      return true
    }
  }
  insertBefore(...nodes) {
    return this.insertByIndex(this.index, nodes)
  }
  insert(...nodes) {
    return this.insertByIndex(this.index + 1, nodes)
  }
  remove() {
    if (this.parent) {
      let removed
      if (typeof this.parent[this.opts.path].splice === 'function') {
        removed = !!this.parent[this.opts.path].splice(this.index, 1).length
      } else {
        removed = delete this.parent[this.opts.path]
      }
      if (removed) {
        this.index--
      }
      return removed
    }
  }
  replace(node) {
    if (this.remove()) {
      this.index++
      if (this.parent[this.opts.path] && typeof this.parent[this.opts.path].splice === 'function') {
        return this.insertBefore(node)
      }

      this.parent[this.opts.path] = node
      return true
    }
  }
}
