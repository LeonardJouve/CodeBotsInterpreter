export const isLetter = (char: string): boolean => {
	return ("a" <= char && char <= "z") || ("A" <= char && char <= "Z") || char === "_";
};

export const isDigit = (char: string): boolean => {
	return "0" <= char && char <= "9";
};
