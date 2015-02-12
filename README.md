# hearthtunnel

Hearthtunnel is a Hearthstone deck tracker. When in use it will monitor the Hearthstone log file and report information about the game as you play. It supports both Windows and OS X, but Windows hasn't been tested very thoroughly yet.

## Install

> $ npm install -g hearthtunnel

## Use

> $ hearthtunnel

Note: Hearthtunnel is still in beta. The deck builder feature is not yet complete so you'll have to define your decks manually until then. To do this follow these steps:

1. > $ cd $(npm get prefix)/lib/node_modules/hearthtunnel/decks

2. Make a new .json file with your deck name as the file name.

3. Copy the contents from [Zoolock.json](https://github.com/chevex/hearthtunnel/blob/master/decks/Zoolock.json) and paste it into your file.

4. Modify the data to reflect your deck. Note that the card names are case sensitive and must be identical to the card names in the game. The number to the right of each card is how many you have in your deck.

Soon there will be a built-in deck builder that will make it infinitely easier to populate your decks. Until then, I apologize for the hassle.
