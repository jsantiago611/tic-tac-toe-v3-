//Self-invoking function
!function() {

  // SET VARIABLES
  let player1Selections = [];
  let player2Selections = [];
  let box = document.querySelectorAll('.box');
  const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

  //Convert UL to Array. This allows us to track user choices.
  let list = document.querySelectorAll('ul.boxes li');
  let boxArray = Array.from(list)

  //Hides everything except Start Screen
  function startScreen() {
    //hide the game board
    $('#board').hide();
    //prepend start screen
    const $startScreen = $(`<div class="screen screen-start" id="start">
  	  <header>
  	    <h1>Tic Tac Toe</h1>
  			<div>
  				<input id="player1" class="playerInputBox" type="text" placeholder="Player One Name"></input>
  				<input id="player2" class="playerInputBox2" type="text" placeholder="Player Two Name"></input>
  			</div>
  	    <a href="#" class="button">Start game</a>
        <div>
          <p class="padding">(Leave "Player Two Name" Blank to Play our Lightning-fast Computer)</p>
        </div>
  	  </header>
  	</div>`);
    $('body').prepend($startScreen);

    //add an input for player names
    let $inputBox1 = $("#player1");
    let $inputBox2 = $("#player2");
    $inputBox1.hide().fadeIn(1000);
    $inputBox2.hide().fadeIn(1000);


    //on Button click...
    $('.button').on('click', function() {
        //Store user names into variable to display during gameplay
        let player1Input = $inputBox1.val();
        let player2Input = $inputBox2.val();
        //add default names if player did not type in a names
        if (player1Input === "") {
          player1Input = "Player 1";
        }
        if (player2Input === "") {
          player2Input = "Computer";
          aiGameplay();

        } else {
          humanGameplay();
        }
        //start screen is removed
        $startScreen.fadeOut();
        //gameplay is shown
        $('#board').show('slow');
        //append player names above the O and X
        $('#player1Box').prepend(`<p> ${player1Input} </p>`);
        $('#player2Box').prepend(`<p> ${player2Input} </p>`);
        $('#player1Box').addClass('active');
    });
  }

  startScreen();

// ///////////////////////////////////////
function activeMouseOver() {
    //Shows X on MouseOver
    $('.box').on('mouseover', function() {
      //if PlayerO is active...
      if (($('#player1Box').hasClass('active')) &&  ($(this).hasClass('box'))) {
          //and the box is empty..
          if ((!$(this).hasClass('box-filled-1')) && (!$(this).hasClass('box-filled-2'))) {
          //attach an o to the empty square,
          $(this).css("background-image", "url('img/o.svg')");
          }
      //Otherwise, if PlayerX is active...
      } else if (($('#player2Box').hasClass('active')) &&  ($(this).hasClass('box'))) {
        //and the box is empty..
        if ((!$(this).hasClass('box-filled-1')) && (!$(this).hasClass('box-filled-2'))) {
          //attach an X
        $(this).css("background-image", "url('img/x.svg')");
      }
    }
    });

    //removes O on mouseOver
    $('.box').on('mouseout', function() {
    //if box is NOT filled...
    if ((!$(this).hasClass('box-filled-1')) && (!$(this).hasClass('box-filled-2'))) {
        //do not display any symbol
        $(this).css("background-image", "none");
      } else {
      }
    })
}; //func ends


/////////////////////////////////////
function humanGameplay() {

  var currentPlayerToken = 'x';
  let moveCount = 0;

  //create variable to store player's choices
  const chosenSquares = {
    'x': [],
    'o': []
  }

  //listen for user clicks on the boxes. :not prevents us from being chosen 2x
  $('.boxes').on('click' , '.box:not(".box-filled-1, .box-filled-2")', function(event) {
    //store the clicked box in a var
    let $selection = $(event.currentTarget);

    //add a number to the move count to track selections
    moveCount += 1;

    //record player choices in the var
    //
    //find index by finding all boxes on board
    var $indexOfSelection = $('.box').index($selection);
    //and passing chosen box as argument into
    var currentPlayerSelection = chosenSquares[currentPlayerToken]
    //push index into the chosenSquares array
    currentPlayerSelection.push($indexOfSelection);
    console.log(currentPlayerSelection);

    //check for win
    ////////////////
    ////////////////
    //For each winning combo...
    $.each(winningCombos, function(index, combination) {
      //lets assume that the player has all the squares
      let hasAllSquares = true;

        //for each box in combo
        $.each(combination, function(index, box) {
          //if chosen box doesnt contain the current square, return false
          if ($.inArray(box, currentPlayerSelection) === -1) {
            hasAllSquares = false;
          }
        });

        //if O player has all squares, return " O wins!"
        if ((hasAllSquares) && (currentPlayerToken === 'x') && (currentPlayerToken !== 'o')) {
          winningScreenO();
          swap();

          //if X player has all squares, return " X wins!"
        } else if ((hasAllSquares) && (currentPlayerToken === 'o')) {
          winningScreenX();
          swap();
        }
    });

      //if all moves have passed and no win, return "tie"
      if (moveCount === 9) {
        tieScreen();
      }
      //////////////
      //////////////

      function swap() {
      //swap current player tokens
      if (currentPlayerToken === 'x') {
        $('#player1Box').removeClass('active');
        $('#player2Box').addClass('active');
          currentPlayerToken = 'o';
      } else if (currentPlayerToken === 'o') {
        $('#player2Box').removeClass('active');
        $('#player1Box').addClass('active');
        currentPlayerToken = 'x';
      }
      console.log(currentPlayerToken)
    }

      //INDIVIDUAL BOX COLORS: if the box is active, fill it with color and add appropriate image
      if (currentPlayerToken === 'x') {
        $(this).addClass('box-filled-1').css("background-image", "url('img/o.svg')");
        swap();
      } else if (currentPlayerToken === 'o') {
        $(this).addClass('box-filled-2').css("background-image", "url('img/x.svg')");
        swap();
      }
  });
}
///////////////////////////////////////////////
function aiGameplay() {

    var currentPlayerToken = 'x';
    let moveCount = 0;

    //create variable to store player's choices
    const chosenSquares = {
      'x': [],
      'o': []
    }


    //listen for user clicks on the boxes. :not prevents us from being chosen 2x
    $('.boxes').on('click' , '.box:not(".box-filled-1, .box-filled-2")', function(event) {
      //store the clicked box in a var
      let $selection = $(event.currentTarget);

      //add a number to the move count to track selections
      moveCount += 1;

      //record player choices in the var
      //
      //find index by finding all boxes on board
      var $indexOfSelection = $('.box').index($selection);
      //and passing chosen box as argument into
      var currentPlayerSelection = chosenSquares['o'];
      //push index into the chosenSquares array
      currentPlayerSelection.push($indexOfSelection);
      console.log(currentPlayerSelection)

      function pickRandomBox() {
        const randomBoxNumber = Math.floor(Math.random() * 9);
        const $boxes = $(".box");
        const box = $($boxes[randomBoxNumber]);
        if ((!box.hasClass("box-filled-1")) && (!box.hasClass("box-filled-2"))) {
                box.addClass("box-filled-2").css("background-image", "url('img/x.svg')");
                // var $indexOfAiSelection = $('.box').index($selection);
                var $indexOfAiSelection = $boxes.index(box);
                var currentAISelection = chosenSquares['x'];
                currentAISelection.push($indexOfAiSelection);
                console.log(currentAISelection);

                winningCombos.forEach(combo => {
                  if ($($boxes[combo[0]]).hasClass('box-filled-2') &&
                      $($boxes[combo[1]]).hasClass('box-filled-2') &&
                      $($boxes[combo[2]]).hasClass('box-filled-2')
                      )
                     {
                    console.log('gotem');
                    winningScreenXai()
                  }
                })
            } else {
                pickRandomBox();
            }
          }

      //check for win
      ////////////////
      ////////////////
      //For each winning combo...
      $.each(winningCombos, function(index, combination) {
        //lets assume that the player has all the squares
        let hasAllSquares = true;

          //for each box in combo
          $.each(combination, function(index, box) {
            //if chosen box doesnt contain the current square, return false
            if ($.inArray(box, currentPlayerSelection) === -1) {
              hasAllSquares = false;
            }
          });

          //if O player has all squares, return " O wins!"
          if ((hasAllSquares) && (currentPlayerToken === 'x') && (currentPlayerToken !== 'o')) {
            winningScreenO();
            swap();

            //if X player has all squares, return " X wins!"
          } else if ((hasAllSquares) && (currentPlayerToken === 'o')) {
            winningScreenX();
            swap();
          }
      });

        //if all moves have passed and no win, return "tie"
        if (moveCount === 9) {
          tieScreen();
        }
        //////////////
        //////////////
        //////////////

        function swap() {
        //swap current player tokens
        if (currentPlayerToken === 'x') {
          $('#player1Box').removeClass('active');
          $('#player2Box').addClass('active');
            currentPlayerToken = 'o';
        } else if (currentPlayerToken === 'o') {
          $('#player2Box').removeClass('active');
          $('#player1Box').addClass('active');
          currentPlayerToken = 'x';
        }
        console.log(currentPlayerToken)
      }

        //INDIVIDUAL BOX COLORS: if the box is active, fill it with color and add appropriate image
        if (currentPlayerToken === 'x') {
          moveCount += 1;
          $(this).addClass('box-filled-1').css("background-image", "url('img/o.svg')");
          pickRandomBox();
        } else if (currentPlayerToken === 'o') {
          $(this).addClass('box-filled-2').css("background-image", "url('img/x.svg')");
          swap();
        }
    });
}
////////////////////////////////////////////////
function winningScreenO() {
  //remove Screen
  $('#board').hide('fast');
  const $oPlayerName = $('.active').find('p').text();
  //append the winning screen
  const $winScreen = $(`<div class="screen screen-win" id="finish">
    <header>
      <h1>Tic Tac Toe</h1>
      <p class="message">${$oPlayerName} Won!</p>
      <a href="" class="button">New game</a>
    </header>
  </div>`);
  $('body').prepend($winScreen).addClass('.screen-win screen-win-one').removeClass('.screen-win screen-win-two');
  $('$tieScreen').hide();
  executeReset(resetGame);
}

function winningScreenX() {
  //remove Screen
  $('#board').hide('fast');
  const $xPlayerName = $('.active').find('p').text();
  //append the winning screen
  const $winScreen = $(`<div class="screen screen-win" id="finish">
    <header>
      <h1>Tic Tac Toe</h1>
      <p class="message">${$xPlayerName} Won!</p>
      <a href="" class="button">New game</a>
    </header>
  </div>`);
  $('body').prepend($winScreen).addClass('.screen-win screen-win-two');
  $('$tieScreen').hide();
  executeReset(resetGame);
}

function winningScreenXai() {
  //remove Screen
  $('#board').hide('fast');
  const $xPlayerName = $('.active').find('p').text();
  //append the winning screen
  const $winScreen = $(`<div class="screen screen-win" id="finish">
    <header>
      <h1>Tic Tac Toe</h1>
      <p class="message">Computer Won!</p>
      <a href="" class="button">New game</a>
    </header>
  </div>`);
  $('body').prepend($winScreen).addClass('.screen-win screen-win-two');
  $('$tieScreen').hide();
  executeReset(resetGame);
}

const $tieScreen = $(`<div class="screen screen-win-tie" id="finish">
  <header>
    <h1>Tic Tac Toe</h1>
    <p class="tie-message">It's a Tie!</p>
    <a href="" class="button">New game</a>
  </header>
</div>`);

function tieScreen() {
  //remove Screen
  $('#board').hide('fast');
  //append the tie screen
  $('body').prepend($tieScreen);
  $('$winScreen').hide();
  executeReset(resetGame);
}

function resetGame() {
  ($(".button")).click(function() {
        document.location.reload(true);
        $('body')
          .hide($winScreen)
          .hide($tieScreen)
  });
}

function executeReset(callback) {
  callback();
}

activeMouseOver();
}();
