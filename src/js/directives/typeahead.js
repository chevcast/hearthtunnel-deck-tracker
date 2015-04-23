module.exports = function () {
  return {
    restrict: 'EA',
    controller: function ($scope, $element, cards) {
      $element.typeahead({
        minLength: 2
      }, {
        name: 'collectible-cards',
        displayKey: 'name',
        source: function (query, cb) {
          $scope.$apply(function () {
            if (query.toLowerCase() === 'knife') {
              cb([cards['NEW1_019'], cards['BRM_002']]);
            } 
          });
        }
      });
    }
  }
};
