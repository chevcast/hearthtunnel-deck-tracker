var blessed = require('blessed');
var screen = require('./screen');
var STYLE = require('./STYLE')();

var containers = [];

module.exports = function () {
  var box = blessed.box({
    parent: screen,
    keys: true,
    mouse: true,
    height: '100%',
    width: '100%',
    border: {
      type: 'bg',
      fg: STYLE.border.fg,
      bg: STYLE.border.bg
    },
    style: STYLE
  });
  var show = box.show;
  box.show = function () {
    containers.forEach(function (container) {
      container.hide();
    });
    box.focus();
    show.apply(box, arguments);
    screen.render();
  };
  containers.push(box);
  return box;
};
