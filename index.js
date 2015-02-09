var ui = require('./ui');

function run() {
  ui.mainMenu.show();

  ui.mainMenu.controls.list.on('select', function (item, index) {
    switch (index) {
      case 0:
        ui.deckBuilder.show();
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        process.exit(0);
        break;
    }
  });
}
run();
