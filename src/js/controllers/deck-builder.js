var path = require('path');
var fs = require('fs');

module.exports = function ($rootScope, $scope, $routeParams, utils) {
  $rootScope.title = "Deck Builder";
  var mode = $routeParams.mode.toLowerCase();
  var deckName = $routeParams.deckName;
  var deckFile, deckPath;
  if (deckName) {
    deckFile = $routeParams.deckName.toLowerCase() + '.json';
    deckPath = path.join(__dirname, '..', '..', 'data', 'decks', deckFile);
    $scope.deck = require(deckPath);
    $scope.cards = Object.keys($scope.deck.cards).map(function (cardId) {
      return {
        id: cardId,
        count: $scope.deck.cards[cardId]
      }
    });
  }
  switch (mode) {
    case 'delete':
      fs.unlink(deckPath);
      utils.navigate('/decks');
      break;
    case 'edit':
      break;
    default:
      break;
  }
};
