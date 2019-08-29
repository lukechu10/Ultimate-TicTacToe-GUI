$(() => {
    //window.uTicTacToe = require('ultimate-tictactoe-ai');
    window.uTicTacToe = require('../../../Node Addon API Integration/exports');
    window.game = new uTicTacToe.uTicTacToe();
});