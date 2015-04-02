var fs = require('fs');
var path = require('path');
var bluebird = require('bluebird');
var extend = require('extend');
bluebird.promisifyAll(fs);
module.exports = function ($scope, $rootScope, utils) {
  $rootScope.title = "My Decks";
  var decksPath = path.join(__dirname, '..', '..', 'data', 'decks');
  fs.readdirAsync(decksPath).then(function (decks) {
    $scope.$apply(function () {
      $scope.decks = decks.map(function (deckFile) {
        return require(path.join(decksPath, deckFile));
      });
    });
  }).catch(console.error.bind(console));
  $scope.go = utils.navigate;
};
