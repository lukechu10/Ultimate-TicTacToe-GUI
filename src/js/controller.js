// event handling
var playerNum = 1;
var opponentNum = 2;

updatePlayer = () => {
    if (playerNum == 1) {
        $(".playerChar").text("X");
        opponentNum = 2;
    }
    if (playerNum == 2) {
        $(".playerChar").text("O");
        opponentNum = 1;
    }
}

updateQuadrantNext = (nextRow, nextCol) => {
    $(".gameboard-quadrant").removeClass("gameboard-quadrant-next");
    if (nextRow == -1 && nextCol == -1 ||
        /* subWin is won */ game.subWins()[nextRow][nextCol] != "blank") { // anywhere
        $(".gameboard-quadrant:not(.gameboard-quadrant-player1):not(.gameboard-quadrant-player2)").addClass("gameboard-quadrant-next");
    }
    else {
        $(".gameboard-quadrant-row-" + nextRow + ".gameboard-quadrant-col-" + nextCol).addClass("gameboard-quadrant-next");
    }
}

setBoard = (row, col, subRow, subCol, who) => {
    const sq = $("button.gamebutton.gamebutton-row-" + row + ".gamebutton-col-" + col + ".gamebutton-subRow-" + subRow + ".gamebutton-subCol-" + subCol);
    switch (who) {
        case 1:
            sq.addClass("gamebutton-player1");
            break;
        case 2:
            sq.addClass("gamebutton-player2");
            break;
        default:
            console.warn("Argument who is invalid");
    }
}

updateQuadrantWins = (subWins) => {
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
            if (subWins[row][col] != "blank") {
                // update quadrant color
                $(".gameboard-quadrant-row-" + row + ".gameboard-quadrant-col-" + col).addClass("gameboard-quadrant-" + subWins[row][col]);
            }
        }
    }
}

gameStateFinished = false;


$(document).on("pageLoad", () => {
    updateQuadrantNext(-1, -1);
    // handle button click
    $("button.gamebutton").click((event) => {
        $("#new-game-btn").removeClass("disabled");

        if (!gameStateFinished) {
            // generate list of availibe moves and see if user move is legal
            // human player is player 1
            var moves = game.availibleMoves("player" + playerNum);
            // construct move
            var sq = $(event.target);

            var classes = sq.attr("class").split(/\s+/);

            const row = parseInt(classes[1][classes[1].length - 1]);
            const col = parseInt(classes[2][classes[2].length - 1]);
            const subRow = parseInt(classes[3][classes[3].length - 1]);
            const subCol = parseInt(classes[4][classes[4].length - 1]);

            var find = moves.find((element) => {
                return element.row == row && element.col == col &&
                    element.subRow == subRow && element.subCol == subCol;
            });

            if (!find) {
                // ilegal move
                alert("That move is not availible!");
            }
            else {
                // update board
                game.applyMove(row, col, subRow, subCol, "player" + playerNum);
                game.checkSubWin(row, col);
                // update ui
                //sq.addClass("gamebutton-player" + playerNum);
                setBoard(row, col, subRow, subCol, playerNum);

                // check for win
                //game.checkSubWin(row, col);
                updateQuadrantWins(game.subWins());
                updateQuadrantNext(subRow, subCol);
                $(".eval-num").text(game.evaluate());

                if (game.checkForWinGlobal() == "player" + playerNum) {
                    alert("You won!");
                    gameStateFinished = true;
                    return;
                }

                // computer turn
                moves = game.availibleMoves("player" + opponentNum);
                if (moves.length == 0) {
                    alert("It's a tie");
                    gameStateFinished = true;
                    return;
                }
                // time move
                var time1 = new Date();
                var move = game.bestMove("player" + opponentNum);
                var time2 = new Date();
                $("#minimax-time").text((time2 - time1) + "ms");
                //console.log(move)

                // apply move
                game.applyMove(move.row, move.col, move.subRow, move.subCol, move.who);
                // update ui
                setBoard(move.row, move.col, move.subRow, move.subCol, opponentNum);
                // check for win
                game.checkSubWin(move.row, move.col);
                updateQuadrantWins(game.subWins());
                updateQuadrantNext(move.subRow, move.subCol);
                $(".eval-num").text(game.evaluate());

                if (game.checkForWinGlobal() == "player" + opponentNum) {
                    alert("You lost!");
                    gameStateFinished = true;
                    return;
                }
            }
        }
    });
});

/**
 * Resets the game.
 */
resetGame = () => {
    const resetComponents = () => {
        game = new uTicTacToe.uTicTacToe();
        $(".gamebutton").removeClass("gamebutton-player1").removeClass("gamebutton-player2");
        $(".gameboard-quadrant").removeClass("gameboard-quadrant-player1").removeClass("gameboard-quadrant-player2");
        updateQuadrantNext(-1, -1);
        $(".eval-num").text(0);
        $("#minimax-time").text("...ms");
        $("#new-game-btn").addClass("disabled");
        gameStateFinished = false;
    }

    if (gameStateFinished) {
        resetComponents();
    }
    else {
        $(".ui.basic.modal").modal('show').modal({
            onApprove: resetComponents
        });
    }
}