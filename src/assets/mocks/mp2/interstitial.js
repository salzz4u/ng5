
var reMarketingOfferAdCBResponse = /^s*marketingOfferAdCB\((.*)\);s*$/m ;
var interstitialInitSlowTimeout = 3000;
var interstitialInitResponseTimeout = 10000;

function handleInterstitialInitSlow() {
    showDiv("loading_wrapper");
}

function handleInterstitialInitTimeout( url ) {
    sendErrorTimeout(generalErrorDiv, "generalError_errorCode", "1010 : The request for " + url + " timed out.");
}

function doInterstitialInit() {

    trace("log: doInterstitialInit");
    isPreviewMode = getParam("previewMode");
    setMessages();

    if (isPreviewMode) {
        trace("log: doInterstitialInit preview");
        showDiv(initialDiv);
        return false;
    }

    var url = "https://" + domain + offerAdParamURL + '?magicId=' + magicId;

    // show waiting message if response is slow
    var slowTimeoutID = setTimeout("handleInterstitialInitSlow()", interstitialInitSlowTimeout);


    var xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("POST", url, true);

    // timeout = 10 seconds
    xmlhttp.timeout = interstitialInitResponseTimeout; // time in milliseconds

    // xmlhttp.ontimeout = function (e) { handleInterstitialInitTimeout( url ); };

    xmlhttp.onreadystatechange = function () {
        try {
            if (xmlhttp.readyState == 4) {
                window.clearTimeout(slowTimeoutID);

                if (xmlhttp.status == 200) {
                    // response is really JSONP so turn into JSON
                    var arResponseText = reMarketingOfferAdCBResponse.exec(xmlhttp.responseText);

                    if (null != arResponseText) {

                        var offerJson = JSON.parse('{ "marketingOfferAdCB" : ' + arResponseText[1] + ' } ');

                        // var offerJson = JSON.parse(test_offerAdCB);
                        if (offerJson &&
                        (typeof offerJson.marketingOfferAdCB != 'undefined') &&
                        offerJson.marketingOfferAdCB &&
                        (typeof offerJson.marketingOfferAdCB.ACCOUNT_LIST != 'undefined') &&
                        offerJson.marketingOfferAdCB.ACCOUNT_LIST
                    ) {
                            if (offerJson.marketingOfferAdCB.EMAIL_ADDRESS) {
                                savedEmail = offerJson.marketingOfferAdCB.EMAIL_ADDRESS;
                            }
                            var out = "";
                            if (offerJson.marketingOfferAdCB.ACCOUNT_LIST.length > 0) {
                                for (var i = 0; i < offerJson.marketingOfferAdCB.ACCOUNT_LIST.length; i++) {
                                    out += '<tr><td><span>' + offerJson.marketingOfferAdCB.ACCOUNT_LIST[i].accountName +
                                        '</span></td><td><span>' + offerJson.marketingOfferAdCB.ACCOUNT_LIST[i].accountNumber + '</span></td></tr>';
                                }
                            }
                            if (document.getElementById(accountDiv)) {
                                if (!out == "") {
                                    document.getElementById(accountDiv).innerHTML = out;
                                } else {
                                    // This is not MC but no account list  .... error
                                    sendError2(generalErrorDiv, "generalError_errorCode", "1020 : account list div missing");
                                }
                            }
                            showDiv(initialDiv);
                        } else {
                            sendError2(generalErrorDiv, "generalError_errorCode", "1030 : cannot convert to valiad JSON the response from " + url);
                        }
                    } else {
                        sendError2(generalErrorDiv, "generalError_errorCode", "1040 : invalid response from " + url);
                    }
                }
                else {
                    // sendError2(generalErrorDiv, "generalError_errorCode", "1050 : error getting response from " + url + " status==" + xmlhttp.status);
                    sendErrorTimeout(generalErrorDiv, "generalError_errorCode", "1050 : Error getting response from " + url );
                }
            }

        } catch ( e ) {
            sendErrorTimeout(generalErrorDiv, "generalError_errorCode", "1060 : Error getting response from " + url );
        }

    }

    xmlhttp.send();

    return false;
}
