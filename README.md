Tic Tac Toe Project Readme

Technologies Used:
  1) HTML5
  2) CSS3
  3) Sass
  4) JavaScript ES6
  5) Bootstrap
  6) AJAX
  7) jQuery

Project Planning:

Per project requirements, I needed to produce a single page application that allows two users to compete side by side in a game of Tic Tac Toe. In order to accomplish this, I decided to create two page views, one for game login, and one for the game board.

Link to project wireframe: https://www.flickr.com/photos/149961751@N05/36880658495/

The following were my initial user stories:
  1) As a user, I will be able to register a new account and log in.
  2) As a user, I will be able to initiate a game of tic-tac-toe with another registered user of the app.
  3) As a user, I will be able to access my in-progress games and return to them later, even after logging out.
  4) As a user, I can access and view my win-loss statistics.
  5) As a user, I can see a message indicating whether or not it is my turn.

To begin building my project, I designed the basic wireframe, using CSS and taking advantage of Bootstrap's grid system. Once the basic page elements were in place, I started writing JavaScript functions for the Tic Tac Toe gameplay. First I got an X to display in a box on click, then I added a mechanism to alternate between X and O, and finally I added logic to check the board for a winner. Utilizing jQuery and HTML class attributes, I came up with a system to make a board square unclickable after it has already been played.

Once the basic gameplay was in place, I began to design the login view and added API auth integration. I added sign up, sign in, sign out, and change password functions. I then added API game status integration. Once a user successfully logs in, a new game is created and registered with the API. I then added the ability to update the server after each move. Once the games are logged and saved with the server, it became possible to design a scoreboard indicating the win/loss/tie history for a given user. I built an additional function that runs on login that parses a list of all games played, and checks for X wins, O wins, and ties, and displays it on an aside next to the game board.

While adding all of this functionality, I integrated UI improvements to integrate my project theme, designing my game to look like Fenway Park's famous Green Monster scoreboard. I added info messages that convey the game status and the success or failure of API calls to the user, as well as a turn indicator ("At Bat").

For an additional challenge, I added the ability to play multiplayer games across different devices. Each game generates a unique game ID, so the first problem was designing a user interface that allows player 2 to join player 1's game. I decided to have player 1 click a Host Game button, which registers the game locally is an online game, and displays a message that it is waiting for input from the other player. Next, player 2 enters the game ID of player 1's game, and submits a form. Player 2 then successfully has joined player 1's game and the game can begin with player 2's move.

Implementing the watcher function proved to be quite challenging. At first, I was only able to get player 1's moves to display on player 2's screen, but not the other way around. Through much trial and error, and dozens of console.logs, I was able to successfully debug the problem. The watcher, which was running on both player 1 and player 2's games, was watching for changes to the game with the ID generated when the user logs in, and not the game that both players had joined. Once I recognized this, I implemented the changes and added new game mechanics to ensure that online games maintain the same turn structure.

So far I've been able to implement a local chat function, but have not yet devised a way to send messages from device to device. In future updates I'd like to add this functionality. Additionally, I'd like to add media queries to make the game display properly on mobile devices.
