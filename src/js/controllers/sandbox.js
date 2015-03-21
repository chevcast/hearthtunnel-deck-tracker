var _ = require('lodash');

module.exports = function ($scope) {
  var cardSets = require('../../../data/all-sets.json');
  var wantedSets = [
    'Basic',
    'Classic',
    'Curse of Naxxramas',
    'Goblins vs Gnomes',
    'Promotion',
    'Reward'
  ];
  $scope.cards = [];
  Object.keys(cardSets).forEach(function (setName) {
    if (!_.contains(wantedSets, setName)) return;
    $scope.cards = $scope.cards.concat(cardSets[setName]);
  });
};
