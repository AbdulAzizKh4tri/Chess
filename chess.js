import {translateToChars} from './utils.js'
import {Game} from './game.js'

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
let CHECK_COLOR = "#F00"
let CHECKMATE_IMAGE = null
let STALEMATE_IMAGE = null


class GameBoard{

    constructor(game){
        this.game = game
    }

    //Sets the color for the actual rendered board using the colors in game
    resetColors() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let cell_color = this.game.getCellAt(translateToChars(j,i)).cell_color;
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

        const white_king = this.game.getKing(WHITE)
        const black_king = this.game.getKing(BLACK)

        if (white_king.in_danger){
            document.getElementById(white_king.position).style.background = CHECK_COLOR
        }
        if (black_king.in_danger){
            document.getElementById(black_king.position).style.background = CHECK_COLOR
        }
    }

    // enable current player's pieces
    enableMovables() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let curr = this.game.getPieceAt(translateToChars(j,i));
                let button = document.getElementById(translateToChars(j, i));

                //Remove '|| true' if you want to keep two separate players (ie online multiplayer,not implemented yet)
                if (curr && curr.color == this.game.TURN && (PLAYER == this.game.TURN || true)) {
                    button.disabled = false;
                    button.onclick = () => {
                        this.showMoves(this.game.getPieceAt(translateToChars(j,i)));
                    };
                } else {
                    button.disabled = true;
                }
            }
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
        if ((TURN_BOARD && this.game.TURN == BLACK) || PLAYER == BLACK) {
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

                let cell_color = this.game.getCellAt(translateToChars(j-1,i-1)).cell_color;

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

    //render the pieces using this.game.board[][]... self explanatory
    renderPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let curr = this.game.getCellAt(translateToChars(j,i))
                document.getElementById(translateToChars(j, i)).innerHTML = "";
                if (curr.piece) {
                    let img = document.createElement("img");
                    img.src =
                        `./themes/${THEME}/${curr.piece.color}/${curr.piece.img}.png`;
                    img.classList.add("piece");
                    // Rotate the black pieces if turn_black_pieces option is checked
                    // rotate both if turn_pieces option is checked and it's black's turn
                    if((TURN_BLACK_PIECES && curr.piece.color == BLACK)|| (TURN_PIECES && this.game.TURN == BLACK)){
                        img.classList.add("rotated")
                    }
                    document.getElementById(curr.piece.position).appendChild(img);
                }
            }
        }
    }

    async promotePawn(move){
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

        qbtn.onclick = async ()=>{
            move.promoted_to = "Q"
            await this.game.makeMove(move)
            this.reRenderBoard()
        }
        rbtn.onclick = async ()=>{
            move.promoted_to = "R"
            await this.game.makeMove(move)
            this.reRenderBoard()
        }
        kbtn.onclick = async ()=>{
            move.promoted_to = "N"
            await this.game.makeMove(move)
            this.reRenderBoard()
        }
        bbtn.onclick = async ()=>{
            move.promoted_to = "B"
            await this.game.makeMove(move)
            this.reRenderBoard()
        }

        qbtn.appendChild(qimg)
        rbtn.appendChild(rimg)
        kbtn.appendChild(kimg)
        bbtn.appendChild(bimg)

        let promotionModal = new bootstrap.Modal(document.getElementById('promotionModal'));
        promotionModal.show();
    }


    //highlight the moves a player can take with the selected piece
    showMoves(piece) {

        //resets colors to remove the highlight from previous calls.
        //we need to re render the pieces to disable any other moves 
        //that may have been enabled by a previous call
        this.resetColors();
        this.renderPieces();
        this.enableMovables();
        let moves = this.game.getPossibleMoves(piece);
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
                    //for obvious reasons... this.game."disables" the redo button
                    this.game.REDO_STACK = [];
                    this.game.makeMove(move);
                    this.reRenderBoard()
                    let [mate,winner] = this.game.getMateStatus()
                    if(mate){
                        this.showMateModal(mate,winner)
                    }
                };
            }else{
                movecell.onclick = async () => {
                    //We empty the redo stack if a move is made by the user
                    //for obvious reasons... this.game."disables" the redo button
                    this.game.REDO_STACK = [];
                    await this.promotePawn(move)
                    this.reRenderBoard()
                    let [mate,winner] = this.game.getMateStatus()
                    if(mate){
                        this.showMateModal(mate,winner)
                    }
                };
            }
        }
    }

    setTheme() {
        THEME = localStorage.getItem("THEME");
        const path = `themes/${THEME}/theme.json`;
        fetch(path)
            .then((response) => response.json())
            .then((data) => {
                LIGHT_COLOR = data["light_color"] ?? "white";
                DARK_COLOR = data["dark_color"] ?? "grey";

                let white_cell_image = data["white_cell_image"] ?? null;
                let black_cell_image = data["black_cell_image"] ?? null;

                if(white_cell_image)
                    WHITE_CELL_IMAGE = `themes/${THEME}/${white_cell_image}`
                if(black_cell_image)
                    BLACK_CELL_IMAGE = `themes/${THEME}/${black_cell_image}`

                LOGO_COLOR = data["logo_color"] ?? "black";

                BACKGROUND_COLOR = data["background_color"] ?? "white";
                BACKGROUND_IMAGE = data["background_image"] ?? null;

                MOVABLE_COLOR = data["movable_color"] ?? "lightgreen"
                KILL_COLOR = data["kill_color"] ?? "#F00"
                CHECK_COLOR = data["check_color"] ?? "#F00"

                let checkmate_image = data["checkmate_image"] ?? null
                let stalemate_image = data["stalemate_image"] ?? null
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
                this.resetColors();
            })
            .catch((error) => console.error("Error loadingbac JSON:", error));

        this.renderBoard();
        this.renderPieces();
        this.enableMovables();
    }

    reRenderBoard(){
        if (TURN_BOARD) {
            this.renderBoard();
        }
        this.resetColors();
        this.renderPieces();
        this.enableMovables();
    }

    showMateModal(mate,winner){
        let html_modal = document.getElementById("endModal")
        if (mate == CHECKMATE) {
            document.getElementById("modal_heading").innerHTML = "Checkmate!"
            document.getElementById("modal_winner").innerHTML = `${(winner).toUpperCase()} WINS!`
            document.getElementById("modal_image").src = CHECKMATE_IMAGE
            console.log("CHECKMATE");
            console.log(winner, "WINS!");
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
}

let game = null;
let game_board = null

//Game related globals
const WHITE = "white";
const BLACK = "black";
let TURN_BOARD = false;
let TURN_PIECES = false;
let TURN_BLACK_PIECES = false;
let PLAYER = WHITE; //currently does nothing since no multiplayer... yet
const STALEMATE = "stalemate"
const CHECKMATE = "checkmate"
const PROMOTION = "promotion"

async function load() {
    game = new Game();
    game_board = new GameBoard(game);

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
    game_board.setTheme();

    document.getElementById("undo").onclick = () => {
        game.undoMove();
        game_board.reRenderBoard();
    };
    document.getElementById("unundo").onclick = () => {
        game.undoMove();
        game.undoMove();
        game_board.reRenderBoard();
    };
    document.getElementById("redo").onclick = () => {
        game.redoMove();
        game_board.reRenderBoard();
    };
    document.getElementById("reredo").onclick = () => {
        game.redoMove();
        game.redoMove();
        game_board.reRenderBoard();
    };

    document.getElementById("theme").onchange = () => {
        localStorage.setItem("THEME", document.getElementById("theme").value);
        game_board.setTheme();
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
            game_board.renderPieces()

        })
    }
}

window.onload = load;
