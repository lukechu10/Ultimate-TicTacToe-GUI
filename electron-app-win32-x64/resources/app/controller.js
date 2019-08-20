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
        case "X":
            sq.addClass("gamebutton-player1");
            break;
        case "O":
            sq.addClass("gamebutton-player2");
            break;
        default:
            console.warn("Argument who is invalid");
    }
    sq.text(who);
}

getBoard = (row, col, subRow, subCol) => {
    return $("button.gamebutton.gamebutton-row-" + row + ".gamebutton-col-" + col + ".gamebutton-subRow-" + subRow + ".gamebutton-subCol-" + subCol).text();
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

$(() => {
    // handle button click
    $("button.gamebutton").click((event) => {
        // generate list of availibe moves and see if user move is legal
        // human player is player 1
        var moves = game.availibleMoves("player1");
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
            game.applyMove(row, col, subRow, subCol, "player1");
            // update ui
            sq.text("X");
            sq.addClass("gamebutton-player1");

            // check for win
            game.checkSubWin(row, col);
            updateQuadrantWins(game.subWins());

            if (game.checkForWinGlobal() == "player1") alert("You win!")

            // computer turn
            // random move
            moves = game.availibleMoves("player2"); // computer is player2
            var move = moves[Math.floor(Math.random() * moves.length)];
            console.log(move)

            // apply move
            game.applyMove(move.row, move.col, move.subRow, move.subCol, move.who);
            // update ui
            setBoard(move.row, move.col, move.subRow, move.subCol, "O");
            // check for win
            game.checkSubWin(move.row, move.col);
            updateQuadrantWins(game.subWins());

            updateQuadrantNext(move.subRow, move.subCol);

            if (game.checkForWinGlobal() == "player2") alert("You loose!")
        }
    });
});
