var _ = require('lodash');

module.exports = function ($filter) {
  var orderBy = $filter('orderBy');
  return function (cards) {
    var filteredCards = _.filter(cards, function (card) {
      return card.collectible && _.contains(['Minion', 'Spell'], card.type);
    });
    var typeSort = function (card) {
      var typePriority = {
        'Spell': 0,
        'Minion': 1
      };
      return typePriority[card.type];
    };
    return orderBy(filteredCards, ['playerClass','cost',typeSort,'name']);
  };
};
