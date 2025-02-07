//THEME related globals
let THEME = "default";

let BACKGROUND_COLOR = null;
let BACKGROUND_IMAGE = null;

let LOGO_COLOR = "black";

let LIGHT_COLOR = "white";
let DARK_COLOR = "grey";

let WHITE_CELL_IMAGE = null;
let BLACK_CELL_IMAGE = null;

let MOVABLE_COLOR = "lightgreen";
let KILL_COLOR = "#F00";

let CHECKMATE_IMAGE = null
let STALEMATE_IMAGE = null

//Game related globals
const WHITE = "white";
const BLACK = "black";

let TURN_BOARD = false;
let TURN_PIECES = false;
let TURN_BLACK_PIECES = false;

let PLAYER = WHITE; //currently does nothing since no multiplayer... yet

let TURN = WHITE;
let STALEMATE = "stalemate"
let CHECKMATE = "checkmate"

//format of each element : [piece,prev_pos,next_pos,taken_piece,(special)]
let MOVES = [];

//format of each element : [piece, next_col, next_row]
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

    //sets the cell colors
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

    //place both kings
    setKings() {
        this.king1 = new King(WHITE, translateToChars(4, 0));
        this.board[0][4].piece = this.king1;
        this.king2 = new King(BLACK, translateToChars(4, 7));
        this.board[7][4].piece = this.king2;
    }

    //places pieces of both sides
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

    //places pawns of both sides
    setPawns() {
        for (let i = 0; i < 8; i++) {
            this.board[1][i].piece = new Pawn(WHITE, translateToChars(i, 1));
            this.board[6][i].piece = new Pawn(BLACK, translateToChars(i, 6));
        }
    }

    //renders the board stored in this.board
    renderBoard() {
        let board = document.getElementById("board");
        board.innerHTML = "";

        // We set different start and end points for both loops 
        // to render the board with either black or white on top/bottom
        // Currently only needed if board rotate option is selected

        // Black on top
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
            // White on top
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

                // Set background image if exists, else just use color
                if (cell_color == WHITE) {
                    if (WHITE_CELL_IMAGE) {
                        button.style.backgroundImage = WHITE_CELL_IMAGE;
                    } else {
                        button.style.background = LIGHT_COLOR;
                    }
                }
                if (cell_color == BLACK) {
                    if (BLACK_CELL_IMAGE) {
                        button.style.backgroundImage = BLACK_CELL_IMAGE;
                    } else {
                        button.style.background = DARK_COLOR;
                    }
                }

                button.classList += " m-0 p-0 button ";
                button.disabled = true; //Everything disabled by default, enabled using enableMovables()
                button.innerHTML = "";
                board.appendChild(button);
            }
        }
    }

    //Sets the color for the actual rendered board using the colors in 
    //this.board[][] set by setColors()
    resetColors() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let cell_color = this.board[i][j].cell_color;
                let button = document.getElementById(translateToChars(j, i));

                if (cell_color == WHITE) {
                    if (WHITE_CELL_IMAGE) {
                        button.style.backgroundImage = WHITE_CELL_IMAGE;
                    } else {
                        button.style.background = LIGHT_COLOR;
                    }
                }
                if (cell_color == BLACK) {
                    if (BLACK_CELL_IMAGE) {
                        button.style.backgroundImage = BLACK_CELL_IMAGE;
                    } else {
                        button.style.background = DARK_COLOR;
                    }
                }
            }
        }
    }

    //render the pieces using this.board[][]... self explanatory
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
                    // Rotate the black pieces if rotate black pieces option is checked
                    // rotate both if rotate pieces option is checked and it's black's turn
                    if((TURN_BLACK_PIECES && curr.piece.color == BLACK)|| (TURN_PIECES && TURN == BLACK)){
                        img.classList += " rotated "
                    }
                    document.getElementById(curr.piece.position).appendChild(img);
                }
            }
        }
    }

    // enable current player's pieces
    enableMovables() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let curr = this.board[i][j].piece;
                let button = document.getElementById(translateToChars(j, i));

                //Remove '|| true' if you you want to keep two separate players (ie online multiplayer)
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


    //highlight the moves a player can take with the selected piece
    showMoves(col, row) {

        //resets colors to remove the highlight from previous calls.
        //we need to re render the pieces to disable any other moves 
        //that may have been enabled by a previous call
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
                movecell.style.background = MOVABLE_COLOR; //if cell empty
            } else if (this.board[mrow][mcol].piece.color != piece.color) {
                movecell.style.background = KILL_COLOR; //if cell has enemy
            }

            movecell.disabled = false;
            movecell.onclick = () => {
                //We empty the redo stack if a move is made by the user
                //for obvious reasons... this "disables" the redo button
                REDO_STACK = [];
                this.makeMove(piece, mcol, mrow);
            };
        }
    }

    //Check if the move puts the piece's king in danger
    moveChecksSelf(move, piece) {
        let checks_self = false;
        let king = this.getKing(piece.color);
        let [next_col, next_row] = move;
        let [prev_col, prev_row] = translateToNums(piece.position);
        let [king_col, king_row] = translateToNums(king.position);

        let prev = this.board[prev_row][prev_col].piece;
        let next = this.board[next_row][next_col].piece;

        // make the move internally and check which cells are in_danger
        this.board[next_row][next_col].piece = prev;
        this.board[prev_row][prev_col].piece = null;
        this.calculateDanger();

        if (this.board[king_row][king_col].in_danger == true) {
            checks_self = true;
        }
        if (piece == king && this.board[next_row][next_col].in_danger == true) {
            checks_self = true;
        }

        //put things back to normal and reset the "in_danger" status
        this.board[next_row][next_col].piece = next;
        this.board[prev_row][prev_col].piece = prev;
        this.calculateDanger();

        return checks_self;
    }

    //return the king of the given color
    getKing(color) {
        if (this.king1.color == color) return this.king1;
        return this.king2;
    }

    //return all squares visible to the piece (possible or not)
    getPieceMoves(piece) {
        let moves = [];
        let [col, row] = translateToNums(piece.position);

        //PAWN MOVES
        if (piece instanceof Pawn) {
            let front = (piece.color == WHITE) ? row + 1 : row - 1;
            if(front > 7 || front < 0){
                console.log("You done goofed!")
                return moves
            }

            // Add the square two steps ahead if pawn hasn't moved and way is clear
            if (piece.color == WHITE && row == 1 || piece.color == BLACK && row == 6) {
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

            //ENPASSANT !!!!!
            if (
                piece.color == WHITE && row == 4 ||
                piece.color == BLACK && row == 3
            ) {
                let last_move = MOVES[MOVES.length - 1];
                //Check if last move allows enpassant
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

            //move front if not blocked
            if (this.board[front][col].piece == null) {
                moves.push([col, front]);
            }
            //diagonals if enemy
            if (diagonal1 && diagonal1.color != piece.color) {
                moves.push([col - 1, front]);
            }
            if (diagonal2 && diagonal2.color != piece.color) {
                moves.push([col + 1, front]);
            }
        }


        //KNIGHT MOVES
        if (piece instanceof Knight) {
            let knightMoves = [
                [-2, -1], [-2, 1],
                [-1, -2], [-1, 2],
                [1, -2], [1, 2],
                [2, -1], [2, 1]
            ];
            for (let [dx, dy] of knightMoves) {
                let c = col + dx;
                let r = row + dy;
                if (r > 7 || r < 0 || c > 7 || c < 0) continue;
                moves.push([c, r]);
            }
        }

        //BISHOP AND QUEEN MOVES, Queen Diagonals
        if (piece instanceof Bishop || piece instanceof Queen) {
            let directions = [
                [-1, -1], [-1, 1],  // Up-left, Up-right
                [1, -1], [1, 1]     // Down-left, Down-right
            ];
            for (let [dx, dy] of directions) {
                for (let i = 1; i <= 7; i++) {
                    let c = col + i * dx;
                    let r = row + i * dy;
                    if (r > 7 || r < 0 || c > 7 || c < 0) break;
                    let curr_cell = this.board[r][c];
                    if (!curr_cell.piece) {
                        moves.push([c, r]);
                    } else{
                        if (curr_cell.piece.color != piece.color) moves.push([c, r]);
                        break;
                    }
                }
            }
        }

        //ROOK AND QUEEN MOVES, Queen straights
        if (piece instanceof Rook || piece instanceof Queen) {
            let directions = [
                [-1, 0], [1, 0],  // Vertical (Up, Down)
                [0, -1], [0, 1]   // Horizontal (Left, Right)
            ];
            for (let [dx, dy] of directions) {
                for (let i = 1; i <= 7; i++) {
                    let c = col + i * dx;
                    let r = row + i * dy;
                    if (r > 7 || r < 0 || c > 7 || c < 0) break;

                    let curr_cell = this.board[r][c];
                    if (!curr_cell.piece) {
                        moves.push([c, r]);
                    } else {
                        if (curr_cell.piece.color != piece.color) moves.push([c, r]);
                        break;
                    }
                }
            }
        }

        //KING MOVES
        if (piece instanceof King) {
            //8 surrounding squares
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) continue;
                    let c = col + i;
                    let r = row + j;

                    if (r > 7 || r < 0 || c > 7 || c < 0) continue;

                    let curr_cell = this.board[r][c];
                    if (!curr_cell.piece) {
                        moves.push([c, r]);
                    } else if (curr_cell.piece.color != piece.color) {
                        moves.push([c, r]);
                    }
                }
            }

            //castling logic
            if (!piece.has_moved && !this.board[row][col].in_danger) {
                let this_row = this.board[row];

                //long castle
                let queenside_rook = this.board[row][0].piece;
                if (
                    queenside_rook && !queenside_rook.has_moved &&
                    !this_row[col - 1].piece && !this_row[col - 2].piece && !this_row[col - 3].piece &&
                    !this_row[col - 1].in_sight && !this_row[col - 2].in_sight // King cannot pass through check
                ) {
                    moves.push([col - 2, row]);
                }

                //short castle 
                let kingside_rook = this.board[row][7].piece;
                if (
                    kingside_rook && !kingside_rook.has_moved &&
                    !this_row[col + 1].piece && !this_row[col + 2].piece &&
                    !this_row[col + 1].in_sight && !this_row[col + 2].in_sight
                ) {
                    moves.push([col + 2, row]);
                }
            }
        }
        return moves;
    }

    // return possible moves, i.e the ones that don't put the king in danger and are inside the board
    getPossibleMoves(piece) {
        let moves = this.getPieceMoves(piece);
        let possible_moves = [];
        for (let move of moves) {
            let [mcol, mrow] = move;
            if (mcol > 7 || mcol < 0 || mrow > 7 || mrow < 0) continue;
            if (this.board[mrow][mcol].piece?.color == piece.color) continue;
            if (this.moveChecksSelf(move, piece)) continue;
            possible_moves.push(move);
        }
        return possible_moves;
    }


    //Moves a piece, and does a bunch of other stuff, does too much imo
    //TODO: Clean this up, could probably extract some more, maybe use a standard object for move
    makeMove(piece, next_col, next_row, forward = true) {
        let [prev_col, prev_row] = translateToNums(piece.position);
        let next_pos = translateToChars(next_col, next_row);
        let prev_pos = piece.position;

        let special = null;
        let old_piece = piece

        piece.position = next_pos;

        let prev = this.board[prev_row][prev_col];
        let next = this.board[next_row][next_col];

        let taken_piece = next.piece;

        //Checks if the move is Enpassant but only if it is done going forward ie NOT undo
        //TODO definitely need a move object
        if (forward && this.isEnpassant(piece, next_row, next_col, prev_col)) {
            console.log("ENPASSANT");
            special = "enpassant";
            let x = (piece.color == WHITE) ? -1 : 1;
            this.board[next_row + x][next_col].piece = null;
        }

        // checks if the pawn is being promoted
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

        //The actual moving
        piece.has_moved = true;
        this.board[next_row][next_col].piece = piece;
        this.board[prev_row][prev_col].piece = null;

        // Castling logic
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

        //recheck danger status for all cells
        this.calculateDanger();

        //check for checkmate/stalemate and display appropriate modals
        //TODO refactor
        let mate = this.checkForMate();
        if (mate == CHECKMATE) {
            let html_modal = document.getElementById("endModal")
            document.getElementById("modal_heading").innerHTML = "Checkmate!"
            document.getElementById("modal_winner").innerHTML = `${(TURN).toUpperCase()} WINS!`
            document.getElementById("modal_image").src = CHECKMATE_IMAGE
            let modal = new bootstrap.Modal(html_modal);
            modal.show();
            console.log("CHECKMATE");
            console.log(TURN, "WINS!");
        }
        if (mate == STALEMATE) {
            let html_modal = document.getElementById("endModal")
            document.getElementById("modal_heading").innerHTML = "Stalemate"
            document.getElementById("modal_winner").innerHTML = `Draw`
            document.getElementById("modal_image").src = STALEMATE_IMAGE
            let modal = new bootstrap.Modal(html_modal);
            modal.show();
            console.log("STALEMATE");
            console.log("BOTH OF YOU SUCK!");
        }

        //record move and change turns if forward
        let curr_move = [piece, prev_pos, next_pos, taken_piece, special];
        if(special == "promotion") curr_move.push(old_piece)

        if (forward) {
            MOVES.push(curr_move);
            TURN = otherColor(piece.color);
        }else{
            TURN = piece.color;
        }
        if(MOVES.length == 0) TURN = WHITE
        if (TURN_BOARD) {
            this.renderBoard();
        }
        this.resetColors();
        this.renderPieces();
        this.enableMovables();
    }

    //Checks if the move is a castle, should be gone after cleanup
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

    //Checks for checkmate and stalemate
    checkForMate() {
        let other = otherColor(TURN);

        // If piece count is 2: stalemate
        let piece_count = 0
        let enough_material = false
        let in_check = false
        let movable = false

        let white_weak_pieces = 0
        let black_weak_pieces = 0

        let enemy_king = this.getKing(other)
        let [king_col,king_row] = translateToNums(enemy_king.position)
        if(this.board[king_row][king_col].in_danger) in_check = true

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = this.board[i][j].piece;
                if (!piece) continue;
                piece_count++
                if(!enough_material && (piece instanceof Rook || piece instanceof Queen)) enough_material = true
                if(!enough_material && (piece instanceof Bishop || piece instanceof Knight)){
                    if(piece.color == WHITE) white_weak_pieces += 1
                    if(piece.color == BLACK) black_weak_pieces += 1
                    if(white_weak_pieces >= 2 || black_weak_pieces >= 2) enough_material = true
                }
                if (piece.color == other) {
                    if (this.getPossibleMoves(piece).length > 0) {
                        movable = true;
                    }
                }
            }
        }

        if(movable){
            if(piece_count <= 4 && !enough_material) 
                return STALEMATE
        }else{
            if(in_check) return CHECKMATE
            return STALEMATE
        }

        return false
    }

    //calculate the pieces that are under threat
    calculateDanger() {
        //reset all to false
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.board[i][j].in_danger = false;
            }
        }

        //Iterate over every piece and check its moves, set the danger of its target to true
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
                    if(target.in_danger) continue // Skip cell if already marked in danger

                    if (target.piece && target.piece.color != piece.color) {
                        target.in_danger = true;
                    }
                }
            }
        }
    }

    // calculate which squares are in enemy sight
    // currently used only for castling, but could be helpful in the future
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

    //redo a move, nothing here
    redoMove() {
        let move = REDO_STACK.pop();
        if (!move) return;
        this.makeMove(move[0], move[1], move[2]);
    }

    //this nightmare attemps to undo a move and restore the state to what it was
    //the lack of a standard move object has made it a nightmare
    //TODO standardize moves accross click, undo and redo
    undoMove() {
        let move = MOVES.pop();
        if (!move) return;

        //move : [piece moved, from, to, taken piece, <special>, <original pawn from promotion>]
        let piece = move[0];
        let [prev_col, prev_row] = translateToNums(move[1]);
        let [next_col, next_row] = translateToNums(move[2]);
        let taken_piece = move[3];

        let new_cell = this.board[next_row][next_col];
        let old_cell = this.board[prev_row][prev_col];


        let behind = (piece.color == WHITE) ? -1 : 1;

        //Normal move, just move the piece back without recording it in MOVES stack
        //then replace the taken piece if there is one
        if (!move[4]) {
            this.makeMove(piece, prev_col, prev_row, false);
            new_cell.piece = taken_piece;
            this.renderPieces();
            REDO_STACK.push([piece, next_col, next_row]);
            return;
        }

        // ENPASSANT!!! put pawn back in prev position, place a pawn in enemy area
        // TODO make more efficient
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
            REDO_STACK.push([piece, next_col, next_row]);
            return;
        }

        // put original pawn and taken pieces back in their original place, 
        if (move[4] == "promotion") {
            let pawn = move[5]
            new_cell.piece = pawn;
            this.makeMove(pawn, prev_col, prev_row, false);
            new_cell.piece = taken_piece
            this.renderPieces()
            this.enableMovables()
            REDO_STACK.push([pawn, next_col, next_row]);
            return
        }

        REDO_STACK.push([piece, next_col, next_row]);

        //castled towards H/A: just return pieces back to origin and set has_moved to false
        if (move[4] == "castle_H") {
            let king = this.getKing(piece.color);
            king.position = translateToChars(4, prev_row);
            king.has_moved = false
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
            king.has_moved = false
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
            LIGHT_COLOR = data["light_color"] ?? "white";
            DARK_COLOR = data["dark_color"] ?? "grey";

            white_cell_image = data["white_cell_image"] ?? null;
            black_cell_image = data["black_cell_image"] ?? null;

            if(white_cell_image)
                WHITE_CELL_IMAGE = `themes/${THEME}/${white_cell_image}`
            if(black_cell_image)
                BLACK_CELL_IMAGE = `themes/${THEME}/${black_cell_image}`

            LOGO_COLOR = data["logo_color"] ?? "black";

            BACKGROUND_COLOR = data["background_color"] ?? "white";
            BACKGROUND_IMAGE = data["background_image"] ?? null;

            MOVABLE_COLOR = data["movable_color"] ?? "lightgreen"
            KILL_COLOR = data["kill_color"] ?? "#F00"

            checkmate_image = data["checkmate_image"] ?? null
            stalemate_image = data["stalemate_image"] ?? null
            if(checkmate_image)
                CHECKMATE_IMAGE = `themes/${THEME}/${checkmate_image}`
            if(stalemate_image) 
                STALEMATE_IMAGE = `themes/${THEME}/${stalemate_image}`

            if (BACKGROUND_IMAGE) {
                document.body.style.backgroundImage =
                    `url('themes/${THEME}/${BACKGROUND_IMAGE}')`;
            } else {
                document.body.style.background = BACKGROUND_COLOR;
            }

            let mate_modal = document.getElementById("modal_content")
            mate_modal.style.background = LIGHT_COLOR ?? "white"

            let mate_modal_close_btn = document.getElementById("close_modal_btn")
            mate_modal_close_btn.style.background = DARK_COLOR ?? "grey"

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

    // themes.json contains the list of themes with their name and icon,
    // the name must be the same name as the folder, icon can be anything
    document.getElementById("theme").innerHTML = "";
    fetch("themes/themes.json")
        .then((response) => response.json())
        .then((data) => {
            data.themes.forEach((theme) => {
                let option = document.createElement("option");
                option.id = `theme-${theme.name}`
                option.value = theme.name;
                option.innerHTML = theme.icon;
                document.getElementById("theme").appendChild(option);
            })
        }).then(() => {
                document.getElementById(`theme-${THEME}`).selected = true
        }).catch((error) => console.error("Error loading themes:", error));

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

    // the turn board, turn pieces, and turn black pieces options are mutually exclusive
    // and also need to be uncheck-able
    for(let radio of document.getElementsByClassName('rotation')){
        radio.addEventListener('click', function () {
            if (this.checked) {
                if (this.dataset.checked === "true") {
                    this.checked = false;
                    this.dataset.checked = "false";
                } else {
                    this.dataset.checked = "true";
                    for(let other of document.getElementsByClassName('rotation')){
                        if (other !== this) other.dataset.checked = "false";
                    }
                }
            }
            TURN_BOARD = document.getElementById("turn_board").checked
            TURN_PIECES = document.getElementById("turn_pieces").checked
            TURN_BLACK_PIECES = document.getElementById("turn_black").checked
            game.renderPieces()

        })
    }
}

window.onload = load;
