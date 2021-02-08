/******************************************************************************
 * Helper method: splitStrToArray
 * Splits a string (s) nicely on spaces between words up to the width (w)
 * provided. IF the string has no defining whitespace on which to split,
 * breaks it down on exact count of letters to the width parameter.
 * Returns an array of the split strings.
 * @param {any} s
 * @param {any} w
 *****************************************************************************/
export let splitStrToArray = (s, w) => {
    let sLen = s.length;
    let strArray = s.split(' ').map((val, idx, arr) => {
        if (!arr.strLength) { arr.strLength = 0 }
        arr.strLength += val.length + 1;
        if (arr.strLength > (w)) {
            arr.strLength = val.length;
            return `\n${val}`;
        }
        return val;
    }).join(' ').split("\n");
    let aLen = strArray.length;
    if (aLen === 2 && strArray[0] === "" && strArray[1].length === sLen) {
        strArray.splice(0, aLen);
        let i = 0;
        while (i < sLen) {
            strArray.push(s.substr(i, w));
            i += w;
        }
    }
    return strArray;
}

/******************************************************************************
 * Helper method: setOrDefault
 * Checks to ensure the object passed is not null or undefined.
 * If not, it returns the provided parameter object (o).
 * if so, sets it to the provided default (d).
 * @param {any} o
 * @param {any} d
 *****************************************************************************/
export let setOrDefault = (o, d) => isNullOrEmpty(o) ? d : o;

/******************************************************************************
 * Helper method: isNullOrEmpty
 * Returns true is object (o) is null, undefined or empty string; false if not.
 * @param {any} o
 *****************************************************************************/
export let isNullOrEmpty = (o) => (o == null || o == undefined || o === "");

export let toTitle = (s) => {
    let b = "";
    let isDash = false;
    for (let i = 0; i < s.length; i++) {
        if (i === 0) {
            b += s[i].toUpperCase();
        } else {
            if (s[i] === "-") {
                b += " ";
                isDash = true;
            } else {
                b += isDash === true ? s[i].toUpperCase() :
                    s[i] === s[i].toUpperCase() ? ` ${s[i]}` : s[i];
                isDash = false;
            }
        }
    }
    while (b.includes("  ")) {
        b = b.replace("  ", " ");
    }
    return b;
}

function useAccessibleHeader(tableName) {
    var table = document.getElementById(tableName);
    var header = table.rows[0];
    var thead = table.createTHead();

    var tmpRow = thead.insertRow(0);
    for (i = 0; i < header.cells.length; i++) {
        var newCell = document.createElement("th");
        newCell.appendChild(document.createTextNode(header.cells[i].innerHTML));
        thead.rows[0].appendChild(newCell);
    }
    table.deleteRow(1);
}

