module.exports = function ($filter) {
  var orderBy = $filter('orderBy');
  return function (cards) {
    var typeSort = function (card) {
      var typePriority = {
        'Spell': 0,
        'Minion': 1
      };
      return typePriority[card.type];
    };
    return orderBy(cards, ['cost',typeSort,'name']);
  };
};
