/**
 * @file castArray
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 03/02/2019
 *
 */

const specTypes = [global.NodeList].filter(Boolean)

module.exports = function(input) {
  if (input && typeof input.slice === 'function') {
    return input
  }
  if (input && specTypes.some(type => input instanceof type)) {
    return [].slice.apply(input)
  }
  return [input]
}
