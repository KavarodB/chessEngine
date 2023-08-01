import Figure from "../logic/Figure.js";
import Coordinate from "./Coordinate.js";
import Bishop from "./pieces/bishop.js";
import King from "./pieces/king.js";
import Knight from "./pieces/knight.js";
import Pawn from "./pieces/pawn.js";
import Queen from "./pieces/queen.js";
import Rook from "./pieces/rook.js";

class Board {
	static MAX_SIZE = 7;
	enpassant = [-1, -1];
	white_king = {};
	black_king = {};
	whitefigures = [];
	blackfigures = [];
	matrix = [];
	fifty_rule = 0;

	constructor(fen = null, enpassant = null) {
		for (let i = 0; i < 8; i++) {
			this.matrix[i] = [];
			for (let j = 0; j < 8; j++) {
				this.matrix[i][j] = null;
			}
		}
		if (fen) {
			this.#fromFEN(fen, enpassant);
		} else {
			this.#fromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
		}
	}

	toFen() {
		let strboard = "";
		for (let x = Board.MAX_SIZE; x >= 0; x--) {
			let empty_space_counter = 0;
			for (let y = 0; y <= Board.MAX_SIZE; y++) {
				let figure = this.matrix[x][y];
				if (figure instanceof Figure) {
					if (empty_space_counter > 0) {
						strboard += empty_space_counter;
						empty_space_counter = 0;
					}
					strboard += figure.notation;
				} else {
					empty_space_counter++;
				}
			}
			if (empty_space_counter > 0) {
				strboard += empty_space_counter;
				empty_space_counter = 0;
			}
			if (x > 0) strboard += "/";
		}
		return strboard;
	}

	showBoard() {
		let strboard = "";
		for (let x = Board.MAX_SIZE; x >= 0; x--) {
			for (let y = 0; y <= Board.MAX_SIZE; y++) {
				let figure = this.matrix[x][y];
				if (figure instanceof Figure) {
					strboard += "[" + figure.notation + "]";
				} else {
					strboard += "[ ]";
				}
			}
			strboard += "\n";
		}
		console.log(strboard);
	}

	getKing(turn) {
		return turn == "w" ? this.white_king : this.black_king;
	}
	getFigures(turn) {
		return turn == "w" ? this.whitefigures : this.blackfigures;
	}
	getFigure(x, y) {
		return this.matrix[x][y];
	}
	setFigure(x, y, figure) {
		this.matrix[x][y] = figure;
	}
	resetFiftyRule() {
		this.fifty_rule = 0;
	}

	#fromFEN(fen, enpassant = null) {
		if (enpassant && enpassant != "-") {
			const coord = Coordinate.generate(enpassant);
			if (coord != null);
			this.enpassant = [coord.x, coord.y];
		}
		const fenParts = fen.split(" ");
		const rows = fenParts[0].split("/").reverse();

		for (let i = 0; i < 8; i++) {
			const row = rows[i];
			let colIndex = 0;

			for (let j = 0; j < row.length; j++) {
				const char = row.charAt(j);

				if (isNaN(parseInt(char))) {
					const side = char == char.toUpperCase() ? "w" : "b";
					const figure = this.#parseFigure(char.toLowerCase(), i, colIndex, side);
					this.matrix[i][colIndex] = figure;
					if (side == "w") {
						if (figure instanceof King) {
							this.white_king = figure;
						}
						this.whitefigures.push(figure);
					} else {
						if (figure instanceof King) {
							this.black_king = figure;
						}
						this.blackfigures.push(figure);
					}
					colIndex++;
				} else {
					colIndex += parseInt(char);
				}
			}
		}
	}

	#parseFigure(notation, x, y, side) {
		let figure = null;
		switch (notation) {
			case "r":
				figure = new Rook(x, y, side);
				break;
			case "b":
				figure = new Bishop(x, y, side);
				break;
			case "n":
				figure = new Knight(x, y, side);
				break;
			case "k":
				figure = new King(x, y, side);
				break;
			case "q":
				figure = new Queen(x, y, side);
				break;
			case "p":
				figure = new Pawn(x, y, side);
				break;
			default:
				break;
		}
		return figure;
	}
}
export default Board;
