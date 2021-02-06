/*****************************************************************************
jsReport                                         authors: Harvey L. Covey, Jr.
                                                   email:  hlcoveyjr@yahoo.com
                                             last update:           03/30/2005
													
PURPOSE:
Create an (or use an existing) grid object using javascript that can be 
displayed, moved, customized or hidden using Standards-based Javascript for 
optimal multi-browser support.

DISCLAIMER:
You may use this code for any purpose, commercial or private, without any 
further permission from the author.  You may remove this notice from your final 
code if you wish, however it is appreciated by the author if at least my website
and/or email address is kept.  You may NOT re-distribute this code in any way 
except through its use.  Meaning, you may include it in your product, or your 
website, or any other form  where the code is actually being used.  You may not 
put the plain javascript up on your site for download or include it in your 
javascript libraries for download.  If you wish to share this code with others, 
please just point them to the URL instead.  Please DO NOT link directly to the
author's .js files from your site.  Copy the files to your server and use them 
there.  Finally, use of this code means that you agree that the author is in 
NO WAY responsible for the any damage or data loss do to the use or mis-use of 
this free product.
Thank you.

COMPATIBILITY:
If a user has Navigator 4.x or Internet Explorer 4.x, they need to upgrade.
There is no excuse in this world to NOT be on the very latest version of a free
browser! If, however they are using the latest version of AOL, Opera, WebTV, 
Mozilla or most other widely recognized browsers, we can support them with this 
script.

REQUIREMENTS:
None
*****************************************************************************/
import { splitStrToArray, setOrDefault, isNullOrEmpty, toTitle } from "./jsHelpers.js";

//#region OBJECTS
/******************************************************************************
 * Report
 * A collection of ImageItem items with methods to support manipulation.
 * @param {any} rptName
 * @param {any} colArray // An array of tuples ([["col1",10],["col2",20]...])
 * @param {any} dataArray
 *****************************************************************************/
export class Report {
    constructor(rptName, colArray, dataArray, objId, style) {
        rptName = setOrDefault(rptName, "Report1");
        this.name = rptName;
        this.title = toTitle(rptName);
        this.objId = setOrDefault(objId, "log");
        this.style = setOrDefault(style, RptObject.Style.Raw);
        this.isIndexed = this.style === RptObject.Style.Raw;
        this.calculateWidths = this.style === RptObject.Style.Raw;

        this.columns = [];
        this.columnCount = 0;
        if (!isNullOrEmpty(colArray)) {
            this.parseColumns(colArray);
        }
        this.data = [];
        this.recordCount = 0;
        if (!isNullOrEmpty(dataArray)) {
            if (this.style === RptObject.Style.Raw) {
                this.parseData(dataArray);
            } else {
                this.data = [...dataArray];
            }
        }
    }
    /**************************************************************************
     * Provided colArray MUST be in the form of an array of tuples.
     * (example: [["Field1",10],["Column2",20]...])
     * @param {any} colArray
     *************************************************************************/
    parseColumns(colArray) {
        let errMsg = "Provided colArray MUST be in the form of an array of ";
        errMsg += "tuples.\nExample: [[\"Field1\",10],[\"Column2\",20]...]";
        if (isNullOrEmpty(colArray)
            || !Array.isArray(colArray)
            || !Array.isArray(colArray[0])) {
            throw new Error(errMsg);
        }
        if (this.isIndexed) {
            this.columns.push(new RptColumn(0, "Idx", 3));
        }
        for (let i = 0; i < colArray.length; i++) {
            let newColumn = new RptColumn(i+1, colArray[i][0], colArray[i][1]);
            this.columns.push(newColumn);
        }
        this.columnCount = this.columns.length;
    }
    /**************************************************************************
     * Provided dataArray MUST match the count of columns in each row.
     * @param {any} dataArray
     *************************************************************************/
    parseData(dataArray) {
        let errMsg = "Provided dataArray MUST be an array whose column count ";
        errMsg += "matches the count of columns in each row.";

        let idx = this.isIndexed ? 1 : 0;
        if (isNullOrEmpty(dataArray)
            || !Array.isArray(dataArray)
            || dataArray[0].length != this.columnCount - idx) {
            throw new Error(errMsg);
        }
        let index = 0;
        let cols = this.columnCount-idx;
        // For each record in the dataArray...
        dataArray.forEach(record => {
            //Open a new working string array
            let sArray = [];
            let rows = 0;
            // For each column in the record, parse out the data to a 
            // col/row centric string array
            for (let c = 0; c < cols; c++) {
                let sArr = splitStrToArray(record[c], this.columns[c+idx].width);
                rows = Math.max(rows, sArr.length);
                sArray.push(sArr);
            }
            // Generate a working array padded with empty values
            let padArray = [...Array(cols)].map(e => Array(rows).fill(""));
            // Populate the corresponding matching col/row values 
            // from the string array to the padded array
            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < sArray[c].length; r++) {
                    padArray[c][r] = sArray[c][r];
                }
            }
            // Transpose the padded array to the proper row/col centric 
            // data model and push each "row" to the this.data array.
            // Add the idx that relates to each record element as each
            // record element spans across muliple rows in the array.
            for (let r = 0; r < rows; r++) {
                let sub = [];
                if (this.isIndexed) {
                    sub.push(index);
                }
                for (let c = 0; c < cols; c++) {
                    sub.push(padArray[c][r]);
                }
                this.data.push(sub);
            }
            index++;
        });
        this.recordCount = index;
        this.columns[0].width = Math.max(index.toString().length, this.columns[0].width);
    }
    report() {
        if (this.objId.toLowerCase() === "log") {
            let log = this.toLog();
            console.log(log);
            return log;
        }
        let rptObj = new RptObject(this.objId);
        this.style === RptObject.Style.Table ? this.toTable(rptObj) :
        this.style === RptObject.Style.Grid ? this.toGrid(rptObj) :
        this.toRaw(rptObj);
    }
    toRaw(rptObj) {
        let pre = document.createElement("pre");
        pre.id = `pre-${this.name}`;
        pre.textContent = this.toLog();
        rptObj.obj.appendChild(pre);
    }
    toGrid(rptObj) {
        //TODO: build a div-based grid object
        let grid = document.createElement("div");
        grid.setAttribute("class", "grid");
        grid.id = `grid-${this.name}`;
        let cap = document.createElement("div");
        cap.setAttribute("class", "caption");
        cap.textContent = `Report: ${this.title}`;
        grid.appendChild(cap);
        let row = document.createElement("div");
        row.setAttribute("class", "header");
        this.columns.forEach(c => {
            if (c.name.toUpperCase() !== "IDX") {
                let cell = document.createElement("div");
                cell.setAttribute("class", `col-header${c.index}`);
                cell.textContent = c.name;
                row.appendChild(cell);
            }
        });
        grid.appendChild(row);
        this.data.forEach(r => {
            row = document.createElement("div");
            row.setAttribute("class", "row");
            for (let c = 0; c < r.length; c++) {
                let cell = document.createElement("div");
                cell.textContent = r[c];
                cell.setAttribute("class", `col-record${c+1}`);
                row.appendChild(cell);
            }
            grid.appendChild(row);
        });
        rptObj.obj.appendChild(grid);
    }

    toTable(rptObj) {
        let tbl = document.createElement("table");
        tbl.setAttribute("style", "table-layout:fixed;width:100%;border-collapse:collapse;");
        tbl.id = `tbl-${this.name}`;
        let cap = document.createElement("caption");
        cap.textContent = `Report: ${this.title}`;
        tbl.appendChild(cap);
        let thd = document.createElement("thead");
        let row = document.createElement("tr");
        let total = this.columns.reduce((t, { width }) => t + width, 0);
        this.columns.forEach(c => {
            if (c.name.toUpperCase() !== "IDX") {
                let cell = document.createElement("th");
                cell.textContent = c.name;
                if (this.calculateWidths) {
                    cell.setAttribute("style", `width:${parseInt((c.width * 100) / total)}%;`);
                }
                row.appendChild(cell);
            }
        });
        thd.appendChild(row);
        tbl.appendChild(thd);
        let tbody = document.createElement("tbody");
        this.data.forEach(r => {
            row = document.createElement("tr");
            for (let c = 0; c < r.length; c++) {
                let cell = document.createElement("td");
                cell.textContent = r[c];
                cell.setAttribute("style", `overflow-wrap:break-word;`);
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        });
        tbl.appendChild(tbody);
        rptObj.obj.appendChild(tbl);
    }
    toLog() {
        let totalWidth = this.columnCount - 1;
        let rptHeaders = "";
        let rptBorders = "";
        for (let c = 0; c < this.columnCount; c++) {
            let width = this.columns[c].width;
            totalWidth += width;
            rptHeaders += `${this.columns[c].name.padEnd(width)} `;
            rptBorders += `${("=").repeat(width)} `;
        }
        let rpt = `Report: ${this.title}\n${("=").repeat(totalWidth)}\n`;
        rpt += `${rptHeaders}\n${rptBorders}\n`;
        let index = -1;
        for (let r = 0; r < this.data.length; r++) {
            let s = "";
            for (let c = 0; c < this.columnCount; c++) {
                let width = this.columns[c].width + 1;
                s += (c == 0 && this.data[r][0] == index)
                    ? (" ").padEnd(width)
                    : (`${this.data[r][c]}`).trim().padEnd(width);
                index = this.data[r][0];
            }
            rpt += `${s}\n`;
        }
        rpt += `${rptBorders}\nTotal records: ${this.recordCount}`;
        return rpt;
    }
}
/******************************************************************************
 * RptColumn
 * @param {any} idx
 * @param {any} colName
 * @param {any} width
 *****************************************************************************/
export class RptColumn {
    constructor(idx, colName, width) {
        idx = parseInt(setOrDefault(idx, 0));
        this.index = idx;
        this.name = setOrDefault(colName, `Column ${idx}`);
        this.width = parseInt(setOrDefault(width, 20));
    }
}
/******************************************************************************
 * RptColumn
 * @param {any} idx
 * @param {any} colName
 * @param {any} width
 *****************************************************************************/
export class RptObject {
    constructor(objId) {
        objId = setOrDefault(objId, "report1");

        let obj = setOrDefault(document.querySelector(`#${objId}`), "");
        if (isNullOrEmpty(obj)) {
            obj = document.createElement("div");
            obj.id = objId;
            document.querySelector("body").appendChild(obj);
        }
        this.obj = obj;
    }
    static Style = { "Raw":1, "Table":2, "Grid":3 };
}
//#endregion OBJECTS
