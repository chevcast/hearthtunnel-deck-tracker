var _ = require('lodash');

module.exports = function () {
  return {
    restrict: 'EA',
    scope: {
      addCard: '&'
    },
    controller: function ($scope, $element, cards, $filter) {
      var collectibleCards = $filter('collectible')(cards);
      var cardsEngine = new window.Bloodhound({
        local: Object.keys(collectibleCards).map(function (cardName) {
          return collectibleCards[cardName];
        }),
        identify: function (card) {
          return card.id;
        },
        datumTokenizer: window.Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: window.Bloodhound.tokenizers.whitespace
      });
      var ttInput = $element.typeahead({
        minLength: 2
      }, {
        name: 'collectible-cards',
        display: 'name',
        source: cardsEngine
      });
      $element.on('typeahead:select', function (event, suggestedCard) {
        $scope.$apply(function () {
          $scope.addCard({ $card: suggestedCard })
        });
      });
      /*
       *var logEvent = function (event, suggestion) { console.log(event, suggestion) };
       *$element.on('typeahead:select', logEvent);
       *$element.on('typeahead:change', logEvent);
       *$element.on('typeahead:active', logEvent);
       *$element.on('typeahead:idle', logEvent);
       *$element.on('typeahead:open', logEvent);
       *$element.on('typeahead:close', logEvent);
       *$element.on('typeahead:render', logEvent);
       *$element.on('typeahead:autocomplete', logEvent);
       *$element.on('typeahead:cursorchange', logEvent);
       */
    }
  }
};
