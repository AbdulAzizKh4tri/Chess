const WHITE = "white";
const BLACK = "black";
const STALEMATE = "stalemate"
const CHECKMATE = "checkmate"

export function otherColor(color) {
    return (color == WHITE) ? BLACK : WHITE;
}

export function translateToNums(pos) {
    return [pos.charCodeAt(0) - 97, parseInt(pos[1]) - 1];
}

export function translateToChars(col, row) {
    return `${String.fromCharCode(col + 97)}${row + 1}`;
}

export function create2DArray(rows, cols, initialValue) {
    return Array.from(
        { length: rows },
        () => Array.from({ length: cols }, initialValue),
    );
}

export function getHomeRow(color){
    return (color == WHITE) ? 0 : 7;
}

