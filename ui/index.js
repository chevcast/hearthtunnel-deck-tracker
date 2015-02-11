var screen = require('./screen');
var mainMenu = require('./mainMenu');

module.exports = exports = {
  screen: screen,
  mainMenu: mainMenu,
  tracker: require('./tracker'),
  //deckBuilder: require('./deckBuilder'),
  //settings: require('./settings'),
  render: screen.render.bind(screen)
};
