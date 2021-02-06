/*************************
 * OBJECTS
 ************************/

const RenderStyle = { "DIV":1, "TABLE":2 };
const Section = { "ROW": 1, "COLUMN": 2, "BOX":3 };

/*****************************
 * Grid object
 * @param {any} id
 ****************************/
function Grid(id) {
    this.id = id;
    const empty = ["000000000", "000000000", "000000000", "000000000", "000000000", "000000000", "000000000", "000000000", "000000000"];
    this.puzzle = empty;
    this.target = empty;
    this.renderStyle = RenderStyle.DIV;

    this.rows = new Array();
    for (let i = 0; i < 9; i++) {
        let row = new Row(i + 1);
        this.rows.push(row);
    }

    this.load = function (puzzle) {
        puzzle = setOrDefault(puzzle, this.puzzle);
        let intArray = parse9x9StrArray(puzzle);
        for (let i = 0; i < 9; i++) {
            let row = this.rows[i];
            for (let j = 0; j < 9; j++) {
                let cell = row.cells[j];
                cell.value = intArray[i][j];
            }
        }
    }

    this.empty = function () {
        return this.reset(empty);
    }

    this.reset = function (content) {
        this.load(content);
        return this.render(this.renderStyle);
    }

    this.solve = function () {
        let updated = true;
        let solved = false;
        while (updated && !solved) {
            updated = this.fillObvious();
            solved = this.isSolved();
        }
        if (!solved) {
            clone = deepDive(this);
            if (clone != false) {
                solved = clone.isSolved();
                if (solved) {
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            let cell = this.rows[i].cells[j];
                            cell.value = clone.rows[i].cells[j].value;
                        }
                    }
                } else {
                    Error("This puzzle is unsolvable as is.");
                    Alert("This puzzle is unsolvable as is.");
                }
            }
        }
        return this.render(this.renderStyle);
    }

    this.fillObvious = function () {
        // Set to false at the start of the loop
        let updated = false;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let cell = this.rows[i].cells[j];
                if (cell.value < 1 && cell.isDoable()) {
                    cell.value = cell.possibilities[0];
                    updated = true;
                }
            }
        }
        return updated;
    }

    this.getSection = function (section, idx) {
        let iArray = [];
        switch (section) {
            case (Section.ROW):
                idx--; // convert to base 0 for the grid reference
                this.rows[idx].cells.forEach(cell => iArray.push(cell.value));
                break;
            case (Section.COLUMN):
                idx--; // convert to base 0 for the grid reference
                this.rows.forEach(row => iArray.push(row.cells[idx].value));
                break;
            case (Section.BOX):
                this.rows.forEach(row => {
                    row.cells.forEach(cell => {
                        if (cell.box == idx) {
                            iArray.push(cell.value);
                        }
                    })
                });
                break;
            default:
                break;
        }
        return iArray;
    }

    this.toIntArray = function () {
        let iArray = [];
        for (let i = 0; i < 9; i++) {
            iArray.push(this.rows[i].toIntArray());
        }
        return iArray;
    }

    this.toStrArray = function () {
        let iArray = [];
        for (let i = 0; i < 9; i++) {
            iArray.push(this.rows[i].toStrArray());
        }
        return iArray;
    }

    this.toText = function () {
        let results = "";
        for (let i = 0; i < 9; i++) {
            results += i === 3 || i === 6 ? `   ----------+----------+----------\n` : "";
            results += `${this.rows[i].toText()}\n`;
        }
        return results;
    }

    this.render = function (renderStyle) {
        renderStyle = setOrDefault(renderStyle, this.renderStyle);
        let results = "";
        for (let i = 0; i < 9; i++) {
            let row = this.rows[i];
            results += row.render(renderStyle);
        }
        let pattern = renderStyle === RenderStyle.TABLE ? `<table class="grid">${results}</table>` : `<div class="grid">${results}</div>`; 
        return pattern;
    }

    this.report = function () {
        console.log(`Grid "${this.id}" Report\n`);
        console.log("===================================================\n");
        console.log("GridId       Row Col Box Cell Val Possibilities   \n");
        console.log("============ === === === ==== === =================\n");
        for (let i = 0; i < 9; i++) {
            console.log(this.rows[i].report());
        }
        console.log("===================================================\n");
        console.log("End Report\n");
    }

    this.isSolved = function() {
        const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let valid = true;
        // Check all rows
        for (i = 1; i < 10 && valid == true; i++) {
            if (!isComparable(expected, this.getSection(Section.ROW, i))) {
                valid = false;
            }
        }
        // Check all columns
        for (i = 1; i < 10 && valid == true; i++) {
            if (!isComparable(expected, this.getSection(Section.COLUMN, i))) {
                valid = false;
            }
        }
        // Check all boxes
        for (i = 1; i < 10 && valid == true; i++) {
            if (!isComparable(expected, this.getSection(Section.BOX, i))) {
                valid = false;
            }
        }
        return valid;
    }

    this.clone = function () {
        let clone = new Grid(`${this.id}.1`);
        clone.load(this.toStrArray());
        return clone;
    }

    // Must be the last property/method of the object
    function init () {
        for (let i = 0; i < 9; i++) {
            this.rows[i].grid = this;
            for (let j = 0; j < 9; j++) {
                let cell = this.rows[i].cells[j];
                if (cell.value > 0) { cell.isGivenCell = true; }
                cell.grid = this;
            }
        }
    }
    init.apply(this);
}

/*****************************
 * Row object
 * @param {any} id
 ****************************/
function Row(id) {
    this.id = id;
    this.grid;

    this.cells = new Array();
    for (let i = 0; i < 9; i++) {
        let j = (this.id * 9) - 9+1+i;
        let cell = new Cell(j);
        cell.value = j;
        this.cells.push(cell);
    }

    this.toText = function () {
        let results = "";
        for (let i = 0; i < 9; i++) {
            results += i === 3 || i === 6 ? ` | ` : "   ";
            results += `${this.cells[i].value}`;
        }
        return results;
    }
    this.toIntArray = function () {
        let iArray = [];
        for (let i = 0; i < 9; i++) {
            iArray.push(this.cells[i].value);
        }
        return iArray;
    }
    this.toStrArray = function () {
        let iStr = "";
        for (let i = 0; i < 9; i++) {
            iStr+=this.cells[i].value.toString();
        }
        return iStr;
    }

    this.report = function () {
        var cellReport = "";
        for (let i = 0; i < 9; i++) {
            cellReport += this.cells[i].report();
        }
        return cellReport;
    }

    this.render = function (renderStyle) {
        renderStyle = setOrDefault(renderStyle, RenderStyle.DIV);
        let results = "";
        for (let i = 0; i < 9; i++) {
            let cell = this.cells[i];
            results += cell.render(renderStyle);
        }
        let pattern = renderStyle == RenderStyle.TABLE ? `<tr class="row">${results}</tr>` : `<div class="row">${results}</div>`;
        return pattern;
    }
}

/*****************************
 * Cell object
 * @param {any} id
 ****************************/
function Cell(id) {
    this.id = parseInt(id);
    this.grid;
    this.value = 0;
    this.isGivenCell = false;
    this.possibilities = [];

    let mod = this.id % 9;
    this.column = mod < 1 ? 9 : mod;
    this.row = parseInt((this.id - 1) / 9) + 1;
    this.box = (parseInt(parseInt(this.row - 1) / 3) * 3) + parseInt(parseInt(this.column - 1) / 3) + 1;

    this.hasValue = this.value > 0;
    this.hasPossibilities = this.possibilities.length > 0;
    this.hasOnePossibility = this.possibilities.length === 1;

    this.isDoable = function () {
        if (this.value > 0) {
            this.possibilities.clear();
            return true;
        }
        this.getPossibilities();
        if (this.possibilities.length > 1) {
            return false;
        }
        return true;
    }

    this.getPossibilities = function () {
        if (this.value > 0) { return [0]; }
        let possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let available = [];
        this.grid.getSection(Section.ROW, this.row).forEach(i => { if (i > 0 && !available.includes(i)) { available.push(i); } });
        this.grid.getSection(Section.COLUMN, this.column).forEach(i => { if (i > 0 && !available.includes(i)) { available.push(i); } });
        this.grid.getSection(Section.BOX, this.box).forEach(i => { if (i > 0 && !available.includes(i)) { available.push(i); } });
        available.forEach(a => possibilities.delete(a));
        this.possibilities.clear();
        [...possibilities].forEach(p => this.possibilities.push(p));
    }

    this.render = function (renderStyle) {
        renderStyle = setOrDefault(renderStyle, RenderStyle.DIV);
        let val = `<input id="cell${this.id}" type="text" value="${this.value.hideZero()}"/>`;
        let css = this.row === 4 || this.row === 7 ? " box-row" : "";
        css += this.column === 4 || this.column === 7 ? " box-col" : "";
        css += this.value==0 ? "" : " given";
        let pattern = renderStyle == RenderStyle.TABLE ? `<td class="cell${css}">${val}</td>` : `<div class="cell${css}">${val}</div>`;
        return pattern;
    }

    this.report = function () {
        this.getPossibilities();
        let possible = (this.possibilities.length < 1) ? "" : (this.possibilities.length > 1) ? `${this.possibilities}` : this.possibilities[0].hideZero();
        return `${this.grid.id.clip(12).pad(12)}  ${this.row}   ${this.column}   ${this.box}   ${this.id.pad(2)}   ${this.value}  ${possible}\n`;
    }
}

/*************************
 * HELPER METHODS
 ************************/
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}
Number.prototype.clip = function (size) {
    return String(this).clip(size);
}
Number.prototype.hideZero = function () {
    var s = String(this);
    return s === "0" ? "" : s;
}
String.prototype.clip = function (size) {
    var s = String(this);
    return s.length > size ? `${s.substring(0, (size - 3))}...` : s.substring(0, size);
}
String.prototype.pad = function (size, padString) {
    var s = String(this);
    var pad = setOrDefault(padString, " ");
    while (s.length < (size || 2)) { s += pad; }
    return s;
}
Array.prototype.clear = function () {
    this.splice(0, this.length);
}

/**************************************************************
 * Helper method: setOrDefault
 * Checks to ensure the object passed is not null or undefined.
 * If not, it returns the provided parameter object (obj).
 * if so, sets it to the provided default (defaultObj).
 * @param {any} obj
 * @param {any} defaultObj
 *************************************************************/
function setOrDefault(obj, defaultObj) {
    return (obj == null || obj == undefined) ? defaultObj : obj;
}

/**************************************************************
 * Helper method: parse9x9StrArray
 * Parses the 9-length string array of digits up to 9 chars.
 * Returns a 9x9 integer array.
 * @param {any} array
 *************************************************************/
function parse9x9StrArray(array) {
    if (array.length < 9) {
        Error("The array provided is not 9 elements long.")
    } else {
        for (let i = 0; i < 9; i++) {
            if (array[i].length < 9) {
                Error(`Element ${i} of the array provided is not 9 characters long.`);
            }
        }
    }
    let rowArray = new Array();
    for (let i = 0; i < 9; i++) {
        let cellArray = new Array();
        for (let j = 0; j < 9; j++) {
            cellArray.push(parseInt(array[i].substr(j, 1)));
        }
        rowArray.push(cellArray);
    }
    return rowArray;
}

/******************************************************
 * Helper function: isComparable
 * Returns true if the given expected and actual arrays
 * contain the same values; false if not.
 * @param {any} expected
 * @param {any} actual
 *****************************************************/
function isComparable(expected, actual) {
    let array1 = expected.slice();
    let array2 = actual.slice();
    return array1.length === array2.length && array1.sort().every(function (value, index) { return value === array2.sort()[index] });
}

/****************************************************
 * Helper Method: cloneBoard
 * Returns a cloned copy of a 9x9x9 integer array
 * @param {any} board
 ***************************************************/
function cloneBoard(board) {
    const newBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            newBoard[r][c] = board[r][c];
        }
    }
    return newBoard;
}

/******************************
 * Brute-force Solver
 *****************************/
function deepDive(original) {

    // Create a cloned board for recursion. 
    let backup = original.clone();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // Process each incomplete cell
            let cell = backup.rows[i].cells[j];
            if (cell.value == 0) {
                if (cell.isDoable()) {
                    cell.value = cell.possibilities[0];
                }
                if (backup.isSolved()) { return backup; }
                // Iterate the list of possibilities, and recurse
                if (cell.hasPossibilities) {
                    for (let i = 0; i < cell.possibilities.length; i++) {
                        // Create a temporary clone for each new recursion. 
                        let newClone = backup.clone();
                        // Choose a value
                        newClone.rows[i].cells[j].value = cell.possibilities[i];
                        // Recurse again using new clone
                        if (finishedClone = deepDive(newClone)) {
                            return finishedClone;
                        }
                    }
                    return false; // dead end
                }
            }
        }
    }
    return false;
}
