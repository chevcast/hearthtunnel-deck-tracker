var screen = require('./screen');
var mainMenu = require('./mainMenu');

module.exports = exports = {
  screen: screen,
  mainMenu: mainMenu,
  /*
   *deckBuilder: require('./deckBuilder'),
   *tracker: require('./tracker'),
   *settings: require('./settings'),
   */
  render: screen.render.bind(screen)
};
