var path = require('path');
var LogWatcher = require('hearthstone-log-watcher');
var decksPath = path.join(__dirname, '..', '..', 'data', 'decks');

module.exports = function ($rootScope, $scope, $routeParams, mainWindow) {
  $rootScope.title = "Deck Tracker";
  $scope.selectedZone = "deck";
  $scope.friendlyName = "Friendly Player";
  $scope.opposingName = "Opposing Player";
  $scope.deckZone = [];
  $scope.handZone = [];
  $scope.playZone = [];
  $scope.graveZone = [];
  $scope.deck = require(path.join(decksPath, $routeParams.deckFile));

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
};
