import Board from "../logic/Board";
import Figure from "../logic/Figure";
import Pawn from "../logic/pieces/pawn";
const board = new Board();

//Constructor
test("board should initialize properly", () => {
	expect(board.toFen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
});

//Functions
describe("testing board functionalities", () => {
	test("board should return white king", () => {
		const w_king = board.getKing("w");
		expect(w_king.side).toBe("w");
	});
	test("board should return black king", () => {
		const b_king = board.getKing("b");
		expect(b_king.side).toBe("b");
	});

	test("board should return a proper figure", () => {
		const pawn = board.getFigure(1, 1);
		expect(pawn instanceof Figure).toBeTruthy();
	});

	test("board should return a null ", () => {
		const pawn = board.getFigure(2, 3);
		expect(pawn instanceof Figure).toBeFalsy();
	});

	test("board should set a new pawn on the board", () => {
		const pawn = new Pawn(2, 3, "w");
		board.setFigure(2, 3, pawn);
		expect(board.getFigure(2, 3) instanceof Pawn).toBeTruthy();
	});
});
