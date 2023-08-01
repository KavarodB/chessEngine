import Figure from "./Figure.js";
import King from "./pieces/king.js";
import Rook from "./pieces/rook.js";
import Pawn from "./pieces/pawn.js";
import Queen from "./pieces/queen.js";
import Coordinate from "./Coordinate.js";
import ErrorMessages from "./ErrorMessages.js";
class BoardEngine {
	constructor(board) {
		this.board = board;
	}

	injectBoard(board) {
		this.board = board;
		return this;
	}

	canKingCastle(king) {
		let str = "";
		const rook = this.board.getFigure(king.x, 7);
		const rook1 = this.board.getFigure(king.x, 0);
		if (!(king instanceof King)) return str; //not a valid king passed.
		if (rook1 instanceof Rook && !rook1.hasMoved) {
			str += "k"; //king side castle avaliable
		}
		if (rook instanceof Rook && !rook.hasMoved) {
			str += "q"; //queen side castle avaliable
		}
		if (str.length == 0) str = "-";

		if (king.side == "w") str = str.toLocaleUpperCase();
		return str;
	}

	castleKingShort(king) {
		const rook = this.board.getFigure(king.x, 7);
		if (!(king instanceof King) && !(rook instanceof Rook)) return false;

		//If either has moved.
		if (king.hasMoved || rook.hasMoved) return false;

		//Cordinate missmatch.
		if (king.y != 4 && rook.y != 7) return false;

		//Colision inbetween check.
		//Would king be in or passing through a check after castle.
		for (let y = rook.y - 1; y > king.y; y--) {
			if (this.board.getFigure(king.x, y) instanceof Figure) return false;
			if (this.isKingInCheck(king.x, y, king.side).length > 0) {
				return false;
			}
		}

		//Do the castle
		this.board.matrix[king.x][king.y] = {};
		this.board.matrix[rook.x][rook.y] = {};
		king.allowMove(king.x, king.y + 2);
		rook.allowMove(rook.x, rook.y - 2);
		this.board.matrix[king.x][king.y] = king;
		this.board.matrix[rook.x][rook.y] = rook;
		return true;
	}

	castleKingLong(king) {
		const rook = this.board.getFigure(king.x, 0);
		if (!(king instanceof King) && !(rook instanceof Rook)) return false;

		if (king.hasMoved || rook.hasMoved) return false;

		//Cordinate missmatch.
		if (king.y != 4 && rook.y != 0) return false;

		//Colision inbetween check.
		//Would king be in or passing through a check after castle.
		for (let y = king.y - 1; y > rook.y; y--) {
			if (this.board.getFigure(king.x, y) instanceof Figure) return false;
			if (y != 1 && this.isKingInCheck(king.x, y, king.side).length > 0) {
				return false;
			}
		}

		//Do the castle
		this.board.matrix[king.x][king.y] = {};
		this.board.matrix[rook.x][rook.y] = {};
		king.allowMove(king.x, king.y - 2);
		rook.allowMove(rook.x, rook.y + 3);
		this.board.matrix[king.x][king.y] = king;
		this.board.matrix[rook.x][rook.y] = rook;
		return true;
	}

	isKingInCheck(_x, _y, side) {
		let checkingfigures = [];
		// My king - enemy figures!
		const my_king = this.board.getKing(side);
		const _iter_figures =
			side == "w" ? this.board.blackfigures : this.board.whitefigures;

		//Move king to position.
		this.board.matrix[my_king.x][my_king.y] = {};
		this.board.matrix[_x][_y] = my_king;
		_iter_figures.forEach((figure) => {
			if (this.#isValidMove(figure, _x, _y)) {
				checkingfigures.push(figure);
			}
		});

		//Retrun king to current position.
		this.board.matrix[_x][_y] = {};
		this.board.matrix[my_king.x][my_king.y] = my_king;

		return checkingfigures;
	}

	getAvailableMoves(figure) {
		if (!(figure instanceof Figure)) return null;

		const king = this.board.getKing(figure.side);
		const allMoves = figure.getAdjacentMoves(this.board);

		//Disappeare the piece.
		this.board.setFigure(figure.x, figure.y, {});
		//Check again.
		const checking_figures = this.isKingInCheck(king.x, king.y, king.side);
		//Return the piece back.
		this.board.setFigure(figure.x, figure.y, figure);
		if (checking_figures.length == 0) return allMoves;

		const dangersqr = this.#generateDangerSquares(
			checking_figures,
			king.x,
			king.y
		);

		const avaliableMoves = allMoves.filter((move) => {
			for (let index = 0; index < dangersqr.length; index++) {
				const sqr = dangersqr[index];
				if (Coordinate.compare(move, sqr)) {
					return move;
				}
			}
		});

		return avaliableMoves;
	}

	canFigureBlock(king, checkingfigs) {
		let can_be_blocked = false;
		//get danger sqrs
		const dangersqr = this.#generateDangerSquares(checkingfigs, king.x, king.y);
		const allyfigures =
			king.side == "w" ? this.board.whitefigures : this.board.blackfigures;
		// for each danger sqr
		dangersqr.forEach((sqr) => {
			allyfigures.forEach((figure) => {
				if (
					!(figure instanceof King) &&
					this.#isValidMove(figure, sqr.x, sqr.y)
				) {
					console.log(figure, sqr);
					can_be_blocked = true;
				}
			});
		});
		return can_be_blocked;
	}

	#generateDangerSquares(checkingFigures, kingx, kingy) {
		//Check if king is in check at all.
		let dangersqrs = [];
		if (checkingFigures.length == 0) return dangersqrs;
		//Check on what squares is the king in check.
		dangersqrs.push(new Coordinate(kingx, kingy));
		checkingFigures.forEach((figure) => {
			dangersqrs.push(new Coordinate(figure.x, figure.y));
			dangersqrs.push(...figure.getMoveVector(kingx, kingy));
		});
		return dangersqrs;
	}

	canKingMove(king) {
		//No blocking from other figures.
		//Can the king move on a safe square
		const validsqr = king.getAdjacentMoves(this.board);
		if (validsqr.length == 0) return false;
		const safesqr = validsqr.filter((sqr) => {
			const checkingfigs = this.isKingInCheck(sqr.x, sqr.y, king.side);
			return checkingfigs.length == 0;
		});
		if (safesqr.length > 0) return true;
		return false;
	}

	/**
	 * Main driving method for the board class.
	 * @param {Figure} figure which figure to move.
	 * @param {number} _x x position of destination
	 * @param {number} _y y position of destination
	 * @returns true or false
	 */
	moveFigure(figure, _x, _y) {
		//Valid move, but not under the rules (checks).
		if (!this.#isValidMove(figure, _x, _y)) return false;
		if (figure instanceof King) {
			//If figure king => no need for checks.
			if (this.isKingInCheck(_x, _y, figure.side).length > 0)
				return ErrorMessages.boardEngineError(0);
			this.#doMove(figure, _x, _y);
			return true;
		}
		//Is the king in check.
		const king = this.board.getKing(figure.side);
		const result = this.#isKingInCheckAfterMove(king, _x, _y, 1);
		if (result != true) return result;
		//Is piece pinned to king.
		//Disappeare the piece.
		this.board.setFigure(figure.x, figure.y, {});
		//Check again.
		const new_result = this.#isKingInCheckAfterMove(king, _x, _y, 2);
		//Return the piece back.
		this.board.setFigure(figure.x, figure.y, figure);
		if (new_result != true) return new_result;
		//Pawn specific behaviour.
		if (figure instanceof Pawn) {
			// Promote to queen check?
			figure = figure.canPromote(_x, _y);
			if (figure instanceof Queen) {
				let arr_figs = this.board.getFigures(figure.side);
				//Necessary to have all 3 properties to change an element in the array.
				arr_figs.forEach((piece, index, arr) => {
					if (piece.x === figure.x && piece.y == figure.y) {
						arr[index] = figure;
					}
				});
			}
			//En passant check.
			if (Math.abs(figure.x) - _x == 2) {
				//Pushing pawn with 2 sqrs.
				this.board.enpassant = figure.side == "w" ? [_x - 1, _y] : [_x + 1, _y];
			} else {
				//Taking the enpassant srq.
				let [x, y] = this.board.enpassant;
				this.board.enpassant = [-1, -1];
				if (x == _x && y == _y) {
					//Taking enemy pawn.
					this.#doMove(figure, _x, _y, 1);
					return true;
				}
			}
		}
		//Execute move on the board
		this.#doMove(figure, _x, _y);
		return true;
	}

	parseFigure(notation, turn) {
		const figures = this.board.getFigures(turn);
		const return_fig = figures.filter(
			(fig) => fig.notationsmall === notation.toLowerCase() && fig.side == turn
		);
		return return_fig;
	}

	/**
	 * Checks if the move made by the figure is possible based on the board.
	 * @param {Figure} figure
	 * @param {number} _x
	 * @param {number} _y
	 * @returns {boolean} true or false
	 */
	#isValidMove(figure, _x, _y) {
		//If no real figure passed
		if (figure == {} || figure == undefined) return false;
		const move_vect = figure.getMoveVector(_x, _y);

		// If move is invalid.
		if (move_vect == Figure.INVAL_COORD) return false;
		// Colision inbetween check.
		for (let index = 0; index < move_vect.length; index++) {
			const vect = move_vect[index];
			if (this.board.getFigure(vect.x, vect.y) instanceof Figure) return false;
		}
		// Taking your own figures.
		const enemyFig = this.board.getFigure(_x, _y);
		if (enemyFig instanceof Figure) {
			if (figure.side == enemyFig.side) return false;
		}
		//Pawn moving sideway.
		if (figure instanceof Pawn) {
			if (Math.abs(figure.y - _y) == 1) {
				//Enpassant check.
				const [x, y] = this.board.enpassant;
				if (enemyFig instanceof Figure) return true;
				if (_x == x && _y == y) {
					//Makes sure that ally pawns don't play the enpassant.
					if (x == 5 && figure.side == "w") return true;
					if (x == 2 && figure.side == "b") return true;
				}
				return false;
			} else {
				//Pushing pawn into enemy figures prevention.
				if (enemyFig instanceof Figure && enemyFig.side != figure.side)
					return false;
			}
		}
		return true;
	}

	#isKingInCheckAfterMove(king, _x, _y, index) {
		const checkingfigs = this.isKingInCheck(king.x, king.y, king.side);
		if (checkingfigs.length == 0) return true;
		const dangersqrs = this.#generateDangerSquares(
			checkingfigs,
			king.x,
			king.y
		);
		const dest = new Coordinate(_x, _y);
		if (!dangersqrs.find((sqr) => Coordinate.compare(sqr, dest))) {
			return ErrorMessages.boardEngineError(index);
		}
		if (checkingfigs.length == 2) return ErrorMessages.boardEngineError(3);
		return true;
	}

	#doMove(figure, _x, _y, status = 0) {
		//Do the actuall move.
		this.board.setFigure(figure.x, figure.y, {});
		//Increment fifty rule.
		this.board.fifty_rule++;

		//Removing enemy figure after capture.
		let enemy;
		//Enpassant case
		if (status == 1) {
			const deltax = figure.side == "w" ? -1 : +1;
			enemy = this.board.getFigure(_x + deltax, _y);
			//remove figure;
			this.board.setFigure(enemy.x, enemy.y, {});
		} else {
			enemy = this.board.getFigure(_x, _y);
		}
		if (enemy instanceof Figure) {
			//Obvy that it is an enemy.
			let fig_arr = this.board.getFigures(enemy.side);
			fig_arr.forEach((item, index, arr) => {
				if (item.x == enemy.x && item.y == enemy.y) {
					arr.splice(index, 1);
				}
			});
			//Captures reset the counter.
			this.board.resetFiftyRule();
		}
		if (figure instanceof Pawn) {
			//Pawn moves reset the counter .
			this.board.resetFiftyRule();
		}
		figure.allowMove(_x, _y);
		this.board.setFigure(_x, _y, figure);
	}
}

export default BoardEngine;
