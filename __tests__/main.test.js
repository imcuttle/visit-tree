/**
 * @file walkTree.test
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 03/02/2019
 *
 */

const walk = require('../index')

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
            ctx.state.push(node.key)
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
