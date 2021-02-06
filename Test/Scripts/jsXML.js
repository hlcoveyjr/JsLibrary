/*****************************************************************************
jsXML                                          author:    Harvey L. Covey, Jr.
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
*******************************************************************************/
//browser detection
var isIECompatible	= navigator.userAgent.toLowerCase().indexOf("msie")  > -1;
var isMozCompatible	= document.implementation && document.implementation.createDocument;

if (isMozCompatible) {
	//add the loadXML() method to the Document class
	Document.prototype.loadXML = function(strXML) {
		var domParser = new DOMParser();
		var objDoc = domParser.parseFromString(strXML, "text/xml");
		
		while (this.hasChildNodes()) {
			this.removeChild(this.lastChild);
		    if (this.childNodes.length == 0) break;
		}
	        
		for (var i=0; i < objDoc.childNodes.length; i++) {
			var newNode = this.importNode(objDoc.childNodes[i], true);
			this.appendChild(newNode);
		}
        jsXML.handleOnLoad(this);
	}
	    
	//add the getter for the .xml attribute
	Node.prototype.xml = function () {
		return (new XMLSerializer).serializeToString(this);
	}
	
    Document.prototype.parseError = 0;
}

//-----------------------------------------------------------------
// Factory jsXML
//-----------------------------------------------------------------
function jsXML() {}

jsXML.getMSXMLDom = function () {
	var ARR_ACTIVEX = [ "Msxml2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", 
						"MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XmlDom"];
	var objXML = null;
	for (var i=0, limit = ARR_ACTIVEX.length; i < limit; i++) {
		try {
			objXML = new ActiveXObject(ARR_ACTIVEX[i]);
			break; // if it got this far, it didn't create an exception
		} catch (objException) {}
	}
	return objXML;
}

jsXML.createDOMDocument = function (strNamespaceURI, strRootTagName) {
	var objDOM = null;
	if (isIECompatible) {
		//create the DOM Document the IE way
		objDOM = jsXML.getMSXMLDom(); //new ActiveXObject(STR_ACTIVEX);
		if (!objDOM) return !!alert("No DOM Document found on your computer.");

		//if there is a root tag name, we need to preload the DOM
		if (strRootTagName) {
			//If there is both a namespace and root tag name, then
			//create an artifical namespace reference and load the XML.  
			if (strNamespaceURI) {
				objDOM.loadXML("<a0:" + strRootTagName + " xmlns:a0=\"" + strNamespaceURI + "\" />");
			} else {
				objDOM.loadXML("<" + strRootTagName + "/>");        
			}
		}
	} else {
		//create the DOM Document the standards way
		objDOM = document.implementation.createDocument(strNamespaceURI, strRootTagName, null);    
        //add the event listener for the load event
        objDOM.addEventListener("load", jsXML.handleOnLoad, false);
	}        
	return objDOM;
}

jsXML.handleOnLoad = function (doc) {
    if (!doc.documentElement || doc.documentElement.tagName == "parsererror")
        doc.parseError = -9999999;
}

// Node type constants.
var NODE_ELEMENT				= 1;
var NODE_ATTRIBUTE				= 2;
var NODE_TEXT					= 3;
var NODE_CDATA_SECTION			= 4;
var NODE_ENTITY_REFERENCE		= 5;
var NODE_ENTITY					= 6;
var NODE_PROCESSING_INSTRUCTION	= 7;
var NODE_COMMENT				= 8;
var NODE_DOCUMENT				= 9;
var NODE_DOCUMENT_TYPE			= 10;
var NODE_DOCUMENT_FRAGMENT		= 11;
var NODE_NOTATION				= 12;

//----------------------------------------------------------------------------
// Converts an Xml Dom node into a Hash object with attribute 
// or child element names as properties/keys. Note that this is intended to  
// return a single-level data structure such as the attributes of a single element 
// or the text contents of a set of child-less elements in element-centric Xml.
// It provides a level of abstraction so that we can take element-centric
// or attribute-centric input and treat it the same way in our "build" methods. 
//
// Arguments: 
// node -- the Xml Dom node object to pull names and values from.
// hash -- [optional] A "recycled" hash can be provided as a performance optimization
//         when making multiple calls to this function for the same element type.
//         This eliminates the creation of new properties on the object for each call.
//         Note that this does create some opportunity for error, since properties
//         that are not overwritten will not be reset. 
//----------------------------------------------------------------------------
function xmlToHash(node, hash) {
	if (arguments.length < 2 || hash == null)  hash = new Object();
	if (node) {
		if (node.hasChildNodes()) {	// Element-centric
			// Iterate child elements.
			for (var i=0, nodes=node.childNodes, limit=nodes.length; i<limit; i++) {
				var elem = nodes[i];
				if (elem.nodeType == NODE_ELEMENT) {	
					hash[elem.nodeName] = elem.childNodes[0].nodeValue;
				} else {
					hash[elem.nodeName] = elem.nodeValue;
				}
			}
		} else { // Attribute-centric
			var nodeMap = node.attributes;
			for (i=0, limit=nodeMap.length; i<limit; i++) {
				var attr = nodeMap[i];
				hash[attr.name] = attr.value;
			}
		}
	}
	return hash;
}


function scrubXmlString(str) {
	return str.replace(/\&(?!amp)/g, "&amp;")  // replace "&" with "&amp;"
		      .replace(/>\s+<(?!\/)/g, "><");  // remove whitespace between elements.
};
