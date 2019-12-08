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
      props
    )
  }

  assign(...props) {
    Object.assign(this, ...props)
  }

  get children() {
    return this.node && this.node[this.opts.path]
  }

  get state() {
    return this.opts.state
  }
  set state(val) {
    this.opts.state = val
  }

  skip() {
    this.status = 'skip'
  }
  break() {
    this.status = 'break'
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
      if (typeof this.parent[this.opts.path].splice === 'function') {
        return this.parent[this.opts.path].splice(this.index, 1)
      }
      return delete this.parent[this.opts.path]
    }
  }
  replace(node) {
    if (this.remove()) {
      if (this.parent[this.opts.path] && typeof this.parent[this.opts.path].splice === 'function') {
        return this.insertBefore(node)
      }

      this.parent[this.opts.path] = node
      return true
    }
  }
}
