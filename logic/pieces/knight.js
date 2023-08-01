import Coordinate from "../Coordinate.js";
import Figure from "../Figure.js";
import Board from "../Board.js";

class Knight extends Figure {
	notationsmall = "n";
	notationbig = "N";

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
		const deltax = Math.abs(x - this.x);
		const deltay = Math.abs(y - this.y);

		//Only 8 valid moves.
		if ((deltax == 2 && deltay == 1) || (deltax == 1 && deltay == 2)) {
			return path;
		} else {
			//Not a valid move.
			return Figure.INVAL_COORD;
		}
	}
	getAdjacentMoves(board) {
		let path = [];
		const matrix = board.matrix;
		//X++;
		path.push(
			new Coordinate(this.x + 1, this.y + 2),
			new Coordinate(this.x + 1, this.y - 2),
			new Coordinate(this.x + 2, this.y + 1),
			new Coordinate(this.x + 2, this.y - 1)
		);
		//X--;
		path.push(
			new Coordinate(this.x - 1, this.y + 2),
			new Coordinate(this.x - 1, this.y - 2),
			new Coordinate(this.x - 2, this.y + 1),
			new Coordinate(this.x - 2, this.y - 1)
		);
		//Filter valid squares only.
		path = path.filter((coordinate) => {
			if (coordinate.x <= Board.MAX_SIZE && coordinate.x >= 0)
				if (coordinate.y <= Board.MAX_SIZE && coordinate.y >= 0) {
					return coordinate;
				}
		});
		//Filter ally figure squares.
		path = path.filter((coord) => {
			if (!(matrix[coord.x][coord.y] instanceof Figure)) return coord;
			if (matrix[coord.x][coord.y].side != this.side) {
				return coord;
			}
		});
		return path;
	}
}

export default Knight;
