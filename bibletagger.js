if(!org) var org={};
if(!org.bible) org.bible={};
if(!org.bible.NETBibleTagger) org.bible.NETBibleTagger={};

org.bible.NETBibleTagger = {

    element: '',
    max_nodes: 500,
    new_window: true, 
    version: 'net',
    isVisible: false,
    currentPassage: '',
    delayTimer: '', 
    hideTimer: '',
    mouseEvent: '',
    mouseOnDiv: '',
    xPos: 0,
    yPos: 0,
    IE: document.all?true:false,
    IE7: (navigator.appVersion.indexOf("MSIE 7.")==-1) ? false : true,
    isTouch: !!('ontouchstart' in window) || !!('onmsgesturechange' in window),//((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) ? true : false,
    showArticlesLink: false,
    voidOnMouseOut: false,
    mouseOnDiv: false,
    skipRe: '^(script|style|textarea|h1|h2|cite|a)$',
    parseAnchors: false,
    fontSize: 'small',
    customCSS: false,
    translation: 'net' 
};

org.bible.NETBibleTagger.divOnMouseOver = function(){

	org.bible.NETBibleTagger.mouseOnDiv = true;
};

org.bible.NETBibleTagger.divOnMouseOut = function(){
	org.bible.NETBibleTagger.hideTimer = setTimeout('org.bible.NETBibleTagger.handleMouseOutDelay()', 100);
	org.bible.NETBibleTagger.mouseOnDiv = false;
};

org.bible.NETBibleTagger.hideTip = function(){

	var tip = document.getElementById('nbtDiv');
	tip.style.left = "-1000px";
	tip.style.top = "-1000px";

	org.bible.NETBibleTagger.isVisible = false;
	
	clearTimeout(org.bible.NETBibleTagger.hideTimer);
};

org.bible.NETBibleTagger.loaded = function(){

	if ((org.bible.NETBibleTagger.IE) || (!org.bible.NETBibleTagger.IE))
   	{
     	document.getElementById('nbtLoading').style.display = "none";
		document.getElementById('verseTarget').style.display = "block";

		if (org.bible.NETBibleTagger.IE7)
		{
	   		document.getElementById('nbtCloseImage').style.position = "relative";
	   		document.getElementById('nbtCloseImage').style.top = "-13px";
	   		document.getElementById('nbtContent').style.width = document.getElementById('nbtDiv').offsetWidth+"px";
	   		document.getElementById('nbtHeader').style.width = (parseInt(document.getElementById('nbtDiv').offsetWidth)+4)+"px";
	   	}
   	}
   	
};

org.bible.NETBibleTagger.getScripture = function(){

	clearTimeout(org.bible.NETBibleTagger.hideTimer);
		//stop the page jumping to the top
		//e.preventDefault();
		var tip = document.getElementById('nbtDiv');
		var verseTarget = document.getElementById('verseTarget');
		var verseTitle = document.getElementById('nbtVerseTitle');
		var NETHeader = document.getElementById('nbtHeader');
		var loading = document.getElementById('nbtLoading');
		loading.style.display = "block";

		verseTitle.innerHTML = org.bible.NETBibleTagger.currentPassage+ " ("+org.bible.NETBibleTagger.translation.toUpperCase()+")";
	
		tip.style.left=org.bible.NETBibleTagger.xPos+"px";
		tip.style.top=org.bible.NETBibleTagger.yPos+"px";
		tip.style.display="block";
		tip.style.position="absolute";
		tip.style.padding = "0";
		
		verseTarget.innerHTML = '';

		var query = '?passage='+org.bible.NETBibleTagger.currentPassage;
		
		if (org.bible.NETBibleTagger.showArticlesLink == true)
		{
			query += '&showArticlesLink=true';
		}
		
		if (org.bible.NETBibleTagger.fontSize != 'small')
		{
			query += '&fontSize=' + org.bible.NETBibleTagger.fontSize;
		}
		
		query += '&translation='+org.bible.NETBibleTagger.translation;

		var script = document.createElement('script');
		query += '&referer='+window.location;
		
		if (org.bible.drawer)
		{
			query += '&openInDrawerOption=true';
		}
		
		script.setAttribute('src', 'https://labs.bible.org/api/NETBibleTagger/v2/script_get_verse.php' + query);

		// load the script
		document.getElementsByTagName('head')[0].appendChild(script); 

		org.bible.NETBibleTagger.isVisible = true;	
};

org.bible.NETBibleTagger.jsonCallback = function(json){
	
	org.bible.NETBibleTagger.loaded();
document.getElementById('verseTarget').innerHTML = '<div>'+json.content+'</div>';
};

org.bible.NETBibleTagger.getBooks = function(translation) {
	var book = '';
	
	if (translation == 'net')
	{
		books = "Genesis|Gen|Ge|Gn|Exodus|Ex|Exod?|Leviticus|Lev?|Lv|Levit?|Numbers|"+
        "Nu|Nm|Hb|Nmb|Numb?|Deuteronomy|Deut?|De|Dt|Joshua|Josh?|Jsh|Judges|Jdgs?|Judg?|Jd|Ruth|Ru|Rth|"+
        "Samuel|Sam?|Sml|Kings|Kngs?|Kgs|Kin?|Chronicles|Chr?|Chron|Ezra|Ez|"+
        "Nehemiah|Nehem?|Ne|Esther|Esth?|Es|Job|Jb|Psalms?|Psa?|Pss|Psm|Proverbs?|Prov?|Prv|Pr|"+
        "Ecclesiastes|Eccl?|Eccles|Ecc?|Songs?ofSolomon|Song?|So|Songs|Isaiah|Isa|Is|Jeremiah|"+
        "Jer?|Jr|Jerem|Lamentations|Lam|Lament?|Ezekiel|Ezek?|Ezk|Daniel|Dan?|Dn|Hosea|"+
        "Hos?|Joel|Jo|Amos|Am|Obadiah|Obad?|Ob|Jonah|Jon|Jnh|Micah|Mi?c|Nahum|Nah?|"+
        "Habakkuk|Ha?b|Habak|Zephaniah|Ze?ph?|Haggai|Ha?g|Hagg|Zechariah|Zech?|Ze?c|"+
        "Malachi|Malac?|Ma?l|Mat{1,2}hew|Mat?|Matt?|Mt|Mark?|Mrk?|Mk|Luke|Lu?k|Lk|John?|Jhn|Jo|Jn|"+
        "Acts?|Ac|Romans|Rom?|Rm|Corinthians|Cor?|Corin|Galatians|Gal?|Galat|"+
        "Ephesians|Eph|Ephes|Philippians|Phili?|Php|Pp|Colossians|Col?|Colos|"+
        "Thessalonians|Thess?|Th|Timothy|Tim?|Titus|Tts|Tit?|Philemon|Phm?|Philem|Pm|"+
        "Hebrews|Hebr?|James|Jam|Jms?|Jas|Peter|Pete?|Pe|Pt|Jude?|Jd|Ju|Revelations?|Rev?|"+
        "Revel";
	}
	else if (translation == 'vdc')
	{
		books = "Geneza, Exodul|Leviticul|Numeri|Deuteronomul|Iosua|Judecatorii|Rut|1 Samuel|2 Samuel|1 Imparati|2 Imparati|1 Cronici|2 Cronici|Ezra|Neemia|Estera|Iov|Psalmii|Proverbele|Eclesiastul|Cantarea cantarilor|Isaia|Ieremia|Plangerile lui Ieremia|Ezechiel|Daniel|Osea|Ioel|Amos|Obadia|Iona|Mica|Naum|Habacuc|Tefania|Hagai|Zaharia|Maleahi|Matei|Marcu|Luca|Ioan|Faptele apostolilor|Romani|1 Corinteni|2 Corinteni|Galateni|Efeseni|Filipeni|Coloseni|1 Tesaloniceni|2 Tesaloniceni|1 Timotei|2 Timotei|Tit|Filimon|Evrei|Iacov|1 Petru|2 Petru|1 Ioan|2 Ioan|3 Ioan|Iuda|Apocalipsa|"+
 	"Gen|Ex|Exod|Lev|Num|Deut|Ios|Jud|Rut|1 Sam|1Sam|2 Sam|2Sam|1 Imp|1Imp|2 Imp|2Imp|1 Cron|1Cron|1Cr|2 Cron|2Cron|2Cr|Ezra|Neem|Est|Iov|Ps|Prov|Ecl|Cant|Cc|Isa|Is|Ier|Pl|Ezec|Dan|Os|Io|Amo|Oba|Iona|Mic|Nau|Hab|Tef|Hag|Zah|Mal"+
 	"Mat|Mt|Marc|Mc|Luc|Ioan|Fapt|Fapte|F. ap.|F ap|Rom|1 Cor|1Cor|2 Cor|2Cor|Gal|Ef|Efes|Filip|Col|1 Tes|1Tes|2 Tes|2Tes|1 Tim|1Tim|2 Tim|2Tim|Tit|Filim|Evr|Iac|1 Pet|1Pet|2 Pet|2Pet|1Ioan|2Ioan|3Ioan|Iud|Apoc|Ap";
	}
	
	return books;	
};

org.bible.NETBibleTagger.doElement = function(elm) {

	var vols = "I+|1st|2nd|3rd|First|Second|Third|1|2|3";
    var books = org.bible.NETBibleTagger.getBooks(org.bible.NETBibleTagger.translation);

	var verse = "\\d+(:\\d+)?(?:\\s?[-â€“â€“&,]\\s?\\d+)*";

    var numberlist = "(\\d+(,\\s?\\d+)*)";
    var passage = "((\\d+(\\.|:)\\d+[-â€“â€“]\\d+(\\.|:)\\d+)|(\\d+(\\.|:)\\d+[-â€“â€“]\\d+)|(\\d+[-â€“â€“]\\d+)|(\\d+(\\.|:)"+numberlist+")|(\\d+))";
    var book = "((?:("+vols+")\\s?)?("+books+")\\.?\\s?)";
    var passagelist = "("+passage + "(;\\s?(?!"+book+")"+passage+")*)";  
    
	var regex = "\\b"+book+passagelist;        

    regex = new RegExp(regex, "m");

    var textproc = function(node) 
    {
    	var match = regex.exec(node.data);

        if (match) 
        {
            var val = match[0];
    
            if (org.bible.drawer && arguments[1])
			{
 				org.bible.drawer.parent.setInitialRef(val);
 				return node;
 			}
 			else
 			{
	            var node2 = node.splitText(match.index);
	            var node3 = node2.splitText(val.length);
	            var anchor = node.ownerDocument.createElement('A');
	           
	            if (node.parentNode.tagName != 'A')
	            {
	            	anchor.setAttribute('href', 'javascript:{}');
	          	}
	          	
	           	anchor.onmouseover = org.bible.NETBibleTagger.linkOnMouseOver;
	           	anchor.onmouseout = org.bible.NETBibleTagger.linkOnMouseOut;
			   	anchor.alt = node2.data;
	            node.parentNode.replaceChild(anchor, node2);
	            anchor.className = 'NETBibleTagged';
	            anchor.appendChild(node2);
	            
	            return anchor;
            }
        } 
        else 
        {
            return node;
        }
    };
    
    __traverseDOM(elm.childNodes[0], 1, textproc);
};

function dataproc(node)
{
    var regex = new RegExp("Bible:(.*)", "m");
    
    var matches = regex.exec(node.getAttribute('ref'));
    
    var anchor = node.ownerDocument.createElement('A');
    anchor.setAttribute('href', 'javascript:{}');
   	// anchor.onmouseover = getScripture(true);
   	anchor.onmouseover = org.bible.NETBibleTagger.linkOnMouseOver;
   	anchor.onmouseout = org.bible.NETBibleTagger.linkOnMouseOut;
   	anchor.className = 'NETBibleTagged';
   	anchor.appendChild(node.firstChild);
   	anchor.alt = matches[1];
   	//anchor.innerHTML = node.title;
   	node.parentNode.replaceChild(anchor, node);
   //	anchor.appendChild(node.firstChild);
   //	node.appendChild(anchor);
   return anchor;

}

function spanproc(node)
{
	if (node.title)
	{
		var anchor = node.ownerDocument.createElement('A');
	    anchor.setAttribute('href', 'javascript:{}');
	   	// anchor.onmouseover = getScripture(true);
	   	anchor.onmouseover = org.bible.NETBibleTagger.linkOnMouseOver;
	   	anchor.onmouseout = org.bible.NETBibleTagger.linkOnMouseOut;
	   	anchor.className = 'NETBibleTagged';
	   	anchor.appendChild(node.firstChild);
	   	anchor.alt = node.title;
	   	//anchor.innerHTML = node.title;
	   	node.parentNode.replaceChild(anchor, node);
	   //	anchor.appendChild(node.firstChild);
	   //	node.appendChild(anchor);
	   return anchor;
	}
	else
	{
		return node;
	}   	
}

org.bible.NETBibleTagger.doDocument = function() {
    if ((org.bible.NETBibleTagger.element && (e = document.getElementById(org.bible.NETBibleTagger.element))) || (e = document.body))
    {
		org.bible.NETBibleTagger.doElement(e);
    }
};

org.bible.NETBibleTagger.init = function() {
	 var onload = 1;
    return onload;
};

org.bible.NETBibleTagger.linkOnMouseOver = function(ev) {
	if (!ev) var ev = window.event;
	var verse = this.alt;//this.childNodes[0].data;			//get the verse text that was moused over

	verse = verse.replace(/â€“/, '-');				//Marc doesn't handle mdashes, replace them
	verse = verse.replace('&nbsp;', " "); 
	verse = verse.replace(/\xC2/g, ""); 
	verse = verse.replace(/\x0A/g, " "); 
	verse = verse.replace(/\xA0/g, " "); 
	
	var tip = document.getElementById('nbtDiv');
	
	if (org.bible.NETBibleTagger.IE) 
	{
		org.bible.NETBibleTagger.xPos = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		org.bible.NETBibleTagger.yPos = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		
		//org.bible.NETBibleTagger.xScreen = document.body.offsetWidth;
		//org.bible.NETBibleTagger.yScreen = document.body.offsetHeight;
		
		org.bible.NETBibleTagger.xScreen = document.documentElement.clientWidth + document.documentElement.scrollLeft;
		org.bible.NETBibleTagger.yScreen = document.documentElement.clientHeight + document.documentElement.scrollTop;
	} 
	else 
	{  
		org.bible.NETBibleTagger.xPos = ev.pageX;
		org.bible.NETBibleTagger.yPos = ev.pageY;
		org.bible.NETBibleTagger.xScreen = window.innerWidth-16;
		org.bible.NETBibleTagger.yScreen = window.innerHeight-16+window.pageYOffset;
	} 
 	
 	if (tip.offsetWidth != 0 && ((org.bible.NETBibleTagger.xPos+tip.offsetWidth) > org.bible.NETBibleTagger.xScreen))
	{
		org.bible.NETBibleTagger.xPos = org.bible.NETBibleTagger.xPos - ((org.bible.NETBibleTagger.xPos + tip.offsetWidth)-org.bible.NETBibleTagger.xScreen);
	}
	if (tip.offsetHeight != 0 && ((org.bible.NETBibleTagger.yPos+tip.offsetHeight) > org.bible.NETBibleTagger.yScreen))
	{
		org.bible.NETBibleTagger.yPos = org.bible.NETBibleTagger.yPos - ((org.bible.NETBibleTagger.yPos + tip.offsetHeight)-org.bible.NETBibleTagger.yScreen);
	}
	
	if (org.bible.NETBibleTagger.currentPassage != verse)
	{
		org.bible.NETBibleTagger.currentPassage = verse;

		org.bible.NETBibleTagger.delayTimer = setTimeout('org.bible.NETBibleTagger.getScripture()', 500);
	}
	else if(org.bible.NETBibleTagger.isVisible && (org.bible.NETBibleTagger.currentPassage == verse))
   	{}
   	else
   	{
		org.bible.NETBibleTagger.currentPassage = verse;

		org.bible.NETBibleTagger.delayTimer = setTimeout('org.bible.NETBibleTagger.getScripture()', 500);
    }
    
    return false;
};

org.bible.NETBibleTagger.linkOnMouseOut = function(ev) {
	
	if (!org.bible.NETBibleTagger.isVisible)
	{
		clearTimeout(org.bible.NETBibleTagger.delayTimer);
	}
	else if(org.bible.NETBibleTagger.voidOnMouseOut && org.bible.NETBibleTagger.isVisible)
	{
		org.bible.NETBibleTagger.hideTimer = setTimeout('org.bible.NETBibleTagger.handleMouseOutDelay()', 100);
	}
   	else
   	{
    	
   	}
	
    return false;
};

org.bible.NETBibleTagger.handleMouseOutDelay = function(){

	if (org.bible.NETBibleTagger.mouseOnDiv == false && org.bible.NETBibleTagger.voidOnMouseOut == true)
	{
		org.bible.NETBibleTagger.hideTip();
	}
};

org.bible.NETBibleTagger.applyCSS = function()
{
	var width, fontFace, fontSize, headerFontColor, contentFontColor, topColor, bottomColor, backgroundColor, headerColor;
	
	var isSet = function(thing)
	{
		if (typeof thing != "null" && thing)
		{
			return true;
		}
		
		return false;
	};
	
	var scripts = document.getElementsByTagName("script");
	var cntr = scripts.length;
	
	while (cntr)
	{
		var curScript = scripts[cntr-1];
		
		if (curScript.src.indexOf("v2/netbibletagger") != -1)
		{
			eval(curScript.innerHTML);
			
			break;
		}
		
		cntr--;
	}
	
	var css = '#nbtDiv {';
	
	if (isSet(width))
	{
		css += 'width:'+width+'px;';
	}
	if (isSet(fontFace))
	{
		css += 'font-family:"'+fontFace+'";';
	}
	
	css += '}';
	
	css += '#verseTarget, #nbtPoweredBy{';
	
	if (isSet(fontSize))
	{
		css += 'font-size:'+fontSize+'px;';
	}
	if (isSet(backgroundColor))
	{
		css += 'background-color:#'+backgroundColor+';';
	}
	if (isSet(contentFontColor))
	{
		css += 'color: #'+contentFontColor+';';
	}
	
	css += '}';
	
	css += '#nbtHeader {';
	
	if (isSet(headerColor))
	{
		css += 'background-color: #'+headerColor+';';
		css += 'background-image: none;';
	}
	else if (isSet(topColor) && isSet(bottomColor))
	{
		css += 'background-image: -ms-linear-gradient(top, #'+topColor+' 0%, #'+bottomColor+' 100%);';
		css += 'background-image: -moz-linear-gradient(top, #'+topColor+' 0%, #'+bottomColor+' 100%);';
		css += 'background-image: -o-linear-gradient(top, #'+topColor+' 0%, #'+bottomColor+' 100%);';
		css += 'background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #'+topColor+'), color-stop(1, #'+bottomColor+'));';
		css += 'background-image: -webkit-linear-gradient(top, #'+topColor+' 0%, #'+bottomColor+' 100%);';
		css += 'background-image: linear-gradient(to bottom, #'+topColor+' 0%, #'+bottomColor+' 100%);';
	}
	
	css += '}';	
	
	css += '#nbtVerseTitle {';
	
	if (isSet(headerFontColor))
	{
		css += 'color: #'+headerFontColor+';';
	}
	
	css += '}';	
	
	var styleElement = document.getElementById("netbible-netbibletagger-dynamic-style");

	if (navigator.userAgent.match(/MSIE/))
	{
		styleElement.styleSheet.cssText = css;
	}
	else
	{
		styleElement.innerHTML = css;
	}
};

function __decodeQS(qs) {
    var k, v, i1, i2, r = {};
    i1 = qs.indexOf('?');
    i1 = i1 < 0 ? 0 : i1 + 1;
    while ((i1 >= 0) && ((i2 = qs.indexOf('=', i1)) >= 0)) {
        k = qs.substring(i1, i2);
        i1 = qs.indexOf('&', i2);
        v = i1 < 0 ? qs.substring(i2+1) : qs.substring(i2+1, i1++);
        r[unescape(k)] = unescape(v);
    }
    return r;
}

function __traverseDOM(node, depth, textproc) {
   // var skipre = /^(script|style|textarea|h1|h2|cite)/i;
    if (org.bible.NETBibleTagger.parseAnchors)
    {
   		org.bible.NETBibleTagger.skipRe = org.bible.NETBibleTagger.skipRe.replace("|a", '');
    }
    
    var skipre = new RegExp(org.bible.NETBibleTagger.skipRe, "i");
    var count = 0;
    while (node && depth > 0) {
        count ++;
        if (count >= org.bible.NETBibleTagger.max_nodes) {
            var handler = function() {
                __traverseDOM(node, depth, textproc);
            };
            setTimeout(handler, 50);
            return;
        }

        switch (node.nodeType) {
            case 1: // ELEMENT_NODE
            	if (node.id == 'nbtDiv' || node.id == 'currentBookChapterHolder' || node.classList == 'title-desc-wrapper')
                {
	                break;
                }
            	if ((node.tagName == 'SPAN' || node.tagName == 'CITE') && node.className == 'bibleref')
                {
                	node = spanproc(node); 
                	break;
                }
                if (node.tagName == 'DATA' && node.hasAttribute('ref') && node.getAttribute('ref').match(/^Bible:/))
                {
                	node = dataproc(node); 
                	break;
                }
                
                if (org.bible.drawer && node.tagName == 'H2' && node.childNodes.length > 0)
                {
	                textproc(node.childNodes[0], true);
                }
                
                if (!skipre.test(node.tagName) && node.childNodes.length > 0) {
                    node = node.childNodes[0];
                    depth ++;
                    continue;
                }
                
                
                break;
            case 3: // TEXT_NODE
            case 4: // CDATA_SECTION_NODE
                node = textproc(node);
                break;
        }
		
	    if (node.nextSibling) 
	    {
	        node = node.nextSibling;
	    } 
	    else 
	    {
	        while (depth > 0) 
	        {
	        	try 
	        	{
	            	node = node.parentNode;
	            	depth --;
	            
		            if (node.nextSibling) 
		            {
		                node = node.nextSibling;
		                break;
		            }
	            }
	            catch(err)
  				{
  					break;
  				}
	        }
	    }
    }
}

var scripts = document.getElementsByTagName("script");
var cntr = scripts.length;

while (cntr)
{
	var curScript = scripts[cntr-1];
	
	if (curScript.src.indexOf("netbibletagger") != -1)
	{
		eval(curScript.innerHTML);
		
		if (curScript.src.indexOf("v2") == -1)
		{
			org.bible.NETBibleTagger.customCSS = false;
		}
		
		break;
	}
	
	cntr--;
}



var headID = document.getElementsByTagName("head")[0];  

if (org.bible.NETBibleTagger.customCSS == false)
{
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = 'https://labs.bible.org/api/NETBibleTagger/v2/netbibletagger.css';
	cssNode.media = 'screen';
	headID.appendChild(cssNode);
}

var cssNode = document.createElement('style');
	cssNode.type = 'text/css';
	cssNode.id = 'netbible-netbibletagger-dynamic-style';
	headID.appendChild(cssNode);

var NETDiv = document.createElement('div');


NETDiv.id = "nbtDiv";

document.getElementsByTagName('body')[0].appendChild(NETDiv);

NETDiv.innerHTML = '<div id="displayagain"><div id="nbtHeader" class="nbtWidth">'+
                       '<span id="nbtVerseTitle"></span>'+
                       '<a id="nbtClose" href="javascript:{}" onclick="org.bible.NETBibleTagger.hideTip();">'+
				          '<img id="nbtCloseImage" src="https://labs.bible.org/api/NETBibleTagger/v2/images/closeBig.png" style="" title="close" />'+
			           '</a>'+
			        '</div>'+
			        '<div id="nbtContent" class="nbtWidth">'+
                       '<img id="nbtLoading" src="https://labs.bible.org/api/NETBibleTagger/v2/images/loading.gif" style="" />'+
                       '<div id="verseTarget"></div>'+
                    '</div><div id="nbtPoweredBy"><a href="https://labs.bible.org/NETBibleTagger?ref=popup" target="_blank"> NETBibleTagger</a>, '+(org.bible.NETBibleTagger.translation == 'net' ? 'Provided by' : 'Oferit de')+' <a href="http://bible.org">bible.org</a></div></div>';

NETDiv.style.display = 'block';
NETDiv.style.left = "-1000px";
NETDiv.style.top = "-1000px";
NETDiv.style.position="absolute";


NETDiv.onmouseover = org.bible.NETBibleTagger.divOnMouseOver;
NETDiv.onmouseout = org.bible.NETBibleTagger.divOnMouseOut;




if (org.bible.NETBibleTagger.isTouch)
{
	var nbtContent = document.getElementById('verseTarget');
	
	var height = 0;
	var cpos = nbtContent.scrollTop;
	nbtContent.scrollTop = 100000;
	height = nbtContent.scrollTop;
	nbtContent.scrollTop = cpos;
	var fullheight = height + nbtContent.outerHeight;
	var scrollbarV_length = nbtContent.innerHeight*(nbtContent.innerHeight/fullheight)+2;
	
	var width = 0;
	var lpos = nbtContent.scrollLeft;
	//cont.scrollLeft(100000);
	width = nbtContent.scrollLeft;
	nbtContent.scrollLeft= lpos;
	
	var nbtHandleTouch = function(e)
	{
		cpos = nbtContent.scrollTop;
		e = e.touches[0];

		var sY = e.pageY;
		var sX = e.pageX;
		
		var nbtHandleTouchMove = function(ev)
		{
			ev.preventDefault();
			ev = ev.touches[0];
			
			var top = cpos-(ev.pageY-sY);
			var left =  lpos-(ev.pageX-sX);

			nbtContent.scrollTop = top;
			cpos = nbtContent.scrollTop;
			sY = ev.pageY;
			
			nbtContent.scrollLeft = left;
			lpos = nbtContent.scrollLeft;
			sX = ev.pageX;	
		};

		var nbtHandleTouchEnd = function(ev)
		{
			nbtContent.removeEventListener('touchmove',nbtHandleTouchMove,false);
			nbtContent.removeEventListener('touchend',nbtHandleTouchEnd,false);
		};
		
		nbtContent.addEventListener('touchmove',nbtHandleTouchMove,false);
		nbtContent.addEventListener('touchend',nbtHandleTouchEnd,false);
	};
	
	nbtContent.addEventListener('touchstart',nbtHandleTouch,false);
}

org.bible.NETBibleTagger.applyCSS();
org.bible.NETBibleTagger.doDocument();