import Coordinate from "../Coordinate.js";
import Figure from "../Figure.js";
import Board from "../Board.js";

class Rook extends Figure {
	notationsmall = "r";
	notationbig = "R";

	constructor(x, y, side) {
		super(x, y, side);
		this.notation = side == "w" ? this.notationbig : this.notationsmall;
	}

	getMoveVector(x, y) {
		//Invalid initial cordinates
		if (x > Board.MAX_SIZE || x < 0) return Figure.INVAL_COORD;

		if (y > Board.MAX_SIZE || y < 0) return Figure.INVAL_COORD;

		//Same cordinates.
		if (this.x == x && this.y == y) return Figure.INVAL_COORD;

		if (this.x != x && this.y != y) return Figure.INVAL_COORD;

		let path = [];
		const deltax = x - this.x;
		const deltay = y - this.y;
		const iterations = Math.max(Math.abs(deltax), Math.abs(deltay));
		for (let i = 1; i < iterations; i++) {
			let next_coord_x = 0;
			let next_coord_y = 0;
			if (deltax == 0) {
				next_coord_x = this.x;
				next_coord_y = this.y + i * (deltay / iterations);
			} else {
				next_coord_x = this.x + i * (deltax / iterations);
				next_coord_y = this.y;
			}
			path.push(new Coordinate(next_coord_x, next_coord_y));
		}
		return path;
	}
	getAdjacentMoves(board) {
		let path = [];
		const matrix = board.matrix;
		let x_up = this.x + 1;
		let x_down = this.x - 1;
		let y_up = this.y + 1;
		let y_down = this.y - 1;
		for (; x_up <= Board.MAX_SIZE; x_up++) {
			const sqr = matrix[x_up][this.y];
			if (sqr instanceof Figure) {
				if (sqr.side == this.side) {
					break;
				} else {
					path.push(new Coordinate(x_up, this.y));
					break;
				}
			}
			path.push(new Coordinate(x_up, this.y));
		}
		for (; x_down >= 0; x_down--) {
			const sqr = matrix[x_down][this.y];
			if (sqr instanceof Figure) {
				if (sqr.side == this.side) {
					break;
				} else {
					path.push(new Coordinate(x_down, this.y));
					break;
				}
			}
			path.push(new Coordinate(x_down, this.y));
		}
		for (; y_up <= Board.MAX_SIZE; y_up++) {
			const sqr = matrix[this.x][y_up];
			if (sqr instanceof Figure) {
				if (sqr.side == this.side) {
					break;
				} else {
					path.push(new Coordinate(this.x, y_up));
					break;
				}
			}
			path.push(new Coordinate(this.x, y_up));
		}
		for (; y_down >= 0; y_down--) {
			const sqr =matrix[this.x][y_down];
			if (sqr instanceof Figure) {
				if (sqr.side == this.side) {
					break;
				} else {
					path.push(new Coordinate(this.x, y_down));
					break;
				}
			}
			path.push(new Coordinate(this.x, y_down));
		}
		return path;
	}
}

export default Rook;
