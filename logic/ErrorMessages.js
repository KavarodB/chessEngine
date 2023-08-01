class ErrorMessages {
	static gameFlow(index) {
		const messages = ["Game has already ended."];
		return messages[index];
	}
	static moveParse(index) {
		const messages = [
			"Move is not in the rigth format",
			"The piece you try to move is not on the board",
			"Out of bounds",
			"Move is not possible on the board",
		];
		return messages[index];
	}
	static castleMove(index) {
		const messages = ["You can not castle short", "You can not castle long"];
		return messages[index];
	}

	static boardEngineError(index) {
		const messages = [
			"King is in check, and will be still in check on this move.",
			"King is in check, move does not block the check.",
			"King is not in check, but will be in check on this move.",
			"King is in check, other piece should block the check.",
		];
		return messages[index];
	}
}
export default ErrorMessages;
