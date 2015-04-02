module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      cardId: '@',
      interactive: '@'
    },
    templateUrl: './templates/directives/card-thumbnail.html',
    controller: function ($scope, cards) {
      for (var index=0;index<cards.length;index++) {
        var card = cards[index];
        if (card.id === $scope.cardId) {
          $scope.card = card;
          break;
        }
      }
    }
  }
};
