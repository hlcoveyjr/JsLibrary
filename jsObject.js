/*****************************************************************************
jsObject                                       author:    Harvey L. Covey, Jr.
                                                email:  hlcoveyjr@netscape.net
                                          last update:              11/02/2005
													
PURPOSE:
Create an (or use an existing) object using javascript that can be displayed,
moved, customized or hidden using Standards-based Javascript for optimal
multi-browser support.

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
browser! If, however they are using AOL, Opera, WebTV, Mozilla or something else
we should be able to support them with this script.

FUNCTIONS:
jsObject(id, content)				Primary Object
jsObject.show(content)				Shows the object
jsObject.hide()						Hides the object
jsObject.toggle()					Toggles the object
jsObject.getObject()				Gets or Creates the object's placeholder
jsObject.showProperties()			Returns the object's Properties not listed
									in the privateProperties comma-delim string
jsObject.toHTML(content)			Overridable method to manage the object's
									innerHTML content
jsObject.onShow(content)			Overloadable method called from this.show()
jsObject.onHide(content)			Overloadable method called from this.hide()

Object.inheritsFrom()				Extends Object to allow inheritance
Object.addProperty()				Extends Object to use get/set logic
Object.onpropertychange()			Extends Object test property change event
*******************************************************************************/
function jsObject(id, content) {
	// initialize the document.objects array if it doesn't already exist
	if (!document.objects) document.objects = new Array();
	this.ordinal        = document.objects.length;
	this.id             = id || "jsObject" + this.ordinal;
	this.content        = content || "";
	this.phObj			= (document.getElementById) ? document.getElementById(this.id) :
						  (document.all)            ? document.all[this.id] : null;

	// switches
	this.isVisible		= false;
	
	// properties
	this.top				= null;
	this.left				= null;
	this.cssClass			= null;
	this.displayStyle		= null;
	this.privateProperties	= "privateProperties, showProperties, getObject, getType, inheritsFrom, "
							+ "addProperty, onpropertychange, toXML, __onShow, __onHide, ";
	// methods
	this.__onShow			= function (content) {
		var layout = document.objects["jsLayout"];
		if (layout) layout.resizeContent();
		this.onShow(content);
	}
	this.__onHide			= function (content) {
		var layout = document.objects["jsLayout"];
		if (layout) layout.resizeContent();
		this.onHide(content);
	}
	this.onShow				= function (content) {} // public  overloadable method
	this.onHide				= function (content) {} // public  overloadable method

	/**************************************************************************
	Displays or	hides the object as instructed.
	**************************************************************************/
	this.show = function (data) {
		var content = data || this.content;
		var obj     = this.getObject();

		// remember the display style if one has been provided.
		if (this.displayStyle == null) this.displayStyle = obj.style.display;

		// if the object meets Standards-based coding methods continue.
		if (content == 'hide') {
			// hide the object
			this.isVisible = false;
			obj.style.visibility = "hidden";
			obj.style.display = "none";
		} else {
			// write the contents of 'innerHTML' out to the object
			// after processing special variables
			obj.innerHTML = this.toHTML(content);
			
			// show the object
			this.isVisible = true;
			obj.style.visibility = "visible";
			obj.style.display = this.displayStyle || "";

			if (this.left != null) {
				// if the position is NOT absolute, the box won't move (properly) so make it absolute
				if (obj.style.position != "absolute") obj.style.position = "absolute";
				obj.style.left = this.left;
			}
			if (this.top != null) {
				// if the position is NOT absolute, the box won't move (properly) so make it absolute
				if (obj.style.position != "absolute") obj.style.position = "absolute";
				obj.style.top = this.top;
			}

			this.__onShow(content);
		}
	}

	/***************************************************************************
	Returns the objects placeholder, if it exists or creates it if it doesn't
	***************************************************************************/
	this.getObject = function () {
		if (this.phObj) return this.phObj;
		// id is an internal property so let's make sure it stays that way!
		if (this.id !=	document.objects[this.ordinal].id)	
			this.id  =	document.objects[this.ordinal].id;
		// get the object's placeholder, if it exists
		var obj = (document.getElementById) ? document.getElementById(this.id) :
				  (document.all)            ? document.all[this.id] : null;
		// if it doesn't exist, create the placeholder
		if (!obj) {
			obj = document.createElement("div");
			obj.setAttribute("id", this.id);
			if (this.cssClass) obj.setAttribute("class", this.cssClass);
			//document.write(obj.outerHTML);
		}
		// set the global obj to the object placeholder for early-out next time
		this.phObj = obj;
		return obj;
	}

	/***************************************************************************
	Processes the content replacing template widgets with variable data
	***************************************************************************/
	this.toHTML = function (content) {
		if (!content || content == "") return "";
		var s = (!content[0] || (content[0].length > 1)) ? content.toString() : content;
		return s.replace(/#ID#/ig, this.id)
				.replace(/#ME#/ig,   "document.objects["+this.ordinal+"]")
				.replace(/#SELF#/ig, "document.objects[\""+this.id+"\"]");
	}

	/***************************************************************************
	Calls this.show with the 'hide' parameter, which sets visibility of the
	object to 'hidden'.
	***************************************************************************/
	this.hide = function (content) {
		this.show('hide');
		this.__onHide(content);
	}

	/**************************************************************************
	Toggles the .hide and .show display methods of the object.
	**************************************************************************/
	this.toggle = function (content) {
		if (this.isVisible) this.hide(content);
		else this.show(content);
	}

	/***************************************************************************
	Displays the properties and public methods of the attached object
	***************************************************************************/
	this.showProperties = function () {
		var result = "";
		for (var i in this) {
			// don't display the private non-changeable properties/methods
			if (this.privateProperties.indexOf(i) < 0) {
				result += this.name + "." + i + " = " + this[i] + "\n";
			}
		}
		return result;
	}

	// file this object to its place in the document.objects array
	document.objects[this.ordinal] = this;
	document.objects[this.id] = this;
	return this;
}

/*****************************************************************************
JavaScript Object extensions
    inheritsFrom() - Allows inheritance from any of 1 or more parent objects.
                     Implementation is as follows:
                
                     function ClassA () {}
                     function ClassB() {
                     	this.extends(new ClassA());
                     }
*****************************************************************************/
Object.prototype.inheritsFrom = function (obj) {
	var parent = (typeof(obj) == 'string') ? eval('new ' + obj + '()') : obj;
	for (child in parent) {
		this[child] = parent[child];
	}
	// no sense in continuing to carry around this no-longer-used object.
	delete(parent);
}

/*****************************************************************************
    addProperty() - Allows for properties to be added with getter/setter
                    methods, and typed to ensure well-formedness.
*****************************************************************************/
Object.prototype.addProperty = function (sType, sName, vValue, bReadOnly) {
	if (typeof vValue != sType) {
		alert("Property " + sName + " must be of type " + sType + ".");
		return;
	}

	this[sName] = vValue;

	var sFuncName = sName.charAt(0).toUpperCase() + sName.substring(1, sName.length);

	this["get" + sFuncName] = function () { return this[sName] };
	this["set" + sFuncName] = function (vNewValue) {
		if (typeof vNewValue != sType) {
			alert("Property " + sName + " must be of type " + sType + ".");
			return;
		}

		var vOldValue = this["get" + sFuncName]();
		var oEvent = {  
			propertyName: sName,  
			propertyOldValue: vOldValue,  
			propertyNewValue: vNewValue,  
			returnValue: !bReadOnly
		};
		this.onpropertychange(oEvent);
		if (oEvent.returnValue) {
			this[sName] = oEvent.propertyNewValue;
		}
	};
}

/*****************************************************************************
    Default onpropertychange() method – does nothing
*****************************************************************************/
Object.prototype.onpropertychange = function (oEvent) {}

/*****************************************************************************
    Array to XML conversion Utility
*****************************************************************************/
Array.prototype.toXML = function (hasTitlesInFirstRecord) {
	var xml = '<?xml version="1.0"?><root><columns></columns><rows></rows></root>';
	var columns = new Array();	
	for (var c=0, limit=this[0].length; c < limit; c++) {
		var colName = hasTitlesInFirstRecord ? this[0][c] : "Field"  + c;
		var colHead = hasTitlesInFirstRecord ? this[0][c] : "Field " + c;
		columns[c] = colName;
		xml = xml.replace(/<\/columns>/, "<column name=\"" + colName + "\" header=\"" + colHead + "\" \/><\/columns>");
	}
	var firstDataRecord = hasTitlesInFirstRecord ? 1 : 0;
	for (var r=firstDataRecord, rlimit=this.length; r < rlimit; r++) {
		var attributes = "";
		for (c=0, climit=this[r].length; c < climit; c++) {
			attributes += columns[c] + "=\"" + this[r][c] + "\" ";
		}
		xml = xml.replace(/<\/rows>/, "<row " + attributes + "\/><\/rows>");
	}
	return xml;
}

/*****************************************************************************
    String to XML conversion Utility
*****************************************************************************/
String.prototype.toArray = function (rowDelim, colDelim, qualifier) {
	var rd = rowDelim  || "~";
	var cd = colDelim  || "\|";
	var q  = qualifier || "";
	if (q != "") var re = new RegExp("\^\\" + q + "\|\\" + q + "\$", "ig");
	
	var rowArray = this.split(rd);
	var rowCount = rowArray.length;
	var strArray = new Array(rowCount);
	
	for (var i=0; i < rowCount; i++) {
		strArray[i] = rowArray[i].split(cd);
		if (q != "") {
			for (var j=0, limit = strArray[i].length; j < limit; j++) {
				strArray[i][j] = strArray[i][j].replace(re, "");
			}
		}
	}
	return strArray;
}
