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
let ENPASSANT = "e-p"
let LONGCASTLE = "O-O-O"
let SHORTCASTLE = "O-O"
let PROMOTION = "promotion"

let MOVES = [];
let REDO_STACK = [];

class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.has_moved = false;
        this.in_danger = false;
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
        this.symbol = "N";
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
        this.cell_color = null;
        this.piece = null;
        this.in_sight = false;
    }
}

class Move{
    constructor(piece,next_pos,special=null){
        this.piece = piece
        this.prev_pos = piece.position
        this.next_pos = next_pos
        this.taken_piece = null
        this.special = special
    }

    getPrevColRow(){
        return translateToNums(this.prev_pos)
    }

    getNextColRow(){
        return translateToNums(this.next_pos)
    }

    isInBounds(){
        let [c, r] = this.getNextColRow()
        return (c <= 7 && c >= 0 && r <= 7 && r >= 0)
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

    getCellAt(pos){
        let [col,row] = translateToNums(pos)
        return this.board[row][col]
    }

    getPieceAt(pos){
        let [col,row] = translateToNums(pos)
        return this.board[row][col].piece
    }

    getKing(color) {
        if (this.king1.color == color) return this.king1;
        return this.king2;
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

                button.classList.add("m-0", "p-0", "button");
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
                    img.classList.add("piece");
                    // Rotate the black pieces if turn_black_pieces option is checked
                    // rotate both if turn_pieces option is checked and it's black's turn
                    if((TURN_BLACK_PIECES && curr.piece.color == BLACK)|| (TURN_PIECES && TURN == BLACK)){
                        img.classList.add("rotated")
                    }
                    document.getElementById(curr.piece.position).appendChild(img);
                }
            }
        }
    }

    //highlight the moves a player can take with the selected piece
    showMoves(piece) {

        //resets colors to remove the highlight from previous calls.
        //we need to re render the pieces to disable any other moves 
        //that may have been enabled by a previous call
        this.resetColors();
        this.renderPieces();
        this.enableMovables();
        this.calculateSight();

        let moves = this.getPossibleMoves(piece);
        for (let move of moves) {
            let movecell = document.getElementById(move.next_pos);

            if (move.taken_piece) {
                movecell.style.background = KILL_COLOR; //if cell has enemy
            }else{
                movecell.style.background = MOVABLE_COLOR; //if cell empty
            }

            movecell.disabled = false;
            if(move.special != PROMOTION){
                movecell.onclick = () => {
                    //We empty the redo stack if a move is made by the user
                    //for obvious reasons... this "disables" the redo button
                    REDO_STACK = [];
                    this.makeMove(move);
                };
            }else{
                movecell.onclick = () => {
                    //We empty the redo stack if a move is made by the user
                    //for obvious reasons... this "disables" the redo button
                    REDO_STACK = [];
                    this.promotePawn(move)
                };
            }
        }
    }

    // enable current player's pieces
    enableMovables() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let curr = this.board[i][j].piece;
                let button = document.getElementById(translateToChars(j, i));

                //Remove '|| true' if you want to keep two separate players (ie online multiplayer,not implemented yet)
                if (curr && curr.color == TURN && (PLAYER == TURN || true)) {
                    button.disabled = false;
                    button.onclick = () => {
                        this.showMoves(this.getPieceAt(translateToChars(j,i)));
                    };
                } else {
                    button.disabled = true;
                }
            }
        }
    }

    //mark all "pieces" that are in danger
    calculateDanger() {
        //reset all to false
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(this.board[i][j].piece)
                    this.board[i][j].piece.in_danger = false;
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
                    if (!move.isInBounds()) continue

                    let target = this.getPieceAt(move.next_pos);
                    if(!target || target.in_danger) continue // Skip cell if already marked in danger
                    if (target.color != piece.color) {
                        target.in_danger = true;
                    }
                }
            }
        }
    }

    // mark all "squares" that are in enemy sight i.e all squares an enemy piece can move to
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

                let moves = this.getPossibleMoves(piece);
                for (let move of moves) {
                    if (!move.isInBounds()) continue

                    let target_cell = this.getCellAt(move.next_pos);
                    target_cell.in_sight = true;
                }
            }
        }
    }

    //Check if the move puts the piece's king in danger
    moveChecksSelf(move) {
        let checks_self = false;
        let king = this.getKing(move.piece.color);

        let prev = this.getPieceAt(move.prev_pos);
        let next = this.getPieceAt(move.next_pos);

        // make the move internally and check which cells are in_danger
        this.getCellAt(move.next_pos).piece = prev;
        this.getCellAt(move.prev_pos).piece = null;
        this.calculateDanger();

        if (king.in_danger == true) {
            checks_self = true;
        }

        //put things back to normal and reset the "in_danger" status
        this.getCellAt(move.next_pos).piece = next;
        this.getCellAt(move.prev_pos).piece = prev;
        this.calculateDanger();

        return checks_self;
    }

    //return all squares visible to the piece (includes moves that might check self)
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
                    moves.push(new Move(piece,translateToChars(col,doublefront)));
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
                if (last_move.piece instanceof Pawn) {
                    let [old_col, old_row] = last_move.getPrevColRow();
                    if (old_col == col + 1 || old_col == col - 1) {
                        let [new_col, new_row] = last_move.getNextColRow();
                        if (Math.abs(new_row - old_row) == 2) {
                            let next_pos = translateToChars(old_col, front)
                            let move = new Move(piece,next_pos)
                            move.special = ENPASSANT
                            move.taken_piece = this.getPieceAt(translateToChars(old_col,new_row))
                            moves.push(move);
                        }
                    }
                }
            }

            //move front if not blocked
            if (this.board[front][col].piece == null) {
                let move = new Move(piece,translateToChars(col, front))
                if(front == 7 || front == 0)  move.special = PROMOTION
                moves.push(move);
            }
            //diagonals if enemy
            if (diagonal1 && diagonal1.color != piece.color) {
                let move = new Move(piece,translateToChars(col - 1, front))
                move.taken_piece = diagonal1
                if(front == 7 || front == 0)  move.special = PROMOTION
                moves.push(move);
            }
            if (diagonal2 && diagonal2.color != piece.color) {
                let move = new Move(piece,translateToChars(col + 1, front))
                move.taken_piece = diagonal2
                if(front == 7 || front == 0)  move.special = PROMOTION
                moves.push(move);
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
                let move = new Move(piece, translateToChars(c, r))
                move.taken_piece = this.getPieceAt(translateToChars(c,r))
                moves.push(move);
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
                        moves.push(new Move(piece, translateToChars(c, r)));
                    } else{
                        if (curr_cell.piece.color != piece.color){
                            let move = new Move(piece, translateToChars(c, r))
                            move.taken_piece = curr_cell.piece
                            moves.push(move);
                        }
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
                        moves.push(new Move(piece, translateToChars(c, r)));
                    } else {
                        if (curr_cell.piece.color != piece.color){
                            let move = new Move(piece, translateToChars(c, r))
                            move.taken_piece = curr_cell.piece
                            moves.push(move);
                        }
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
                        moves.push(new Move(piece, translateToChars(c, r)));
                    } else if (curr_cell.piece.color != piece.color) {
                            let move = new Move(piece, translateToChars(c, r))
                            move.taken_piece = curr_cell.piece
                            moves.push(move);
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
                    let move = new Move(piece, translateToChars(col - 2, row))
                    move.special = LONGCASTLE
                    moves.push(move);
                }

                //short castle 
                let kingside_rook = this.board[row][7].piece;
                if (
                    kingside_rook && !kingside_rook.has_moved &&
                    !this_row[col + 1].piece && !this_row[col + 2].piece &&
                    !this_row[col + 1].in_sight && !this_row[col + 2].in_sight
                ) {
                    let move = new Move(piece, translateToChars(col + 2, row))
                    move.special = SHORTCASTLE
                    moves.push(move);
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
            if (!move.isInBounds()) continue
            if (move.taken_piece?.color == move.piece.color) continue;
            if (this.moveChecksSelf(move)) continue;
            possible_moves.push(move);
        }
        return possible_moves;
    }

    // returns true if given piece has any legal moves
    hasPossibleMoves(piece){
        let moves = this.getPieceMoves(piece);
        let possible_moves = [];
        for (let move of moves) {
            if (!move.isInBounds()) continue
            if (move.taken_piece?.color == piece.color) continue;
            if (this.moveChecksSelf(move)) continue;
            return true
        }
        return false
    }

    promotePawn(move){
        let modal = document.getElementById("promotionModalContent")
        if(move.piece.color == BLACK && TURN_BLACK_PIECES)
            modal.classList.add("rotated")
        else
            modal.classList.remove("rotated")

        modal.style.background = LIGHT_COLOR

        let qbtn = document.getElementById("queen_promote")
        let rbtn = document.getElementById("rook_promote")
        let kbtn = document.getElementById("knight_promote")
        let bbtn = document.getElementById("bishop_promote")

        qbtn.style.background = DARK_COLOR
        rbtn.style.background = DARK_COLOR
        kbtn.style.background = DARK_COLOR
        bbtn.style.background = DARK_COLOR

        qbtn.innerHTML = ""
        rbtn.innerHTML = ""
        kbtn.innerHTML = ""
        bbtn.innerHTML = ""

        let qimg = document.createElement("img")
        let rimg = document.createElement("img")
        let kimg = document.createElement("img")
        let bimg = document.createElement("img")

        qimg.src = `themes/${THEME}/${move.piece.color}/queen.png`
        rimg.src = `themes/${THEME}/${move.piece.color}/rook.png`
        kimg.src = `themes/${THEME}/${move.piece.color}/knight.png`
        bimg.src = `themes/${THEME}/${move.piece.color}/bishop.png`

        qimg.classList.add("piece")
        rimg.classList.add("piece")
        kimg.classList.add("piece")
        bimg.classList.add("piece")

        qbtn.onclick = ()=>{
            move.piece = new Queen(move.piece.color, move.prev_pos)
            this.makeMove(move)
        }
        rbtn.onclick = ()=>{
            move.piece = new Rook(move.piece.color, move.prev_pos)
            this.makeMove(move)
        }
        kbtn.onclick = ()=>{
            move.piece = new Knight(move.piece.color, move.prev_pos)
            this.makeMove(move)
        }
        bbtn.onclick = ()=>{
            move.piece = new Bishop(move.piece.color, move.prev_pos)
            this.makeMove(move)
        }

        qbtn.appendChild(qimg)
        rbtn.appendChild(rimg)
        kbtn.appendChild(kimg)
        bbtn.appendChild(bimg)

        let promotionModal = new bootstrap.Modal(document.getElementById('promotionModal'));
        promotionModal.show();
    }


    //Moves a piece, and does a bunch of other stuff, does too much imo
    makeMove(move) {
        let prev_cell = this.getCellAt(move.prev_pos);
        let next_cell = this.getCellAt(move.next_pos);

        //Checks if the move is Enpassant, kill enemy pawn
        if (move.special == ENPASSANT) {
            console.log("ENPASSANT");
            this.getCellAt(move.taken_piece.position).piece = null
        }

        // castling logic
        if (move.special == LONGCASTLE) {
            console.log("LONG CASTLE");
            let king = this.getKing(move.piece.color)
            let row = getHomeRow(king.color)
            let rook = this.getPieceAt(translateToChars(0,row))

            this.getCellAt(king.position).piece = null
            this.getCellAt(rook.position).piece = null

            let rook_new_pos = translateToChars(3,row)
            let king_new_pos = translateToChars(2,row)

            rook.position = rook_new_pos
            this.getCellAt(rook_new_pos).piece = rook
            king.position = king_new_pos
            this.getCellAt(king_new_pos).piece = king

            king.has_moved = true
            rook.has_moved = true
        }

        if (move.special == SHORTCASTLE) {
            console.log("SHORT CASTLE");
            let king = this.getKing(move.piece.color)
            let row = getHomeRow(king.color)
            let rook = this.getPieceAt(translateToChars(7,row))

            this.getCellAt(king.position).piece = null
            this.getCellAt(rook.position).piece = null

            let rook_new_pos = translateToChars(5,row)
            let king_new_pos = translateToChars(6,row)

            rook.position = rook_new_pos
            this.getCellAt(rook_new_pos).piece = rook
            king.position = king_new_pos
            this.getCellAt(king_new_pos).piece = king

            king.has_moved = true
            rook.has_moved = true
        }

        //The piece is exchanged by promotePawn(), so nothing to do here
        if (move.special == PROMOTION) {
            console.log("PROMOTION");
        }

        //The actual moving part
        if(!move.special || move.special==PROMOTION || move.special == ENPASSANT){
            move.piece.has_moved = true;
            move.piece.position = move.next_pos;
            next_cell.piece = move.piece;
            prev_cell.piece = null;
        }

        //recheck danger status for all cells
        this.calculateDanger();

        //check for checkmate/stalemate and display appropriate modals
        let mate = this.checkForMate();
        if(mate) showMateModal(mate);

        //record move and change turns if forward
        MOVES.push(move);
        TURN = otherColor(move.piece.color);

        if(MOVES.length == 0) TURN = WHITE

        if (TURN_BOARD) {
            this.renderBoard();
        }
        this.resetColors();
        this.renderPieces();
        this.enableMovables();
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
        if(enemy_king.in_danger) in_check = true

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
                    if (this.hasPossibleMoves(piece) > 0) {
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

        return null
    }

    //redo a move
    redoMove() {
        let move = REDO_STACK.pop();
        if (!move) return;
        this.makeMove(move);
    }

    //undo a move 
    undoMove() {
        let move = MOVES.pop()
        if(!move) return
        REDO_STACK.push(move)

        let prev = move.prev_pos
        let next = move.next_pos
        let piece = move.piece
        let taken = move.taken_piece
        let home_row = getHomeRow(move.piece.color)

        if(!move.special){
            piece.position = prev
            this.getCellAt(prev).piece = piece
            this.getCellAt(next).piece = taken
        }

        else if(move.special == ENPASSANT){
            piece.position = prev
            this.getCellAt(prev).piece = piece
            this.getCellAt(next).piece = null
            this.getCellAt(taken.position).piece = taken
        }

        else if(move.special == PROMOTION){
            this.getCellAt(prev).piece = new Pawn(piece.color, prev)
            this.getCellAt(next).piece = taken
        }

        else if(move.special == SHORTCASTLE){
            let king = this.getKing(piece.color);
            king.position = translateToChars(4, home_row);
            king.has_moved = false
            this.board[home_row][4].piece = king;
            this.board[home_row][5].piece = null;
            this.board[home_row][6].piece = null;
            this.board[home_row][7].piece = new Rook(
                piece.color,
                translateToChars(7, home_row),
            );
        }

        else if(move.special == SHORTCASTLE){
            let king = this.getKing(piece.color);
            king.position = translateToChars(4, home_row);
            king.has_moved = false
            this.board[home_row][4].piece = king;
            this.board[home_row][3].piece = null;
            this.board[home_row][2].piece = null;
            this.board[home_row][1].piece = null;
            this.board[home_row][0].piece = new Rook(
                piece.color,
                translateToChars(0, home_row),
            );
        }

        TURN = piece.color;
        if (TURN_BOARD) {
            this.renderBoard();
        }
        this.renderPieces();
        this.enableMovables();
    }
}

function getHomeRow(color){
    return (color == WHITE) ? 0 : 7;
}

function otherColor(color) {
    return (color == WHITE) ? BLACK : WHITE;
}

function translateToChars(col, row) {
    return `${String.fromCharCode(col + 97)}${row + 1}`;
}

function translateToNums(pos) {
    return [pos.charCodeAt(0) - 97, parseInt(pos[1]) - 1];
}

function create2DArray(rows, cols, initialValue) {
    return Array.from(
        { length: rows },
        () => Array.from({ length: cols }, initialValue),
    );
}

function showMateModal(mate){
    let html_modal = document.getElementById("endModal")
    if (mate == CHECKMATE) {
        document.getElementById("modal_heading").innerHTML = "Checkmate!"
        document.getElementById("modal_winner").innerHTML = `${(TURN).toUpperCase()} WINS!`
        document.getElementById("modal_image").src = CHECKMATE_IMAGE
        console.log("CHECKMATE");
        console.log(TURN, "WINS!");
    }
    if (mate == STALEMATE) {
        document.getElementById("modal_heading").innerHTML = "Stalemate"
        document.getElementById("modal_winner").innerHTML = `Draw`
        document.getElementById("modal_image").src = STALEMATE_IMAGE
        console.log("STALEMATE");
        console.log("BOTH OF YOU SUCK!");
    }
    let modal = new bootstrap.Modal(html_modal);
    modal.show();
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
