var blessed = require('blessed');
var extend = require('extend');
var screen = require('./screen');
var container = new require('./Container')();
var STYLE = require('./STYLE')();

var friendlyDeck = blessed.list({
  parent: container,
  label: 'Friendly',
  style: extend(true, {}, STYLE, {
    border: {
      fg: '#005500',
      bg: STYLE.bg
    },
    label: {
      fg: '#00ff00',
      bg: STYLE.bg
    },
    fg: '#00ff00',
    bg: '#000000'
  }),
  border: {
    type: 'line',
    fg: '#005500',
    bg: STYLE.bg
  },
  left: 'center',
  top: 2,
  height: Math.floor(screen.rows * .60),
  width: screen.cols - 4,
  interactive: false, // future proof
  keys: false,
  mouse: false
});
// Temporary hack until ^
friendlyDeck._isList = false;

var opponentDeck = blessed.list({
  parent: container,
  label: 'Opponent',
  style: extend(true, {}, STYLE, {
    border: {
      fg: '#550000',
      bg: STYLE.bg
    },
    label: {
      fg: '#ff0000',
      bg: STYLE.bg
    },
    fg: '#ff0000',
    bg: '#000000'
  }),
  border: {
    type: 'line',
    fg: '#550000',
    bg: STYLE.bg
  },
  left: 'center',
  top: friendlyDeck.height + 2,
  height: screen.rows - (friendlyDeck.height + 5),
  width: screen.cols - 4,
  interactive: false, // future proof
  keys: false,
  mouse: false
});
// Temporary hack until ^
opponentDeck._isList = false;

var debug = blessed.box({
  parent: container,
  label: 'debug',
  style: extend(true, {}, STYLE, {
    border: {
      fg: '#005555',
      bg: STYLE.bg
    },
    label: {
      fg: '#00ffff',
      bg: STYLE.bg
    },
    fg: '#00ffff',
    bg: '#000000'
  }),
  border: {
    type: 'line',
    fg: '#005555',
    bg: STYLE.bg
  },
  left: 'center',
  width: screen.cols - 4
});
debug.hide();

container.key('d', function () {
  debug.toggle();
  calculateSizes();
});

calculateSizes();
container.on('resize', calculateSizes);

function calculateSizes() {
  if (!debug.visible) {
    friendlyDeck.height = Math.floor(screen.rows * .60);
    friendlyDeck.width = screen.cols - 4;
    opponentDeck.top = friendlyDeck.height + 2;
    opponentDeck.height = screen.rows - (opponentDeck.top + 2);
    opponentDeck.width = screen.cols - 4;
  } else {
    friendlyDeck.height = Math.floor(screen.rows * .5) - 2;
    opponentDeck.top = friendlyDeck.height + 2; 
    opponentDeck.height = Math.floor(friendlyDeck.height * .5)
  }
  debug.top = opponentDeck.top + opponentDeck.height;
  debug.height = screen.rows - debug.top - 2;
  debug.width = screen.cols - 4;

  screen.render();
}

module.exports = {
  title: 'Deck Tracker',
  container: container,
  friendlyDeck: friendlyDeck,
  opponentDeck: opponentDeck,
  debug: debug,
  show: container.show.bind(container)
};
