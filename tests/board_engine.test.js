import Board from "../logic/Board";
import BoardEngine from "../logic/BoardEngine";
import Knight from "../logic/pieces/knight";
import Queen from "../logic/pieces/queen";
const board = new Board();
const boardEngine = new BoardEngine(board);

//Constructor
test("boardEngine should inject initial board properly", () => {
	boardEngine.injectBoard(board);
	expect(boardEngine.board).toBe(board);
});

//Functions
describe("Castling rights and actions", () => {
	test("white king should have the right to castle both ways", () => {
		const w_king = boardEngine.board.getKing("w");
		expect(boardEngine.canKingCastle(w_king)).toBe("KQ");
	});

	test("should let white king to castle long", () => {
		const customBoard = new Board(
			"rnbqkbnr/ppp2ppp/8/3pp3/8/8/PPPPPPPP/R3KBNR"
		);
		boardEngine.injectBoard(customBoard);
		expect(boardEngine.castleKingLong(customBoard.white_king)).toBe(true);
	});

	test("should let white king to castle short", () => {
		const customBoard = new Board(
			"rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPPPPPP/RNBQK2R"
		);
		boardEngine.injectBoard(customBoard);
		expect(boardEngine.castleKingShort(customBoard.white_king)).toBe(true);
	});
});

describe("Parsing figures", () => {
	test("should parse a white knight properly, first one", () => {
		const knight = boardEngine.parseFigure("n", "w")[0];
		expect(knight).toBeInstanceOf(Knight);
		expect(knight.side).toBe("w");
	});

	test("should not parse a black bishop, not on board", () => {
		const customBoard = new Board(
			"rn1qk1nr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR"
		);
		boardEngine.injectBoard(customBoard);
		const bishop = boardEngine.parseFigure("b", "b");
		expect(bishop).toHaveLength(0);
	});
});

describe("King interactions,  ", () => {
	const customBoard = new Board(
		"rBb1kb1r/pp2pppp/5n2/q1pp4/3P4/6P1/PPP1PP1P/RN1QKBNR"
	);
	boardEngine.injectBoard(customBoard);
	const white_king = customBoard.white_king;
	const checking_figures = boardEngine.isKingInCheck(
		white_king.x,
		white_king.y,
		white_king.side
	);
	test("white king in check from enemy queen", () => {
		expect(checking_figures[0]).toBeInstanceOf(Queen);
	});

	test("a figure can block that check", () => {
		const canBlock = boardEngine.canFigureBlock(white_king, checking_figures);
		expect(canBlock).toBe(true);
	});

	test("white king can NOT move in a custom position", () => {
		const customBoard = new Board(
			"rBb1kb1r/pp2pppp/5n2/q1pp4/3P4/6P1/PPP1PP1P/RN1QKBNR"
		);
		boardEngine.injectBoard(customBoard);
		const white_king = customBoard.white_king;
		const canMove = boardEngine.canKingMove(white_king);
		expect(canMove).toBe(false);
	});

	test("white king be safe in the starting position", () => {
		const white_king = board.white_king;
		boardEngine.injectBoard(board);
		const checking_figures = boardEngine.isKingInCheck(
			white_king.x,
			white_king.y,
			white_king.side
		);
		expect(checking_figures).toHaveLength(0);
	});
});

describe("Available moves + Making valid moves in a custom position", () => {
	const customBoard = new Board(
		"r2qkbnr/ppp2ppp/2n5/3pPb2/5B2/2N5/PPP1PPPP/R2QKBNR"
	);
	boardEngine.injectBoard(customBoard);
	const queen = boardEngine.parseFigure("Q", "w")[0];
	const knight = boardEngine.parseFigure("N", "w")[1];
	const bishop = boardEngine.parseFigure("B", "w")[1];
	const rook = boardEngine.parseFigure("R", "w")[0];
	const pawn = boardEngine.parseFigure("p", "w")[2];

	describe("Available moves for a figure ", () => {
		test("correct available moves white Queen", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.getAvailableMoves(queen)).toHaveLength(6);
		});
		test("correct available moves white Knight", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.getAvailableMoves(knight)).toHaveLength(5);
		});
		test("correct available moves white Bishop", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.getAvailableMoves(bishop)).toHaveLength(6);
		});
		test("correct available moves white Rook", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.getAvailableMoves(rook)).toHaveLength(2);
		});
		test("correct available moves white Pawn", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.getAvailableMoves(pawn)).toHaveLength(0);
		});
	});

	describe("Making moves for a figure", () => {
		test("white queen taking pawn on d5 ", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.moveFigure(queen, 4, 3)).toBe(true);
		});
		test("white knight takes enemy queen on d5", () => {
			boardEngine.injectBoard(customBoard);
			const enemy_queen = boardEngine.parseFigure("q", "b")[0];
			boardEngine.moveFigure(enemy_queen, 4, 3);
			expect(boardEngine.moveFigure(knight, 4, 3)).toBe(true);
		});
		test("white bishop back to g3", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.moveFigure(bishop, 2, 6)).toBe(true);
		});
		test("white rook moves to d1", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.moveFigure(rook, 0, 3)).toBe(true);
		});
		test("white pawn can move to c4", () => {
			boardEngine.injectBoard(customBoard);
			expect(boardEngine.moveFigure(pawn, 3, 2)).toBe(true);
		});
	});
});
