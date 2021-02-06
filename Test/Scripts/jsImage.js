/******************************************************************************
 * jsImage.js                                     author:  Harvey L. Covey, Jr.
 * Object-oriented sudoku application             created: Jan 31, 2021
 *****************************************************************************/
import { setOrDefault, isNullOrEmpty, toTitle } from './jsHelpers.js';
import { Report } from "./jsReport.js";

//#region GLOBALS
/******************************************************************************
 * Global constant: toolImages
 * An Array consisting of the basic images used for icons in toolbars.
 *****************************************************************************/
const toolImages = [
    ["Clean", "data:image/gif;base64,R0lGODlhFgAWAIQbAD04KTRLYzFRjlldZl9vj1dusY14WYODhpWIbbSVFY6O7IOXw5qbms+wUbCztca0ccS4kdDQjdTLtMrL1O3YitHa7OPcsd/f4PfvrvDv8Pv5xv///////////////////yH5BAEKAB8ALAAAAAAWABYAAAV84CeOZGmeaKqubMteyzK547QoBcFWTm/jgsHq4rhMLoxFIehQQSAWR+Z4IAyaJ0kEgtFoLIzLwRE4oCQWrxoTOTAIhMCZ0tVgMBQKZHAYyFEWEV14eQ8IflhnEHmFDQkAiSkQCI2PDC4QBg+OAJc0ewadNCOgo6anqKkoIQA7", "", "imgButton", "if(validateMode()&&confirm('Are you sure?')){oDoc.innerHTML=sDefTxt};"],
    ["Print", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oEBxcZFmGboiwAAAAIdEVYdENvbW1lbnQA9syWvwAAAuFJREFUOMvtlUtsjFEUx//n3nn0YdpBh1abRpt4LFqtqkc3jRKkNEIsiIRIBBEhJJpKlIVo4m1RRMKKjQiRMJRUqUdKPT71qpIpiRKPaqdF55tv5vvusZjQTjOlseUkd3Xu/3dPzusC/22wtu2wRn+jG5So/OCDh8ycMJDflehMlkJkVK7KUYN+ufzA/RttH76zaVocDptRxzQtNi3mRWuPc+6cKtlXZ/sddP2uu9uXlmYXZ6Qm8v4Tz8lhF1H+zDQXt7S8oLMXtbF4e8QaFHjj3kbP2MzkktHpiTjp9VH6iHiA+whtAsX5brpwueMGdONdf/2A4M7ukDs1JW662+XkqTkeUoqjKtOjm2h53YFL15pSJ04Zc94wdtibr26fXlC2mzRvBccEbz2kiRFD414tKMlEZbVGT33+qCoHgha81SWYsew0r1uzfNylmtpx80pngQQ91LwVk2JGvGnfvZG6YcYRAT16GFtW5kKKfo1EQLtfh5Q2etT0BIWF+aitq4fDbk+ImYo1OxvGF03waFJQvBCkvDffRyEtxQiFFYgAZTHS0zwAGD7fG5TNnYNTp8/FzvGwJOfmgG7GOx0SAKKgQgDMgKBI0NJGMEImpGDk5+WACEwEd0ywblhGUZ4Hw5OdUekRBLT7DTgdEgxACsIznx8zpmWh7k4rkpJcuHDxCul6MDsmmBXDlWCH2+XozSgBnzsNCEE4euYV4pwCpsWYPW0UHDYBKSWu1NYjENDReqtKjwn2+zvtTc1vMSTB/mvev/WEYSlASsLimcOhOBJxw+N3aP/SjefNL5GePZmpu4kG7OPr1+tOfPyUu3BecWYKcwQcDFmwFKAUo90fhKDInBCAmvqnyMgqUEagQwCoHBDc1rjv9pIlD8IbVkz6qYViIBQGTJPx4k0XpIgEZoRN1Da0cij4VfR0ta3WvBXH/rjdCufv6R2zPgPH/e4pxSBCpeatqPrjNiso203/5s/zA171Mv8+w1LOAAAAAElFTkSuQmCC", "", "imgButton", "printDoc();"],
    ["Undo", "data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=", "", "imgButton", "formatDoc('undo');"],
    ["Redo", "data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==", "", "imgButton", "formatDoc('redo');"],
    ["RemoveFormat", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9oECQMCKPI8CIIAAAAIdEVYdENvbW1lbnQA9syWvwAAAuhJREFUOMtjYBgFxAB501ZWBvVaL2nHnlmk6mXCJbF69zU+Hz/9fB5O1lx+bg45qhl8/fYr5it3XrP/YWTUvvvk3VeqGXz70TvbJy8+Wv39+2/Hz19/mGwjZzuTYjALuoBv9jImaXHeyD3H7kU8fPj2ICML8z92dlbtMzdeiG3fco7J08foH1kurkm3E9iw54YvKwuTuom+LPt/BgbWf3//sf37/1/c02cCG1lB8f//f95DZx74MTMzshhoSm6szrQ/a6Ir/Z2RkfEjBxuLYFpDiDi6Af///2ckaHBp7+7wmavP5n76+P2ClrLIYl8H9W36auJCbCxM4szMTJac7Kza////R3H1w2cfWAgafPbqs5g7D95++/P1B4+ECK8tAwMDw/1H7159+/7r7ZcvPz4fOHbzEwMDwx8GBgaGnNatfHZx8zqrJ+4VJBh5CQEGOySEua/v3n7hXmqI8WUGBgYGL3vVG7fuPK3i5GD9/fja7ZsMDAzMG/Ze52mZeSj4yu1XEq/ff7W5dvfVAS1lsXc4Db7z8C3r8p7Qjf///2dnZGxlqJuyr3rPqQd/Hhyu7oSpYWScylDQsd3kzvnH738wMDzj5GBN1VIWW4c3KDon7VOvm7S3paB9u5qsU5/x5KUnlY+eexQbkLNsErK61+++VnAJcfkyMTIwffj0QwZbJDKjcETs1Y8evyd48toz8y/ffzv//vPP4veffxpX77z6l5JewHPu8MqTDAwMDLzyrjb/mZm0JcT5Lj+89+Ybm6zz95oMh7s4XbygN3Sluq4Mj5K8iKMgP4f0////fv77//8nLy+7MCcXmyYDAwODS9jM9tcvPypd35pne3ljdjvj26+H2dhYpuENikgfvQeXNmSl3tqepxXsqhXPyc666s+fv1fMdKR3TK72zpix8nTc7bdfhfkEeVbC9KhbK/9iYWHiErbu6MWbY/7//8/4//9/pgOnH6jGVazvFDRtq2VgiBIZrUTIBgCk+ivHvuEKwAAAAABJRU5ErkJggg==", "", "imgButton", "formatDoc('removeFormat')"],
    ["Bold", "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=", "", "imgButton", "formatDoc('bold');"],
    ["Italic", "data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==", "", "imgButton", "formatDoc('italic');"],
    ["Underline", "data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7", "", "imgButton", "formatDoc('underline');"],
    ["LeftAlign", "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==", "", "imgButton", "formatDoc('justifyleft');"],
    ["CenterAlign", "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7", "", "imgButton", "formatDoc('justifycenter');"],
    ["RightAlign", "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==", "", "imgButton", "formatDoc('justifyright');"],
    ["NumberList", "data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=", "", "imgButton", "formatDoc('insertorderedlist');"],
    ["BulletList", "data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==", "", "imgButton", "formatDoc('insertunorderedlist');"],
    ["Quote", "data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7", "", "imgButton", "formatDoc('formatblock','blockquote');"],
    ["DeleteIndent", "data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=", "", "imgButton", "formatDoc('outdent');"],
    ["AddIndent", "data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==", "", "imgButton", "formatDoc('indent');"],
    ["Hyperlink", "data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7", "", "imgButton", "var sLnk=prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){formatDoc('createlink',sLnk)}"],
    ["Cut", "data:image/gif;base64,R0lGODlhFgAWAIQSAB1ChBFNsRJTySJYwjljwkxwl19vj1dusYODhl6MnHmOrpqbmpGjuaezxrCztcDCxL/I18rL1P///////////////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAVu4CeOZGmeaKqubDs6TNnEbGNApNG0kbGMi5trwcA9GArXh+FAfBAw5UexUDAQESkRsfhJPwaH4YsEGAAJGisRGAQY7UCC9ZAXBB+74LGCRxIEHwAHdWooDgGJcwpxDisQBQRjIgkDCVlfmZqbmiEAOw==", "", "imgButton", "formatDoc('cut');"],
    ["Copy", "data:image/gif;base64,R0lGODlhFgAWAIQcAB1ChBFNsTRLYyJYwjljwl9vj1iE31iGzF6MnHWX9HOdz5GjuYCl2YKl8ZOt4qezxqK63aK/9KPD+7DI3b/I17LM/MrL1MLY9NHa7OPs++bx/Pv8/f///////////////yH5BAEAAB8ALAAAAAAWABYAAAWG4CeOZGmeaKqubOum1SQ/kPVOW749BeVSus2CgrCxHptLBbOQxCSNCCaF1GUqwQbBd0JGJAyGJJiobE+LnCaDcXAaEoxhQACgNw0FQx9kP+wmaRgYFBQNeAoGihCAJQsCkJAKOhgXEw8BLQYciooHf5o7EA+kC40qBKkAAAGrpy+wsbKzIiEAOw==", "", "imgButton", "formatDoc('copy');"],
    ["Paste", "data:image/gif;base64,R0lGODlhFgAWAIQUAD04KTRLY2tXQF9vj414WZWIbXmOrpqbmpGjudClFaezxsa0cb/I1+3YitHa7PrkIPHvbuPs+/fvrvv8/f///////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAWN4CeOZGmeaKqubGsusPvBSyFJjVDs6nJLB0khR4AkBCmfsCGBQAoCwjF5gwquVykSFbwZE+AwIBV0GhFog2EwIDchjwRiQo9E2Fx4XD5R+B0DDAEnBXBhBhN2DgwDAQFjJYVhCQYRfgoIDGiQJAWTCQMRiwwMfgicnVcAAAMOaK+bLAOrtLUyt7i5uiUhADs=", "", "imgButton", "formatDoc('paste');"]
];
//#endregion GLOBALS

//#region OBJECTS
/******************************************************************************
 * ImageList
 * A collection of ImageItem items with methods to support manipulation.
 *****************************************************************************/
export class ImageList {
    constructor(name, arr) {
        this.name = setOrDefault(name, "image-list");
        this.title = toTitle(this.name);
        this.items = [];
        this.timer = null;
        this.rotator = [];
        this.count = this.items.length;
        this.cursor = -1;
        if (setOrDefault(arr, null) != null) {
            this.addFromArray(arr);
        }
    }

    /************************************************************************
     * The following methods return the ImageItem at the current, first,
     * next, previous or last positions as set by the built-in cursor.
     ***********************************************************************/
    current() {
        return this.items[this.cursor];
    }

    first() {
        this.cursor = 0;
        return this.current();
    }

    next() {
        this.cursor = this.cursor === (this.items.length - 1) ? 0 : this.cursor + 1;
        return this.current();
    }

    previous() {
        this.cursor = this.cursor === 0 ? (this.items.length - 1) : this.cursor - 1;
        return this.current();
    }

    last() {
        this.cursor = this.count - 1;
        return this.current();
    }

    /**************************************************************************
     * Method: add
     * Used to manually add a new ImageItem to the items collection.
     * @param {any} name
     * @param {any} data
     * @param {any} caption
     * @param {any} keywords
     * @param {any} onclick
     *************************************************************************/
    add(name, data, caption, keywords, onclick) {
        caption = setOrDefault(caption, name);
        this.items.push(new ImageItem(name, data, caption, keywords, onclick));
    }

    /**************************************************************************
     * Method: remove
     * Finds the index of the img by its name (imgName) in the items collection
     * and removes it from the collection.
     * @param {any} imgName
     *************************************************************************/
    remove(imgName) {
        let idx = this.items.findIndex(({ name }) => name == imgName);
        this.items.splice(idx, 1);
    }

    setImageWithCaption(obj, list) {
        if (typeof obj == "string") {
            obj = document.querySelector(`#${obj}`);
        }
        list = setOrDefault(list, this);
        if (!obj.hasChildNodes()) {
            let iTag = document.createElement("img");
            let dTag = document.createElement("div");
            iTag.setAttribute("onclick", `${list.name}.toggle()`);
            dTag.setAttribute("class", "caption");
            obj.appendChild(iTag);
            obj.appendChild(dTag);
        }
        let img = obj.querySelector("img");
        let cap = obj.querySelector("div.caption");
        let pic = list.current();
        img.setAttribute("src", pic.src);
        cap.innerHTML = pic.caption;
        list.next();
    }

    addToObject(obj) {
        if (typeof obj == "string") {
            obj = document.querySelector(`#${obj}`);
        }
        this.items.forEach(i => i.addToObject(obj));
    }

    rotate(obj, mSec) {
        if (typeof obj == "string") {
            obj = document.querySelector(`#${obj}`);
        }
        this.rotator.splice(0, this.rotator.length, obj, mSec);
        var f = this.setImageWithCaption;
        this.timer = setInterval(f, mSec, obj, this);
        this.setImageWithCaption(obj);
    }

    toggle() {
        if (this.timer == null) {
            this.resume();
        } else {
            this.stop();
        }
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    resume() {
        if (isNullOrEmpty(this.rotator[0])) {
            console.error("No rotator object has been set.");
            return;
        }
        this.rotate(this.rotator[0], this.rotator[1]);
    }

    filterOn(kwd) {
        let list = this.items.filter(({ keywords }) => keywords.includes(kwd));
        let newArray = [];
        list.forEach(i => newArray.push(`${i.name}, ${i.src.replace("data:", "")}, ${i.caption}, ${i.keywords}, ${i.onclick}`));
        let newList = new ImageList(`${this.name}-${kwd}`, newArray);
        return newList;
    }
    //#region HIDE
    /**************************************************************************
     * Method: addFromArray
     * Parses the provided array and loads its contents to the items collection
     * one at a time.
     * 
     * The provided array must be in one of two formats to be considered legal:
     * 1. A comma-delimited text string array in which the data component must
     *    be the second component of each string:
     *    (["name, data", "name, data"] or 
     *     ["name, data, caption, keywords", "name, data, ..."]).
     *   
     * 2. An array of arrays in which again, the data element must be the 2nd
     *    element of each sub-array:
     *    ([["name", "data"], ["name", "data"]] or 
     *     [["name", "data", "caption", "keywords"], ...]).
     *     
     * The caption and keywords elements are optional. The "caption" element, if
     * not present, will be derived from the Title Case of the "name" element.
     * The "keywords" element will default to empty string ("").
     * @param {any} arr
     *************************************************************************/
    addFromArray(arr) {
        let errorMsg = "Array provided is NOT a legal array.\n";
        errorMsg += "Array must be in the format of 1 or more elements of either ";
        errorMsg += "comma-delimited strings (\"name, data[, caption[, keywords]]\") or 2-3 ";
        errorMsg += "element string arrays (\"name\", \"data\", [\"caption\"[, \"keywords\"]].\n";
        errorMsg += "As indicated by the square brackets, caption and keywords are optional.\n";
        if (!Array.isArray(arr)) { console.error(errorMsg); }

        let workingArray = [];

        if (Array.isArray(arr[0])) {
            // Assume array is already in the correct format and assign it to 
            // the workingArray.
            workingArray = [...arr];
        } else {
            if (!arr[0].includes(",")) { console.error(errorMsg); }

            // Parse a string array into a 2-dimentioal array removing the
            // "data:" from the data element prior to parsing and temporarily
            // modifying the "base64," with "base64;" before splitting.
            arr.forEach(e => {
                let val = e.replace("data:", "").replace("base64,", "base64;");
                let subArray = val.split(",");
                workingArray.push(subArray);
            });
        }
        // Build from the 2-dimentional workingArray
        workingArray.forEach(e => {
            let eLen = e.length;
            let name = e[0].trim();
            // Put the "base64;" text back to its original state: "base64,".
            let data = e[1].trim().replace("base64;", "base64,");
            // if the array is of length 2 or more, get the next one
            // otherwise, use the "name" value for caption.
            let caption = ((eLen > 2) ? e[2].trim() : name);
            let keywords = ((eLen > 3) ? e[3].trim() : "");
            let onclick = ((eLen > 4) ? e[4].trim() : "");
            this.items.push(new ImageItem(name, data, caption, keywords, onclick));
        });
    }

    /**************************************************************************
     * Method: sort
     * Sorts the items collection in ascending order unless the asc value is
     * set to false, in which case returns the items in descending order.
     * @param {any} asc
     *************************************************************************/
    sort(asc) {
        if (asc == null || asc == undefined || asc == true) {
            this.items.sort();
        } else {
            this.items.reverse();
        }
    }

    /**************************************************************************
     * Method: report
     * Outputs the items collection in a simple text-base report.
     *************************************************************************/
    report(objId, style, calcWidths) {
        let cols = [
            ["Name", 20],
            ["Caption", 20],
            ["Data Type", 22],
            ["Data Source", 80],
            ["Keywords", 40],
            ["OnClick", 40]
        ]
        let rpt = new Report(this.name, cols, this.toArray(), objId, style);
        if (!isNullOrEmpty(calcWidths)) { rpt.calculateWidths = calcWidths; }
        return rpt.report();
    }

    /**************************************************************************
     * Method: toXml
     * Outputs the items collection in a simple xml layout.
     *************************************************************************/
    toXml() {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
        xml += `<root>\n\t<imageList name="${this.name}">`;
        this.items.forEach(i => xml += `${i.toXml()}`);
        xml += "\n\t</imageList>\n</root>\n";
        return xml;
    }

    toArray() {
        let arr = [];
        this.items.forEach(i => arr.push(i.toArray()));
        return arr;
    }

    /**************************************************************************
     * Method: list
     * Outputs the items collection in a simple text-based list.
     *************************************************************************/
    list() {
        let str = `${this.name.toUpperCase()}\n`;
        this.items.forEach(i => str += `${i.list()}\n`);
        return str;
    }

    /**************************************************************************
     * Method: setSource
     * Sets the src= attribute of the provided img object with the src value
     * of the ImageItem found in the items collection by its name according
     * to the provided id. If the id parameter is not provided, looks at the id 
     * of the provided img and attempts to find the ImageItem by that.
     * @param {any} img
     * @param {any} id
     *************************************************************************/
    setSource(img, id) {
        id = setOrDefault(id, img.id);
        let src = this.items.find(({ name }) => name == id).src;
        img.setAttribute("src", src);
    }
    //#endregion HIDE
}

/******************************************************************************
 * ImageItem
 * An object representing an image with support for manipulation.
 *****************************************************************************/
export class ImageItem {
    constructor(name, data, caption, keywords, onclick) {
        let isUrl = !data.includes("base64");
        this.name = name;
        this.caption = toTitle(setOrDefault(caption, name));
        this.keywords = setOrDefault(keywords, "");
        this.onclick = setOrDefault(onclick, "");
        this.isBase64 = !isUrl
        this.dataType = isUrl ? "URL" : data.substr(0, data.indexOf(","))
        this.src = isUrl || data.includes("data:") ? data : `data:${data}`;
    }

    addToObject(obj) {
        if (typeof obj == "string") {
            obj = document.querySelector(`#${obj}`);
        }
        let img = document.createElement("img");
        img.id = this.name;
        img.setAttribute("alt", this.caption);
        img.setAttribute("title", this.caption);
        if (!isNullOrEmpty(this.keywords)) {
            img.setAttribute("class", `${this.keywords}`);
        }
        if (!isNullOrEmpty(this.onclick)) {
            img.setAttribute("onclick", `${this.onclick}`);
            img.style.cursor = "pointer";
        }
        img.setAttribute("src", this.src);
        obj.appendChild(img);
    }

    /**************************************************************************
     * Method: list
     * Outputs the item's properties in a simple string.
     *************************************************************************/
    list() {
        let lst = `name: "${this.name}", caption: "${this.caption}", `;
        lst += `keywords: "${this.keywords}", dataType: "${this.dataType}", `;
        lst += `onclick: "${this.onclick}", src: "${this.src}"`;
        return lst;
    }

    toArray() {
        return [this.name, this.caption, this.dataType, this.src, this.keywords, this.onclick];
    }
    /**************************************************************************
     * Method: toXml
     * Outputs the item's properties in a simple xml string.
     *************************************************************************/
    toXml() {
        return `
            <image>
                <name>${this.name}</name>
                <caption>${this.caption}</caption>
                <keywords>${this.keywords}</keywords>
                <dataType>${this.dataType}</dataType>
                <onclick>${this.onclick}"</src>
                <src>${this.src}"</src>
            </image>`;
    }
}
//#endregion OBJECTS

/******************************************************************************
 * Initiallizes the toolButtons object from the toolImages array for ready use.
 * 
 * To setup and use:
 * 1. Create a list of <img> objects in the page with id's that correspond to
 *    the first parameter of the toolImages listed in GLOBALS and a common
 *    class name.
 *    (ex. <img id="Bold" class="imgButton" onclick=.../>)
 *    
 * 2. Add the following lines of code at the base or in the onload method of 
 *    the page.
 *    
 *    <script type="text/javascript">
 *        let imgButtons = document.querySelectorAll("[class*='imgButton']");
 *        imgButtons.forEach(btn => toolButtons.setSource(btn));
 *    </script>
 *    
 * 3. Add the necessary onclick methods to perform each image button's task.
 *****************************************************************************/
export let toolButtons = new ImageList("tool-buttons", toolImages);
