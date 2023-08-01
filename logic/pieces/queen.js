import Figure from "../Figure.js";
import Board from "../Board.js";
import Bishop from "./bishop.js";
import Rook from "./rook.js";

class Queen extends Figure {
	notationsmall = "q";
	notationbig = "Q";

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

		if (this.x != x && this.y != y) {
			//act as a bishop.
			let bishop = new Bishop(this.x, this.y, this.side);
			return bishop.getMoveVector(x, y);
		} else if (this.x == x || this.y == y) {
			//act as a rook.
			let rook = new Rook(this.x, this.y, this.side);
			return rook.getMoveVector(x, y);
		} else {
			return Figure.INVAL_COORD;
		}
	}
	getAdjacentMoves(board) {
		let path = [];
		let bishop = new Bishop(this.x, this.y, this.side);
		let rook = new Rook(this.x, this.y, this.side);
		path.push(...bishop.getAdjacentMoves(board));
		path.push(...rook.getAdjacentMoves(board));
		return path;
	}
}

export default Queen;
