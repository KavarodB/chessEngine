import BoardEngine from "./BoardEngine.js";
import Board from "./Board.js";
import ErrorMessages from "./ErrorMessages.js";
import ChessGame from "./ChessGame.js";
import Coordinate from "./Coordinate.js";

class ChessEngine {
	chessGame;
	boardEngine;
	#number_regex = /^[1-8]$/gm;
	#char_regex = /^[a-h]$/gm;

	constructor(chessGame) {
		this.chessGame = chessGame;
		this.boardEngine = new BoardEngine(chessGame.board);
	}
	injectGame(chessGame) {
		this.chessGame = chessGame;
		this.boardEngine = this.boardEngine.injectBoard(chessGame.board);
		return this;
	}
	chessGameToFEN() {
		let fen = this.boardEngine.board.toFen();
		fen += " " + this.chessGame.turn + " ";
		fen += this.boardEngine.canKingCastle(this.boardEngine.board.getKing("w"));
		fen += this.boardEngine.canKingCastle(this.boardEngine.board.getKing("b"));
		const [x, y] = this.boardEngine.board.enpassant;
		if (x > -1 && y > -1) {
			fen += " " + Coordinate.translate(x, y);
		} else {
			fen += " -";
		}
		fen += " " + this.boardEngine.board.fifty_rule;
		fen += " " + this.chessGame.fullMoves;
		return fen;
	}
	chessGameFromFEN(fen) {
		let fen_array = fen.split(" ");
		const board_fen = fen_array[0];
		const turn = fen_array[1];
		const castle = fen_array[2];
		const enpassant = fen_array[3];
		const fifty_rule = fen_array[4];
		const full_move = fen_array[5];
		this.chessGame = new ChessGame({ board_fen, turn, enpassant, full_move });
		this.boardEngine = new BoardEngine(this.chessGame.board);
	}
	playMove(move) {
		//Game ended.
		if (this.chessGame.hasEnded) return ErrorMessages.gameFlow(0);
		const played = this.#ParseAndTryMove(move);
		if (played != true) {
			//Error message.
			return played;
		}
		this.chessGame.history.push(move);
		this.chessGame.switchTurn();
		this.chessGame.board.showBoard();
		if (this.#isCheckmate()) {
			console.log(
				"Game ended!\nWinner:",
				this.chessGame.turn == "w" ? "Black" : "White"
			);
			this.chessGame.hasEnded = true;
			//Winner.
			return this.chessGame.turn == "w" ? 2 : 1;
		}
		if (this.#isDraw()) {
			console.log("Game ended!\nDraw!");
			this.chessGame.hasEnded = true;
			//Draw.
			return 3;
		}
		//Countinue playing.
		return 0;
	}

	playGame(str) {
		//1. d4 h6 2. Qd3 g5 3. Be3 f5 4. Nc3 e5
		let moves_array = [];
		const regex =
			/\d+. ([a-zA-Z0-9]{1,3}\d(\+|#)? |O-O-O |O-O )(([a-zA-Z0-9]{1,3}\d(\+|#)? )|O-O-O |O-O )/gm;
		const matches = str.matchAll(regex);
		for (const match of matches) {
			moves_array.push(match[1].trim(), match[3].trim());
		}
		for (let i = 0; i < moves_array.length; i++) {
			if (this.ended == true) {
				console.log("skipped, ", moves_array[i]);
				continue;
			}
			const move = moves_array[i];
			console.log(this.playMove(move));
		}
		this.injectGame(new ChessGame());
	}

	#isDraw() {
		return (
			//50-moves rule.( 50 moves per player => 100 in total. )
			this.chessGame.board.fifty_rule >= 100
			//this.#drawByInsufficientMaterial() ||
			//this.#drawByStaleMate() ||
			//this.#drawByThreeFoldRep()
		);
	}

	#isCheckmate() {
		//Get king.
		const king = this.chessGame.getActiveKing();
		const checking_figures = this.boardEngine.isKingInCheck(
			king.x,
			king.y,
			king.side
		);
		if (checking_figures.length == 0) return false;
		//Check first if a figure other than king can block the check.
		let can_be_blocked = this.boardEngine.canFigureBlock(
			king,
			checking_figures
		);
		if (can_be_blocked) return false;
		//Check if king can move to safety.
		return !this.boardEngine.canKingMove(king);
	}

	#ParseAndTryMove(move) {
		if (move === "O-O") {
			const king = this.chessGame.getActiveKing();
			if (!this.boardEngine.castleKingShort(king))
				return ErrorMessages.castleMove(0);
			return true;
		}
		if (move === "O-O-O") {
			const king = this.chessGame.getActiveKing();
			if (!this.boardEngine.castleKingLong(king))
				return ErrorMessages.castleMove(1);
			return true;
		}
		if (move.includes("x")) {
			move = move.replace("x", "");
		}
		if (move.includes("+")) {
			move = move.replace("+", "");
		}
		if (move.includes("#")) {
			move = move.replace("#", "");
		}
		//Syntax checks.
		if (move.length > 4 || move.length < 2) {
			return ErrorMessages.moveParse(0);
		}

		//Check for figure notation first.
		let figure_notation = "";
		let offset = 0;
		let filter = "";
		let isNumber = true;
		if (move.length == 2) {
			figure_notation = "p";
		} else if (move.length == 3) {
			figure_notation = move.charAt(0);
			//Remove that char.
			move = move.substr(1);
			// Pawn filter.
			if (figure_notation.match(this.#char_regex) != null) {
				filter = Number.parseInt(
					String.fromCharCode(figure_notation.charCodeAt(0) - 49)
				);
				isNumber = false;
				figure_notation = "p";
			}
		} else if (move.length == 4) {
			figure_notation = move.charAt(0);
			filter = move.charAt(1);
			//Remove thoose chars.
			move = move.substr(2);
			// Rook,Bishop or Knight filter.
			if (filter.match(this.#number_regex) != null) {
				filter = Number.parseInt(filter) - 1;
			} else if (filter.match(this.#char_regex) != null) {
				filter = Number.parseInt(
					String.fromCharCode(filter.charCodeAt(0) - 49)
				);
				isNumber = false;
			}
		}

		const found_figures = this.boardEngine
			.parseFigure(figure_notation, this.chessGame.turn)
			.filter((figure) => {
				if (filter != "") {
					if (isNumber) {
						return figure.x == filter;
					} else {
						return figure.y == filter;
					}
				}
				return figure;
			});

		if (found_figures.length == 0) {
			return ErrorMessages.moveParse(1);
		}

		//Parse move cooridnates.
		const coord = Coordinate.generate(move);
		if (coord == null) return ErrorMessages.moveParse(2);

		//Find figure that can go to that coord on board.
		for (let i = 0; i < found_figures.length; i++) {
			const result = this.boardEngine.moveFigure(
				found_figures[i],
				coord.x,
				coord.y
			);
			if (result == true) {
				return true;
			} else if (result != false) {
				return result;
			}
		}
		return ErrorMessages.moveParse(3);
	}

	#drawByStaleMate() {
		//no legal king & pawns moves.
		let is_stalemate = true;
		const figure_arr =
			this.turn == "w" ? this.board.whitefigures : this.board.blackfigures;
		const result = figure_arr.filter(
			(figure) => figure instanceof King || figure instanceof Pawn
		);
		if (result.length == figure_arr.length) {
			result.forEach((figure) => {
				if (!(figure instanceof King)) {
					if (this.board.isValidMove(figure, figure.x + 1, figure.y)) {
						is_stalemate = false;
					}
				} else {
					if (this.boardEngine.canKingMove(figure)) {
						is_stalemate = false;
					}
				}
			});
		} else {
			is_stalemate = false;
		}
		return is_stalemate;
	}

	#drawByInsufficientMaterial() {
		//Insufficient material
		if (this.board.whitefigures.length == 1) {
			if (this.board.blackfigures.length == 1) return true;
		}

		if (this.board.whitefigures.length == 1) {
			if (this.board.blackfigures.length == 2) {
				if (
					this.board.blackfigures.find(
						(figure) => figure instanceof Knight || figure instanceof Bishop
					) != undefined
				)
					return true;
			}
		}
		if (this.board.whitefigures.length == 2) {
			if (this.board.blackfigures.length == 1) {
				if (
					this.board.whitefigures.find(
						(figure) => figure instanceof Knight || figure instanceof Bishop
					) != undefined
				)
					return true;
			}
			if (this.board.blackfigures.length == 2) {
				const black_bishop = this.board.blackfigures.find(
					(figure) => figure instanceof Bishop
				);
				const white_bishop = this.board.whitefigures.find(
					(figure) => figure instanceof Bishop
				);
				if (black_bishop.isWhiteColor() == white_bishop.isWhiteColor())
					return true;
			}
		}
		return false;
	}

	//Not quite accurate.
	#drawByThreeFoldRep() {
		const last_ten = this.history.slice(Math.max(this.history.length - 10, 1));
		let counters = [0, 0, 0, 0];
		if (last_ten.length <= 8) return false;
		let last_moves = last_ten.slice(0, 4);
		for (let i = 4; i < 10; i++) {
			const move = last_ten[i];
			if (move === last_moves[i % 4]) {
				counters[i % 4]++;
			}
		}
		if (
			counters[0] == 2 &&
			counters[1] >= 1 &&
			counters[2] == 1 &&
			counters[3] == 1
		)
			return true;

		return false;
	}
}

export default ChessEngine;
