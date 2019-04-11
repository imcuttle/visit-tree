/**
 * @file castArray
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 03/02/2019
 *
 */
const isIterable = require('is-iterable')

module.exports = function(input) {
  if (input && typeof input.slice === 'function') {
    return input
  }

  if (isIterable(input)) {
    return [].slice.apply(input)
  }

  return [input]
}
