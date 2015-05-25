var path = require('path');
var LogWatcher = require('hearthstone-log-watcher');
var decksPath = path.join(__dirname, '..', '..', 'data', 'decks');

module.exports = function ($rootScope, $scope, $routeParams, mainWindow, cards, utils) {
  $rootScope.title = "Deck Tracker";
  $scope.selectedZone = "deck";
  $scope.selectedTeam = "friendly";
  $scope.friendlyName = "Friendly Player";
  $scope.opposingName = "Opposing Player";
  $scope.deck = require(path.join(decksPath, $routeParams.deckFile));
  $scope.friendlyDeckZone = Object.keys($scope.deck.cards).map(function (cardId) {
    var count = $scope.deck.cards[cardId];
    return {
      id: cardId,
      count: count,
      cost: cards[cardId].cost
    };
  });
  $scope.friendlyHandZone = [];
  $scope.friendlyPlayZone = [];
  $scope.friendlyGraveZone = [];
  $scope.opposingDeckZone = [];
  $scope.opposingHandZone = [];
  $scope.opposingPlayZone = [];
  $scope.opposingGraveZone = [];

  // Configure the log watcher.
  var logWatcher = new LogWatcher();
  logWatcher.on('game-start', function (players) {
    $scope.$apply(function () {
      players.forEach(function (player) {
        $scope[player.team.toLowerCase() + 'Name'] = player.name;
      });
    });
  });
  logWatcher.on('zone-change', console.log.bind(console));
  logWatcher.on('game-over', console.log.bind(console));
  logWatcher.start();

  $scope.done = function () {
    logWatcher.stop();
    utils.navigate('/decks');
  };
};
