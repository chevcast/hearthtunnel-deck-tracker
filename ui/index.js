var blessed = require('blessed');
var extend = require('extend');

var screen = blessed.screen();
screen.key('C-c', process.exit.bind(process, 0));

var containers = [];

var STYLE = {
  fg: '#ffffff',
  bg: '#111111',
  border: {
    fg: '#ffffff',
    bg: '#333333'
  },
  selected: {
    fg: '#111111',
    bg: '#ffffff'
  },
  label: {
    fg: '#ffffff',
    bg: '#333333'
  }
};

var createContainer = function () {
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
    style: extend(true, {}, STYLE)
  });
  box.controls = {};
  var show = box.show;
  box.show = function () {
    containers.forEach(function (container) {
      container.hide();
    });
    this.focus();
    show.apply(this, arguments);
    screen.render();
  };
  containers.push(box);
  return box;
};

// Declare the main menu and all controls.
var mainMenu = createContainer();
mainMenu.controls.list = blessed.list({
  parent: mainMenu,
  label: 'Main Menu',
  height: 6,
  align: 'center',
  top: 'center',
  left: 'center',
  keys: true,
  vi: true,
  mouse: true,
  border: {
    type: 'line',
    fg: STYLE.border.fg,
    bg: STYLE.border.bg
  },
  style: extend(true, {}, STYLE, { bg: STYLE.border.bg }),
  items: [
    'Deck Builder',
    'Start Tracking',
    'Settings',
    'Exit'
  ]
});
mainMenu.focus = mainMenu.controls.list.focus.bind(mainMenu.controls.list);

// Declare the deck builder screen.
var deckBuilder = createContainer();
deckBuilder.controls.box = blessed.box({
  parent: deckBuilder,
  label: 'Test Box',
  top: 'center',
  left: 'center',
  height: '50%',
  width: '50%',
  border: {
    type: 'line'
  },
  content: 'hey there'
});
deckBuilder.focus = deckBuilder.controls.box.focus.bind(deckBuilder.controls.box);
deckBuilder.controls.box.key('q', function () {
  mainMenu.show();
});

// Delcare the tracker and all controls.
/*
 *var tracker = {};
 *tracker.screen = createScreen();
 *tracker.render = tracker.screen.render.bind(tracker.screen);
 */

// Delcare the settings screen.
/*
 *var settings = {};
 *settings.screen = createScreen();
 *settings.render = settings.screen.render.bind(settings.screen);
 */

module.exports = exports = {
  mainMenu: mainMenu,
  deckBuilder: deckBuilder,
  //tracker: tracker,
  //settings: settings,
  render: screen.render.bind(screen)
};
