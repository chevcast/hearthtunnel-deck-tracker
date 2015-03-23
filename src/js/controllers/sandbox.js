var _ = require('lodash');
var LogWatcher = require('hearthstone-log-watcher');

module.exports = function ($scope) {
  var logWatcher = new LogWatcher();
  var cards = require('../../data/cards.json');
    logWatcher.on('zone-change', function (data) {
      $scope.$apply(function () {
        $scope.card = _.find(cards, function (card) {
          return card.name === data.cardName
            && _.contains(['Minion', 'Spell'], card.type);
        });
        $scope.team = data.team;
        $scope.zone = data.zone;
      });
    });
  logWatcher.start();
};
