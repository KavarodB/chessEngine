import Figure from "../Figure.js";
import Board from "../Board.js";
import Coordinate from "../Coordinate.js";
import Queen from "./queen.js";

class Pawn extends Figure {
	notationsmall = "p";
	notationbig = "P";

	constructor(x, y, side) {
		super(x, y, side);
		this.notation = side == "w" ? this.notationbig : this.notationsmall;
	}
	getMoveVector(x, y) {
		//Invalid initial cordinates
		if (x > Board.MAX_SIZE || x < 0) return Figure.INVAL_COORD;

		if (y > Board.MAX_SIZE || y < 0) return Figure.INVAL_COORD;

		//Same cordinates.
		if (this.x == x) return Figure.INVAL_COORD;

		//Check for possible miss matches.
		if (this.side == "w") {
			if (x < this.x) return Figure.INVAL_COORD;
		} else {
			if (x > this.x) return Figure.INVAL_COORD;
		}

		let path = [];

		//Can move with two on first move.
		if (Math.abs(this.x - x) == 2) {
			//Can move with two on first move.
			if (this.hasMoved) return Figure.INVAL_COORD;
			if (this.y != y) return Figure.INVAL_COORD;
			const deltax = x - this.x;
			const iterations = Math.abs(deltax);
			for (let i = 1; i < iterations; i++) {
				let next_coord_x = this.x + i * (deltax / iterations);
				let next_coord_y = this.y;
				path.push(new Coordinate(next_coord_x, next_coord_y));
			}
		} else {
			//Not a legal move.
			if (Math.abs(this.x - x) > 1) return Figure.INVAL_COORD;
			if (Math.abs(this.y - y) > 1) return Figure.INVAL_COORD;
		}

		return path;
	}
	canPromote(_x, _y) {
		if (_x == Board.MAX_SIZE || _x == 0) {
			const queen = new Queen(this.x, this.y, this.side);
			return queen;
		}
		return this;
	}
	getAdjacentMoves(board) {
		let path = [];
		const matrix = board.matrix;
		const deltax = this.side == "w" ? 1 : -1;
		const x_delta = this.x + deltax;
		const path_up = this.getMoveVector(this.x + 2 * deltax, this.y);
		// Move pawn with 2 and add all squares without collision.
		for (let index = 0; index < path_up.length; index++) {
			const vect = path_up[index];
			if (!(board.getFigure(vect.x, vect.y) instanceof Figure)) {
				path.push(vect);
			}
		}
		//Taking sideways.
		const enemy1 = matrix[x_delta][this.y + 1];
		const enemy2 = matrix[x_delta][this.y - 1];
		if (enemy1 instanceof Pawn && enemy1.side != this.side) {
			path.push(new Coordinate(enemy1.x, enemy1.y));
		}
		if (enemy2 instanceof Pawn && enemy2.side != this.side) {
			path.push(new Coordinate(enemy2.x, enemy2.y));
		}
		//Entpassant square too.
		const [en_x, en_y] = board.enpassant;
		if (en_x != -1 || en_y != -1) {
			if (x_delta == en_x && this.y + 1 == en_y) {
				path.push(new Coordinate(x_delta, this.y + 1));
			}
			if (x_delta == en_x && this.y - 1 == en_y) {
				path.push(new Coordinate(x_delta, this.y - 1));
			}
		}
		return path;
	}
}

export default Pawn;
