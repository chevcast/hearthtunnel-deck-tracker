var blessed = require('blessed');
var extend = require('extend');
var screen = require('./screen');
var container = new require('./Container')();
var STYLE = require('./STYLE')();

var list = blessed.list({
  parent: container,
  label: 'Main Menu',
  height: 3,
  align: 'center',
  top: 'center',
  left: 'center',
  interactive: false,
  keys: true,
  vi: true,
  mouse: true,
  border: {
    type: 'line',
    fg: STYLE.border.fg,
    bg: STYLE.border.bg
  },
  style: extend(true, {}, STYLE, {
    bg: STYLE.border.bg
  }),
  items: [
    'No items'
  ]
});

container.focus = list.focus.bind(list);
container.on('resize', screen.render.bind(screen));

var listItems = [];

module.exports = {
  title: 'Main Menu',
  container: container,
  list: list,
  setItems: function (items) {
    listItems = items;
    list.interactive = true;
    list.height += items.length - 1;
    list.setItems(items);
    screen.render();
  },
  onSelect: function (callback) {
    list.on('select', function (elem, index) {
      callback(listItems[index].toLowerCase().replace(/ /g, '-'));
    });
  },
  show: container.show.bind(container)
};
