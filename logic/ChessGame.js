import Board from "./Board.js";

class ChessGame {
	board;
	turn = "w";
	hasEnded = false;
	fullMoves = 1;
	history = [];
	constructor(injectObject) {
		if (injectObject) {
			const { board_fen, turn, enpassant, fullMoves } = injectObject;
			this.board = new Board(board_fen, enpassant);
			this.turn = turn;
			this.fullMoves = fullMoves;
			this.history = [];
			this.hasEnded = false;
		} else {
			this.setDefeault();
		}
	}
	setDefeault() {
		this.board = new Board();
		this.turn = "w";
		this.hasEnded = false;
		this.history = [];
		this.fullMoves = 1;
	}
	getActiveKing() {
		return this.turn == "w" ? this.board.white_king : this.board.black_king;
	}

	switchTurn() {
		this.turn = this.turn == "w" ? "b" : "w";
		if (this.turn == "w") this.fullMoves++;
	}
}
export default ChessGame;
