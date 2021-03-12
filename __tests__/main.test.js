/**
 * @file walkTree.test
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 03/02/2019
 *
 */

const { sync: walk } = require('../index')
const walkAsync = require('../index')

describe('walkTree', function() {
  it('should walk pre well', function() {
    const list = []
    const pathsList = []
    walk(
      {
        key: 'root',
        children: {
          key: 'a',
          children: [
            {
              key: 'b'
            }
          ]
        }
      },
      (node, ctx) => {
        list.push(node.key)
        pathsList.push(ctx.paths)
      }
    )

    expect(list).toEqual(['root', 'a', 'b'])
    expect(pathsList).toEqual([[], [0], [0, 0]])
  })

  it('should ctx.remove works', function() {
    const node = {
      key: 'root',
      children: [
        {
          key: 'a',
          children: [
            {
              remove: true,
              key: 'b'
            },
            {
              remove: true,
              key: 'b'
            }
          ]
        }
      ]
    }
    walk(node, null, (node, ctx) => {
      if (node.remove) {
        ctx.remove()
      }
    })

    expect(node).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "children": Array [],
      "key": "a",
    },
  ],
  "key": "root",
}
`)
  })
  it('should ctx.remove works when post walk', function() {
    const node = {
      key: 'root',
      children: [
        {
          key: 'a',
          children: [
            {
              remove: true,
              key: 'b'
            },
            {
              remove: true,
              key: 'b'
            }
          ]
        }
      ]
    }
    walk(node, null, (node, ctx) => {
      if (node.remove) {
        ctx.remove()
      }
    })

    expect(node).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "children": Array [],
      "key": "a",
    },
  ],
  "key": "root",
}
`)
  })

  it('should ctx.remove works when pre walk', function() {
    const node = {
      key: 'root',
      children: [
        {
          key: 'a',
          children: [
            {
              remove: true,
              key: 'b'
            },
            {
              remove: true,
              key: 'b'
            }
          ]
        }
      ]
    }
    walk(node, (node, ctx) => {
      if (node.remove) {
        ctx.remove()
      }
    })

    expect(node).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "children": Array [],
      "key": "a",
    },
  ],
  "key": "root",
}
`)
  })
  it('should ctx.remove works when pre walk2', function() {
    const node = {
      key: 'root',
      children: [
        {
          key: '1'
        },
        {
          key: 'a',
          remove: true,
          children: [
            {
              remove: true,
              key: 'b'
            },
            {
              remove: true,
              key: 'b'
            }
          ]
        },
        {
          key: '2'
        }
      ]
    }
    walk(node, (node, ctx) => {
      if (node.remove) {
        ctx.remove()
      }
    })

    expect(node).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "key": "1",
    },
    Object {
      "key": "2",
    },
  ],
  "key": "root",
}
`)
  })

  it('should walk post well', function() {
    const list = []
    const pathsList = []
    walk(
      {
        key: 'root',
        children: {
          key: 'a',
          children: [
            {
              key: 'b'
            }
          ]
        }
      },
      null,
      (node, ctx) => {
        list.push(node.key)
        pathsList.push(ctx.paths)
      }
    )

    expect(list).toEqual(['root', 'a', 'b'].reverse())
    expect(pathsList).toEqual([[0, 0], [0], []])
  })

  it('should walk pre & post well', function() {
    const list = []
    const pathsList = []
    const parents = []
    walk(
      {
        key: 'root',
        children: {
          key: 'a',
          children: [
            {
              key: 'b'
            }
          ]
        }
      },
      (node, ctx) => {
        list.push(node.key)
        pathsList.push(ctx.paths)
        parents.push(ctx.parents)
      },
      (node, ctx) => {
        list.push(node.key)
        pathsList.push(ctx.paths)
        parents.push(ctx.parents)
      }
    )

    expect(list).toEqual(['root', 'a', 'b', 'b', 'a', 'root'])
    expect(pathsList).toEqual([[], [0], [0, 0], [0, 0], [0], []])
    expect(parents.map(parents => parents.map(node => node.key))).toMatchInlineSnapshot(`
Array [
  Array [],
  Array [
    "root",
  ],
  Array [
    "root",
    "a",
  ],
  Array [
    "root",
    "a",
  ],
  Array [
    "root",
  ],
  Array [],
]
`)
  })

  it('should walk skip/remove well', function() {
    const test = (key, expectedList, { method = 'skip' } = {}) => {
      const list = []
      walk(
        {
          key: 'root',
          children: {
            key: 'a',
            children: [
              {
                key: 'b'
              },
              {
                key: 'd'
              }
            ]
          }
        },
        (node, ctx) => {
          if (node.key === key) {
            ctx[method]()
          } else {
            ctx.globalState.push(node.key)
          }
        },
        {
          state: list,
          order: 'pre'
        }
      )

      expect(list).toEqual(expectedList)
    }

    test('a', ['root'])
    test('root', [])
    test('b', ['root', 'a', 'd'])

    test('a', ['root'], { method: 'break' })
    test('root', [], { method: 'break' })
    test('b', ['root', 'a'], { method: 'break' })
  })

  it('should walk remove well', function() {
    const tree = {
      key: 'root',
      children: {
        key: 'a',
        children: [
          {
            key: 'b'
          }
        ]
      }
    }
    walk(
      tree,
      (node, ctx) => {
        if (node.key === 'a') {
          ctx.remove()
        }
      },
      {
        order: 'post'
      }
    )

    expect(tree).toMatchInlineSnapshot(`
Object {
  "key": "root",
}
`)
  })

  it('should walk remove well - 2', function() {
    const tree = {
      key: 'root',
      children: {
        key: 'a',
        children: [
          {
            key: 'b'
          }
        ]
      }
    }
    walk(
      tree,
      (node, ctx) => {
        if (node.key === 'b') {
          ctx.remove()
        }
      },
      {
        order: 'post'
      }
    )

    expect(tree).toMatchInlineSnapshot(`
Object {
  "children": Object {
    "children": Array [],
    "key": "a",
  },
  "key": "root",
}
`)
  })

  it('should walk replace well', function() {
    const tree = {
      key: 'root',
      children: {
        key: 'a',
        children: [
          {
            key: 'b'
          }
        ]
      }
    }
    walk(
      tree,
      (node, ctx) => {
        if (node.key === 'a') {
          ctx.replace({
            key: 'lll'
          })
        }
      },
      {
        order: 'post'
      }
    )

    expect(tree).toMatchInlineSnapshot(`
Object {
  "children": Object {
    "key": "lll",
  },
  "key": "root",
}
`)
  })

  it('should walk replace well - 2', function() {
    const tree = {
      key: 'root',
      children: {
        key: 'a',
        children: [
          {
            key: 'b'
          }
        ]
      }
    }
    walk(
      tree,
      (node, ctx) => {
        if (node.key === 'b') {
          ctx.replace({
            key: 'lll'
          })
        }
      },
      {
        order: 'post'
      }
    )

    expect(tree).toMatchInlineSnapshot(`
Object {
  "children": Object {
    "children": Array [
      Object {
        "key": "lll",
      },
    ],
    "key": "a",
  },
  "key": "root",
}
`)
  })

  it('should ctx.state is not inheritable & ctx.globalState is inheritable', function() {
    const tree = {
      key: 'root',
      children: {
        key: 'a',
        children: [
          {
            key: 'b'
          }
        ]
      }
    }

    const state = {
      v: 1,
      ctxList: []
    }

    walk(
      tree,
      (node, ctx) => {
        ctx.state[ctx.globalState.v++] = node.key
        ctx.globalState.ctxList.push(ctx)
      },
      {
        order: 'post',
        state
      }
    )

    expect(state.v).toBe(4)
    expect(state.ctxList.map(ctx => ctx.state)).toEqual([{ '1': 'root' }, { '2': 'a' }, { '3': 'b' }])
  })

  it('should walk insert well - 2', function() {
    const tree = {
      key: 'root',
      children: {
        key: 'a',
        children: [
          {
            key: 'b'
          }
        ]
      }
    }
    walk(
      tree,
      (node, ctx) => {
        if (node.key === 'b') {
          ctx.insert(
            {
              key: 'lll'
            },
            {
              key: 'lllx'
            }
          )
        }
      },
      {
        order: 'pre'
      }
    )

    expect(tree).toMatchInlineSnapshot(`
Object {
  "children": Object {
    "children": Array [
      Object {
        "key": "b",
      },
      Object {
        "key": "lll",
      },
      Object {
        "key": "lllx",
      },
    ],
    "key": "a",
  },
  "key": "root",
}
`)
  })

  it('should walk insert well - post', function() {
    const tree = {
      key: 'root',
      children: {
        key: 'a',
        children: [
          {
            key: 'b'
          }
        ]
      }
    }
    walk(
      tree,
      (node, ctx) => {
        if (node.key === 'b') {
          ctx.insert(
            {
              key: 'lll'
            },
            {
              key: 'lllx'
            }
          )
        }
      },
      {
        order: 'post'
      }
    )

    expect(tree).toMatchInlineSnapshot(`
Object {
  "children": Object {
    "children": Array [
      Object {
        "key": "b",
      },
      Object {
        "key": "lll",
      },
      Object {
        "key": "lllx",
      },
    ],
    "key": "a",
  },
  "key": "root",
}
`)
  })
})
