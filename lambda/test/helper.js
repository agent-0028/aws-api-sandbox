global.td = require('testdouble')

global.context = global.describe

module.exports = {
  afterEach: function () {
    td.reset()
  }
}
