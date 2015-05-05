var path = require('path');
var fs = require('fs');

module.exports = function ($rootScope, $scope, $routeParams, utils, cards) {
  $rootScope.title = "Deck Builder";
  var mode = $routeParams.mode.toLowerCase();
  var deckName = $routeParams.deckName;
  var deckFile, deckPath;
  if (deckName) {
    deckFile = $routeParams.deckName.toLowerCase() + '.json';
    deckPath = path.join(__dirname, '..', '..', 'data', 'decks', deckFile);
    $scope.deck = require(deckPath);
    $scope.totalCards = 0;
    $scope.$watch('deck.cards', function () {
      $scope.cards = Object.keys($scope.deck.cards).map(function (cardId) {
        var count = $scope.deck.cards[cardId];
        $scope.totalCards += count;
        return {
          id: cardId,
          count: count
        }
      });
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
