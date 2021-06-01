var LeadPersonalizationFns = new function() {
        var _lang = document.documentElement.lang || "en",
            months = {
                "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                "fr": ["janvier", "f&eacute;vrier", "mars", "avril", "mai", "juin", "juillet", "ao&ucirc;t", "septembre", "octobre", "novembre", "d&eacute;cembre"]
            },
            weekDays = {
                "en": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "fr": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
            };

        this.localizeNumber = function(num, format, lang, content, signed) {
            var l = (lang) ? lang.replace(/^([a-zA-z]+)/, "$1") : _lang;
            var ret = '';
            var inner = (typeof(content) === 'undefined' || content.length === 0) ? false : true;
            var sign = (typeof(signed) === 'undefined' || signed.length === 0) ? null : signed;

            //console.log(num, format, l, content, sign)

            var thousandsChar = (l == 'fr') ? '<span class="thin-space"> </span>' : ',',
                decimalChar = (l == 'fr') ? ',' : '.',
                _num = parseInt(Math.abs(num), 10),
                _dec = parseInt(approx(parseFloat(Math.abs(num) - _num), 2) * 1000, 10),
                isNegative = !!(parseFloat(num) < 0);

            //console.log(num, _num, _dec, 3 - _dec.toString().length, Array(3 - _dec.toString().length).join('0'))

            var numStr = _num.toString();
            if(_num > 999) {
                var _numK = parseInt(_num / 1000, 10),
                    _numD = '00' + (_num - _numK * 1000).toString();
				if(_numK > 999) {
					var _numM = parseInt(_numK / 1000, 10),
						_numK = '00' + (_numK - _numM * 1000).toString();
					_numK = _numM.toString() + thousandsChar + _numK.substr(_numK.length - 3);
				}
                numStr = _numK.toString() + thousandsChar + _numD.substr(_numD.length - 3);
            }

            if(_dec > 0 || format == 'decimal') {
                var decStr = (Array(4 - _dec.toString().length).join('0') + _dec.toString() + '00').substr(0, 3); // with padding (.000)
                if(decStr.charAt(2) == '0') decStr = decStr.substr(0, 2);

                ret = numStr + decimalChar + decStr;
            }
            else ret = numStr;

            switch(sign) {
                case "signednumber":
                    sign = isNegative ? '-' : '+';
                    break;
                case "alphasignednumber":
                    sign = isNegative ? (l == 'fr' ? 'moins ' : 'minus ') : (l == 'fr' ? 'plus ' : 'plus ');
                    break;
                default:
                    sign = isNegative ? '-' : '';
            }

            return sign + ((l == 'fr' && !inner) ? ret + '<span class="thin-space"> </span>' : ret);
        };

        this.formatName = function(_name){
            var result = '';
            var name = _name.trim();
            var tokens = name.split(/[^a-zA-ZÀ-ÿ]+/g);
            var symbols = name.match(/[^a-zA-ZÀ-ÿ]+/g);
            for(var t in tokens) {
                result += Capitalize(tokens[t]);
                if(t < symbols.length) result += symbols[t].replace(/\s+/g, ' ');
            }
            return result;
        };

        this.formatDate = function(date, format, lang) {
            var l = (lang) ? lang.replace(/^([a-zA-z]+)/, "$1") : _lang;
            var ret = '';

            try {
                var dt, _date = date.split(/\D+/);
                _date[0] *= 1;
                _date[1] -= 1;
                _date[2] *= 1;

                dt = new Date(_date[0], _date[1], _date[2]);

                if(dt.getFullYear() == _date[0] && dt.getMonth() == _date[1] && dt.getDate() == _date[2]) {
                    ret = dt;
                }
                else throw new Error('The date specified (' + date + ') does not exist');
            }
            catch(er) {
                personalizationFailed();
                return ret;
            }

            var mmStr = dt.getMinutes(),
                displayTime = dt.getHours() > 0 || mmStr > 0,
                dayOfTheWeek = '';

            mmStr = '0' + mmStr.toString();
            mmStr = mmStr.substr(mmStr.length - 2);

            if(format == 'dayoftheweek') dayOfTheWeek = weekDays[l == 'fr' ? l : 'en'][dt.getDay()] + ' ';

            if(l == 'fr') {
                ret = (displayTime ? dt.getHours() + " h " + mmStr + " HE, " : "") +
                    dayOfTheWeek + (dt.getDate() == 1 ? dt.getDate() + '<sup>er</sup>' : dt.getDate()) + " " + months["fr"][dt.getMonth()] + " " + dt.getFullYear();
            }
            else {
                ret = (displayTime ? dt.getHours() + ":" + mmStr + " ET, " : "") +
                    dayOfTheWeek + months["en"][dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear();
            }

            return ret;
        };

        this.pluralize = function(str, noun, plural) {
            if (typeof(str) === 'undefined' || str.length === 0) return str;
            if (typeof(noun) === 'undefined' || noun.length === 0) return str;

            var _nbr = isNaN(str) ? parseFloat(str.replace(/[\$,+% ]/g, '')) : str;

            if (isNaN(_nbr) || +_nbr === 1) return str + " " + noun;
            else return (typeof(plural) !== 'undefined' && plural !== null) ? str + " " + plural : str + " " + noun + "s";
        };
    },
    innerPopupText = null,
    formattedLeadPersonalizationData = null,
    globalLeadPersonalizationData = null,
    leadPersonalizationTimeout = 3000,
    isPersonalizedDataFetched = false,
    isPreviewMode = getParam("previewMode"),
    isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
    bmo404Pg = "https://www.bmo.com/LME/error/errorCreative.htmlx",
    attributeDelim = ":",
    typeDelim = "|",
	pageTitleTagName = "_AD_PAGE_TITLE_";

function personalizationFailed() {
    var localCT = ( (typeof creativeType) == 'undefined' ) ? 'unknown' : creativeType ;
    if ( "interstitial" == localCT ) {
        if ( sendErrorTimeout && ( typeof( sendErrorTimeout ) === typeof( Function ) ) ) {
            sendErrorTimeout(generalErrorDiv, "generalError_errorCode", "4010 : personalizationFailed");
        }
    } else {
        document.body.style.visibility = "hidden";
        if ( localCT != "adBanner") {
            window.location.href = bmo404Pg;
        }
    }
}

function marketingOfferAdCB(data){
    isPersonalizedDataFetched = true;
    //formattedLeadPersonalizationData = JSON.parse(JSON.stringify(data));
    formattedLeadPersonalizationData = cloneObj(data);
    if (_isAllParamsPopulatedAndFilled(params || [], data)) {
        globalLeadPersonalizationData = data;
        if(innerPopupText) var delayer = setTimeout(function() {
                loadTermsTextFromFile(innerPopupText);
            }, 500);
		document.body.style.visibility = "visible";
		if (creativeType == "adBanner" && data[pageTitleTagName])
    		document.getElementsByTagName('html')[0].setAttribute("title", data[pageTitleTagName]);
    }
    else personalizationFailed();
}

function clickBannerAd() {
    if (typeof window.postMessage !== 'function') {
        _clickBannerAdIFrame();
    }
    else {
        try {
            var data = '{"magicId": "' + magicId + '", "action": "click"}';
            top.postMessage(data,'https://' + domain.substring(0, domain.lastIndexOf('/')));
        }
        catch (err) {
            _clickBannerAdIFrame();
        }
    }
    return false;
}

function _isAllParamsPopulatedAndFilled(paramsArray, data) {
    paramsArray.sort();
    for (var i = 0 ; i < paramsArray.length; i++) {
        var formattedValue = '';
        var paramName = paramsArray[i].split(typeDelim)[0].split(attributeDelim)[0];
        var value = data[paramName];
        var maxInstance = 1;
        if(paramsArray[i].indexOf(attributeDelim) > 0) maxInstance = parseInt(paramsArray[i].split(typeDelim)[0].split(attributeDelim)[1]);
        var paramType = 'generic';
        if(paramsArray[i].indexOf(typeDelim) > 0) paramType = paramsArray[i].split(typeDelim)[1];

        //console.log(paramName, value, maxInstance, paramType);

        if (!value)
            return false;
        else {
            formattedValue = value;
            for(var j = 1; j <= maxInstance; j++) {
                var e = document.getElementById(paramName + (maxInstance > 1 ? ':' + j : ''));
                if (e) {
                    switch (paramType) {
                        case 'string':
                            formattedValue = value;
                            break;
                        case 'name':
                            formattedValue = LeadPersonalizationFns.formatName(value);
                            break;
                        case 'date':
                            if (/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/.test(value))
                                formattedValue = LeadPersonalizationFns.formatDate(value, e.getAttribute("data-format"), e.getAttribute("lang"));
                            else return false;
                            break;
                        case 'number':
                        case 'signednumber':
                        case 'alphasignednumber':
                            if (/^([-])?\d+(\.\d*)?$/.test(value))
                                formattedValue = LeadPersonalizationFns.localizeNumber(value, e.getAttribute("data-format"), e.getAttribute("lang"), e.innerHTML, paramType == "number" ? undefined : paramType);
                            else if (/^([-])?\.(\d*)$/.test(value))
                                formattedValue = LeadPersonalizationFns.localizeNumber(parseFloat(value) * 100, e.getAttribute("data-format"), e.getAttribute("lang"), e.innerHTML, paramType == "number" ? undefined : paramType);
                            else return false;
                            break;
                        case 'percentage':
                            if (/^([-])?\d+\.(\d*)$/.test(value))
                                formattedValue = LeadPersonalizationFns.localizeNumber(parseFloat(value) * 100, e.getAttribute("data-format"), e.getAttribute("lang"), e.innerHTML);
                            else return false;
                            break;
                    }
                    switch (paramType) {
                        case 'name':
                            e.innerHTML = formattedValue;
                            break;
                        default:
                            e.innerHTML = LeadPersonalizationFns.pluralize(formattedValue, e.innerHTML, e.getAttribute("data-plural"));
                    }
                    e.setAttribute('class', 'lead_parameter');
                    formattedLeadPersonalizationData[paramName] = formattedValue;
                }
            }
        }
    }
    return true;
}

function _clickBannerAdIFrame() {
    var id = "clickBannerAdIFrame";
    var ifrm = document.getElementById(id);
    var url = "https://" + domain + "/cgi-bin/netbnx/NBmain/AdTracking?action=click&magicId=" + magicId;
    if (ifrm) {
        ifrm.setAttribute("src", url);
    }
    else {
        ifrm = document.createElement("IFRAME");
        ifrm.setAttribute("id", id);
        ifrm.setAttribute("src", url);
        ifrm.setAttribute("frameborder", "0");
        ifrm.style.width = "0px";
        ifrm.style.height = "0px";
        ifrm.style.visibility = "hidden";
        document.body.appendChild(ifrm);
    }
}

function fetchPersonalizedDataFailed() {
    if (!isPersonalizedDataFetched) {
        personalizationFailed();
    }
}

function fetchPersonalizedData() {
    if (isPreviewMode) {
        document.body.style.visibility = "visible";
        addCSSRule(document.styleSheets[0], ".lead_parameter", "background: yellow", 1);
    }
    if (window.opener && window.opener.globalLeadPersonalizationData) {
        marketingOfferAdCB(window.opener.globalLeadPersonalizationData);
    } else {
        if (isPreviewMode) return;
        var sc = document.createElement('script');
        sc.type = 'text/javascript';
        sc.src = "https://" + domain + "/MarketingOfferAdParam?magicId=" + magicId;
        document.getElementsByTagName('head')[0].appendChild(sc);
    }
}

if (!isPreviewMode)
    setTimeout("fetchPersonalizedDataFailed()", leadPersonalizationTimeout);

function loadTermsTextFromFile(url) {
    var xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function() {
        var terms_text;
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            terms_text = xmlhttp.responseText;
            if(!isPreviewMode) terms_text = replaceTermsWithPersonalizedData(terms_text, formattedLeadPersonalizationData);

            var terms_popup = document.getElementById('terms_popup');
            if(terms_popup) terms_popup.onclick = function() { createTermsPDF(prepareForPDF(terms_text)); };
            // if(terms_popup) terms_popup.onclick = function() { writeToWindow(terms_text); };

            var terms_popup_html = document.getElementById('terms_popup_html');
            if(terms_popup_html) terms_popup_html.onclick = function() { writeToWindow(terms_text); };
			
            var terms_frame = document.getElementById('terms_frame');
            var terms_frame_document = (terms_frame.contentWindow || terms_frame.contentDocument);
            if (terms_frame_document.document) terms_frame_document = terms_frame_document.document;
            terms_frame_document.write(terms_text);
            if(isFirefox) terms_frame.contentWindow.stop();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function replaceTermsWithPersonalizedData(text, data) {
    if(!data) return;
    var t = text;

    for(var key in data) {
        var r = new RegExp('##' + key + '##', 'ig');
        t = t.replace(r,  data[key]);
    }

    return t;
}

function openMagicIdPopup(url, n, a) {
    url += (url.indexOf("?") == -1 ? "?" : "&") + "magicId=" + magicId;
    if(isPreviewMode) url += (url.indexOf("?") == -1 ? "?" : "&") + "previewMode=1";
    var w = window.open(url, n, a);
}

function prepareForPDF(string) {
    string = string.split('<span class="thin-space"> </span>').join('&nbsp;');
    return string;
}

function createTermsPDF(text) {
	var pdfAction = "https://www.bmo.com/bmocda/pdf/bfo_reflector.jsp"; //"https://tqavgn-bmo.dev.bmo.com/bmocda/pdf/bfo_reflector.jsp";
    var pdfVar = "xml"; // "env"
    var pdfMethod = "post";
    var useTextArea = false;

    var pdfArea = document.getElementById('pdfArea');
    if(pdfArea) pdfArea.parentNode.removeChild(pdfArea);
    var pdfForm = document.getElementById('pdfForm');
    if(pdfForm) pdfForm.parentNode.removeChild(pdfForm);

    pdfForm = document.createElement('form');
    pdfForm.setAttribute('id', 'pdfForm');
    pdfForm.setAttribute('name', 'pdfForm');
    pdfForm.setAttribute('style', 'display:none;');
    pdfForm.setAttribute('method', pdfMethod);
    pdfForm.setAttribute('action', pdfAction);
    pdfForm.setAttribute('target', '_blank');

    pdfArea = useTextArea ? document.createElement('textarea') : document.createElement('input');
    pdfArea.setAttribute('id', 'pdfArea');
    pdfArea.setAttribute('name', pdfVar);
    if(!useTextArea) {
        pdfArea.setAttribute('type', 'text');
        pdfArea.setAttribute('value', text);
    }

    pdfForm.appendChild(pdfArea);
    document.getElementsByTagName('body')[0].appendChild(pdfForm);
    if(useTextArea) document.getElementById('pdfArea').innerHTML = text;

    document.forms.pdfForm.submit();
}

function writeToWindow(text) {
    if(text != undefined && (text == null || text.trim() == '')) {
        return false;
    }
	var termsWindow = window.open("", "_blank", "width=500,height=600,scrollbars=yes,resizable=yes");
    termsWindow.document.write("<html>"+text+"</html>");
	termsWindow.document.close();
}

function approx(number, precision) {
    return (parseFloat(number.toPrecision(precision)));
}

function Capitalize(word){
    return word.substr(0,1).toUpperCase() + word.substr(1).toLowerCase();
}

//trim() polyfill for IE8-
if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

function addCSSRule(sheet, selector, rules, index) {
    if(sheet.insertRule) {
        sheet.insertRule(selector + "{" + rules + "}", index);
    } else {
        sheet.addRule(selector, rules, index);
    }
}

//Would love to be able to use JSON.parse(JSON.stringify(obj)) instead...
function cloneObj(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor();

    for(var key in obj)
        temp[key] = cloneObj(obj[key]);
    return temp;
}