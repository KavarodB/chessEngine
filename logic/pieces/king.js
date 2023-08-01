import Figure from "../Figure.js";
import Board from "../Board.js";
import Coordinate from "../Coordinate.js";

class King extends Figure {
	notationsmall = "k";
	notationbig = "K";

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

		let path = [];
		const deltay = this.y - y;
		const deltax = this.x - x;
		if (Math.abs(deltax) > 1 || Math.abs(deltay) > 1) return Figure.INVAL_COORD;

		return path;
	}
	getAdjacentMoves(board) {
		//Some initials
		let i = this.x;
		let j = this.y;
		const matrix = board.matrix;
		// Size of given 2d array
		let n = Board.MAX_SIZE;
		let m = Board.MAX_SIZE;
		// Initialising a vector array where
		// adjacent elements will be stored
		let v = [];
		// Checking for adjacent elements
		// and adding them to array

		// Deviation of row that gets adjusted
		// according to the provided position
		for (let dx = i > 0 ? -1 : 0; dx <= (i < n ? 1 : 0); ++dx) {
			// Deviation of the column that
			// gets adjusted according to
			// the provided position
			for (let dy = j > 0 ? -1 : 0; dy <= (j < m ? 1 : 0); ++dy) {
				if (dx != 0 || dy != 0) {
					const sqr = matrix[i + dx][j + dy];
					if (sqr instanceof Figure && sqr.side == this.side) continue;
					v.push(new Coordinate(i + dx, j + dy));
				}
			}
		}
		// Returning the vector array
		return v;
	}
}

export default King;
