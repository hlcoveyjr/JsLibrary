//==============================================================================
// Form Validation functions
// Basically, this is a subset of a much re-worked FORMCHEK.JS file put out by
//     Netscape combined with functions we have developed that were NOT included
//     in the Netscape library. We ONLY include the functions we normally use to
//     reduce page load time. Also, some of the functions have been re-worked to
//     make them more useable and/or more readable for our environment.
//     
//     This library includes declarators, patterns and supporting functions, 
//     as well as the standard checkObject functions.
//==============================================================================
// VARIABLE DECLARATIONS
//------------------------------------------------------------------------------
var digits = "0123456789";
var legalDigits = "0123456789.";
var lcLetters = "abcdefghijklmnopqrstuvwxyz";
var ucLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var legalString = lcLetters + ucLetters + " -_." + digits;
var whitespace = " \t\n\r";
var uspsPossessionList = {
		"Possession": [	
			"Alabama","Alaska","American Samoa","Arizona","Arkansas",
			"California","Colorado","Connecticut","Delaware",
			"District of Columbia","Federated States of Micronesia",
			"Florida","Georgia","Guam","Hawaii","Idaho",
			"Illinois","Indiana","Iowa","Kansas","Kentucky",
			"Louisiana","Maine","Marshall Islands","Maryland",
			"Massachusetts","Michigan","Minnesota","Mississippi",
			"Missouri","Montana","Nebraska","Nevada","New Hampshire",
			"New Jersey","New Mexico","New York","North Carolina",
			"North Dakota","Northern Mariana Islands","Ohio",
			"Oklahoma","Oregon","Palau","Pennsylvania","Puerto Rico",
			"Rhode Island","South Carolina","South Dakota","Tennessee",
			"Texas","Utah","Vermont","Virgin Islands","Virginia",
			"Washington","West Virginia","Wisconsin","Wyoming" ],
		"Abbreviation": [
			"AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL",
			"GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH",
			"MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
			"NY","NC","ND","MP","OH","OK","OR","PW","PA","PR","RI","SC",
			"SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY" ] };

//------------------------------------------------------------------------------
// PATTERN DECLARATIONS
//------------------------------------------------------------------------------
var pWhitespace = /^\s+$/;
var pEmail = /^.+\@.+\..+$/;
var pPhone = /^\d{3}\/\d{3}\-\d{4}$/;
var pAlpha = /^[a-zA-Z]+$/;
var pLegalAlpha = /^[a-zA-Z _]+$/;
var pAlphaNumeric = /^[a-zA-Z0-9]+$/;
var pInteger = /^\d+$/;
var pSignedInteger = /^(\+|\-)?\d+$/;
var pFloat = /^((\d+(\.\d*)?)|((\d*\.)?\d+))$/;
var pZipCode = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
var pSignedFloat = /^(((\+|\-)?\d+(\.\d*)?)|((\+|\-)?(\d*\.)?\d+))$/;
var pUSDate = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/;

//------------------------------------------------------------------------------
// PATTERN DELIMITERS
//------------------------------------------------------------------------------
var phoneNumberDelimiters = "/";

//------------------------------------------------------------------------------
// LENGTH DECLARATIONS
//------------------------------------------------------------------------------
var digitsInUSPhoneNumber = 10;

//------------------------------------------------------------------------------
// Global variable defaultEmptyOK defines default return value 
// for many functions when they are passed the empty string. 
// By default, they will return defaultEmptyOK.
//
// defaultEmptyOK is false, which means that by default, 
// these functions will do "strict" validation.  Function
// isInteger, for example, will only return true if it is
// passed a string containing an integer; if it is passed
// the empty string, it will return false.
//
// You can change this default behavior globally (for all 
// functions which use defaultEmptyOK) by changing the value
// of defaultEmptyOK.
//
// Most of these functions have an optional argument emptyOK
// which allows you to override the default behavior for 
// the duration of a function call.
//
// This functionality is useful because it is possible to
// say "if the user puts anything in this field, it must
// be an integer (or a phone number, or a string, etc.), 
// but it's OK to leave the field empty too."
// This is the case for fields which are optional but which
// must have a certain kind of content if filled in.
//------------------------------------------------------------------------------
var defaultEmptyOK = false;

//==============================================================================
// Various is/has functions
//==============================================================================
// Check whether string s is empty.
//------------------------------------------------------------------------------
function isEmpty(s) {
	return ((s == null) || (s.length == 0));
}

//------------------------------------------------------------------------------
// Returns true if string s is empty or whitespace characters only.
//------------------------------------------------------------------------------
function isWhitespace (s) {
	return (isEmpty(s) || pWhitespace.test(s));
}

//------------------------------------------------------------------------------
// isInteger (STRING s [, BOOLEAN emptyOK])
//
// Returns true if all characters in string s are numbers.  Accepts non-signed 
// integers only. Does not accept floating point, exponential notation, etc.
// We don't use parseInt because that would accept a string with trailing non-
// numeric characters.
//------------------------------------------------------------------------------
function isInteger (s) {
	if (isEmpty(s)) {
		if (isInteger.arguments.length == 1) return defaultEmptyOK;
		else return (isInteger.arguments[1] == true);
	} else {
		return pInteger.test(s);
	}
}

//------------------------------------------------------------------------------
// isSignedFloat (STRING s [, BOOLEAN emptyOK])
// 
// True if string s is a signed or unsigned floating point 
// (real) number. First character is allowed to be + or -.
//
// Does not accept exponential notation.
//------------------------------------------------------------------------------
function isSignedFloat (s) {
	if (isEmpty(s)) {
		if (isSignedFloat.arguments.length == 1) return defaultEmptyOK;
		else return (isSignedFloat.arguments[1] == true);
	} else {
		return pSignedFloat.test(s)
	}
}

//------------------------------------------------------------------------------
// inRange - Tests a value to determine if it is within a range.  
// Returns false if inStr not a number or is not between and including lo and hi
//------------------------------------------------------------------------------
function inRange(inStr, lo, hi)
{
	var num;
	if (!isNaN(inStr))
	{
		num = parseInt(inStr, 10);
		if (num < lo || num > hi)
		{
			return false;
		}
		return true;
	}
	return false;
}	

//------------------------------------------------------------------------------
// isUSPhoneNumber (STRING s [, BOOLEAN emptyOK])
// 
// isUSPhoneNumber returns true if string s is a valid U.S. Phone Number.
// NOTE: Strip out any delimiters (spaces, hyphens, parentheses, etc.) from
// string s before calling this function.
//------------------------------------------------------------------------------
function isUSPhoneNumber (s) {
	if (isEmpty(s)) {
		if (isUSPhoneNumber.arguments.length == 1) return defaultEmptyOK;
		else return (isUSPhoneNumber.arguments[1] == true);
	} else {
		return (isInteger(s) && s.length == digitsInUSPhoneNumber);
	}
}

//------------------------------------------------------------------------------
// Validates that a string contains only valid dates with 1 or 2-digit month, 
// 1 or 2-digit day, and 4-digit year. Date separator can be ., -, or /.
// Ex. mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy
//------------------------------------------------------------------------------
function isUSTime( s ) {
	return false;
}

//------------------------------------------------------------------------------
// Validates that a string contains only valid dates with 1 or 2-digit month, 
// 1 or 2-digit day, and 4-digit year. Date separator can be ., -, or /.
// Ex. mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy
//------------------------------------------------------------------------------
function isUSDate( s ) {
	if (isEmpty(s)) {
		if (isUSDate.arguments.length == 1) return defaultEmptyOK;
		else return (isUSDate.arguments[1] == true);
	} else {
		if (pUSDate.test(s)) {
			var dateParts = s.split(/\.|\-|\//); //split date into month, day, year
			var intYear = parseInt(dateParts[2]);
			var intDay = parseInt(dateParts[1]);
			var intMonth = parseInt(dateParts[0]);

			monthDays = new Array ( 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 );
			monthDays[1] = daysInFebruary (intYear);
			if (monthDays[intMonth-1] != null) {
				if (intDay <= monthDays[intMonth-1] && intDay != 0) return true;
			}
			return false; //any other values, bad date
		} else {
			return false; //doesn't match pattern, bad date
		}
	}
}

//------------------------------------------------------------------------------
// February has 29 days in any year evenly divisible by four,
// EXCEPT for centurial years which are not also divisible by 400.
//------------------------------------------------------------------------------
function daysInFebruary (year) {   
    return (  ((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0) ) ) ? 29 : 28 );
}

//------------------------------------------------------------------------------
// isEmail (STRING s [, BOOLEAN emptyOK])
// 
// Email address must be of form a@b.c -- in other words:
//   * there must be at least one character before the @ (required character)
//   * there must be at least one character before and after the . (required char)
//------------------------------------------------------------------------------
function isEmail (s) {
	if (isEmpty(s)) {
		if (isEmail.arguments.length == 1) return defaultEmptyOK;
		else return (isEmail.arguments[1] == true);
	} else {
		return pEmail.test(s);
	}
}

//------------------------------------------------------------------------------
// isUSState (STRING s)
// 
// isUSState returns true if string s is a valid U.S. State.
//------------------------------------------------------------------------------
function isUSState (s) {
	var retval = false;
	var stList = uspsPossessionList.Abbreviation;
	for (var i=0, limit = stList.length; i<limit; i++) {
		if (stList[i] == s) {
			retval = true;
			break;
		}
	}
	return retval;
}

//------------------------------------------------------------------------------
// Check for invalid characters in text and textarea fileds of form frm
//------------------------------------------------------------------------------
function hasInvalidChars (frm, bag) {
  	var flag=0;
  	var msg = "The following fields were found to contain illegal characters (";
		msg += bag + ")\nPlease remove or replace them and re-submit:\n\n";
	for (i=0; i<frm.elements.length; i++) {
		if (frm.elements[i].type.indexOf("text") >= 0) {
			if (hasCharsInBag (frm.elements[i].value, bag)) {
				flag=1;
				msg += frm.elements[i].name + "\n";
			}
		}
	}
	if (flag) {
		alert (msg);
		return false;
	} else {
		return true;
	}
}

//==============================================================================
// Various reformating or cleanup functions
//==============================================================================
// reformat (TARGETSTRING, STRING, INTEGER, STRING, INTEGER ... )       
//
// Handy function for arbitrarily inserting formatting characters
// or delimiters of various kinds within TARGETSTRING.
//
// reformat takes one named argument, a string s, and any number
// of other arguments.  The other arguments must be integers or
// strings.  These other arguments specify how string s is to be
// reformatted and how and where other strings are to be inserted
// into it.
//
// reformat processes the other arguments in order one by one.
// * If the argument is an integer, reformat appends that number 
//   of sequential characters from s to the resultString.
// * If the argument is a string, reformat appends the string
//   to the resultString.
//
// NOTE: The first argument after TARGETSTRING must be a string.
// (It can be empty.)  The second argument must be an integer.
// Thereafter, integers and strings must alternate.  This is to
// provide backward compatibility to Navigator 2.0.2 JavaScript
// by avoiding use of the typeof operator.
//
// It is the caller's responsibility to make sure that we do not
// try to copy more characters from s than s.length.
//
// EXAMPLES:
//
// * To reformat a 10-digit U.S. phone number from "1234567890"
//   to "(123) 456-7890" make this function call:
//   reformat("1234567890", "(", 3, ") ", 3, "-", 4)
//
// * To reformat a 9-digit U.S. Social Security number from
//   "123456789" to "123-45-6789" make this function call:
//   reformat("123456789", "", 3, "-", 2, "-", 4)
//
// HINT:
//
// If you have a string which is already delimited in one way
// (example: a phone number delimited with spaces as "123 456 7890")
// and you want to delimit it in another way using function reformat,
// call function stripCharsNotInBag to remove the unwanted 
// characters, THEN call function reformat to delimit as desired.
//
// EXAMPLE:
//
// reformat (stripCharsNotInBag ("123 456 7890", digits),
//           "(", 3, ") ", 3, "-", 4)
//------------------------------------------------------------------------------
function reformat (s) {
	var arg;
	var sPos = 0;
	var resultString = "";

	for (var i = 1; i < reformat.arguments.length; i++) {
		arg = reformat.arguments[i];
		if (i % 2 == 1) {
			resultString += arg;
		} else {
			resultString += s.substring(sPos, sPos + arg);
			sPos += arg;
		}
	}
	return resultString;
}

//------------------------------------------------------------------------------
// takes USDate, a string of 10 digits and reformats as mm.dd.yyyy or mm-dd-yyyy
// or mm/dd/yyyy (default).
//------------------------------------------------------------------------------
function reformatUSDate (USDate, delimiter) {
	var s = "";
	var dateParts = USDate.split(/\.|\-|\//); //split date into month, day, year
	if (dateParts[0] < 10) { s += "0"; }
	s += parseInt(dateParts[0]) + delimiter;
	if (dateParts[1] < 10) { s += "0"; }
	s += parseInt(dateParts[1]) + delimiter + dateParts[2];
	return s;
}

//------------------------------------------------------------------------------
// takes USPhone, a string of 10 digits and reformats as 123-456-789
//------------------------------------------------------------------------------
function reformatUSPhone (USPhone) {
	return (reformat (USPhone, "", 3, "-", 3, "-", 4));
}

//------------------------------------------------------------------------------
// Force numeric display in a fixed number af places (default to 2), dollar
// symbol true/false/passed symbol, and commas true/false (default to false).
//------------------------------------------------------------------------------
function parseFixed( num, places, symbol, commas ) {
	var sgn="", tmp="", pos;
	num = stripCharsNotInBag(num, '0123456789-.');
	if (num < 0) sgn = "-";
	num = stripCharsNotInBag(num, digits + '0123456789.');
	if (parseFixed.arguments.length < 2) places = 2;
	if (parseFixed.arguments.length < 3) symbol = false;
	if (parseFixed.arguments.length < 4) commas = false;
	if (places.toString()=="true") places = 2;
	if ( !symbol ) {
		sgn += "";
	} else {
		if ( symbol==true ) { sgn += "$"; }
		else { sgn += symbol; }
	}
	if ( isNaN ( num )) tmp += Number(num);
	else tmp += Number(num).toString();
	if ( places > 0 ) {
		if ( tmp.indexOf( "." ) < 0 ) {
			tmp += ".";
			for ( n = 0; n < places; n++ ) { tmp += "0"; }
			return (addCommas(sgn + tmp,commas));
		}
		tmp = tmp.replace(/\s+/g, "");
		tmpParts=tmp.split(/\./);
		tmpParts[1] = roundUp(tmpParts[1], places);
		if (tmpParts[1].toString().length > places) {
			tmpParts[0]++;
			tmpParts[1] = tmpParts[1].toString().substring(1,places+1);
		}
		if (tmpParts[1].toString().length < places) tmpParts[1] += "0";
		return ( addCommas(sgn + tmpParts[0],commas) + "." + tmpParts[1] );
	} else {
		if ( tmp.indexOf( "." ) < 0 ) {
			return (addCommas(sgn + tmp,commas));
		} else {
			return (addCommas(sgn + Math.round(tmp),commas));
		}
	}
}

//------------------------------------------------------------------------------
// Used to perform a Math.round on an integer at the specified number of places.
// Basically, used to perform a round-up on the right-side of a decimal number.
//------------------------------------------------------------------------------
function roundUp( num, places ) {
	if (roundUp.arguments.length < 2) places = 2;
	if ( isNaN ( num )) tmp = num;
	else tmp = num.toString();
	for ( i = 0; i < places; i++ ) { tmp += "0"; }
	var n = tmp.substring(0,places) + "." + tmp.substring(places);
	num = Math.round(n);
	return num;
}

//------------------------------------------------------------------------------
// Inserts commas into numeric string.
// Used with integers or numbers with 2 or less decimal places.
//------------------------------------------------------------------------------
function addCommas( num, commas ) {
	if (addCommas.arguments.length < 2) commas = false;
	if (commas==true) {
		var numRE  = /(\-?\$?[0-9]+)([0-9]{3})/;
		while(numRE.test(num)) {
			num = num.replace(numRE, '$1,$2');
		}
	}
	return num;
}

//------------------------------------------------------------------------------
// Removes all characters which appear in string bag from string s.
//------------------------------------------------------------------------------
function stripCharsInBag (s, bag) {
	var i; var returnString = "";
	for (i = 0; i < s.length; i++) {   
		var c = s.charAt(i);
		if (bag.indexOf(c) == -1) returnString += c;
	}
	return returnString;
}

//------------------------------------------------------------------------------
// Removes all characters which do NOT appear in string bag from string s.
//------------------------------------------------------------------------------
function stripCharsNotInBag (s, bag) {
	var i; var returnString = "";
	for (i = 0; i < s.length; i++) {   
		var c = s.charAt(i);
		if (bag.indexOf(c) != -1) returnString += c;
	}
	return returnString;
}

//------------------------------------------------------------------------------
// Return true if characters in bag exist in string s
//------------------------------------------------------------------------------
function hasCharsInBag (s, bag) {
	if (!bag) { bag = "/`~!@#$%^&*()_+-=[]{}\\|:;\"'<>,.?$"; }
	var returnValue = false;
    for (var i = 0; i < bag.length; i++) {
        if (s.indexOf(bag.charAt(i)) >= 0) {
			returnValue = true;
			break;
		}
    }
    return returnValue;
}

//------------------------------------------------------------------------------
// Trim characters c from the left of a string str
//------------------------------------------------------------------------------
function ltrim(str, c) {
	if (!c) c=' ';
	var i = -1; 
	while (++i < str.length && str.charAt(i) == c); 
	return (str.substring(i, str.length)); 
} 

//------------------------------------------------------------------------------
// Trim characters c from the right of a string str
//------------------------------------------------------------------------------
function rtrim(str, c) {
	if (!c) c=' ';
	var i = str.length; 
	while (--i > 0 && str.charAt(i) == c); 
	return (str.substring(0, i + 1)); 
}

//------------------------------------------------------------------------------
// Trim characters c from the left and right of a string str
//------------------------------------------------------------------------------
function trim(str, c) { 
	if (!c) c=' ';
	return (ltrim(rtrim(str, c), c)); 
}

//==============================================================================
// Notify user that required field theField is empty or invalid.  String s shows
// expected contents of theField.value.  Put focus in theField and return false.
//==============================================================================
function warning (theField, s) {
	alert(s);
	var fldType = theField.type.toLowerCase();
	if (fldType != "hidden") theField.focus();
	if (fldType == "text") theField.select();
    return false;
}

//==============================================================================
// FUNCTIONS TO INTERACTIVELY CHECK VARIOUS FIELDS. 
//==============================================================================
// checkString (TEXTFIELD theField, STRING s, [, BOOLEAN emptyOK==false])
// Check that string theField.value is not all whitespace.
//------------------------------------------------------------------------------
function checkString (theField, s, sLength, emptyOK) {
    if (checkString.arguments.length < 4) emptyOK = defaultEmptyOK;
    if (checkString.arguments.length < 3) sLength = 0;
    if (checkString.arguments.length < 2) s = theField.name;
    if ((emptyOK == true) && (isEmpty(theField.value))) {
		return true;
	} else {
		var normalizedstring = stripCharsNotInBag(theField.value, legalString);
		if (isWhitespace(normalizedstring)) {
			return warning (theField, s + " is a required field and cannot be empty.");
		} else {
			if (sLength && theField.value.length != sLength) {
				return warning (theField, s + " must be " + sLength + " characters or digits in length.");
	    	} else {
				theField.value = normalizedstring;
				return true;
			}
		}
	}
}


//------------------------------------------------------------------------------
// checkMaxLength (TEXTFIELD theField, s, sLength [, BOOLEAN emptyOK==false])
// Check that string theField.value does not exceed sLength characters.
//------------------------------------------------------------------------------
function checkMaxLength (theField, s, sLength, emptyOK) {
    if (checkString.arguments.length < 4) emptyOK = defaultEmptyOK;
    if (checkString.arguments.length < 3) sLength = 0;
    if (checkString.arguments.length < 2) s = theField.name;
    if ((emptyOK == true) && (isEmpty(theField.value))) {
		return true;
	} else {
		var normalizedstring = stripCharsNotInBag(theField.value, legalString);
		if (isWhitespace(normalizedstring)) {
			return warning (theField, s + " is a required field and cannot be empty.");
		} else {
			if (sLength && theField.value.length > sLength) {
				return warning (theField, s + " must not be more than " + sLength + " characters or digits in length.");
	    	} else {
				theField.value = normalizedstring;
				return true;
			}
		}
	}
}

//------------------------------------------------------------------------------
// checkUSPhone (TEXTFIELD theField [, BOOLEAN emptyOK==false])
// Check that string theField.value is a valid US Phone.
//------------------------------------------------------------------------------
function checkUSDate (theField, s, delimiter, emptyOK) {
	if (checkUSDate.arguments.length < 4) emptyOK = defaultEmptyOK;
	if (checkUSDate.arguments.length < 3) delimiter = "/";
	if (checkUSDate.arguments.length < 2) s = theField.name;
	if ((emptyOK == true) && (isEmpty(theField.value))) {
		return true;
	} else {
		var normalizedDate = stripCharsNotInBag(theField.value, digits + ".-/")
		if (isWhitespace(normalizedDate)) {
			return warning (theField, s + " is a required field and cannot be empty.");
		} else {
			if (!isUSDate(normalizedDate, false)) {
				return warning (theField, s + " either has an incorrect month, day and/or year value or is not in the\ncorrect US Date format ( i.e. mm.dd.yyyy or mm-dd-yyyy or mm/dd/yyyy ).");
			} else {
				// if you don't want to reformat as 123-456-7890, comment next line out
				theField.value = reformatUSDate(normalizedDate, delimiter);
				return true;
			}
		}
	}
}

//------------------------------------------------------------------------------
// checkUSPhone (TEXTFIELD theField [, BOOLEAN emptyOK==false])
// Check that string theField.value is a valid US Phone.
//------------------------------------------------------------------------------
function checkUSPhone (theField, s, emptyOK) {
	if (checkUSPhone.arguments.length < 3) emptyOK = defaultEmptyOK;
	if (checkUSPhone.arguments.length < 2) s = theField.name;
	if ((emptyOK == true) && (isEmpty(theField.value))) {
		return true;
	} else {
		var normalizedPhone = stripCharsNotInBag(theField.value, digits)
		if (isWhitespace(normalizedPhone)) {
			return warning (theField, s + " is a required field and cannot be empty.");
		} else {
			if (!isUSPhoneNumber(normalizedPhone, false)) {
				return warning (theField, s + " is not in the valid US Phone format ( i.e. 123-456-7890 ).");
			} else {
				// if you don't want to reformat as 123-456-7890, comment next line out
				theField.value = reformatUSPhone(normalizedPhone);
				return true;
			}
		}
	}
}

//------------------------------------------------------------------------------
// checkEmail (TEXTFIELD theField [, BOOLEAN emptyOK==false])
// Check that string theField.value is a valid Email.
//------------------------------------------------------------------------------
function checkEmail (theField, s, emptyOK) {
	if (checkEmail.arguments.length < 3) emptyOK = defaultEmptyOK;
	if (checkEmail.arguments.length < 2) s = theField.name;
	if ((emptyOK == true) && (isEmpty(theField.value))) {
		return true;
    } else {
		if (isWhitespace(s)) {
			return warning (theField, s + " is a required field and cannot be empty.");
		} else {
			if (!isEmail(theField.value, false)) {
				return warning (theField, s + " is not in the valid Email format ( i.e. MyID@wellsfargo.com ).");
			} else {
				return true;
			}
		}
	}
}

//------------------------------------------------------------------------------
// checkDropList (SELECT theField [, BOOLEAN emptyOK==false])
// Check that string theField.value is a valid Email.
//------------------------------------------------------------------------------
function checkDropList (theField, s, emptyOK) {
	if (checkDropList.arguments.length < 3) emptyOK = defaultEmptyOK;
	if (checkDropList.arguments.length < 2) s = theField.name;
	if (emptyOK == true) {
		return true;
    } else {
		if (theField.selectedIndex == 0) {
			return warning (theField, s + " is a required field. Please select an item from the list.");
		} else {
			return true;
		}
	}
}

//------------------------------------------------------------------------------
// checkDropList (SELECT theField [, BOOLEAN emptyOK==false])
// Check that string theField.value is a valid Email.
//------------------------------------------------------------------------------
function checkFixed (theField, s, places, symbol, commas, emptyOK) {
	if (checkFixed.arguments.length < 6) emptyOK = defaultEmptyOK;
	if (checkFixed.arguments.length < 5) commas = false;
	if (checkFixed.arguments.length < 4) symbol = false;
	if (checkFixed.arguments.length < 3) places = 2;
	if (checkFixed.arguments.length < 2) s = theField.name;
	if ((emptyOK == true) && (isEmpty(theField.value))) {
		return true;
	} else {
		var normalizedFixed = stripCharsNotInBag(theField.value, digits + '.-')
		if (isWhitespace(normalizedFixed)) {
			return warning (theField, s + " is a required field and cannot be empty.");
		} else {
			if (!isSignedFloat(normalizedFixed, false)) {
				return warning (theField, s + " is not in the valid Fixed format ( i.e. 123,456.78 ).");
			} else {
				// if you don't want to reformat as 123-456-7890, comment next line out
				theField.value = parseFixed(normalizedFixed, places, symbol, commas);
				return true;
			}
		}
	}
}

//------------------------------------------------------------------------------
// checkUSState (TEXTFIELD theField, STRING s [, BOOLEAN emptyOK==false])
// Check that string theField.value is a valid US State code.
//------------------------------------------------------------------------------
function checkUSState (theField, s, emptyOK) {
    if (checkUSState.arguments.length < 3) emptyOK = defaultEmptyOK;
    if (checkUSState.arguments.length < 2) s = theField.name;
    var sLength = 2;
    if ((emptyOK == true) && (isEmpty(theField.value))) {
		return true;
	} else {
		var normalizedstring = stripCharsNotInBag(theField.value, legalString).toUpperCase();
		if (checkString(theField, s, 2, emptyOK)) {
			if (isUSState(theField.value.toUpperCase())) {
				theField.value = theField.value.toUpperCase();
				return true;
			} else {
				return warning (theField, s + " must be a valid US State code (i.e. MN or CA ...).");
			}
		}
		return false;
	}
}

