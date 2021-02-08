<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Test.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript">
        const images = [
            ["franken-grizzley", "./Images/Franken-Grizzly.jpg", "", "pics camp"],
            ["HauntingSeason", "./Images/HauntingSeason.png", "", "pics book"],
            ["MarleyAtHome", "./Images/MarleyAtHome.jpg", "", "pics camp"],
            ["Me-at-Kickoff", "./Images/Me at Kickoff.png", "", "pics camp"],
            ["SparrowsFlight", "./Images/SparrowsFlight.jpg", "", "pics book"],
            ["SpectrumVol-1", "./Images/SpectrumVol1.jpg", "", "pics book"]
        ];
    </script>
    <style type="text/css">
        #pictureBox {
            display: block;
            max-width: 300px;
        }
        #pictureBox img {
            height: 200px;
        }
        #pictureBox .caption {
            font-family: 'Comic Sans MS';
            font-size: medium;
            text-align: center;
        }

        #pre-tool-buttons {
            font-size: 8pt;
        }

        table {
            table-layout: auto;
            font: normal 8pt Tahoma, Arial;
            width: 50%;
        }
        table caption {
            margin:0;
            padding:0;
            font-weight: bold;
            background-color:darkred;
            color: white;
            text-align:left;
        }
        td, th {
            border: solid 1px lightgray;
            margin:0;
            padding:2;
            word-wrap: break-word;
            vertical-align: top;
        }
        th{
            text-align:left;
            background-color:lightgray;
            border: solid 1px #999999;
            font-weight: bold;
        }

        .grid {
            display: table;
            margin:0;
            padding:0;
            table-layout: fixed;
            width: 100%;
            font: normal 8pt Tahoma, Arial;
            border-collapse: collapse;
        }
        .grid .caption {
            display: table-caption;
            margin:0;
            padding:2px;
            font-weight: bold;
            background-color:darkslategray;
            color: white;
        }
        .row, .header {
            display: table-row;
            margin:0;
            padding:0;
        }
        .row div, .header div {
            display: table-cell;
            margin:0;
            padding:2px;
            border: solid 1px lightgray;
            vertical-align: top;
        }
        .header div {
            background-color:lightgray;
            border: solid 1px gray;
            font-weight: bold;
        }
        .col-header4, .col-record4 {
            word-wrap: break-word;
            width: 50em;
        }
        .col-header6, .col-record6 {
            word-wrap: break-word;
            width: 20em;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div id="pictureBox"></div><br />
        <div id="toolbar"></div><br />
        <div id="rpt" style="display:block;max-width:80em;"></div>
    </form>
    <script type="module">
        import { ImageList, toolButtons } from './jsLibrary/jsImage.js';
        import { RptObject } from './jsLibrary/jsReport.js';
        let imgList = new ImageList("imgList", images);
        let box = document.querySelector("#pictureBox");
        imgList.cursor = 2;
        imgList.rotate(box, 3000);
        imgList.filterOn("book").report();
        toolButtons.report("rpt", RptObject.Style.Grid, true);
        //let obj = document.querySelector("#toolbar");
        toolButtons.addToObject("toolbar");
    </script>
</body>
</html>
