module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      interactive: '='
    },
    templateUrl: './templates/directives/card-thumbnail.html',
    controller: function ($scope, $attrs, cards) {
      $scope.card = cards[$attrs.cardId];
    }
  }
};
