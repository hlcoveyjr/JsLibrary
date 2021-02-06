/*****************************************************************************
jsCalendar                                       authors: Harvey L. Covey, Jr.
                                                   email:  hlcoveyjr@yahoo.com
                                             last update:           02/24/2005
													
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
Requires the following library files:
jsObject.js
*****************************************************************************/
//document.writeln('<script src="./jsObject.js"></script>');
/*****************************************************************************
OBJECTS:
jsCalendar(id)                                            Primary Object
*****************************************************************************/
function jsCalendar (id) {
	// identities
	this.inheritsFrom(new jsObject(id || "jsCalendar"));
	this.name				= this.id
	
	// defaults
	this.currDate			= new Date();
	this.currMonth			= this.currDate.getMonth();
	this.currYear			= this.currDate.getFullYear();
	this.currDay			= this.currDate.getDate();

	// collections
	this.daysOfTheWeek		= new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
	this.monthsOfTheYear	= new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	this.selectedDates		= new Array();
	this.months				= new Array();

	// properties
	this.cssClass			= "calendar";
	this.template			= "<table border=0 cellpadding=0 cellspacing=0>"
							+ "<caption>#caption#</caption>"
							+ "<tr><td>#content#</td></tr></table>";
	this.caption			= "";
	this.boundaries			= 0;
	this.gridlines			= 1;
	this.cellSpacing		= this.gridlines;
	this.cellPadding		= 1;
	this.border				= 0;
	
    // switches
	this.showOnlyThisMonth  = true;
	this.showGridlines		= true;
	this.showEmptyWeek		= false;
    this.showHeader			= true;
	this.showYear			= true;
	this.showNav			= true;
	this.showHolidays		= true;
    this.hideOnSelect		= true;
	this.isMultiSelect		= true;
	this.size				= "tiny"; // or "small" or anything else
	this.view				= "month"; // or "quarter" or "year"
	
	// methods
	this.onSelect			= function (dateStr) {} //overload function
	this.onClose			= function (dateStr) {} //overload function

	this.onHide             = function (dateStr) {  //overload function
		this.onClose(dateStr);	// calls the overload function onClose(dateStr)
	}
	
	this.selected			= function () {
		return this.selectedDates;
	}

	this.selectedFull		= function () {
		var numDates = this.selectedDates.length;
		var selected = new Array(numDates);
		for (var i=0; i<numDates; i++) {
			var dt = new Date(this.selectedDates[i]);
			var mo = new Month(this, dt);
			var dy = mo.getDay();
			dy.isCurrDay();
			dy.isHoliday();
			selected[i] = dy.title;
		}
		return selected;
	}

	this.getMonthName		= function (n) {
		var size = this.size.toLowerCase();
		var mo   = this.monthsOfTheYear[n];
		return	((size == "tiny")  ? mo.substring(0,1) :
				((size == "small") ? mo.substring(0,3) : mo));
	}
	
	this.getWeekdayName		= function (n) {
		var size  = this.size.toLowerCase();
		var wkday = this.daysOfTheWeek[n];
		return	((size == "tiny")  ? wkday.substring(0,1) :
				((size == "small") ? wkday.substring(0,3) : wkday));
	}
	
	this.select				= function (dateStr) {
		var wasListed = false;
		for (var i=0; i<this.selectedDates.length; i++) {
			if (this.selectedDates[i] == dateStr) {
				this.selectedDates.splice(i, 1);
				wasListed = true;
			}
		}
		if (!wasListed) { this.selectedDates[this.selectedDates.length] = dateStr; }

		this.onSelect(dateStr);	// calls the override function onSelect(dateStr)

		if (this.hideOnSelect) {
			this.hide(dateStr);
		} else {
			this.show(dateStr);
		}
	}

	this.toHTML  = function (dateStr) {
		var tmpl = this.template;
		var obj  = new Object;
		
		switch (this.view.toLowerCase()) {
			case "month":
				obj = this.addMonth(dateStr);
				break;
			case "quarter":
				obj = this.addQuarter(dateStr);
				break;
			case "year":
				obj = this.addYear(dateStr);
				break;
			default:
				obj.toHTML = function () { alert("Unable to determine view."); }; 
				break;
		}
		
		var html = obj.toHTML();
		return	tmpl.replace(/#content#/ig, html)
					.replace(/#caption#/ig, this.caption)
					.replace(/\<a href='' onclick='' class='calendar'\>\<\/a\>/ig, "&nbsp;")
					.replace(/ class=''/ig, "")
					.replace(/\<caption\>\<\/caption\>/ig, "");
	}
	
	this.getSelectedDate		= function (dateStr) {
		if (dateStr && dateStr.indexOf(",") >= 0) {
			this.selectedDates = dateStr.split(/\s*,\s*/);
			dateStr = this.selectedDates[this.selectedDates.length-1];
		}
		
		var dt = new Date();
		if (!isNaN(Date.parse(dateStr))) dt = new Date(dateStr);

		if (this.hideOnSelect) {
			this.selectedDates = null;
			this.selectedDates = new Array();
		}
		
		return dt;
	}
	
	this.addMonth				= function (dateStr) {
		var month = new Month(this, this.getSelectedDate(dateStr));
		
		var moty = this.monthsOfTheYear;
		var dotw = this.daysOfTheWeek;
		
		var time = month.dateValue.getHours() + ":" + month.dateValue.getMinutes() + ":" + month.dateValue.getSeconds();
		var year = month.dateValue.getFullYear();
		
		var firstDayOfMonth = new Date(month.name + " 1, " + year + " " + time);
		var firstWeekDay = firstDayOfMonth.getDay();
		
		var newMonth = month.id + 1;
		var newYr = year;
		if (newMonth == 12) {
			newMonth = 0;
			newYr++;
		}
		
		var nextMon  = new Date(moty[newMonth] + " 1, " + newYr + " " + time);
		var lastDate = new Date(Date.parse(nextMon)-86400000);
		var lastDay  = lastDate.getDate();
		var prevLastDate = new Date(Date.parse(firstDayOfMonth)-86400000);
		var prevLastDay  = prevLastDate.getDate();
		
		for (var w=0; w < 7; w++) {
			month.addWeekday(dotw[w]);
		}

		var n = 0;
		var	m = month.id;
		var	y = year;
		var lastrow=false;
		
		for( var w=0; w < 6; w++ ) {
			if (!this.showEmptyWeek && (lastrow == true)) { break; }
			month.addWeek();
			
			for( var d=0; d < 7; d++ ) {
				var dow	= month.weekdays[d];
				var wk	= month.weeks[w];
				if ((w==0) && (d < firstWeekDay)) {
					if (this.showOnlyThisMonth) {
						n = 0;
					} else {
						n = prevLastDay - (firstWeekDay - d - 1);
						m = month.id == 0 ? 11 : month.id - 1;
						y = month.id == 0 ? year - 1 : year;
					}
				} else if ((w==0) && (d == firstWeekDay)) {
					n = 1;
					m = month.id;
					y = year;
				} else {
					if ((w > 0) && (n == lastDay)) {
						lastrow = true;
						if (this.showOnlyThisMonth) {
							n = 0;
						} else {
							n=1;
							m = month.id == 11 ? 0 : month.id + 1;
							y = month.id == 11 ? year + 1 : year;
						}
					} else {
						n += (this.showOnlyThisMonth && lastrow) ? 0 : 1;
					}
				}
				
				// clean-up hack
				if (!this.showEmptyWeek && w == 5 && d == 0 && n == 0) {
					month.weeks.splice(5,1);
					break;
				}
				
				var day = new Day(dow, wk, n);
				if (n > 0) {
					day.month       = m+1;
					day.year        = y;
					day.reset();
				}
				wk.days[d]		= day;
				wk.days[dow.id]	= day;
			}
		}
		return month;
	}
	
	this.addQuarter				= function (dateStr) {
		this.showEmptyWeek = true;
		this.showOnlyThisMonth = true;
		var qtr = new Quarter(this, this.getSelectedDate(dateStr));
		for (var i = 1; i < 4; i++) {
			var mon = qtr.firstMonth + i;	// changes the month to base 1 for the dateStr
			qtr.addMonth(mon + "/1/" + qtr.year);
		}
		return qtr;
	}
	
	this.addYear				= function (dateStr) {
		this.showEmptyWeek = true;
		this.showOnlyThisMonth = true;
		var year = new Year(this, this.getSelectedDate(dateStr));
		for (var i = 0; i < 12; i++) {
			var mon = 1 + i;	// changes the month to base 1 for the dateStr
			year.addMonth(mon + "/1/" + year.id);
		}
		return year;
	}

	this.prevYear				= function (dv) {
		this.prevMonth(dv, 12);
	}

	this.nextYear				= function (dv) {
		this.nextMonth(dv, 12);
	}

	this.prevQtr				= function (dv) {
		this.prevMonth(dv, 3);
	}

	this.nextQtr				= function (dv) {
		this.nextMonth(dv, 3);
	}

	this.prevMonth				= function (dv, n) {
		if (!n || n == null) n = 1;
		var dateValue = new Date(dv);
		var m = dateValue.getMonth() - (n == 12 ? 0 : n);
		var y = dateValue.getFullYear() - (n == 12 ? 1 : 0);
		if (m == -1) {
			m = 11;
			y--;
		};
		this.show ((m+1) + "/" + dateValue.getDate() + "/" + y);
	}

	this.nextMonth				= function (dv, n) {
		if (!n || n == null) n = 1;
		var dateValue = new Date(dv);
		var m = dateValue.getMonth() + (n == 12 ? 0 : n);
		var y = dateValue.getFullYear() + (n == 12 ? 1 : 0);
		if (m == 12) {
			m = 0;
			y++;
		};
		this.show ((m+1) + "/" + dateValue.getDate() + "/" + y);
	}

	this.today					= function () {
		var dateValue = new Date();
		var m = dateValue.getMonth();
		var y = dateValue.getFullYear();
		this.show ((m+1) + "/" + dateValue.getDate() + "/" + y);
	}
}

function Year (parent, dt) {
	// identities
	this.parent			= parent;
	this.obj			= parent;
	this.dateValue		= dt;
	this.id				= dt.getFullYear();
	this.name			= this.id.toString();
	
	// collections
	this.months			= new Array();
	
	// properties
	this.template		= "<table name='#name#' border=0 cellpadding=0 cellspacing=0 class='#css#'>"
						+ "<caption class='#css#'>#caption#</caption>#content#</table>";
						
	var id				= this.id + 1; // base 1
	this.today			= "<a href='javascript:" + this.obj.name + ".today()' align='left' title='Today'>&nbsp;T&nbsp;&nbsp;</a>";
	this.leftArrow		= "<a href='javascript:" + this.obj.name + ".prevYear(\"" + this.dateValue + "\")' align='left'  title='" + (this.id - 1) + "'>&nbsp;&#171;&nbsp;&nbsp;</a>";
	this.rightArrow		= "<a href='javascript:" + this.obj.name + ".nextYear(\"" + this.dateValue + "\")' align='right' title='" + (this.id + 1) + "'>&nbsp;&nbsp;&#187;&nbsp;</a>";
	this.close			= "<a href='javascript:" + this.obj.name + ".hide()' align='left' title='Close'>&nbsp;&nbsp;X&nbsp;</a>";
	
	this.caption		= this.name;
	this.boundaries		= this.obj.boundaries;
					
	// switches
    this.showHeader		= this.obj.showHeader;
	this.showNav		= this.obj.showNav;

	// methods
	//------------------------------------------------------------------------
	// Add a Month to the Quarter
	//------------------------------------------------------------------------
	this.addMonth = function (dateStr) {
		var mo = this.obj.addMonth(dateStr);
		mo.showNav  = false;
		mo.showYear = false;
		mo.width    = "100%";
		this.months[this.months.length] = mo;
		return mo;
	}

	this.toHTML = function () {
		var tmpl = this.template;
		var html = "<tr valign='top'>";
		var n = 0;
		for( var m=0; m < 12; m++ ) {
			if (n == 4) {
				n = 0;
				html += "</tr><tr valign='top'>";
			}
			html += "<td>" + this.months[m].toHTML() + "</td>";
			n++;
		}
		html += "</tr>";
		
		if (this.showHeader) {
			this.caption = (this.showNav ?  this.today      + this.leftArrow      : "")
						 +  this.name    + (this.showYear   ? (" - " + this.year) : "")
						 + (this.showNav ?  this.rightArrow + this.close          : "");
		}
		
		return	tmpl.replace(/#content#/ig, html)
					.replace(/#name#/ig, this.name)
					.replace(/#caption#/ig, this.caption || "")
					.replace(/#css#/ig, this.obj.cssClass || "");
	}
}

function Quarter (parent, dt) {
	// identities
	this.parent			= parent;
	this.obj			= parent;
	this.dateValue		= dt;
	this.id				= parseInt(dt.getMonth()/3); // base 0
	this.year			= dt.getFullYear();
	this.name			= "Q" + (this.id + 1);
	this.firstMonth		= ((this.id * 4) - this.id); // base 0
	
	// collections
	this.months			= new Array();
	
	// properties
	this.template		= "<table name='#name#' border=0 cellpadding=0 cellspacing=0 class='#css#'>"
						+ "<caption class='#css#'>#caption#</caption><tr valign='TOP'>#content#</tr></table>";
						
	var id				= this.id + 1; // base 1
	this.today			= "<a href='javascript:" + this.obj.name + ".today()' align='left' title='Today'>&nbsp;T&nbsp;&nbsp;</a>";
	this.leftArrow		= "<a href='javascript:" + this.obj.name + ".prevQtr(\"" + this.dateValue + "\")' align='left'  title=''>&nbsp;&#171;&nbsp;&nbsp;</a>";
	this.rightArrow		= "<a href='javascript:" + this.obj.name + ".nextQtr(\"" + this.dateValue + "\")' align='right' title=''>&nbsp;&nbsp;&#187;&nbsp;</a>";
	this.close			= "<a href='javascript:" + this.obj.name + ".hide()' align='left' title='Close'>&nbsp;&nbsp;X&nbsp;</a>";
	
	this.caption		= this.obj.caption;
	this.boundaries		= this.obj.boundaries;
					
	// switches
    this.showHeader		= this.obj.showHeader;
	this.showNav		= this.obj.showNav;
	this.showYear		= this.obj.showYear;

	// methods
	//------------------------------------------------------------------------
	// Add a Month to the Quarter
	//------------------------------------------------------------------------
	this.addMonth = function (dateStr) {
		var mo = this.obj.addMonth(dateStr);
		mo.showNav  = false;
		mo.showYear = false;
		mo.width    = "100%";
		this.months[this.months.length] = mo;
		return mo;
	}

	this.toHTML  = function () {
		var tmpl = this.template;
		var html = "";
		
		for( var m=0; m < 3; m++ ) {
			html += "<td>" + this.months[m].toHTML() + "</td>";
		}
		
		if (this.showHeader) {
			this.caption = (this.showNav ?  this.today      + this.leftArrow      : "")
						 +  this.name    + (this.showYear   ? (" - " + this.year) : "")
						 + (this.showNav ?  this.rightArrow + this.close          : "");
		}
		
		return	tmpl.replace(/#content#/ig, html)
					.replace(/#name#/ig, this.name)
					.replace(/#caption#/ig, this.caption || "")
					.replace(/#css#/ig, this.obj.cssClass || "");
	}
}

//============================================================================
// Constructor for the Month object
//
// Parameters are as follows...
// id:		reference to Month object.
// date:	string representation of the date whose month is to be displayed.
// size:	size of the month object.
//
// Defaults set to the text name of the current month for id, the current date
// for date and "" for size.
//----------------------------------------------------------------------------
//function Month (id, obj, top, left) {
function Month (parent, dt) {
	// identities
	this.parent			= parent;
	this.dateValue		= dt;
	this.id				= dt.getMonth();
	this.obj			= this.parent.obj || this.parent;
	this.quarter		= (this.id % 4);
	this.year			= dt.getFullYear();
	this.name			= this.obj.monthsOfTheYear[this.id];
	this.width			= "";
	
	// collections
	this.weekdays		= new Array();
	this.weeks			= new Array();
	
	// properties
	this.template		= "<table name='#name#' border=#border# cellpadding=#cellpadding#"
						+ " cellspacing=#cellspacing# class='#css#'#width#>"
						+ "<caption class='#css#'>#caption#</caption>"
						+ "#header##content#</table>";

	this.today			= "<a href='javascript:" + this.obj.name + ".today()' align='left' title='Today'>T</a>";
	this.leftArrow		= "<a href='javascript:" + this.obj.name + ".prevMonth(\"" + this.dateValue + "\")' align='left'  title='" + this.obj.monthsOfTheYear[(12+this.id-1)%12] + "'>&nbsp;&#171;&nbsp;</a>";
	this.rightArrow		= "<a href='javascript:" + this.obj.name + ".nextMonth(\"" + this.dateValue + "\")' align='right' title='" + this.obj.monthsOfTheYear[(12+this.id+1)%12] + "'>&nbsp;&#187;&nbsp;</a>";
	this.close			= "<a href='javascript:" + this.obj.name + ".hide()' align='left' title='Close'>X</a>";
	
	this.caption		= this.obj.caption;
	this.boundaries		= this.obj.boundaries;
	this.gridlines		= this.obj.gridlines;
	this.cellSpacing	= this.obj.cellSpacing;
	this.cellPadding	= this.obj.cellPadding;
	this.border			= this.obj.border;
					
	// switches
    this.showHeader		= this.obj.showHeader;
	this.showYear		= this.obj.showYear;
	this.showNav		= this.obj.showNav;

	// methods
	//------------------------------------------------------------------------
	// Get the provided Day (dt) from the Month
	//------------------------------------------------------------------------
	this.getDay = function (selected) {
		// Create the objects, but do NOT add them to a collection
		var weekday = new WeekDay(this, this.dateValue.getDay());
		var week	= new Week (this);
		// Now, use the objects to get and return the Day object.
		var day		= new Day(weekday, week, this.dateValue.getDate(), selected);
		return day;
	}

	//------------------------------------------------------------------------
	// Add a WeekDay to the Month
	//------------------------------------------------------------------------
	this.addWeekday = function (id) {
		var weekday = new WeekDay(this, id);
		this.weekdays[this.weekdays.length] = weekday;
		this.weekdays[id] = weekday;
		return weekday;
	}

	//------------------------------------------------------------------------
	// Add a Week to the Month
	//------------------------------------------------------------------------
	this.addWeek = function () {
		var wk = new Week(this);
		this.weeks[this.weeks.length] = wk;
	}

	//------------------------------------------------------------------------
	// Convert the Month to HTML
	//------------------------------------------------------------------------
	this.toHTML   = function () {
		var tmpl  = this.template;
		var html  = "";
		var width = (this.width == "") ? "" : (" width='" + this.width + "'");
		
		for( var w=0; w < this.weeks.length; w++ ) {
			html += this.weeks[w].toHTML();
		}
		/*
		var len = this.weeks.length;
		var stack = new Array(len);
		for( var w=0; w < len; w++ ) {
			stack[w] = this.weeks[w].toHTML();
		}
		html = stack.join("");*/
		
		if (this.showHeader) {
			this.caption = (this.showNav  ? this.today + this.leftArrow : "")
						 + (this.showYear ? this.name.substring(0,3) : this.name)
						 + (this.showYear ? ("-" + this.year) : "")
						 + (this.showNav  ? this.rightArrow + this.close : "");
		}
		
		return	tmpl.replace(/#content#/ig, html)
					.replace(/#name#/ig, this.name)
					.replace(/#border#/ig, this.border || 0)
					.replace(/#cellpadding#/ig, this.cellPadding || 0)
					.replace(/#cellspacing#/ig, this.cellSpacing || 0)
					.replace(/#caption#/ig, this.caption || "")
					.replace(/#header#/ig, this.getWeekdayTitles())
					.replace(/#width#/ig, width)
					.replace(/#css#/ig, this.obj.cssClass || "");
	}
	
	//------------------------------------------------------------------------
	// Get the Weekday Titles
	//------------------------------------------------------------------------
	this.getWeekdayTitles = function () {
		var template = "<tr>#content#</tr>";
		var html     = "";
		for (var i=0; i<7; i++) {
			html += "<th align='center' class='#css#'>" + this.obj.getWeekdayName(i) + "</th>";
		}
		return template.replace(/#content#/ig, html);
	}
}

//============================================================================
// WeekDay object constructor
//
// Parameters are as follows...
// parent:		reference to Month object.
// id:			string to use as id in output.
// headerText:	string to display in column header when rendered as HTML table.
// width:		default width for the weekday (column).
// cssClass:	default CSS class for the weekday (column).
//----------------------------------------------------------------------------
function WeekDay ( month, id ) {
	this.month		= month;
	this.id			= id;
	this.year		= month.year;
	this.obj		= month.obj;
	
	this.template	= "<td align='right' class='#css#'><a href='#href#' onclick='#onclick#' class='"
					+ this.obj.cssClass + "' title='#title#'>#content#</a></td>";
	
}

//============================================================================
// Row object constructor
//
// Parameters are as follows...
// parent:	reference to Month object.
// id:		string to use as id in output.
//----------------------------------------------------------------------------
function Week ( month, id ) {
	this.month		= month;
	this.id			= id;
	this.obj		= month.obj;
	this.year		= month.year;
	
	this.days		= new Array(7);
	this.template	= "<tr>#content#</tr>";
	
	//------------------------------------------------------------------------
	// Add a Day to the Week
	//------------------------------------------------------------------------
	this.addDay		= function ( weekday, value ) {
		var newDay	= new Day(weekday, this, value);
		this.days[weekday.ordinal] = newDay;
		return newDay;
	}

	//------------------------------------------------------------------------
	// Convert the Week to HTML
	//------------------------------------------------------------------------
	this.toHTML = function () {
		var html = "";
		
		for( var d=0; d < this.days.length; d++ ) {
			html += this.days[d].toHTML();
		}
		/*var len = this.days.length;
		var row = new Array(len);
		for( var d=0; d < len; d++ ) {
			row[d] = this.days[d].toHTML();
		}
		html = row.join("");*/

		return this.template.replace(/#content#/ig, html);
	}
}

//============================================================================
// Day object constructor
//
// Parameters are as follows...
// weekday:		reference to weekday object (column).
// week:		reference to week object (row).
// value:		string to display when rendered as HTML table.
// selected:	boolean (true/false) state of the day object.
// href:		
//----------------------------------------------------------------------------
function Day ( weekday, week, value, selected, href ) {
	this.weekday	= weekday;
	this.week		= week;
	this.month		= this.weekday.month.id + 1; // numeric value of month (option base 1)
	this.year		= this.weekday.month.year;	 // numeric value of year gathered from month object
	this.value		= (value < 1) ? "&nbsp;" : value;
	this.obj		= this.weekday.obj;

	this.id			= this.year  + ((this.month < 10) ? "0" : "") + 
					  this.month + ((this.value < 10) ? "0" : "") + this.value;
	this.stdDate	= this.month + "/" + this.value + "/" + this.year;
	this.title		= this.stdDate;
	this.href		= href || "#";
	this.onClick	= this.obj.name + ".select(\"" + this.stdDate + "\")";

	//------------------------------------------------------------------------
	// Reset the basic Day calculations
	//------------------------------------------------------------------------
	this.reset = function () {
		this.id			= this.year  + ((this.month < 10) ? "0" : "") + 
						  this.month + ((this.value < 10) ? "0" : "") + this.value;
		this.stdDate	= this.month + "/" + this.value + "/" + this.year;
		this.title		= this.stdDate;
		this.href		= href || "#";
		this.onClick	= this.obj.name + ".select(\"" + this.stdDate + "\")";
	}

	//------------------------------------------------------------------------
	// Convert the Day to HTML
	//------------------------------------------------------------------------
	this.toHTML = function () {
		var value	= this.value;
		var isEmpty = value == "";
		var css		=   this.obj.cssClass
					+ ( this.isWeekend()      ? " weekend"    : "")
					+ ( this.obj.showHolidays ? (this.isHoliday() ? " holiday" : "") : "")
					+ ( this.isCurrDay()      ? " today"      : "")
					+ ( this.isSelected()     ? " selected"   : "")
					+ (!this.isCurrMonth()    ? " notcurrent" : "");
					   
		return weekday.template.replace(/#content#/ig, 
					  (parseInt(value) < 10) ? "&nbsp;" + value : value)
					  .replace(/#href#/ig,		isEmpty ? "" : this.href)
					  .replace(/#title#/ig,		isEmpty ? "" : this.title)
					  .replace(/#onClick#/ig,	isEmpty ? "" : this.onClick)
					  .replace(/#css#/ig,		isEmpty ? "" : css);
	}
	
	this.isWeekend	= function () {
		return (this.weekday.id == "Saturday" || this.weekday.id == "Sunday");
	}
	
	this.isHoliday	= function () {
		var retVal  = false;
		
		// Exact Day calculations
		if (this.month ==  1 && this.value ==  1) { retVal = true; this.title += " - New Year"; } // New Year
		if (this.month ==  2 && this.value == 14) { retVal = true; this.title += " - Valentine&apos;s Day"; } // Valentine's Day
		if (this.month ==  3 && this.value == 17) { retVal = true; this.title += " - St. Patrick&apos;s Day"; } // St. Patrick's Day
		if (this.month ==  5 && this.value ==  5) { retVal = true; this.title += " - Cinco d&apos;Mayo"; } // Cinco d'mayo
		if (this.month ==  7 && this.value ==  4) { retVal = true; this.title += " - Independence Day"; } // Independence Day
		if (this.month == 10 && this.value == 31) { retVal = true; this.title += " - Halloween (All Soul&apos;s Day)"; } // Halloween (All Soul's Day)
		if (this.month == 11 && this.value ==  1) { retVal = true; this.title += " - All Saint&apos;s Day"; } // All Saint's Day
		if (this.month == 12 && this.value == 25) { retVal = true; this.title += " - Christmas"; } // Christmas
		
		// Nth Week Day of Month calculations
		if (this.month ==  1 && this.value == this.getDayByDOW(1, 3))   { retVal = true; this.title += " - Martin Luther King Day"; } // MLK Day
		if (this.month ==  2 && this.value == this.getDayByDOW(1, 3))   { retVal = true; this.title += " - President&apos;s Day"; } // President's Day
		if (this.month ==  9 && this.value == this.getDayByDOW(1, 1))   { retVal = true; this.title += " - Labor Day"; } // Labor Day
		if (this.month == 10 && this.value == this.getDayByDOW(1, 2))   { retVal = true; this.title += " - Columbus Day"; } // Columbus Day
		if (this.month == 11 && this.value == this.getDayByDOW(1, 1)+1)	{ retVal = true; this.title += " - Election Day"; } // Election Day
		if (this.month == 11 && this.value == this.getDayByDOW(4, 4))   { retVal = true; this.title += " - Thanksgiving"; } // Thanksgiving Day
		
		// Last Week Day of Month calculations
		if (this.month ==  5 && this.value > 24 && this.weekday.id == "Monday") { retVal = true; this.title += " - Memorial Day"; } // Memorial Day
		
		// TODO: Add the following Special days
		// Ash Wednesday
		// Good Friday
		// Easter
		// Orthodox Easter
		// Hanukkah
		// Yom Kippur
		// Ramadan
		// Kwansaa
		// Passover
		
		return retVal;
	}
	
	this.getDayByDOW = function (wkDay, nth) {
		var earliestDay = 1+(7*(nth-1));
		var date		= new Date(this.year, this.month - 1, earliestDay)
		var weekday		= date.getDay();
		var offset		= (wkDay == weekday) ? 0 :
						(wkDay <  weekday) ? wkDay + (7 - weekday) :
						(wkDay  > weekday) ? wkDay + (7 - weekday) - 7 : 0;
		return earliestDay + offset;
	}
	
	this.isCurrDay = function () {
		var bool = this.stdDate == (this.obj.currMonth + 1) + "/" + this.obj.currDay + "/" + this.obj.currYear;
		if (bool == true) this.title += " - Today";
		return bool;
	}
	
	this.isCurrMonth = function () {
		return (this.month == (this.weekday.month.id + 1));
	}
	
	this.isSelected	= function () {
		var retVal  = false;
		for (var i=0; i<this.obj.selectedDates.length; i++) {
			if (this.obj.selectedDates[i] == this.stdDate) {
				retVal = true;
				this.title += " - Selected";
				break;
			}
		}
		return retVal;
	}
}

/*****************************************************************************
Iterate through the arguments assigning their values to strArray
and return the joined strArray.
*****************************************************************************/
function Concat () {
	var strArray = new Array(arguments.length);
	for (var i=0; i<arguments.length; i++) {
		strArray[i] = arguments[i];
	}
	return strArray.join("");
}
