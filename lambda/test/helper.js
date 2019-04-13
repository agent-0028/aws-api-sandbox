global.td = require('testdouble')

module.exports = {
  afterEach: function () {
    td.reset()
  }
}
