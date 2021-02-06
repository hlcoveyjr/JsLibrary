/*****************************************************************************
jsLayout                                author:           Harvey L. Covey, Jr.
                                         email:  harvey.l.covey@wellsfargo.com
                                   last update:                     03/06/2006
													
PURPOSE:
Create an (or use an existing) grid object using javascript that can be 
displayed, moved, customized or hidden using Standards-based Javascript for 
optimal multi-browser support.

DISCLAIMER:
You may use this code for any purpose, commercial or private, without any 
further permission from the author.  You may remove this notice from your final
code if you wish, however it is appreciated by the author if at least his
website and/or email address is kept.  You may NOT re-distribute this code in
any way except through its use.  Meaning, you may include it in your product,
or your website, or any other form  where the code is actually being used.  
You may not put the plain javascript up on your site for download or include 
it in your javascript libraries for download.  If you wish to share this code 
with others, please just point them to the URL instead.  Please DO NOT link 
directly to the author's .js files from your site.  Copy the files to your 
server and use them there.  Finally, use of this code means that you agree 
that the author is in NO WAY responsible for the any damage or data loss do to
the use or mis-use of this free product.
Thank you.

COMPATIBILITY:
If a user has Navigator 4.x or Internet Explorer 4.x, they need to upgrade.
There is no excuse in this world to NOT be on the very latest version of free
browsers!

REQUIREMENTS:
Requires the following support files:
N/A

OBJECTS:
jsLayout(content_id, leftnav_id, rightnav_id)                  Primary Object
*****************************************************************************/
function jsLayout (content_id, nav_id) {
	// identities
	if (!document.objects) document.objects = new Array();
	this.id             = "jsLayout";
	this.ordinal        = document.objects.length;
	this.parent			= this.ownerDocument;
	
	// properties
	this.contentId		= content_id || "";
	this.navId			= nav_id     || "";
	this.width			= "63em";	// At a general font-size of 90%, 63em = 758px
	
	// switches
	this.showCode		= false;
	this.showNavTop		= false;	//true = topnav, false = leftnav
	this.showCurrPage	= false;
	this.showFullScreen	= false;
	this.useNavSelect	= true;
	this.showPlusMinus	= false;	// Use only if you turn off IndentIcons
	this.showArrows		= true;		// Use in place of PlusMinus
	this.showTextMode	= false;
	
	// child elements
	this.header			= new PageHeader(this);
	this.footer			= new PageFooter(this);
	this.currPage		= null;
	this.nav			= null;
	this.content		= null;
	//this.parent			= null;
	this.menu			= null;
	this.icons			= new Array();

	// icons
	this.icons.directory	= this.showTextMode ? "" : "images/";
	this.icons.indent		= this.showTextMode ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"  : "<img src=\"" + this.icons.directory + "tree_indent.gif\"			border=0 alt=\"\" align=\"absmiddle\" />"; //
	this.icons.plus			= this.showTextMode ? "&nbsp;&nbsp;+&nbsp;"             : "<img src=\"" + this.icons.directory + "tree_plus.gif\"			border=0 alt=\"\" align=\"absmiddle\" />"; //
	this.icons.minus		= this.showTextMode ? "&nbsp;&nbsp;-&nbsp;&nbsp;"       : "<img src=\"" + this.icons.directory + "tree_minus.gif\"			border=0 alt=\"\" align=\"absmiddle\" />"; //
	this.icons.arrowDown	= this.showTextMode ? "&nbsp;&nbsp;&nbsp;&#171;"        : "<img src=\"" + this.icons.directory + "arrow_down.gif\"			border=0 alt=\"\" align=\"absmiddle\" />"; //
	this.icons.arrowUp		= this.showTextMode ? "&nbsp;&nbsp;&nbsp;&#187;"        : "<img src=\"" + this.icons.directory + "arrow_out.gif\"			border=0 alt=\"\" align=\"absmiddle\" />"; //

	// methods	
	this.init = function () {
		this.content = this.getContent([this.contentId,"Main","main","content","bodypos","bodyPos"], "contentId");
		this.parent  = this.content.parentNode;
		
		if (this.nav == null) {
			if (this.menu == null) {
				this.nav = this.getContent([this.navId,"menu","leftnav","topnav","tabbar","nav"], "navId");
			} else {
				document.write ("<ul id=\"" + this.navId + "\" class=\"" + this.menu.cssClass + "\">" + this.menu.toHTML() + "</ul>");
				this.nav = document.getElementById(this.navId);
			}
		}
	}
	
	this.display = function () {
		this.build();
		this.resizeContent();
	}
	
	this.getContent = function(in_list, in_id) {
		var id   = in_id   || "";
		var list = in_list || "";

		if ((typeof list) == "string") {
			if (list == "") return null;
			else list = [list];	//if list is a single string object, convert it to an array.
		}

		for (var i=0, limit=list.length; i<limit; i++) {
			var obj = document.getElementById(list[i]);
			if (obj != null) {
				if (id.toLowerCase() == "contentid") this.contentId	= list[i];
				if (id.toLowerCase() == "navid")	 this.navId		= list[i];
				break;
			}
		}
		return obj;
	}
	
	this.build = function () {
		this.init();
		
		this.currPage = (this.showCurrPage == true) ? this.getPageName() : null;
		if (this.currPage) this.header.addBreadCrumb(this.currPage, "");

		var navType = ((this.showNavTop == true) ? "topnav" : "leftnav")
		var matter	= this.createNewElement("div", "matter",  "matter");
		var nav		= this.createNewElement("div",  navType,   navType);
		var content	= this.createNewElement("div", "content");
		var footer	= this.createNewElement("div", "footer",  "footer", this.footer.toHTML());
		var header	= this.createNewElement("div", "header",  "header", this.header.toHTML());
		
		this.parent.appendChild(matter);
		if (this.nav != null) {
			matter.appendChild(nav);
			this.nav.parentNode.removeChild(this.nav);
			nav.appendChild(this.nav);
			nav.onresize = this.resizeContent;
		}
		this.parent.removeChild(this.content);
		matter.appendChild(content);
		content.appendChild(this.content);
		matter.appendChild(footer);
		this.parent.appendChild(header);
		
		if (this.nav == null || (this.showNavTop == true)) {
			content.style.left = 0;
			content.style.width = header.offsetWidth;
		}
		
		if (this.showCode) {
			var codeBlock = this.createNewElement("div", "codeBlock", "", this.parent.innerHTML.replace(/\<\/(\w+)\>/ig, "</$1>\n").replace(/\</ig, "&lt;").replace(/\n/ig, "<br />"));
			this.parent.appendChild(codeBlock);
			codeBlock.style.top = matter.offsetHeight + footer.offsetHeight + header.offsetHeight;
			codeBlock.style.position = "static";
		}
	}

	this.resizeContent = function () {
		var leftnav = document.getElementById(this.navId);
		var content = document.getElementById(this.contentId);
		var matter  = document.getElementById("matter");
		var header  = document.getElementById("header");
		var footer  = document.getElementById("footer");
		
		header.style.width   = this.showFullScreen ? "Auto" : this.width;
		footer.style.width   = this.showFullScreen ? "Auto" : this.width;
		matter.style.width   = this.showFullScreen ? "Auto" : this.width;
		content.style.height = "Auto";

		var lWidth	= parseInt(leftnav ? leftnav.offsetWidth  + 10 : 0);
		var lHeight	= parseInt(leftnav ? leftnav.offsetHeight + 10 : 0);
		var cHeight	= parseInt(content.offsetHeight + 0);
		var hWidth	= parseInt(header.offsetWidth   + 0);
		
		alert("NavWidth: " + lWidth + ", NavHeight: " + lHeight + ", ContentWidth: " + (content.offsetWidth + 0) + ", ContentHeight: " + cHeight + ", HeaderWidth: " + hWidth);

		content.style.height = Math.max(lHeight, cHeight);
		content.style.width  = hWidth - lWidth;
		
		alert("ContentWidth: " + (content.offsetWidth + 0) + ", ContentHeight: " + (content.offsetHeight + 0));
	}
	
	this.createNav = function (id, cssClass, title) {
		this.navId = id || "menu";
		this.menu = new MenuTree(this, id, cssClass, title);
		return this.menu;
	}
	
	this.createNewElement = function (type, id, cssClass, innerHTML) {
		var eType		= type || "div";
		var eId			= id   || eType + document.getElementsByTagName(eType).length;
		var eClass		= cssClass  || "";
		var eInnerHTML  = innerHTML || "";
		
		var elem = document.createElement(eType);
		elem.setAttribute("id", eId);
		if (eClass != "") elem.setAttribute("class", eClass);
		if (eInnerHTML != "") elem.innerHTML = eInnerHTML;
		
		return elem;
	}
	
	this.getPageName = function (str_url) {
		var url  = str_url || window.location.pathname;
		var uri  = url.split(/\?|\#/);
		if (!uri[0] || uri[0] == "") return "";
		
			url  = uri[0].replace(/\\/g, "/");
		var pos  = url.lastIndexOf("/") + 1;
		var end  = url.lastIndexOf(".");
		var page = url.substring(pos, end);
		return page;
	}

	// file this object to its place in the document.objects array
	document.objects[this.ordinal] = this;
	document.objects[this.id] = this;

	// initializations
	this.header.addBreadCrumb("Teamworks", "http://teamworks.homestead.wellsfargo.com/index.asp", "Teamworks", "_blank");
	
	this.header.addLink("Team Member Look-Up", "http://lookup.wellsfargo.com", "Team Member Look-Up", "_blank");
	this.header.addLink("A-Z Site List", "http://teamworks.homestead.wellsfargo.com/az/", "A-Z Site List", "_blank");
	this.header.addLink("Contact Us", this.header.contactUs, "Contact Us");
	
	this.footer.addLink("Vision &amp; Values", "http://www.wellsfargo.com/invest_relations/vision_values/", "Vision &amp; Values", "_blank");
	
}

/************************************************************************************
 Header Object
************************************************************************************/
function PageHeader (parent) {
	// identities
	this.parent = parent;

	// collections
	this.breadCrumbList	= new Array();
	this.linkList		= new Array();
	
	// initializations
	this.logo		= "images/wflogo_52x52.gif"
	this.topImage	= "images/image_header_coach_33x200.jpg"
	this.grayBanner	= "Test Application"
	this.searchURL	= "search.homestead.wellsfargo.com/wfsearch";
	this.contactUs	= "contact.html";
	
	// switches
	this.isVisible	= true;
	this.showSearch = true;
	
	// templates
	this.template	= "<table width='100%' cellpadding=0 cellspacing=0 border=0 id='header_top'>" +
					  "<tr valign='top'>" +
					  "	<td rowspan='2' width=52><img id='logo' src='~logo~' alt=' ' width=52></td>" +
					  "	<td bgcolor='#3266CC' nowrap><img id='top_image' src='~topImage~' alt=' '></td>" +
					  "	<td bgcolor='#3266CC' nowrap align='right' valign='middle'>~searchBlock~</td>" +
					  "</tr>" +
					  "<tr>" +
					  "	<td valign='middle' id='breadcrumb' nowrap>~breadCrumb~</td>" +
					  "	<td valign='middle' id='rightblock' nowrap>~linkList~</td>" +
					  "</tr>" +
					  "</table>" +
					  "<div id='grayBanner'>~grayBanner~</div>";
				
	this.searchBlock= "<form name='wfsearch' method='get' action='http://search.homestead.wellsfargo.com/wfsearch' target='_blank' ID='wfsearch'>" +
					  "<table class='search' cellpadding=0 cellspacing=3 border=0 ID='header_search'>" +
					  "<tr valign='middle'>" +
					  "	<td class='search'><label for='qt'><a href='http://search.homestead.wellsfargo.com/wfsearch'>Search</a></label></td>" +
					  "	<td class='searchcell'>" +
					  "		<input type='text'   id='qt'      name='qt'      value='' size='14' class='searchbox'>" +
					  "		<input type='hidden' ID='Hidden1' name='col'     value='intranet'></td>" +
					  "		<input type='hidden' ID='Hidden2' name='qp'      value='+url:~searchURL~'>" +
					  "		<input type='hidden' ID='Hidden3' name='HomeURL' value='http://tig.homestead.wellsfargo.com/'>" +
					  "	<td><input type='image'  ID='Image1'  name='Search'  src='images/button_red_15x15.gif' alt='Search this site' class='formbutton' border='0'></td>" +
					  "</tr>" +
					  "</table>" +
					  "</form>";
	
	// methods
	this.addBreadCrumb = function (name, url, title, target) {
		this.breadCrumbList[this.breadCrumbList.length] = new Anchor(name, url, title, target);
	}
	
	this.addLink = function (name, url, title, target) {
		this.linkList[this.linkList.length] = new Anchor(name, url, title, target);
	}
	
	this.toHTML	= function () {
		var anchorTemplate = "<a href='~href~' target='~target~' title='~title~'>~name~</a>";
		var bc = "";
		var ll = "";
		
		for (var i=0, limit = this.breadCrumbList.length; i < limit; i++) {
			var crumb = this.breadCrumbList[i];
			bc += i > 0 ? " > " : "";
			bc += crumb.url == "" ? crumb.name : crumb.toHTML();
		}
		
		for (i=0, limit = this.linkList.length; i < limit; i++) {
			var link = this.linkList[i];
			ll += i > 0 ? " | " : "";
			ll += link.url == "" ? link.name : link.toHTML();
		}

		var html = this.template.replace(/~searchBlock~/ig, this.showSearch == true ? this.searchBlock : "&nbsp;")
								.replace(/~searchURL~/ig, this.searchURL)
								.replace(/~logo~/ig, this.logo)
								.replace(/~topImage~/ig, this.topImage)
								.replace(/~breadCrumb~/ig, bc || "&nbsp;")
								.replace(/~linkList~/ig, ll || "&nbsp;")
								.replace(/~grayBanner~/ig, this.grayBanner);

		return	this.isVisible == true ? html : "";
	}
}

/************************************************************************************
 Footer Object
************************************************************************************/
function PageFooter (parent) {
	// identities
	this.parent			= parent;
	this.seperator		= "&nbsp;&nbsp;|&nbsp;&nbsp;";
	this.siteMap		= "sitemap.html";
	this.appVersion		= "1.0";
	var  lastUpd		= new Date(document.lastModified);
	this.lastUpdate		= (lastUpd.getMonth()+1) + "/" + lastUpd.getDate() + "/" + lastUpd.getFullYear();
	this.belowFooter	= "&nbsp;<p>";
	
	// switches
	this.isVisible		= true;
	this.showSiteMap	= true;
	this.showLastUpdate	= true;
	this.showVersion	= false;
	
	// collections
	this.linkList		= new Array();

	// templates
	this.template = "<table width='100%' border='0' cellpadding='6' cellspacing='0'>" +
					"<tr><td align='center'>~linkList~~sitemap~~lastupdate~</td></tr>" + 
					"<tr><td align='center'>~belowFooter~</td></tr>" +
					"</table>";

	// methods
	this.addLink = function (name, url, title, target) {
		this.linkList[this.linkList.length] = new Anchor(name, url, title, target);
	}
	
	this.toHTML	= function () {
		var ll = "";
		
		for (var i=0, limit = this.linkList.length; i < limit; i++) {
			var link = this.linkList[i];
			ll += i > 0 ? this.seperator : "";
			ll += link.url == "" ? link.name : link.toHTML();
		}
		
		var sitemap = this.showSiteMap    == true ? this.seperator + "<a href='" + this.siteMap + "'>Sitemap</a>" : "&nbsp;";
		var lastupd = this.showLastUpdate == true ? this.seperator + "Last Updated " + this.lastUpdate : 
					  this.showVersion    == true ? this.seperator + "Version " + this.appVersion : "&nbsp;";

		var html = this.template.replace(/~linkList~/ig,	ll || "&nbsp;")
								.replace(/~sitemap~/ig,		sitemap)
								.replace(/~lastupdate~/ig,	lastupd)
								.replace(/~belowFooter~/ig,	this.belowFooter);
								
		return	this.isVisible == true ? html : "";
	}
}

/************************************************************************************
 MenuTree Object
************************************************************************************/
function MenuTree (parent, id, cssClass, title) {
	// identities
	this.parent				= parent;
	this.layout				= this.parent;
	this.cssClass			= cssClass || "nav";
	this.level				= 0;
	this.id					= id || "menu";
	this.title				= title || "";
	this.levelCount			= 1;

	// collections
	this.itemList			= new Array();
	this.elements			= new Array();
	
	// switches
	this.isVisible			= true;
	this.currItemSelected	= false;

	// methods
	this.expand = function () {}
	this.collapse = function () {}
	this.select = function () {}
	
	this.addItem = function (name, url, title, target) {
		var item = new MenuTreeNode(this, name, url || "#", title, target);
		this.itemList[this.itemList.length] = item;
		this.elements[name.toString()] = item;
		return item;
	}
	
	this.setLevelCount = function (n) {
		this.levelCount = Math.max(this.levelCount, n);
	}
	
	this.toHTML = function (currPage) {
		var current = currPage || this.parent.currPage || this.parent.getPageName();

		if (!this.currItemSelected) {
			for (var id in this.elements) {
				var item = this.elements[id];
				var iUrl = item.url || "";
				if (this.parent.getPageName(iUrl) == current) {
					if (item.select) item.select();
					break;
				}
			}
			this.currItemSelected = true;
		}
		
		var html  = "";
			html += this.layout.showNavTop ? "" : this.title;
		for (var i=0, limit = this.itemList.length; i < limit; i++) {
			html += this.itemList[i].toHTML();
		}
		return html;
	}

	/**************************************************************************
	Displays or	hides the object as instructed.
	**************************************************************************/
	this.show = function (data) {
		var content = data || this.content;
		var obj     = document.getElementById(this.id);

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
		}
		this.layout.resizeContent();
	}

	/***************************************************************************
	Calls this.show with the 'hide' parameter, which sets visibility of the
	object to 'hidden'.
	***************************************************************************/
	this.hide = function (content) {
		this.show('hide');
		this.layout.resizeContent();
	}
}

/************************************************************************************
 MenuTreeNode Object
************************************************************************************/
function MenuTreeNode (parent, name, url, title, target) {
	// identities
	this.parent	= parent;
	this.layout	= this.parent.layout || this.parent;
	this.level	= parent.level + 1;
	this.menu	= this.parent.menu || this.parent;
	this.name   = name   || "";
	this.url    = url    || "";
	this.title  = title  || "";
	this.target = target || "_self";
	if (this.name  == "") 
		return !!alert("You MUST supply a name!");	

	// collections
	this.itemList = new Array();
	
	// switches
	this.isVisible = true;
	this.isExpanded = false;
	this.hasChildren = function () { return (this.itemList.length > 0); }

	// template
	this.template = "<li~selected~><a href='~url~' title='~title~' target='~target~' onClick='~onclick~'>~indent~~plusminus~~name~~icon~</a></li>";
	
	// methods
	this.addItem = function (name, url, title, target) {
		var item = new MenuTreeNode(this, name, url || "#", title, target);
		this.itemList[this.itemList.length] = item;
		this.menu.elements[name] = item;
		this.menu.setLevelCount(item.level);
		this.url = "#";
		return item;
	}
	
	this.select = function () {
		this.parent.isExpanded = true;
		this.parent.select();
	}

	this.toHTML = function (currPage) {
		var layout = this.layout;
		var icons  = this.layout.icons;
		var currentPage = currPage || layout.currPage || layout.getPageName();
		var page = layout.getPageName(this.url);

		var indent	= "";
		for (var i=0, limit=(this.level-1); i<limit; i++) {
			indent += layout.icons.indent;
		}
		var selected = (page.toLowerCase() == currentPage.toLowerCase());
		var html = this.template.replace(/~selected~/ig,	selected ? " class=\"selected\"" : "")
								.replace(/~url~/ig,			this.url)
								.replace(/~onclick~/ig,		this.hasChildren() ? (this.menu.id + ".elements[\"" + this.name + (this.isExpanded ? "\"].collapse()" : "\"].expand()")) : "")
								.replace(/~title~/ig,		this.title)
								.replace(/~target~/ig,		this.target)
								.replace(/~indent~/ig,		indent)
								.replace(/~plusminus~/ig,	this.hasChildren() ? (layout.showPlusMinus ? (this.isExpanded ? icons.minus : icons.plus) : "") : "")
								.replace(/~name~/ig,		this.name)
								.replace(/~icon~/ig,		this.hasChildren() ? (layout.showArrows ? (this.isExpanded ? icons.arrowDown : icons.arrowUp) : "") : "");
		if (this.hasChildren() && this.isExpanded) {					
			for (i=0, limit = this.itemList.length; i < limit; i++) {
				html += this.itemList[i].toHTML();
			}
		}
		return html;
	}

	this.expand = function () {
		this.isExpanded = this.hasChildren() && true;
		this.menu.show();
	}
	
	this.collapse = function (id, ignoreOnClick) {
		this.isExpanded = this.hasChildren() && false;
		this.menu.show();
	}
	return this;
}

/************************************************************************************
 Anchor Object
************************************************************************************/
function Anchor (name, url, title, target) {
	this.name   = name   || "";
	this.url    = url    || "";
	this.title  = title  || "";
	this.target = target || "";

	if (this.name  == "") 
		return !!alert("You MUST supply a name!");	
		
	this.template = "<a href='~href~' title='~title~' target='~target~'>~name~</a>";
	
	this.toHTML	= function () {
		return this.template.replace(/~name~/,   this.name)
							.replace(/~href~/,   this.url)
							.replace(/~title~/,  this.title)
							.replace(/~target~/, this.target);
	}
	return this;
}
