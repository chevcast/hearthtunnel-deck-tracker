module.exports = function ($rootScope, $scope, mainWindow) {
  $rootScope.title = "Untitled";
  $scope.closeApp = function () {
    mainWindow.close();
  };
  $scope.minimizeApp = function () {
    mainWindow.minimize();
  };
  $scope.devTools = function (event) {
    if (!event.ctrlKey || event.keyCode !== 68) {
      return;
    }
    if (!mainWindow.isDevToolsOpen()) {
      mainWindow.showDevTools();
    } else {
      mainWindow.closeDevTools();
    }
  };
};
