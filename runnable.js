import Board from "./logic/Board.js";
import BoardEngine from "./logic/BoardEngine.js";
import ChessGame from "./logic/ChessGame.js";
import ChessEngine from "./logic/ChessEngine.js";

const chessEngine = new ChessEngine(new ChessGame());
//Scholar's mate.
chessEngine.playGame(`1. e4 f5 2. f4 g5 3. Qh5# Kf7 `);
