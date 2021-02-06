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
function UseAccessibleHeader (tableName) {
	var table  = document.getElementById(tableName);
	var header = table.rows[0];
	var thead  = table.createTHead();

	var tmpRow = thead.insertRow(0);
	for (i = 0; i < header.cells.length; i++) {
		var newCell = document.createElement("th");
		newCell.appendChild(document.createTextNode(header.cells[i].innerHTML));
		thead.rows[0].appendChild(newCell);
	}
	table.deleteRow(1);
}