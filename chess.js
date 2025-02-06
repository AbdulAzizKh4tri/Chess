let THEME = "default";

let BACKGROUND_COLOR = null;
let BACKGROUND_IMAGE = null;

let LOGO_COLOR = "black";

let WHITE_CELL_COLOR = "white";
let BLACK_CELL_COLOR = "grey";

let WHITE_CELL_IMAGE = null;
let BLACK_CELL_IMAGE = null;

const MOVABLE_COLOR = "lightgreen";
const KILL_COLOR = "#F00";

const WHITE = "white";
const BLACK = "black";

let TURN_BOARD = false;
let TURN_PIECES = false;
let PLAYER = WHITE;

let TURN = WHITE;

//format of each element : [piece,prev_pos,next_pos,taken_piece,(special)]
let MOVES = [];

let REDO_STACK = [];

class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.has_moved = false;
    }
}

class Pawn extends Piece {
    constructor(color, position) {
        super(color, position);
        this.name = "pawn";
        this.symbol = "P";
        this.img = "pawn";
    }
}
class Knight extends Piece {
    constructor(color, position) {
        super(color, position);
        this.name = "Knight";
        this.symbol = "Kn";
        this.img = "knight";
    }
}
class Bishop extends Piece {
    constructor(color, position) {
        super(color, position);
        this.name = "Bishop";
        this.symbol = "B";
        this.img = "bishop";
    }
}
class Rook extends Piece {
    constructor(color, position) {
        super(color, position);
        this.name = "Rook";
        this.symbol = "R";
        this.img = "rook";
    }
}
class Queen extends Piece {
    constructor(color, position) {
        super(color, position);
        this.name = "Queen";
        this.symbol = "Q";
        this.img = "queen";
    }
}

class King extends Piece {
    constructor(color, position) {
        super(color, position);
        this.name = "King";
        this.symbol = "K";
        this.img = "king";
    }
}

class Cell {
    constructor() {
        this.color = null;
        this.piece = null;
        this.in_danger = false;
        this.in_sight = false;
    }
}

class Game {
    constructor() {
        this.board = create2DArray(8, 8, () => {
            return new Cell();
        });

        this.setColors();
        this.setPawns();
        this.setPieces();
        this.setKings();
    }

    setColors() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 == 0) {
                    this.board[i][j].cell_color = BLACK;
                } else {
                    this.board[i][j].cell_color = WHITE;
                }
            }
        }
    }

    setKings() {
        this.king1 = new King(WHITE, translateToChars(4, 0));
        this.board[0][4].piece = this.king1;
        this.king2 = new King(BLACK, translateToChars(4, 7));
        this.board[7][4].piece = this.king2;
    }

    setPieces() {
        this.board[0][0].piece = new Rook(WHITE, translateToChars(0, 0));
        this.board[0][7].piece = new Rook(WHITE, translateToChars(7, 0));
        this.board[7][0].piece = new Rook(BLACK, translateToChars(0, 7));
        this.board[7][7].piece = new Rook(BLACK, translateToChars(7, 7));

        this.board[0][1].piece = new Knight(WHITE, translateToChars(1, 0));
        this.board[0][6].piece = new Knight(WHITE, translateToChars(6, 0));
        this.board[7][1].piece = new Knight(BLACK, translateToChars(1, 7));
        this.board[7][6].piece = new Knight(BLACK, translateToChars(6, 7));

        this.board[0][2].piece = new Bishop(WHITE, translateToChars(2, 0));
        this.board[0][5].piece = new Bishop(WHITE, translateToChars(5, 0));
        this.board[7][2].piece = new Bishop(BLACK, translateToChars(2, 7));
        this.board[7][5].piece = new Bishop(BLACK, translateToChars(5, 7));

        this.board[0][3].piece = new Queen(WHITE, translateToChars(3, 0));
        this.board[7][3].piece = new Queen(BLACK, translateToChars(3, 7));
    }

    setPawns() {
        for (let i = 0; i < 8; i++) {
            this.board[1][i].piece = new Pawn(WHITE, translateToChars(i, 1));
            this.board[6][i].piece = new Pawn(BLACK, translateToChars(i, 6));
        }
    }

    renderBoard() {
        let board = document.getElementById("board");
        board.innerHTML = "";
        let start = 8;
        let end = 1;
        let incr = -1;
        let condition = (s, e) => {
            return s >= e;
        };
        let jstart = 1;
        let jend = 8;
        let jincr = 1;
        let jcondition = (s, e) => {
            return s <= e;
        };
        if ((TURN_BOARD && TURN == BLACK) || PLAYER == BLACK) {
            start = 1;
            end = 8;
            incr = 1;
            condition = (s, e) => {
                return s <= e;
            };
            jstart = 8;
            jend = 1;
            jincr = -1;
            jcondition = (s, e) => {
                return s >= e;
            };
        }
        for (let i = start; condition(i, end); i += incr) {
            for (let j = jstart; jcondition(j, jend); j += jincr) {
                let button = document.createElement("button");
                button.id = translateToChars(j - 1, i - 1);

                let cell_color = this.board[i - 1][j - 1].cell_color;

                if (cell_color == WHITE) {
                    if (WHITE_CELL_IMAGE) {
                        button.style.backgroundImage = WHITE_CELL_IMAGE;
                    } else {
                        button.style.background = WHITE_CELL_COLOR;
                    }
                }
                if (cell_color == BLACK) {
                    if (BLACK_CELL_IMAGE) {
                        button.style.backgroundImage = BLACK_CELL_IMAGE;
                    } else {
                        button.style.background = BLACK_CELL_COLOR;
                    }
                }

                button.classList += " m-0 p-0 button ";
                button.disabled = true;
                button.innerHTML = "";
                board.appendChild(button);
            }
        }
    }

    resetColors() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let cell_color = this.board[i][j].cell_color;
                let button = document.getElementById(translateToChars(j, i));

                if (cell_color == WHITE) {
                    if (WHITE_CELL_IMAGE) {
                        button.style.backgroundImage = WHITE_CELL_IMAGE;
                    } else {
                        button.style.background = WHITE_CELL_COLOR;
                    }
                }
                if (cell_color == BLACK) {
                    if (BLACK_CELL_IMAGE) {
                        button.style.backgroundImage = BLACK_CELL_IMAGE;
                    } else {
                        button.style.background = BLACK_CELL_COLOR;
                    }
                }
            }
        }
    }

    renderPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let curr = this.board[i][j];
                document.getElementById(translateToChars(j, i)).innerHTML = "";
                if (curr.piece) {
                    let img = document.createElement("img");
                    img.src =
                        `./themes/${THEME}/${curr.piece.color}/${curr.piece.img}.png`;
                    img.classList += " piece ";
                    if(TURN_PIECES && TURN == BLACK){
                        img.classList += " rotated "
                    }
                    document.getElementById(curr.piece.position).appendChild(img);
                }
            }
        }
    }

    enableMovables() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let curr = this.board[i][j].piece;
                let button = document.getElementById(translateToChars(j, i));
                if (curr && curr.color == TURN && (PLAYER == TURN || true)) {
                    button.disabled = false;
                    button.onclick = () => {
                        this.showMoves(j, i);
                    };
                } else {
                    button.disabled = true;
                }
            }
        }
    }

    showMoves(col, row) {
        this.resetColors();
        this.renderPieces();
        this.enableMovables();
        this.calculateSight();
        let piece = this.board[row][col].piece;
        let moves = this.getPossibleMoves(piece, col, row);

        for (let move of moves) {
            let [mcol, mrow] = move;
            let movecell = document.getElementById(
                translateToChars(mcol, mrow),
            );
            if (this.board[mrow][mcol].piece == null) {
                movecell.style.background = MOVABLE_COLOR;
            } else if (this.board[mrow][mcol].piece.color != piece.color) {
                movecell.style.background = KILL_COLOR;
            }
            movecell.disabled = false;
            movecell.onclick = () => {
                REDO_STACK = [];
                this.makeMove(piece, mcol, mrow);
            };
        }
    }

    moveChecksSelf(move, piece) {
        let checks_self = false;
        let king = this.getKing(piece.color);
        let [next_col, next_row] = move;
        let [prev_col, prev_row] = translateToNums(piece.position);
        let [king_col, king_row] = translateToNums(king.position);

        let prev = this.board[prev_row][prev_col].piece;
        let next = this.board[next_row][next_col].piece;
        this.board[next_row][next_col].piece = prev;
        this.board[prev_row][prev_col].piece = null;

        this.calculateDanger();
        if (this.board[king_row][king_col].in_danger == true) {
            checks_self = true;
        }
        if (piece == king && this.board[next_row][next_col].in_danger == true) {
            checks_self = true;
        }

        this.board[next_row][next_col].piece = next;
        this.board[prev_row][prev_col].piece = prev;
        this.calculateDanger();

        return checks_self;
    }

    getKing(color) {
        if (this.king1.color == color) return this.king1;
        return this.king2;
    }

    getPieceMoves(piece) {
        let moves = [];
        let [col, row] = translateToNums(piece.position);
        if (piece instanceof Pawn) {
            let front = (piece.color == WHITE) ? row + 1 : row - 1;
            if (
                piece.color == WHITE && row == 1 ||
                piece.color == BLACK && row == 6
            ) {
                let doublefront = (piece.color == WHITE) ? row + 2 : row - 2;
                if (
                    this.board[front][col].piece == null &&
                    this.board[doublefront][col].piece == null
                ) {
                    moves.push([col, doublefront]);
                }
            }
            let diagonal1 = this.board[front][col - 1]?.piece;
            let diagonal2 = this.board[front][col + 1]?.piece;

            if (
                piece.color == WHITE && row == 4 ||
                piece.color == BLACK && row == 3
            ) {
                let last_move = MOVES[MOVES.length - 1];
                if (last_move[0] instanceof Pawn) {
                    let [old_col, old_row] = translateToNums(last_move[1]);
                    if (old_col == col + 1 || old_col == col - 1) {
                        let [new_col, new_row] = translateToNums(last_move[2]);
                        if (Math.abs(new_row - old_row) == 2) {
                            moves.push([old_col, front]);
                        }
                    }
                }
            }
            if (this.board[front][col].piece == null) {
                moves.push([col, front]);
            }
            if (diagonal1 && diagonal1.color != piece.color) {
                moves.push([col - 1, front]);
            }
            if (diagonal2 && diagonal2.color != piece.color) {
                moves.push([col + 1, front]);
            }
        } else if (piece instanceof Knight) {
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    if (Math.abs(i) == Math.abs(j) || i == 0 || j == 0) {
                        continue;
                    }
                    moves.push([col + i, row + j]);
                }
            }
        } else if (piece instanceof Bishop) {
            let h = [1, 1, -1, -1, 1];
            for (let j = 0, k = 1; j < 4, k < 5; j++, k++) {
                for (let i = 1; i <= 7; i++) {
                    let c = col + i * h[j];
                    let r = row + i * h[k];
                    if (r > 7 || r < 0 || c > 7 || c < 0) {
                        continue;
                    }
                    let curr_cell = this.board[r][c];
                    if (!curr_cell.piece) {
                        moves.push([c, r]);
                    } else if (curr_cell.piece.color != piece.color) {
                        moves.push([c, r]);
                        break;
                    } else if (curr_cell.piece.color == piece.color) {
                        break;
                    }
                }
            }
        } else if (piece instanceof Rook) {
            let h = [0, 1, 0, -1, 0];
            for (let j = 0, k = 1; j < 4, k < 5; j++, k++) {
                for (let i = 1; i <= 7; i++) {
                    let c = col + i * h[j];
                    let r = row + i * h[k];
                    if (r > 7 || r < 0 || c > 7 || c < 0) {
                        continue;
                    }

                    let curr_cell = this.board[r][c];
                    if (!curr_cell.piece) {
                        moves.push([c, r]);
                    } else if (curr_cell.piece.color != piece.color) {
                        moves.push([c, r]);
                        break;
                    } else if (curr_cell.piece.color == piece.color) {
                        break;
                    }
                }
            }
        } else if (piece instanceof Queen) {
            let h = [1, 1, -1, -1, 1];
            for (let j = 0, k = 1; j < 4, k < 5; j++, k++) {
                for (let i = 1; i <= 7; i++) {
                    let c = col + i * h[j];
                    let r = row + i * h[k];
                    if (r > 7 || r < 0 || c > 7 || c < 0) {
                        continue;
                    }
                    let curr_cell = this.board[r][c];
                    if (!curr_cell.piece) {
                        moves.push([c, r]);
                    } else if (curr_cell.piece.color != piece.color) {
                        moves.push([c, r]);
                        break;
                    } else if (curr_cell.piece.color == piece.color) {
                        break;
                    }
                }
            }

            h = [0, 1, 0, -1, 0];
            for (let j = 0, k = 1; j < 4, k < 5; j++, k++) {
                for (let i = 1; i <= 7; i++) {
                    let c = col + i * h[j];
                    let r = row + i * h[k];
                    if (r > 7 || r < 0 || c > 7 || c < 0) {
                        continue;
                    }
                    let curr_cell = this.board[r][c];
                    if (!curr_cell.piece) {
                        moves.push([c, r]);
                    } else if (curr_cell.piece.color != piece.color) {
                        moves.push([c, r]);
                        break;
                    } else if (curr_cell.piece.color == piece.color) {
                        break;
                    }
                }
            }
        } else if (piece instanceof King) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i == 0 && j == 0) continue;
                    let c = col + i;
                    let r = row + j;

                    if (r > 7 || r < 0 || c > 7 || c < 0) {
                        continue;
                    }

                    let curr_cell = this.board[r][c];
                    if (!curr_cell.piece) {
                        moves.push([c, r]);
                    } else if (curr_cell.piece.color != piece.color) {
                        moves.push([c, r]);
                    }
                }
            }
            if (!piece.has_moved && !this.board[row][col].in_danger) {
                let col1 = col - 4;
                let col2 = col + 3;
                let rook1 = this.board[row][col1].piece;
                let rook2 = this.board[row][col2].piece;
                let this_row = this.board[row];
                if (
                    rook1 && !rook1.has_moved &&
                    !this_row[col - 1].piece && !this_row[col - 2].piece &&
                    !this_row[col - 3].piece &&
                    !this_row[col - 1].in_sight &&
                    !this_row[col - 2].in_sight && !this_row[col - 3].in_sight
                ) {
                    moves.push([col - 2, row]);
                }
                if (
                    rook2 && !rook2.has_moved &&
                    !this_row[col + 1].piece && !this_row[col + 2].piece &&
                    !this_row[col + 1].in_sight && !this_row[col + 2].in_sight
                ) {
                    moves.push([col + 2, row]);
                }
            }
        }
        return moves;
    }

    getPossibleMoves(piece) {
        let moves = this.getPieceMoves(piece);
        let possible_moves = [];
        for (let move of moves) {
            let [mcol, mrow] = move;
            if (mcol > 7 || mcol < 0 || mrow > 7 || mrow < 0) continue;
            if (this.moveChecksSelf(move, piece)) continue;
            if (
                this.board[mrow][mcol].piece &&
                this.board[mrow][mcol].piece.color == piece.color
            ) continue;
            possible_moves.push(move);
        }
        return possible_moves;
    }

    makeMove(piece, next_col, next_row, forward = true) {
        let [prev_col, prev_row] = translateToNums(piece.position);
        let next_pos = translateToChars(next_col, next_row);
        let prev_pos = piece.position;
        piece.position = next_pos;
        let special = null;

        let prev = this.board[prev_row][prev_col];
        let next = this.board[next_row][next_col];
        let taken_piece = next.piece;

        if (forward && this.isEnpassant(piece, next_row, next_col, prev_col)) {
            console.log("ENPASSANT");
            special = "enpassant";
            let x = (piece.color == WHITE) ? -1 : 1;
            this.board[next_row + x][next_col].piece = null;
        }

        if (forward && this.isPromotion(piece, next_row)) {
            console.log("PROMOTION");
            let selected = false;
            let cell = this.board[prev_row][prev_col];
            while (!selected) {
                let x = prompt(
                    "Promote to? [(Q)ueen,(K)night, (B)ishop, (R)ook",
                );
                switch (x) {
                    case "Q":
                    case "q":
                        cell.piece = new Queen(piece.color, next_pos);
                        selected = true;
                        break;
                    case "K":
                    case "k":
                        cell.piece = new Knight(piece.color, next_pos);
                        selected = true;
                        break;
                    case "B":
                    case "b":
                        cell.piece = new Bishop(piece.color, next_pos);
                        selected = true;
                        break;
                    case "R":
                    case "r":
                        cell.piece = new Rook(piece.color, next_pos);
                        selected = true;
                        break;
                    default:
                        selected = false;
                }
            }
            piece = cell.piece;
            special = "promotion";
        }

        piece.has_moved = true;

        this.board[next_row][next_col].piece = piece;
        this.board[prev_row][prev_col].piece = null;

        if (this.isCastle(piece, next_col, prev_col)) {
            console.log("CASTLE");
            let rook = null;
            if (next_col < prev_col) {
                rook = this.board[next_row][next_col - 2].piece;
                this.makeMove(rook, next_col + 1, next_row, false);
                TURN = otherColor(rook.color);
                special = "castle_A";
            } else {
                rook = this.board[next_row][next_col + 1].piece;
                this.makeMove(rook, next_col - 1, next_row, false);
                TURN = otherColor(rook.color);
                special = "castle_H";
            }
        }

        this.calculateDanger();
        let mate = this.checkForMate();
        if (mate) {
            console.log("CHECKMATE");
            console.log(TURN, "WINS!");
        }

        let curr_move = [piece, prev_pos, next_pos, taken_piece, special];

        if (forward) {
            MOVES.push(curr_move);
        }
        TURN = otherColor(TURN);
        if (TURN_BOARD) {
            this.renderBoard();
        }
        this.resetColors();
        this.renderPieces();
        this.enableMovables();
    }

    isCastle(piece, new_col, prev_col) {
        if (piece instanceof King && Math.abs(new_col - prev_col) == 2) {
            return true;
        }
        return false;
    }

    isEnpassant(piece, new_row, new_col, prev_col) {
        if (
            piece instanceof Pawn && new_col != prev_col &&
            this.board[new_row][new_col].piece == null
        ) {
            return true;
        }
        return false;
    }

    isPromotion(piece, new_row) {
        if (piece instanceof Pawn) {
            if (piece.color == WHITE && new_row == 7) {
                return true;
            }
            if (piece.color == BLACK && new_row == 0) {
                return true;
            }
        }
        return false;
    }

    checkForMate() {
        let other = otherColor(TURN);
        let mate = true;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = this.board[i][j].piece;
                if (!piece) continue;
                if (piece.color == other) {
                    if (this.getPossibleMoves(piece).length > 0) {
                        mate = false;
                        return mate;
                    }
                }
            }
        }
        return mate;
    }

    calculateDanger() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.board[i][j].in_danger = false;
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let curr = this.board[i][j];
                let piece = curr.piece;
                if (!piece) continue;
                let moves = this.getPieceMoves(piece);
                for (let move of moves) {
                    let [mcol, mrow] = move;
                    if (mcol > 7 || mcol < 0 || mrow > 7 || mrow < 0) continue;
                    let target = this.board[mrow][mcol];
                    if (target.piece && target.piece.color != piece.color) {
                        target.in_danger = true;
                    }
                }
            }
        }
    }

    calculateSight() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.board[i][j].in_sight = false;
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let curr = this.board[i][j];
                let piece = curr.piece;
                if (!piece) continue;
                if (piece.color == TURN) continue;
                let moves = this.getPieceMoves(piece);
                for (let move of moves) {
                    let [mcol, mrow] = move;
                    if (mcol > 7 || mcol < 0 || mrow > 7 || mrow < 0) continue;
                    let target = this.board[mrow][mcol];
                    target.in_sight = true;
                }
            }
        }
    }

    redoMove() {
        let move = REDO_STACK.pop();
        if (!move) return;
        this.makeMove(move[0], move[1], move[2]);
    }

    undoMove() {
        let move = MOVES.pop();
        if (!move) return;

        let piece = move[0];
        let [prev_col, prev_row] = translateToNums(move[1]);
        let [next_col, next_row] = translateToNums(move[2]);
        let taken_piece = move[3];

        let new_cell = this.board[next_row][next_col];
        let old_cell = this.board[prev_row][prev_col];

        REDO_STACK.push([piece, next_col, next_row]);

        let behind = (piece.color == WHITE) ? -1 : 1;

        if (!move[4]) {
            this.makeMove(piece, prev_col, prev_row, false);
            new_cell.piece = taken_piece;
            this.renderPieces();
            return;
        }
        if (move[4] == "enpassant") {
            let pawn = new Pawn(
                otherColor(piece.color),
                translateToChars(next_col, next_row + behind),
            );
            this.board[next_row + behind][next_col].piece = pawn;
            this.makeMove(move[0], prev_col, prev_row, false);
            let last_move = MOVES.pop();
            last_move[0] = pawn;
            MOVES.push(last_move);
            return;
        }

        if (move[4] == "promotion") {
            let pawn = new Pawn(
                piece.color,
                translateToChars(next_col, next_row),
            );
            new_cell.piece = pawn;
            this.makeMove(pawn, prev_col, prev_row, false);
            return;
        }

        if (move[4] == "castle_H") {
            let king = this.getKing(piece.color);
            king.position = translateToChars(4, prev_row);
            this.board[prev_row][4].piece = king;
            this.board[prev_row][5].piece = null;
            this.board[prev_row][6].piece = null;
            this.board[prev_row][7].piece = new Rook(
                piece.color,
                translateToChars(7, prev_row),
            );
            TURN = piece.color;
            if (TURN_BOARD) {
                this.renderBoard();
            }
            this.renderPieces();
            this.enableMovables();
        }

        if (move[4] == "castle_A") {
            let king = this.getKing(piece.color);
            king.position = translateToChars(4, prev_row);
            this.board[prev_row][4].piece = king;
            this.board[prev_row][3].piece = null;
            this.board[prev_row][2].piece = null;
            this.board[prev_row][1].piece = null;
            this.board[prev_row][0].piece = new Rook(
                piece.color,
                translateToChars(0, prev_row),
            );
            TURN = piece.color;
            if (TURN_BOARD) {
                this.renderBoard();
            }
            this.renderPieces();
            this.enableMovables();
        }
    }
}

function otherColor(color) {
    return (color == WHITE) ? BLACK : WHITE;
}

function translateToChars(col, row) {
    return `${String.fromCharCode(col + 65)}${row + 1}`;
}

function translateToNums(pos) {
    return [pos.charCodeAt(0) - 65, parseInt(pos[1]) - 1];
}

function create2DArray(rows, cols, initialValue) {
    return Array.from(
        { length: rows },
        () => Array.from({ length: cols }, initialValue),
    );
}

function setTheme() {
    THEME = localStorage.getItem("THEME");
    const path = `themes/${THEME}/theme.json`;
    fetch(path)
        .then((response) => response.json())
        .then((data) => {
            WHITE_CELL_COLOR = data["white_cell_color"] ?? "white";
            BLACK_CELL_COLOR = data["black_cell_color"] ?? "grey";
            WHITE_CELL_IMAGE = data["white_cell_image"] ?? null;
            BLACK_CELL_IMAGE = data["black_cell_image"] ?? null;
            LOGO_COLOR = data["logo_color"] ?? "black";

            BACKGROUND_COLOR = data["background_color"] ?? "white";
            BACKGROUND_IMAGE = data["background_image"] ?? null;

            if (BACKGROUND_IMAGE) {
                document.body.style.backgroundImage =
                    `url('themes/${THEME}/${BACKGROUND_IMAGE}')`;
            } else {
                document.body.style.background = BACKGROUND_COLOR;
            }
            document.getElementById("logo").style.color = LOGO_COLOR;
            game.setColors();
            game.resetColors();
        })
        .catch((error) => console.error("Error loadingbac JSON:", error));

    game.renderBoard();
    game.renderPieces();
    game.enableMovables();
}

let game = null;
function load() {
    REDO_STACK = [];
    MOVES = [];
    TURN = WHITE;
    game = new Game();

    document.getElementById("theme").innerHTML = "";
    fetch("themes/themes.json")
        .then((response) => response.json())
        .then((data) => {
            data.themes.forEach((theme) => {
                let option = document.createElement("option");
                option.value = theme.name;
                option.innerHTML = theme.icon;
                document.getElementById("theme").appendChild(option);
            });
        })
        .catch((error) => console.error("Error loading themes:", error));

    if (!localStorage.getItem("THEME")) {
        localStorage.setItem("THEME", "default");
    }
    setTheme();
    game.renderBoard();
    game.renderPieces();
    game.enableMovables();
    document.getElementById("undo").onclick = () => {
        game.undoMove();
    };
    document.getElementById("unundo").onclick = () => {
        game.undoMove();
        game.undoMove();
    };
    document.getElementById("redo").onclick = () => {
        game.redoMove();
    };
    document.getElementById("reredo").onclick = () => {
        game.redoMove();
        game.redoMove();
    };
    document.getElementById("theme").onchange = () => {
        localStorage.setItem("THEME", document.getElementById("theme").value);
        setTheme();
    };
    let turn_board_check = document.getElementById("turn_board");
    turn_board_check.onchange = () => {
        TURN_BOARD = turn_board_check.checked;
        TURN_PIECES = turn_pieces_check.checked;
    };
    let turn_pieces_check = document.getElementById("turn_pieces");
    turn_pieces_check.onchange = () => {
        TURN_BOARD = turn_board_check.checked;
        TURN_PIECES = turn_pieces_check.checked;
    };
}

window.onload = load;
