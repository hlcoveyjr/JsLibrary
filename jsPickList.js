/*****************************************************************************
jsPickList                                     authors: Harvey L. Covey, Jr.
                                                          Edwin E. Butler, III
                                                   email:  hlcoveyjr@yahoo.com
                                             last update:           06/09/2004
													
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
document.writeln('<script src="/scripts/jsObject.js"></script>');
/*****************************************************************************
OBJECTS:
jsPickList(id)                                                  Primary Object
*****************************************************************************/
function jsPickList (id) {
	// identities
	this.inheritsFrom(new jsObject(id || "jsPickList"));
	this.name				= this.id;
	
	// collections
	this.options			= new Array();
	
	// properties
	this.listsize			= 8;
	this.style				= "width:200px;";
	this.cssClass			= "";
	
	// switches
	this.isStandAlone		= false;
	
	// assignments
	this.template  = '<form><table border=1 cellpadding=3 cellspacing=0>';
	this.template += '<tr><td><select name="FromList" multiple size=#listsize##style##css# ondblclick="#ID#.pushOver(this, this.form.ToList, true)">#fromList#</select></td>';
	this.template += '<td><input type="Button" name="addOptionsButton" value="--->" onclick="#ID#.pushOver(this.form.FromList, this.form.ToList, true)"><br>';
	this.template += '<input type="Button" name="removeOptionsButton" value="<---" onclick="#ID#.pushOver(this.form.ToList, this.form.FromList)"><br></td>';
	this.template += '<td><select name="ToList" multiple size=#listsize##style##css# ondblclick="#ID#.pushOver(this, this.form.FromList)">#toList#</select></td>';
	this.template += '</tr></table></form>';

	this.buildLists = function () {
		var selected = true;
		return this.template.replace(/#fromList#/ig,		this.buildOptions(!selected))
							.replace(/#toList#/ig,			this.buildOptions(selected))
							.replace(/#listsize#/ig,		this.listsize)
							.replace(/#style#/ig,  			(this.style ? " style=\"" + this.style + "\"" : ""))
							.replace(/#css#/ig,  			(this.cssClass ? " class=\"" + this.cssClass + "\"" : ""))
							.replace(/(<form>|<\/form>)/ig,	(this.isStandAlone ? "$1" : ""));
	}

	this.buildOptions = function (selected) {
		var returnList = new Array();
		for (var i=0; i<this.options.length; i++) {
			if (this.options[i].selected == selected) {
				returnList[i] = this.options[i].toHTML();
			}
		}
		return returnList.join("\n");
	}

	this.addOption = function (text, value, selected) {
		if (!text || text == null)   return !!alert("A required parameter is missing!");
		var opt = new ListOption(text, value || text, selected || false);
		//this.options[this.options.length] = opt;
		this.options[text] = opt;
		return opt;
	}

	this.load = function (allOptions, selectedOptions) {
		if (!allOptions || allOptions == null)   return !!alert("A required parameter is missing!");
		if (!selectedOptions || selectedOptions == null) selectedOptions = new Array();

		for (var i=0; i<allOptions.length; i++) {
			this.options[i] = this.addOption(allOptions[i][1], allOptions[i][0], selectedOptions[allOptions[i][1]]);
		}
		this.content = this.buildLists();
	}

	this.pushOver = function (fromList, toList, selecting) {
		var isSelecting = selecting || false;
		var selectedItems = new Array();
		for (var i = 0; i < fromList.length; i++) {
			if (fromList.options[i].selected == true) {
				this.options[fromList.options[i].text].selected = isSelecting;
				toList.options[toList.length] = new Option(fromList.options[i].text, fromList.options[i].value, false);
			}
		}
		var len = (fromList.length - 1);
		for (var i = len; i >= 0; i--) {
			if (fromList.options[i].selected == true) {
				fromList.options[i] = null;
			}
		}
		this.onSelect();
	}

	this.getSelected = function () {
		var selectedItems = new Array();
		for (var i=0, limit=this.options.length; i<limit; i++) {
			if (this.options[i].selected == true)
				selectedItems[selectedItems.length] = new Option(this.options[i].text, this.options[i].value);
		}
		return selectedItems;
	}

	this.getKeys = function () {
		var keys = new Array();
		for (var i=0, limit=this.options.length; i<limit; i++) {
			if (this.options[i].selected == true)
				keys[keys.length] = this.options[i].text;
		}
		return keys;
	}

	this.getValues = function () {
		var values = new Array();
		for (var i=0, limit=this.options.length; i<limit; i++) {
			if (this.options[i].selected == true)
				values[values.length] = this.options[i].value;
		}
		return values;
	}

	this.onSelect = function () {} // public overloadable method
}

/******************************************************************************
This object is required only for the initial creation of the (parent) object.
This is necessary because MSIE cannot prototype the Option object so in order
to add a method called toHTML(), it became necessary to re-create the Option
object, or at least the parts that are important for our main object to exist.
******************************************************************************/
function ListOption (text, value, selectedState) {
	this.text		= text;
	this.value		= value || this.text;
	this.selected	= selectedState || false;
	
	this.template	= "<option #value##selected##css#>#text#</option>";
	
	this.toHTML		= function (css) {
		this.css	= css ? ((css.indexOf(":") >= 0) ? "style='" + css + "'" : "class='" + css + "'") : "";
		
		return this.template.replace(/#value#/ig,	(this.value ? " value=\"" + this.value + "\"" : ""))
							.replace(/#selected#/ig,(this.selected ? " selected" : ""))
							.replace(/#text#/ig,	(this.text ? this.text : ""))
							.replace(/#css#/ig,		this.css);
	}
}
