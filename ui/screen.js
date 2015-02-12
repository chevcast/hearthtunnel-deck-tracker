var screen = require('blessed').screen({
  ignoreLocked: ['C-c']
});
module.exports = screen;
