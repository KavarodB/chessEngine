class Coordinate {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static compare(coord1, coord2) {
		if (coord1.x == coord2.x && coord1.y == coord2.y) return true;
		return false;
	}
	static translate(x, y) {
		const str_y = String.fromCharCode(y + 97);
		const str_x = `${x + 1}`;
		return str_y + str_x;
	}
	static generate(move) {
		//Case sensitivity issue.
		move = move.toLowerCase();
		//Semantic checks for coordinates.
		let stry = move.charAt(0).charCodeAt(0);
		const y = Number.parseInt(String.fromCharCode(stry - 49));

		const x = Number.parseInt(move.charAt(1)) - 1;

		if (x > 7 || x < 0) return null;
		if (y > 7 || y < 0) return null;

		return new Coordinate(x, y);
	}
}

export default Coordinate;
