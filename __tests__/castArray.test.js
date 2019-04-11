/**
 * @file castArray
 * @author Cuttle Cong
 * @date 2019/4/11
 * @description
 */
const castArray = require('../castArray')

describe('castArray', function() {
  it('should castArray', () => {
    const arr = []
    expect(castArray(arr)).toBe(arr)
  })

  it('should NodeList', () => {
    document.body.innerHTML = '<p></p><p></p><p></p>'

    const arr = castArray(document.body.childNodes)
    expect(arr.length).toBe(3)
    expect(Array.isArray(arr)).toBeTruthy()
  })

  it('should HTMLCollection', () => {
    document.body.innerHTML = '<p></p><p></p><p></p>'

    const arr = castArray(document.body.children)
    expect(arr.length).toBe(3)
    expect(Array.isArray(arr)).toBeTruthy()
  })
})
