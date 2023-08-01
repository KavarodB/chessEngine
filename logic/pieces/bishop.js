import Figure from "../Figure.js";
import Board from "../Board.js";
import Coordinate from "../Coordinate.js";
class Bishop extends Figure {
	notationsmall = "b";
	notationbig = "B";

	constructor(x, y, side) {
		super(x, y, side);
		this.notation = side == "w" ? this.notationbig : this.notationsmall;
	}

	getMoveVector(x, y) {
		
		//Invalid initial cordinates
		if (x > Board.MAX_SIZE || x < 0) return Figure.INVAL_COORD;

		if (y > Board.MAX_SIZE || y < 0) return Figure.INVAL_COORD;

		//Same cordinates or invalid ones.
		if (this.x == x || this.y == y) return Figure.INVAL_COORD;

		let path = [];
		const deltax = x - this.x;
		const deltay = y - this.y;

		//Not a diagonal.
		if (Math.abs(deltax) != Math.abs(deltay)) return Figure.INVAL_COORD;

		const iterations = Math.abs(deltax);
		for (let i = 1; i < iterations; i++) {
			let next_coord_x = this.x + i * (deltax / iterations);
			let next_coord_y = this.y + i * (deltay / iterations);
			path.push(new Coordinate(next_coord_x, next_coord_y));
		}
		return path;
	}
	/**
	 * Is the bishop white or black
	 * ( true or false )
	 */
	isWhiteColor() {
		if (this.x % 2 == 1) {
			if (this.y % 2 == 0) return true;
			return false;
		} else {
			if (this.y % 2 == 1) return true;
			return false;
		}
	}
	getAdjacentMoves(board) {
		let path = [];
		let path1_new = [];
		let path2_new = [];
		let path3_new = [];
		let path4_new = [];
		const matrix = board.matrix;
		const max = Math.max(this.x, this.y);
		const min = Math.min(this.x, this.y);
		const delta_max = 7 - max;
		const delta_min = 7 - min;
		let upper_right = new Coordinate(this.x + delta_max, this.y + delta_max);
		let lower_left = new Coordinate(this.x - min, this.y - min);
		let upper_left =
			this.x > this.y
				? new Coordinate(this.x - delta_min, this.y + delta_min)
				: new Coordinate(this.x - delta_max, this.y + delta_max);
		let lower_right =
			this.x > this.y
				? new Coordinate(this.x + delta_max, this.y - delta_max)
				: new Coordinate(this.x + delta_min, this.y - delta_min);
		let path1 = this.getMoveVector(upper_right.x, upper_right.y);
		if (path1) {
			path1.push(upper_right);
			for (let index = 0; index < path1.length; index++) {
				const vect = path1[index];
				const sqr = matrix[vect.x][vect.y];
				if (sqr instanceof Figure) {
					if (sqr.side == this.side) {
						break;
					} else {
						path1_new.push(vect);
						break;
					}
				}
				path1_new.push(vect);
			}
		}

		let path2 = this.getMoveVector(upper_left.x, upper_left.y);
		if (path2) {
			path2.push(upper_left);

			for (let index = 0; index < path2.length; index++) {
				const vect = path2[index];
				const sqr = matrix[vect.x][vect.y];
				if (sqr instanceof Figure) {
					if (sqr.side == this.side) {
						break;
					} else {
						path2_new.push(vect);
						break;
					}
				}
				path2_new.push(vect);
			}
		}
		let path3 = this.getMoveVector(lower_right.x, lower_right.y);
		if (path3) {
			path3.push(lower_right);

			for (let index = 0; index < path3.length; index++) {
				const vect = path3[index];
				const sqr = matrix[vect.x][vect.y];
				if (sqr instanceof Figure) {
					if (sqr.side == this.side) {
						break;
					} else {
						path3_new.push(vect);
						break;
					}
				}
				path3_new.push(vect);
			}
		}
		let path4 = this.getMoveVector(lower_left.x, lower_left.y);
		if (path4) {
			path4.push(lower_left);

			for (let index = 0; index < path4.length; index++) {
				const vect = path4[index];
				const sqr = matrix[vect.x][vect.y];
				if (sqr instanceof Figure) {
					if (sqr.side == this.side) {
						break;
					} else {
						path4_new.push(vect);
						break;
					}
				}
				path4_new.push(vect);
			}
		}
		path.push(...path1_new, ...path2_new, ...path3_new, ...path4_new);
		return path;
	}
}

export default Bishop;
