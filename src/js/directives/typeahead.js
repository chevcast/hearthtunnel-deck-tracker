module.exports = function () {
  var cardsEngine = new window.Bloodhound({
    local: cards,
    queryTokenizer: window.Bloodhound.tokenizers.whitespace,
    datumTokenizer: window.Bloodhound.tokenizers.whitespace
  });
  return {
    restrict: 'EA',
    controller: function ($scope, $element, cards) {
      $element.typeahead({
        minLength: 2
      }, {
        name: 'collectible-cards',
        displayKey: 'name',
        source: cardsEngine
      });
    }
  }
};
