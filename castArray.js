/**
 * @file castArray
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 03/02/2019
 *
 */
const isIterable = require('is-iterable')

const collListTypes = [global.HTMLCollection, global.NodeList].filter(x => typeof x === 'function')

module.exports = function(input) {
  if (input && typeof input.slice === 'function') {
    return input
  }

  if (isIterable(input) || collListTypes.find(type => input instanceof type)) {
    return [].slice.apply(input)
  }

  return [input]
}
