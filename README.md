# @moyuyc/visit-tree

[![Build status](https://img.shields.io/travis/imcuttle/visit-tree/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/visit-tree)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/visit-tree.svg?style=flat-square)](https://codecov.io/github/imcuttle/visit-tree?branch=master)
[![NPM version](https://img.shields.io/npm/v/@moyuyc/visit-tree.svg?style=flat-square)](https://www.npmjs.com/package/@moyuyc/visit-tree)
[![NPM Downloads](https://img.shields.io/npm/dm/@moyuyc/visit-tree.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@moyuyc/visit-tree)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> Visit tree by pre or post DFS

## Installation

```bash
npm install @moyuyc/visit-tree
# or use yarn
yarn add @moyuyc/visit-tree
```

## Usage

```javascript
const visitTree = require('@moyuyc/visit-tree')

// or sync
const { sync } = require('@moyuyc/visit-tree')

await visitTree(
  {
    value: 'root',
    children: [
      {
        value: 'a'
      }
    ]
  },
  async (node, ctx) => {},
  {}
)
```

## API

### **`visitTree(tree, preWalk: (node, ctx: Context) => void, options: Options): Promise<void>`**

### **`visitTree(tree, preWalk: (node, ctx: Context) => void, postWalk: (node, ctx: Context) => void, options: Options): Promise<void>`**

### Options

#### `path`

Assign children's path.

- **Type:** `string`
- **Default:** `children`

#### `state`

- **Type:** any
- **Default:** `null`

### Context

#### `state`

It's same reference to `options.state`.

#### `node`

The current node.

#### `children`

The current node's children.

#### `index`

Get the index of the current node.

#### `depth`

Get the depth of the current node. The depth is the number of ancestors the current node has.

#### `parent`

Get the parent of the current node.

#### `skip`

Skip current node, children won't be visited.

```javascript
walk(rootNode, (node, ctx) => {
  if (node.name === 'skip') {
    return ctx.skip()
  }
})
```

#### `break`

Stop traversal now.

```javascript
walk(rootNode, (node, ctx) => {
  if (node.name === 'stop') {
    return ctx.break()
  }
})
```

#### `replace`

```javascript
walk(rootNode, (node, ctx) => {
  if (node.name === 'replace-me') {
    return ctx.replace({ name: 'new-me' })
  }
})
```

#### `remove`

```javascript
walk(rootNode, (node, ctx) => {
  if (node.name === 'remove-me') {
    return ctx.remove()
  }
})
```

#### `insert`

```javascript
walk(rootNode, (node, ctx) => {
  if (node.name === 'insert-me') {
    return ctx.insert({ name: 'abc' }, { name: '' })
  }
})
```

#### `paths`

Get the paths(index list) of the current node.

#### `parents`

Get the parents(backward) of the current node.

#### `parentCtx`

Get the context of the current node's parent.

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
