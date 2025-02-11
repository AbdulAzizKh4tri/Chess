const WHITE = "white";
const BLACK = "black";

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

export function showMateModal(mate){
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
