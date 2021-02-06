/*****************************************************************************
jsDate                                            author: Harvey L. Covey, Jr.
                                                   email:  hlcoveyjr@yahoo.com
                                             last update:           02/14/2006
													
PURPOSE:
Extend the capabilities of the Form Object to include a "viewState" property
and "hasChanged", "ignoreChange" and "getViewState" methods. Also it positions
the cursor onto the first focus-able field in the xForm form. An example of a
use of this script is in an anchor (or link) tag--see Example.

EXAMPLE:
<a href="new_url.html" onClick="return xForm.ignoreChange();">Click here</a>

In the above example, the onClick statement calls the xForm.ignoreChange()
method which ultimately returns a true or false. If a form change has occured,
a confirmation box will display prompting the user to OK (ignore and continue)
or Cancel (return false and halt). By returning the result of this function,
the link will or will not continue depending upon the returned result.

Include this script in a script tag at the base of your page, or include it in
the document head block and comment out the last line (xForm.setup();). Then
call "xForm.setup();" from the onLoad="" method of the BODY tag.

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
*****************************************************************************/
function jsDate () {
	this.dateStr		= arguments[0] || "today";
	this.date			= ((this.dateStr.toLowerCase() == "today" || this.dateStr.toLowerCase() == "now") ? new Date() : new Date(this.dateStr));

	var theDate			= this.date; // localize the date so that it isn't trying to look it up all the time.
	var dayofweek		= new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
	var monthofyear		= new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

	var yr				= theDate.getFullYear();
	this.year			= yr + ((yr > 1999) ? 0 : 100);
	this.yearShort		= this.year.toString().substring(2,4);
	this.month			= theDate.getMonth() + 1;
	this.monthShort		= monthofyear[theDate.getMonth()].substring(0,3);
	this.monthLong		= monthofyear[theDate.getMonth()];
	this.day			= theDate.getDate();
	this.weekday		= theDate.getDay() + 1;
	this.weekdayTiny	= dayofweek[theDate.getDay()].substring(0,1);
	this.weekdayShort	= dayofweek[theDate.getDay()].substring(0,3);
	this.weekdayLong	= dayofweek[theDate.getDay()];
	this.century		= parseInt(this.year.toString().substring(0,2)) + 1;
	var testCentury		= this.century.toString().substring(1,2);
	switch (testCentury) {
		case "1" : this.centuryLong = this.century.toString() + "st"; break;
		case "2" : this.centuryLong = this.century.toString() + "nd"; break;
		case "3" : this.centuryLong = this.century.toString() + "rd"; break;
		default  : this.centuryLong = this.century.toString() + "th"; break;
	}
	this.hour			= theDate.getHours();
	var testHour		= theDate.getHours() % 12;
	this.hourShort		= (testHour == 0) ? 12 : testHour;
	this.minute			= theDate.getMinutes();
	this.second			= theDate.getSeconds();
	this.ampm			= (this.hour < 12) ? "am" : "pm";

	this.refresh		= function (dateStr) {
		var newDate = dateStr || this.dateStr;
		this.constructor(newDate);
	}

	this.format			= function () {
		var formatStr = arguments[0] || "mm/dd/yyyy";
		return formatStr.replace(/yyyy|ccyy/ig, this.year)
						.replace(/yyy|cyy/ig, this.year)
						.replace(/yy/ig, this.yearShort)
						.replace(/y/ig, this.yearShort)
						.replace(/cccc/ig, "\~")
						.replace(/ccc/ig, "\~")
						.replace(/cc/ig, this.century)
						.replace(/c/ig, this.century)
						.replace(/am|pm/g, "p")
						.replace(/AM|PM/g, "P")
						.replace(/mmmm/g, "\!")
						.replace(/mmm/g, "\@")
						.replace(/mm/g, (this.month < 10) ? ("0" + this.month) : this.month)
						.replace(/m/g, this.month)
						.replace(/wwww/ig, "\%")
						.replace(/www/ig, "\#")
						.replace(/ww/ig, "\$")
						.replace(/w/ig, this.weekday)
						.replace(/dd/ig, (this.day < 10) ? ("0" + this.day) : this.day)
						.replace(/d/ig, this.day)
						.replace(/HH/g, (this.hour < 10) ? ("0" + this.hour) : this.hour)
						.replace(/H/g, this.hour)
						.replace(/hh/g, (this.hourShort < 10) ? ("0" + this.hourShort) : this.hourShort)
						.replace(/h/g, this.hourShort)
						.replace(/MM/g, (this.minute < 10) ? ("0" + this.minute) : this.minute)
						.replace(/M/g, this.minute)
						.replace(/nn/ig, (this.minute < 10) ? ("0" + this.minute) : this.minute)
						.replace(/n/ig, this.minute)
						.replace(/ss/ig, (this.second < 10) ? ("0" + this.second) : this.second)
						.replace(/s/ig, this.second)
						.replace(/[ap]/g, this.ampm.toLowerCase())
						.replace(/[AP]/g, this.ampm.toUpperCase())
						.replace(/\~/ig, this.centuryLong)
						.replace(/\!/ig, this.monthLong)
						.replace(/\@/ig, this.monthShort)
						.replace(/\%/ig, this.weekdayLong)
						.replace(/\$/ig, this.weekdayTiny)
						.replace(/\#/ig, this.weekdayShort);
	}
}
