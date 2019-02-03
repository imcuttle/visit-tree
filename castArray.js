/**
 * @file castArray
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 03/02/2019
 *
 */

module.exports = function(input) {
  if (input && typeof input.slice === 'function') {
    return input
  }
  return [input]
}
