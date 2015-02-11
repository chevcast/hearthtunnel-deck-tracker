// Get reference to our UI suite.
var ui = require('./ui');

// Attach a global key handler for ^C so the process
// can easily be killed.
ui.screen.key('C-c', process.exit.bind(process, 0));

// Set the list of main menu items.
ui.mainMenu.setItems([
  'Deck Builder',
  'Start Tracking',
  'Settings',
  'Exit'
]);

// Temporarily show the first item as disabled the first item.
var firstItem = ui.mainMenu.list.items[0];
firstItem.style.fg = '#ff0000';
firstItem.content += ' (soon)';

// The main program function.
function run() {
  // Showing a container hides all others.
  ui.mainMenu.show();

  // When the user selects an item.
  ui.mainMenu.onSelect(function (item) {
    switch (item) {
      case 'deck-builder':
        // Temporarily do nothing.
        // ui.deckBuilder.show();
        break;
      case 'start-tracking':
        ui.tracker.show();
        break;
      case 'settings':
        // Temporarily do nothing.
        // ui.settings.show();
        break;
      case 'exit':
        // Exit the process cleanly.
        process.exit(0);
        break;
    }
  });
}

// If at any time the user presses the Q key,
// return to the main menu.
ui.screen.key('q', run);

// Run the program for the first time.
run();
