/*
 OLB Marketing scripts v2.26

 May 12, 2017 - add classes to support new OSA
 April 11, 2017 - add day 2 Interstitial classes.
 October 19, 2016 - merge interstitial.js into this file.

October 7, 2016
 - add event listeners to button tags as well (on top of A tags ), as interstitials use buttons
 - handle href attribute if object is a button (vs A) for Redirect* event handlers

September 26, 2016
 - Add Interstitial init function, OLB tour

June 17, 20006
 - Update powerswitch links something something

 tra/acc/pws/powerSwitchDNHInit?mode=form

June 15, 2016
- added editProfile class

May 17, 2016
- added addAlerts class

March 23, 2016
 - added paymentTransfer class

January 20, 2016
 - added SetUpCSP class

July 30, 2015
 - update checkboxCC_PAPLOC_AirMiles and checkboxCC_PAPLOC - &status=1

July 22, 2015
 - update checkboxCC_PAPLOC_AirMiles and checkboxCC_PAPLOC (MC.MCPAO revised to MC for correct eCorr sorting)

July 16, 2015
 - update olbURL to concact z=timestamp with ? or & by checking if the query string exists in the URL already

 June 26, 2015
 - added checkboxCC_PAPLOC_AirMiles class
 - fixes on checkboxCC_PAPLOC based off https://www.bmo.com/LME/MessageCentre/September2013/PreApproved_CC/CC_PA_XSLL_1/en/index.html

 June 24, 2015
 - added eTransfers class

 June 17, 2015
 - update preapproveMortgage value

 June 10, 2015
 - added checkboxBalanceTransfer

 June 8, 2015
 - added checkboxCC_PAPLOC
 - changes to continueIfAgreed function to accommodate for checkboxCC_PAPLOC and test parameter

 June 3, 2015
 - added test script for Credit Card upsell - CC_PAPLOC_Conf

 June 2, 2015
 - fixed SSA

 June 1, 2015
 - added MortgageRenewal5Fixed and MortgageRenewal5Variable
 - fixed CC_PAPLOC_Conf

 May 28, 2015
 - fixed PAPLOC

 April 29, 2015
 - Added RedirectService and AddAuthUser

 April 9, 2015
 - changed notifyOlbAccounts so that it always add olbPath to domain

 March 31, 2015
 - Added/edited SBA to mimic http://www.bmo.com/LME/MessageCentre/May2014/SSA/en/index.html

 January 28, 2015
 - Added OpenTFSA_MarketingPages

 */
var domain;
var olbPath;
var inprint;
var magicId;

var LogFulfilledSales = 'LogFulfilledSales';
var LogFulfilledService = 'LogFulfilledService';
var LogAppointmentOAB = 'LogAppointmentOAB';
var LogFulfilledRedirect = 'LogFulfilledRedirect';
var LogFulfilledOther = 'LogFulfilledOther';
var product_list = '';
var accountUrl = '/OLBmain/ssoSspa?mode=confirmation&step=2'; //OSA - LogFulfilledSales
var accountSSPAUrl = '/OLBmain/ssoSspa?mode=confirmation&frameId=SSPAFrame_AdBanner&step=2'; //OSA - SSPA

var openOSAolbUrl = '/OLBmain/ssoSspa?mode=confirmation&amp;step=1&amp;olb=y'; //OSA - open new account Debit
var openOSArmcUrl = '/RMCmain/ssoSspa?mode=confirmation&amp;step=1&amp;olb=y'; //OSA - open new account Credit

var eStatementsUrl = '/fin/acc/bnk/statementOptionInit?mode=form'; //eStatements - FBC & FBCB
var eStatementsMCUrl = '/RMC/fin/acc/bnk/mcStatementOptionInit?mode=form&mcNumber=0'; //eStatements - RMC
var eStatementsSBMCUrl = '/CMC/fin/acc/bnk/mcStatementOptionInit?mode=form&mcNumber=0'; //eStatements - SBMC
var oabFrameUrl = '/OLBmain/ssoOai?mode=confirmation&frameId=OABBannerFrame&olb=y&oai_jump_app=OAB&oai_jump_entry=new'; //OSA - LogAppointmentOAB
var oabUrl = '/ssoOai?mode=confirmation&olb=y&oai_jump_app=OAB&oai_jump_entry=manage';
var oabNoticesUrl =
  '/mes/messagesImportantNotices/null/messagesImportantNoticesDetails?mode=form&LaunchOverlayType=OAB';
var oabMCUrl = '/mes/messagesBMOOffers/null/messagesBMOOffersDetails?mode=form&LaunchOverlayType=OAB';
var sbaUrl = '/mes/messagesBMOOffers/null/messagesBMOOffersDetails?mode=form&LaunchOverlayType=OSA';
var ssaUrl = '/mes/messagesBMOOffers/null/messagesBMOOffersDetails?mode=form&LaunchOverlayType=OSA';
var osaRrspUrl = '/sre/inv/null/purchaseRRSPInit?mode=form'; //RRSP
var osaUrl = '/sre/inv/null/purchaseInit?mode=form'; //GIC
var setupBalTransUrl = '/ClickToFormServlet?formName=SetupBalanceTransfer'; //Balance Transfer
var osaMfUrl = '/ClickToFormServlet?formName=PurchaseMutualFunds'; //Mutual Funds
var addAuthUserUrl = '/ClickToFormServlet?formName=AddAuthorizedUser'; //Add Authorized User
var redirectUrl = '/cgi-bin/netbnx/TrackMarketingStatus';
var preapprovedUrl = '/mes/messagesBMOOffers/null/preApprovedOffers?mode=confirmation&trackForm=Y'; //Debit+MC
var plocOfferUrl =
  '/mes/messagesBMOOffers/null/messagesBMOOffersDetails?mode=form&showAirMilesYorN=N&bmooffer=Y&LaunchOverlayType=PAPLOC';
var CC_preapprovedPlocUrl = '/mes/messagesBMOOffers/null/messagesBMOOffersDetails?mode=form&bmooffer=Y&trackForm=Y';
var plocUrl = '/mes/messagesBMOOffers/null/messagesBMOOffersDetails?mode=form&showAirMilesYorN=N&status=1';
var preapproveMortgage = '/mes/messagesBMOOffers/null/MessagesBMOOffersFormSbmt'; //mortgage renewal
var westernUnionUrl = '/tra/irm';
var eTransferUrl = '/tra/ema'; //eTransfers
var paymentTransferUrl = '/tra'; //Payments and transfers
var crossborderUrl = '/tra/acc/nul/accountTransferInit?mode=form';
var tfsaUrl = '/inv/mon/null/TFSAccountOpenInit?mode=introduction2'; //TFSA Open an account
var tfsaApplyUrl = '/sre/inv/null/TFSAccountOpenInit?mode=introduction2'; //TFSA Apply now
var preapprovedMCUrl = '/mes/messagesImportantNotices/null/preApprovedOffers?mode=confirmation';
var switchPlanUrl =
  '/mes/messagesImportantNotices/null/preApprovedOffers?mode=confirmation&trackForm=Y&productType=ImportantNotice.PAO&offerAction=A&leadCode=Campaign ID&pageId=123';
var setCSPUrl = '/ClickToFormServlet?formName=SetupCSP';
var profileUrl = '/ppr'; //Profiles
var alertsUrl = '/ppr/alr'; //Alerts
var payBill = '/tra/acc/mak/billerPayInit?mode=form'; // Pay a bill
var osa2Url = '/sre/eve/sap/everydayBanking?mode=form'; // open an account, 2017 version . removed /onlinebanking/OLB

// Interstitial URLs
var continueToOLBURL = '/fin';
var offerAdParamURL = '/MarketingOfferAdParam';
var enrollEstatementURL = '/EnrollEStatements';
var trackMarketingURL = '/cgi-bin/netbnx/TrackMarketingStatus';
var subscribeEstatementURL = '/SubscribeEStatementAlerts';
var interstitialOABFrame =
  '/OLBmain/ssoOai?mode=confirmation&olb=y&oai_jump_app=OAB&oai_jump_entry=manage&frameId=interstitialFrame';
var interstitialOSAFrame = '/OLBmain/ssoSspa?mode=confirmation&step=1&olb=y';
var interstitialMessageCentre = '/mes/messagesBMOOffers';

function set_cookie(name, value, path, domain, secure) {
  var cookie_string = name + '=' + escape(value);
  if (path) cookie_string += '; path=' + escape(path);
  if (domain) cookie_string += '; domain=' + escape(domain);
  if (secure) cookie_string += '; secure';
  document.cookie = cookie_string;
}

function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

function removeCookie(name) {
  document.cookie = name + '=; expires=0; path=/; domain=.bmo.com';
}

function getParam(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null) return '';
  else return results[1];
}

function customPopup(url, features) {
  window.open(url, '_blank', features);
}

function createTrackingPixel() {
  var pixelTracker = document.createElement('img');
  pixelTracker.id = 'callback';
  pixelTracker.src = '';
  pixelTracker.alt = '';
  pixelTracker.style.display = 'none';
  var theBody = document.getElementsByTagName('body')[0];
  theBody.appendChild(pixelTracker);
}

window.onload = function () {
  domain = readCookie('SetDomainToBMO');
  olbPath = readCookie('OlbServletPath');
  inprint = readCookie('InPrint');
  removeCookie('InPrint');
  magicId = getParam('magicId');
  var anchorTags = document.getElementsByTagName('A');
  // add event listeners to all anchor elements
  for (var i = 0; i < anchorTags.length; i++) {
    addEventListenerCrossBrowser(anchorTags[i], 'click', evaluateAnchor);
  }
  // add event listeners to all button elements
  var buttonTags = document.getElementsByTagName('BUTTON');
  for (var i = 0; i < buttonTags.length; i++) {
    addEventListenerCrossBrowser(buttonTags[i], 'click', evaluateAnchor);
  }
  // add event listeners for the checkbox+continue button combo
  var agree_checkbox = document.getElementById('agree_checkbox');
  var continue_button = document.getElementById('continue_button');
  if (continue_button && agree_checkbox) {
    addEventListenerCrossBrowser(agree_checkbox, 'click', function () {
      if (agree_checkbox.checked) {
        continue_button.setAttribute('class', 'redButton');
        continue_button.setAttribute('className', 'redButton');
      } else {
        continue_button.setAttribute('class', 'redButton-inactive');
        continue_button.setAttribute('className', 'redButton-inactive');
      }
    });
  }
  // Call Interstitial init function if defined
  if (typeof doInterstitialInit === 'function') {
    doInterstitialInit();
  }
};

function getHref(obj) {
  var objHref = null;
  if ('a' == obj.tagName || 'A' == obj.tagName) {
    objHref = obj.href;
  } else if ('button' == obj.tagName || 'BUTTON' == obj.tagName) {
    objHref = obj.getAttribute('href');
  }
  return objHref;
}

function evaluateAnchor(event) {
  //message centre URLs
  var obj;
  if (window.attachEvent && !window.addEventListener) {
    obj = event.srcElement;
  } else {
    obj = event.target;
  }

  var objClass = obj.className;
  String.prototype.testClass = function (string) {
    return this.indexOf(string) != -1 ? this.toString() : null;
  };
  //PLEASE NOTE: it's important that classes with similar names (e.g. OpenTFSA, OpenTFSA_MarketingPages)
  //are listed so that the longer name comes first in the switch
  switch (objClass) {
    case objClass.testClass('Interstitial_SwitchPWS'):
      obj.target = '_top';
      obj.onClick = doCustomPowerSwitch(obj);
      break;
    case objClass.testClass('Interstitial_RedirectInternal'):
      customPopup(getHref(obj), '');
      closeInterstitial(LogFulfilledRedirect);
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      break;
    case objClass.testClass('Interstitial_RedirectOther'):
      customPopup(getHref(obj), '');
      closeInterstitial(LogFulfilledOther);
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      break;
    case objClass.testClass('Interstitial_NoThanks'):
      obj.onClick = doNoThanks();
      break;
    case objClass.testClass('Interstitial_RemindMeLater'):
      obj.onClick = doRemindMeLater();
      break;
    case objClass.testClass('Interstitial_GoToSelectAccounts'):
      obj.target = '_top';
      obj.onClick = notifyOlb(obj, LogFulfilledRedirect, eStatementsUrl);
      break;
    case objClass.testClass('Interstitial_OAB_MarketingPages'):
      obj.onClick = interstitialOAB();
      break;
    case objClass.testClass('Interstitial_OAB'):
      obj.target = '_self';
      obj.onClick = interstitialNotifyOLBmainTarget(obj, LogAppointmentOAB, interstitialOABFrame);
      break;
    case objClass.testClass('Interstitial_OSA'):
      obj.target = '_top';
      obj.onClick = notifyOlbTrack(obj, LogFulfilledSales, '/sre');
      //            obj.onClick = interstitialNotifyOLBmain(obj, LogFulfilledSales, "/sre");
      break;
    case objClass.testClass('Interstitial_AddAuthUser'):
      //obj.target = "_top";
      obj.onClick = interstitialNotifyOLBmain2(obj, LogFulfilledSales, addAuthUserUrl);
      break;
    case objClass.testClass('Interstitial_TFSA'):
      obj.target = '_top';
      obj.onClick = interstitialNotifyOlb(obj, LogFulfilledService, tfsaApplyUrl);
      break;
    case objClass.testClass('Interstitial_CC_PAPLOC_Conf'):
      obj.target = '_top';
      obj.onClick = interstitialNotifyOlb(obj, LogFulfilledRedirect, interstitialMessageCentre);
      break;
    case objClass.testClass('Interstitial_eTransfers'):
      obj.target = '_top';
      obj.onClick = interstitialNotifyOlb(obj, LogFulfilledService, eTransferUrl);
      break;
    case objClass.testClass('Interstitial_addAlerts'):
      obj.target = '_top';
      obj.onClick = interstitialNotifyOlb(obj, LogFulfilledService, alertsUrl);
      break;
    case objClass.testClass('Interstitial_OpenMoneylogic'):
      obj.target = '_top';
      obj.onClick = interstitialcustomOLB(obj, LogFulfilledService);
      break;
    case objClass.testClass('Interstitial_editProfile'):
      obj.target = '_top';
      obj.onClick = interstitialNotifyOlb(obj, LogFulfilledService, profileUrl);
      break;
    case objClass.testClass('Interstitial_paymentTransfer'):
      obj.onClick = interstitialNotifyOlb(obj, LogFulfilledService, paymentTransferUrl);
      break;
    // editProfile
    //MGRN - 5F
    case objClass.testClass('MortgageRenewal5Fixed'):
      obj.onClick = notifyOlbOffersForm(obj, LogFulfilledSales, preapproveMortgage, 'A', 'MGRN', {
        rateType: '5 Year Fixed',
      });
      break;
    case objClass.testClass('Interstitial_MortgageRenewal5Fixed'):
      obj.onClick = notifyOlbOffersForm(obj, LogFulfilledSales, preapproveMortgage, 'A', 'MGRN', {
        rateType: '5 Year Fixed',
      });
      break;
    //MGRN - 5V
    case objClass.testClass('MortgageRenewal5Variable'):
      obj.onClick = notifyOlbOffersForm(obj, LogFulfilledSales, preapproveMortgage, 'A', 'MGRN', {
        rateType: '5 Year Variable',
      });
      break;
    case objClass.testClass('CC_PAPLOC_Conf'):
      obj.target = '_top';
      obj.onClick = notifyOlbOffers(obj, LogFulfilledSales, preapprovedUrl, 'A', 'MC');
      break;
    case objClass.testClass('PLOC_OfferForm'):
      obj.target = '_top';
      obj.onClick = notifyOlbOffers(obj, LogFulfilledSales, plocOfferUrl, 'A', 'PLOC');
      break;
    case objClass.testClass('PLOC_Conf'):
      obj.onClick = notifyOlbOffers(obj, LogFulfilledSales, plocUrl, 'A', 'PLOC');
      break;
    case objClass.testClass('PurchaseGIC'):
      obj.onClick = notifyOlb(obj, LogFulfilledSales, osaUrl);
      break;
    case objClass.testClass('PurchaseRRSP'):
      obj.target = '_top';
      obj.onClick = notifyOlb(obj, LogFulfilledSales, osaRrspUrl);
      break;
    case objClass.testClass('PurchaseMF'):
      obj.onClick = notify(obj, LogFulfilledSales, osaMfUrl);
      break;
    case objClass.testClass('SetUpCSP'):
      obj.onClick = notifyNoInprint(obj, LogFulfilledSales, setCSPUrl);
      break;
    case objClass.testClass('AddAuthUser'):
      obj.onClick = notify(obj, LogFulfilledSales, addAuthUserUrl);
      break;
    case objClass.testClass('eStatementsDCP'):
      obj.target = '_top';
      obj.onClick = notifyOlb(obj, LogFulfilledService, eStatementsUrl);
      break;
    case objClass.testClass('eStatementsMCP'):
      obj.target = '_top';
      obj.onClick = notify(obj, LogFulfilledService, eStatementsMCUrl);
      break;
    case objClass.testClass('eStatementsMCSB'):
      obj.target = '_top';
      obj.onClick = notify(obj, LogFulfilledService, eStatementsSBMCUrl);
      break;
    case objClass.testClass('MoneyTransfers'):
      obj.target = '_top';
      obj.href = 'https://' + domain + olbPath + westernUnionUrl;
      break;
    case objClass.testClass('eTransfers'):
      obj.target = '_top';
      obj.href = 'https://' + domain + olbPath + eTransferUrl;
      break;
    case objClass.testClass('paymentTransfer'):
      obj.target = '_top';
      obj.onClick = notifyOlb(obj, LogFulfilledService, paymentTransferUrl);
      break;
    case objClass.testClass('CrossBorderTransfer'):
      obj.target = '_top';
      obj.onClick = customCrossBorderTransfer(obj);
      break;
    case objClass.testClass('PayBill'):
      obj.target = '_top';
      obj.onClick = customOLBRedirect(obj, LogFulfilledService, payBill);
      break;
    case objClass.testClass('addAlerts'):
      obj.target = '_top';
      obj.href = 'https://' + domain + olbPath + alertsUrl;
      obj.onClick = notifyOlb(obj, LogFulfilledService, alertsUrl);
      break;
    case objClass.testClass('editProfile'):
      obj.target = '_top';
      obj.href = 'https://' + domain + olbPath + profileUrl;
      obj.onClick = notify(obj, LogFulfilledService, profileUrl);
      break;
    case objClass.testClass('OpenTFSA_MarketingPages'):
      obj.target = '_top';
      obj.onClick = notifyOlb(obj, LogFulfilledService, tfsaUrl);
      break;
    case objClass.testClass('OpenTFSA'):
      obj.target = '_self';
      obj.onClick = notifyOlb(obj, LogFulfilledService, tfsaUrl);
      break;
    case objClass.testClass('PurchaseTFSAApply'):
      obj.target = '_top';
      obj.onClick = notifyOlbTrack(obj, LogFulfilledService, tfsaApplyUrl);
      break;
    case objClass.testClass('SwitchPlanImpNotConf'):
      obj.target = '_top';
      obj.onClick = notifySwitch(obj, switchPlanUrl);
      break;
    case objClass.testClass('OAB_Notices'):
      obj.target = '_top';
      obj.onClick = notifyOlb(obj, LogAppointmentOAB, oabNoticesUrl);
      break;
    case objClass.testClass('OAB_Offers'):
      obj.target = '_top';
      obj.onClick = notifyOlb(obj, LogAppointmentOAB, oabMCUrl);
      break;
    case objClass.testClass('OAB_MarketingPages'):
      obj.target = '_self';
      obj.onClick = notify(obj, LogAppointmentOAB, oabFrameUrl);
      break;
    case objClass.testClass('checkboxBalanceTransfer'):
      /*obj.target = "_top";*/
      obj.onClick = continueIfAgreed(setupBalTransUrl, '', '', '', '', LogFulfilledSales);
      break;
    case objClass.testClass('Interstitial_checkboxBalanceTransfer'):
      /*obj.target = "_top";*/
      obj.onClick = continueIfAgreed(setupBalTransUrl, '', '', '', '', LogFulfilledSales);
      break;
    case objClass.testClass('checkboxCC_PAPLOC_AirMiles'):
      obj.target = '_top';
      obj.onClick = continueIfAgreed(
        CC_preapprovedPlocUrl + '&showAirMilesYorN=Y&status=1',
        'MC',
        'PAPLOC',
        'A',
        olbPath,
        LogFulfilledSales
      );
      break;
    case objClass.testClass('checkboxCC_PAPLOC'):
      obj.target = '_top';
      obj.onClick = continueIfAgreed(
        CC_preapprovedPlocUrl + '&showAirMilesYorN=N&status=1',
        'MC',
        'PAPLOC',
        'A',
        olbPath,
        LogFulfilledSales
      );
      break;
    case objClass.testClass('checkboxPAPLOC'):
      obj.target = '_top';
      obj.onClick = continueIfAgreed(plocUrl, 'PLOC', 'PAPLOC', 'A', olbPath, LogFulfilledSales);
      break;
    case objClass.testClass('checkboxLOC'):
      obj.target = '_top';
      obj.onClick = continueIfAgreed(plocUrl, 'PLOC', 'PAPLOC', 'A', olbPath, LogFulfilledSales);
      break;
    case objClass.testClass('RedirectInternal'):
      if (!document.getElementById('callback')) {
        createTrackingPixel();
      }
      customPopup(getHref(obj), '');
      obj.onClick = notifyOLB_redirect(obj, LogFulfilledRedirect, redirectUrl);
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      break;
    case objClass.testClass('RedirectOther'):
      if (!document.getElementById('callback')) {
        createTrackingPixel();
      }
      customPopup(getHref(obj), '');
      obj.onClick = notifyOLB_redirect(obj, LogFulfilledOther, redirectUrl);
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      break;
    case objClass.testClass('RedirectService'):
      if (!document.getElementById('callback')) {
        createTrackingPixel();
      }
      customPopup(getHref(obj), '');
      obj.onClick = notifyOLB_redirect(obj, LogFulfilledService, redirectUrl);
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      break;
    case objClass.testClass('Locator'):
      if (!document.getElementById('callback')) {
        createTrackingPixel();
      }
      customPopup(getHref(obj), 'scrollbars=0,resizable=0,width=982,height=700,left=125,top=-15');
      obj.onClick = notifyOLB_redirect(obj, LogFulfilledRedirect, redirectUrl);
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      break;
    /*
    OSA2_PCA    PCAPAL1 - BMO CAD Primary Chequing
    OSA2_PRSA   PRSPAL2 - BMO CAD Premium Rate Savings
    OSA2_SSPA   HS1PAL2 - BMO CAD Smart Saver
    OSA2_SBA    HS2PAL2 - BMO CAD Savings Builder Account
    OSA2_USDPCA PCAPAL3 - BMO USD Primary Chequing
    OSA2_USDPRSA    PRSPAL4 - BMO USD Premium Rate Savings
    */
    case objClass.testClass('OSA2_PCA'):
      product_list = 'PCAPAL1';
      obj.target = '_top';
      obj.onClick = openOSA2(obj, LogFulfilledSales, osa2Url, product_list);
      break;
    case objClass.testClass('OSA2_PRSA'):
      product_list = 'PRSPAL2';
      obj.target = '_top';
      obj.onClick = openOSA2(obj, LogFulfilledSales, osa2Url, product_list);
      break;
    case objClass.testClass('OSA2_SSPA'):
      product_list = 'HS1PAL2';
      obj.target = '_top';
      obj.onClick = openOSA2(obj, LogFulfilledSales, osa2Url, product_list);
      break;
    case objClass.testClass('OSA2_SBA'):
      product_list = 'HS2PAL2';
      obj.target = '_top';
      obj.onClick = openOSA2(obj, LogFulfilledSales, osa2Url, product_list);
      break;
    case objClass.testClass('OSA2_USDPCA'):
      product_list = 'PCAPAL3';
      obj.target = '_top';
      obj.onClick = openOSA2(obj, LogFulfilledSales, osa2Url, product_list);
      break;
    case objClass.testClass('OSA2_USDPRSA'):
      product_list = 'PRSPAL4';
      obj.target = '_top';
      obj.onClick = openOSA2(obj, LogFulfilledSales, osa2Url, product_list);
      break;
    case objClass.testClass('PCA'):
      product_list = 'PCAPAL1';
      obj.target = '_top';
      obj.onClick = notifyOlbAccounts(obj, LogFulfilledSales, accountUrl, product_list);
      break;
    case objClass.testClass('PRSA'):
      product_list = 'PRSPAL2';
      obj.target = '_top';
      obj.onClick = notifyOlbAccounts(obj, LogFulfilledSales, accountUrl, product_list);
      break;
    case objClass.testClass('SSA'):
      product_list = 'HS1PAL2';
      obj.onClick = notifyOlbAccounts(obj, LogFulfilledSales, ssaUrl, product_list, true);
      break;
    case objClass.testClass('SBA'):
      product_list = 'HS2PAL2';
      obj.onClick = notifyOlbAccounts(obj, LogFulfilledSales, sbaUrl, product_list, true);
      break;
    case objClass.testClass('SSPA'):
      product_list = 'HS1PAL2';
      obj.onClick = notifyOlbAccounts(obj, LogFulfilledSales, accountSSPAUrl, product_list);
      break;
    case objClass.testClass('USDPCA'):
      product_list = 'PCAPAL3';
      obj.target = '_top';
      obj.onClick = notifyOlbAccounts(obj, LogFulfilledSales, accountUrl, product_list);
      break;
    case objClass.testClass('USDPRSA'):
      product_list = 'PRSPAL4';
      obj.target = '_top';
      obj.onClick = notifyOlbAccounts(obj, LogFulfilledSales, accountUrl, product_list);
      break;
    case objClass.testClass('openOSA'):
      obj.target = '_top';
      obj.onClick = customOpenOSA(obj);
      break;
    case objClass.testClass('OpenMoneylogic'):
      obj.target = '_top';
      obj.onClick = customOpenMoneylogic(obj);
      break;
    case objClass.testClass('SwitchPWS'):
      obj.target = '_top';
      obj.onClick = customPowerSwitch(obj);
      break;
    case objClass.testClass('ContinueToOLB'):
      obj.target = '_top';
      obj.onClick = continueOLBForm();
      break;
    case objClass.testClass('selectAccountsBtn'):
      obj.target = '_top';
      obj.href = 'https://' + domain + olbPath + statementOptionsUrl;
      obj.onClick = doEnrollSelectAccount();
      break;
    default:
      //alert(obj.id);
      break;
  }
}

function notifyOlb(obj, trackingcode, url) {
  // with olbPath
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }
  var olbUrl = 'https://' + domain + olbPath + url;
  if (url.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }
  if (magicId != undefined) {
    olbUrl = olbUrl + '&trackingCode=' + trackingcode + '&magicId=' + magicId;
  }
  obj.href = olbUrl;
  return true;
}

function notifyOlbTrack(obj, trackingcode, url) {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }
  var olbUrl = 'https://' + domain + olbPath + url;
  if (url.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }

  if (trackingcode != undefined) {
    olbUrl = olbUrl + '&trackingCode=' + trackingcode;
  }
  if (magicId != undefined) {
    olbUrl = olbUrl + '&magicId=' + magicId;
  }

  obj.href = olbUrl;
  return true;
}

function notify(obj, trackingcode, url) {
  // no olbPath
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }
  var olbUrl = 'https://' + domain + url;
  if (url.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }

  if (magicId != undefined) {
    olbUrl = olbUrl + '&trackingCode=' + trackingcode + '&magicId=' + magicId;
  }
  obj.href = olbUrl;
  return true;
}

function notifyNoInprint(obj, trackingcode, url) {
  // no inprint

  var olbUrl = 'https://' + domain + url + '&z=' + new Date().getTime();
  if (magicId != undefined) {
    olbUrl = olbUrl + '&trackingCode=' + trackingcode + '&magicId=' + magicId;
  }
  obj.href = olbUrl;
  return true;
}

function notifyOLB_redirect(obj, trackingcode, url) {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }
  var olbUrl = 'https://' + domain + url + '?z=' + new Date().getTime();

  if (magicId == undefined || magicId == '') {
    return true;
  }

  olbUrl = olbUrl + '&trackingCode=' + trackingcode + '&magicId=' + magicId;

  document.images['callback'].src = olbUrl;
  return true;
}

function notifyOlbAccounts(obj, trackingcode, url, productList, setCookie) {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }

  if (setCookie) set_cookie('sspa_prod', productList, '/', '.bmo.com', 'secure');
  var olbUrl = 'https://' + domain + olbPath + url + '&z=' + new Date().getTime();

  if (magicId != undefined) {
    olbUrl = olbUrl + '&trackingCode=' + trackingcode + '&magicId=' + magicId + '&prodList=' + productList;
  }

  obj.href = olbUrl;
  return true;
}

function openOSA2(obj, trackingcode, url, productList) {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }

  var olbUrl = 'https://' + domain + olbPath + url + '&z=' + new Date().getTime();
  if (magicId != undefined) {
    olbUrl = olbUrl + '&trackingCode=' + trackingcode + '&magicId=' + magicId + '&productlist=' + productList;
  }

  obj.href = olbUrl;
  return true;
}

function notifySwitch(obj, url) {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }

  var olbUrl = 'https://' + domain + olbPath + url + '&z=' + new Date().getTime();

  obj.href = olbUrl;
  return true;
}

function notifyOlbOffers(obj, trackingcode, url, action, productType) {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }

  var olbUrl = 'https://' + domain + olbPath + url + '&z=' + new Date().getTime();

  if (magicId != undefined) {
    olbUrl =
      olbUrl +
      '&trackingCode=' +
      trackingcode +
      '&magicId=' +
      magicId +
      '&productType=' +
      productType +
      '&offerAction=' +
      action;
    // uncomment the following to test upsell campaigns - needs leadCode append to test in OLB
    //olbUrl = olbUrl + '&leadCode=PRE233456' + '&trackingCode=' + trackingcode + '&magicId=' + magicId + '&productType=' + productType + '&offerAction=' + action;
  }

  obj.href = olbUrl;
  return true;
}

function notifyOlbOffersForm(obj, trackingcode, url, action, productType, userSelectionJson) {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }

  var olbUrl = 'https://' + domain + olbPath + url;
  if (url.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }
  if (magicId != undefined) {
    var tForm = document.createElement('form');
    tForm.action = olbUrl;
    tForm.target = '_top';
    tForm.method = 'post';
    tForm.style.visibility = 'hidden';
    _createFormElement('trackingCode', trackingcode, tForm, 'hidden');
    _createFormElement('magicId', magicId, tForm, 'hidden');
    _createFormElement('productType', productType, tForm, 'hidden');
    _createFormElement('offerAction', action, tForm, 'hidden');

    if (userSelectionJson) {
      for (var k in userSelectionJson) {
        if (typeof k == 'string') _createFormElement('extra(' + k + ')', userSelectionJson[k], tForm, 'hidden');
      }
    }

    if (productType == 'MC') {
      _createFormElement('creditCard', document.offerform.card.value, tForm);
    }

    document.body.appendChild(tForm);
    tForm.submit();
    return false;
  }
  return false;
}

function continueOLBForm() {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }

  sendLMETrackingCode(LogFulfilledRedirect);

  var olbUrl = 'https://' + domain + olbPath + continueToOLBURL;
  if (continueToOLBURL.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }
  if (magicId != undefined) {
    var tForm = document.createElement('form');
    tForm.action = olbUrl;
    tForm.target = '_top';
    tForm.method = 'post';
    tForm.style.visibility = 'hidden';
    _createFormElement('refreshMessage', 'Y', tForm, 'hidden');

    document.body.appendChild(tForm);
    tForm.submit();
    return false;
  }
  return false;
}

function _createFormElement(name, value, formObj, inputType) {
  var e = document.createElement('input');
  e.type = inputType;
  e.name = name;
  e.value = value;
  formObj.appendChild(e);
}

function customPowerSwitch(obj) {
  if (olbPath == '/OLB' || olbPath == '/RMC') {
    olbUrl = 'https://' + domain + olbPath + '/tra/acc/pws/powerSwitchDNHInit?mode=form';
  }

  if (olbPath == '/CMC') {
    olbUrl = 'https://' + domain + olbPath + '/fin/tra/acc/pws/powerSwitchDNHInit?mode=form';
  }

  obj.href = olbUrl;
  return true;
}

/*
function openNewUSaccount(obj) {
    if (olbPath == '/OLB') {
        olbUrl = "https://" + domain + openOSAolbUrl;
    }

    if (olbPath == '/RMC') {
        olbUrl = "https://" + domain + openOSArmcUrl ;
    }

    obj.href = olbUrl;
    return true;
}
*/

function customOpenOSA(obj) {
  if (olbPath == '/OLB' || olbPath == '/RMC') {
    olbUrl = 'https://' + domain + olbPath + '/sre';
  }
  if (olbPath == '/CMC') {
    olbUrl = 'https://' + domain + olbPath + '/fin/sre';
  }
  obj.href = olbUrl;
  return true;
}

/*
function notifyOlbUrlPurchase(obj,trackingcode,url,action) {
    if(inprint != undefined && ( inprint == 'Y' || inprint == 'y')) {
        return false;
    }
    var launchUrl = '';
    var trackingCode;
    if(action == "now") {
        trackingCode = trackingcode;
        launchUrl = olbPath + osaUrl;
    } else if(action == "here") {
        trackingCode = trackingcode;
        launchUrl = olbPath + osaRrspUrl;
    } else {
        trackingCode = oabCode;
        launchUrl = olbPath + 'main' + oabFrameUrl + '&z=' + new Date().getTime();
    }
    var olbUrl = '';
    olbUrl = 'https://' + domain + launchUrl;
    if(magicId != undefined) {
        olbUrl = olbUrl + '&trackingCode=' + trackingCode + '&magicId=' + magicId;
    }
    obj.href = olbUrl;
    return true;
}
*/

function continueIfAgreed(destUrl, productType, overlayType, offerAction, olbPath_, trackingCode) {
  var continue_button = document.getElementById('continue_button');
  var agree_checkbox = document.getElementById('agree_checkbox');
  if (continue_button && agree_checkbox) {
    var continue_a = continue_button.childNodes[0];
    if (continue_a) {
      continue_a = continue_a.childNodes[0];
      // Check if the checkbox is checked, and enable/disable the button.
      if (agree_checkbox.checked) {
        var olbUrl = 'https://' + domain + olbPath_ + destUrl + '&z=' + new Date().getTime();
        if (magicId != undefined) {
          olbUrl += '&magicId=' + magicId;
          if (productType != undefined && productType != '') olbUrl = olbUrl + '&productType=' + productType;
          if (offerAction != undefined && offerAction != '') olbUrl = olbUrl + '&offerAction=' + offerAction;
          if (overlayType != undefined && overlayType != '') olbUrl = olbUrl + '&LaunchOverlayType=' + overlayType;
          if (trackingCode != undefined && trackingCode != '') olbUrl = olbUrl + '&trackingCode=' + trackingCode;
          // uncomment the following to test - needs leadCode append to test in OLB
          //olbUrl = olbUrl + '&leadCode=PRE123456';
        }
        continue_a.href = olbUrl;

        return true;
      } else {
        continue_a.href = 'javascript:void(0);';
        continue_a.setAttribute('target', '_self');

        return false;
      }
    }
  }
}

function customCrossBorderTransfer(obj) {
  if (olbPath == '/OLB' || olbPath == '/RMC') {
    olbUrl = 'https://' + domain + olbPath + '/tra/acc/nul/accountTransferInit?mode=form';
  }
  // sendLMETrackingCode(LogFulfilledService);
  obj.href = olbUrl;
  return true;
}

function customOLBRedirect(obj, trackingcode, url) {
  var olbUrl = 'https://' + domain + olbPath + url;
  // sendLMETrackingCode(trackingcode);
  obj.href = olbUrl;
  return true;
}

function customOpenMoneylogic(obj) {
  if (olbPath == '/OLB' || olbPath == '/RMC') {
    olbUrl = 'https://' + domain + olbPath + '/man';
  }
  if (olbPath == '/CMC') {
    olbUrl = 'https://' + domain + olbPath + '/fin/man';
  }
  obj.href = olbUrl;
  return true;
}

/**
 * Allows for cross browser event listeners
 * @param:obj - the object to be passed, can be a document.getElementById
 * @param:evt - the event type (click,change,etc)
 * @param:fnc - the function to call when the event happens
 */
var addEventListenerCrossBrowser = function (obj, evt, fnc) {
  // W3C model
  if (obj.addEventListener) {
    obj.addEventListener(evt, fnc, false);
    return true;
  }
  // Microsoft model
  else if (obj.attachEvent) {
    return obj.attachEvent('on' + evt, fnc);
  }
  // Browser don't support W3C or MSFT model, go on with traditional
  else {
    evt = 'on' + evt;
    if (typeof obj[evt] === 'function') {
      // Object already has a function on traditional
      // Let's wrap it with our own function inside another function
      fnc = (function (f1, f2) {
        return function () {
          f1.apply(this, arguments);
          f2.apply(this, arguments);
        };
      })(obj[evt], fnc);
    }
    obj[evt] = fnc;
    return true;
  }
  return false;
};

/**
 * Allows for multiple functions to be loaded in an onload event handler
 */
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    if (typeof func == 'function') window.onload = func;
  } else {
    window.onload = function () {
      if (oldonload) {
        oldonload();
      }
      if (typeof func == 'function') func();
    };
  }
}

/*
 *
 *  targeted interstitial code
 *
 */
var version_date = '20161125';
/*
 *   LME tracking codes
 */
var LME_enroll_tc = 'LogFulfilledService';
var LME_Mgmt_Pref_tc = 'LogFulfilledRedirect';
var LME_Not_Interested_tc = 'LogReject';
var LME_Remind_Me_Later_tc = 'LogFollowUp';

var initialDiv = 'enroll_wrapper';
var errorDiv = 'error_wrapper';
var accountDiv = 'accnt_list';
var generalErrorDiv = 'generalError_wrapper';
var waitingDiv = 'waiting_wrapper';

var interstitialSlowTimeout = 3000;
var interstitialEnrollAllResponseTimeout = 60000;
var interstitialSubscribeAlertsResponseTimeout = 60000;

/*
 *   creative local variables
 */
var savedEmail = '';
var success = 'success'; // Success text from OLB Web services
var hideable = 'hideable'; // Class name for hide/show divisions
var errorCodeID = 'errorCode'; // use this hard-code value if the error code is to be shown

var ctaClicked = false;

// error messages
var emptyMsg = '';
var invalidMsg = '';
var emailRE = new RegExp(
  "^\\w+((-\\w+)|(\\.\\w+)|(\\_\\w+)|(\\'\\w+)|(-))*\\@[A-Za-z0-9]+((\\.|-|_)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$"
);
var emptyEmailEN = 'Email Address is required.';
var emptyEmailFR = 'Courriel est requise.';
var emptyInvalidEmailEN =
  "The email address is invalid.  Please ensure that only one '@' symbol is in the address.  Also, ensure that you include the '.' in the address, and at least one character should be on either side of the '@' and the '.'";
var emptyInvalidEmailFR =
  "L'adresse &eacute;lectronique n'est pas valide. Veuillez vous assurer que le << @ >> n'apparant qu'une seule fois dans l'adresse. Assurez-vous &eacute;galement d'inclure le << . >> dans l'adresse. De plus, au moins un caract&egrave;re devrait se situer de part et d'autre du << @>> et du << . >>.";
/*   test data - TODO remove when implement in production
 */
var trace_enabled = true;

var isPreviewMode = false;
var test_offerAdCB =
  '{"marketingOfferAdCB": {' +
  '"ACCOUNT_LIST":[{"accountNumber" : "****-1234","accountName" : "Checking"}' +
  ',{"accountNumber":"****-1235","accountName":"Saving"}' +
  ',{"accountNumber":"****-1236","accountName":"Saving US"}' +
  ',{"accountNumber":"****-1237","accountName":"Super Saving"}' +
  ',{"accountNumber":"****-2237","accountName":"BMO Investments Inc.- Spousal Retirement Income Fund"}' +
  ',{"accountNumber":"****-1238","accountName":"BMO Inv. Inc. - Fonds enr. de revenu de retraite de conjoint"}' +
  ',{"accountNumber":"****-1239","accountName":"Super Saving2"}' +
  ']' +
  ',"EMAIL_ADDRESS":"test.email@bmo.com"' +
  '}}';

var test_enroll_success = '{' + '"status":"success"' + ',"referenceNumber":"0001235"' + '}';

var test_enroll_failed = '{' + '"status":"failure"' + ',"errorCode":"E010011"' + '}';

var test_subAlert_success = '{' + '"status":"success"' + '}';

var test_subAlert_failed = '{' + '"status":"failure"' + ',"errorCode":"E010021"' + '}';

/*
 *
 *  function showDiv will hide all the DIVs defined in the HTML with a class of
 *  "hideable" except the one supplied
 */

function showDiv(showDivID) {
  if (document.getElementById) {
    var showID = document.getElementById(showDivID);
    var hideShowDivs = [];
    if (document.getElementsByClassName) {
      hideShowDivs = document.getElementsByClassName(hideable);
    } else {
      // ugly IE
      var elArray = [];
      var tmp = document.getElementsByTagName('div');
      for (var i = 0; i < tmp.length; i++) {
        var div_class = tmp[i].getAttribute('class');
        // try className if class is not found ... obsolete code?
        if (div_class == null) div_class = tmp[i].getAttribute('className');
        if (div_class != null && div_class.indexOf(hideable) > -1) {
          elArray.push(tmp[i]);
        }
      }
      hideShowDivs = elArray;
    }
    for (var i = 0; i < hideShowDivs.length; i++) {
      hideShowDivs[i].style.display = 'none';
    }
    showID.style.display = 'block';
  }
  return false;
}

/*     error - /onlinebanking/SubscribeAlerts
/*
/*   goto my alerts - /onlinebanking/OLB/ppr/alr
/*
*/

function doCustomPowerSwitch(obj) {
  trace('log: doCustomPowerSwitch');
  sendLMETrackingCode(LogFulfilledOther);
  notifyOlbDb();
  return customPowerSwitch(obj);
}

function handleInterstitialSlow() {
  showDiv(waitingDiv); // show waiting screen
}

function handleInterstitialTimeout(url) {
  sendErrorTimeout(generalErrorDiv, 'generalError_errorCode', '2100 : The request for ' + url + ' timed out.');
}

function doEnroll(nextDiv, emailDiv, refNumDiv, errorDiv) {
  if (ctaClicked) {
    return false;
  }
  ctaClicked = true;

  trace('log: doEnroll');

  if (isPreviewMode) return false;

  var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

  var url = 'https://' + domain + enrollEstatementURL + '?trackingCode=' + LME_enroll_tc + '&magicId=' + magicId;

  // show waiting message if response is slow
  var slowTimeoutID = setTimeout('handleInterstitialSlow()', interstitialSlowTimeout);

  xmlhttp.open('POST', url, true);

  xmlhttp.timeout = interstitialEnrollAllResponseTimeout; // time in milliseconds

  // xmlhttp.ontimeout = function (e) { handleInterstitialTimeout( url ); };

  xmlhttp.onreadystatechange = function () {
    try {
      if (xmlhttp.readyState == 4) {
        window.clearTimeout(slowTimeoutID);
        if (xmlhttp.status == 200) {
          var enrollJson = null;
          try {
            // respose will be empty in case of timeout
            enrollJson = JSON.parse(xmlhttp.responseText);
          } catch (e) {
            trace('log: doEnroll, failed to parse json');
            enrollJson = null;
          }
          // var enrollJson = JSON.parse(test_enroll_success);
          trace('log: doEnroll, enrollJson = ' + enrollJson);
          if (enrollJson && typeof enrollJson.Status != 'undefined' && enrollJson.Status) {
            trace('log: doEnroll, enrollJson.Status = ' + enrollJson.Status);
            if (enrollJson.Status === success) {
              // not needed anymore sendLMETrackingCode(LME_enroll_tc);
              document.getElementById(emailDiv).value = savedEmail;
              if (enrollJson.ReferenceNumber) {
                ctaClicked = false;
                document.getElementById(refNumDiv).innerHTML = enrollJson.ReferenceNumber;
                showDiv(nextDiv);
              } else {
                sendError2(generalErrorDiv, 'generalError_errorCode', '2010 : invalid response from ' + url);
              }
            } else {
              if (typeof enrollJson.ErrorCode != 'undefined' && enrollJson.ErrorCode) {
                // sendError(errorDiv, "enrollEStatement : " + enrollJson.ErrorCode);
                sendError2(
                  generalErrorDiv,
                  'generalError_errorCode',
                  '2020 : enrollEStatement error = ' + +enrollJson.ErrorCode
                );
              } else {
                sendError2(generalErrorDiv, 'generalError_errorCode', '2030 : invalid response from ' + url);
              }
            }
          } else {
            sendError2(generalErrorDiv, 'generalError_errorCode', '2040 : invalid response from ' + url);
          }
        } else {
          sendError2(generalErrorDiv, 'generalError_errorCode', '2050 : invalid response from ' + url);
        }
      }
    } catch (e) {
      sendError2(generalErrorDiv, 'generalError_errorCode', '2060 : Error getting response from ' + url);
    }
  };

  xmlhttp.send();
  return false;
}

function notifyOlbInterstitial(obj, trackingcode, url) {
  // with olbPath + explicit LME tracking
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }
  var olbUrl = 'https://' + domain + olbPath + url;
  if (url.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }
  // sendLMETrackingCode(trackingcode);
  obj.target = '_top';
  obj.href = olbUrl;
  return true;
}

function interstitialNotifyOLBmainTarget(obj, _lmeTrackingCode, url) {
  // with no olbPath + explicit LME tracking + don't override target
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }
  sendLMETrackingCode(_lmeTrackingCode);

  var olbUrl = 'https://' + domain + url;
  if (olbUrl.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }
  // assuming the obj is an <a> tag
  obj.href = olbUrl;
  return false;
}

function interstitialNotifyOLBmain2(obj, _lmeTrackingCode, url) {
  // with no olbPath + explicit LME tracking + magicid + don't override target
  if (magicId != undefined) {
    url = url + '&magicId=' + magicId;
  }

  return interstitialNotifyOLBmainTarget(obj, _lmeTrackingCode, url);
}

function interstitialNotifyOLBmain1(obj, _lmeTrackingCode, url) {
  // with olbPath + explicit LME tracking + magicid
  if (magicId != undefined) {
    url = url + '&magicId=' + magicId;
  }

  return interstitialNotifyOLBmain(obj, _lmeTrackingCode, olbPath + url);
}

function interstitialNotifyOlb(obj, _lmeTrackingCode, url) {
  // with olbPath + explicit LME tracking

  return interstitialNotifyOLBmain(obj, _lmeTrackingCode, olbPath + url);
}

function interstitialNotifyOLBmain(obj, _lmeTrackingCode, url) {
  // with no olbPath + explicit LME tracking
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }
  sendLMETrackingCode(_lmeTrackingCode);

  var olbUrl = 'https://' + domain + url;
  if (olbUrl.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }
  // assuming the obj is an <a> tag
  obj.target = '_top';
  obj.href = olbUrl;
  return false;
}

function interstitialcustomOLB(obj, _lmeTrackingCode) {
  if (olbPath == '/OLB' || olbPath == '/RMC') {
    olbUrl = 'https://' + domain + olbPath + '/man';
  }
  if (olbPath == '/CMC') {
    olbUrl = 'https://' + domain + olbPath + '/fin/man';
  }
  sendLMETrackingCode(_lmeTrackingCode);
  obj.href = olbUrl;
  return true;
}

// ?? not called
function doEnrollSelectAccount() {
  sendLMETrackingCode(LME_Mgmt_Pref_tc);

  return true;
}

function subAlert(nextDiv, email_addrDiv, errorDiv) {
  if (ctaClicked) {
    return false;
  }
  ctaClicked = true;

  trace('log: subAlert');
  if (isPreviewMode) return false;

  var email_addr = document.getElementById(email_addrDiv).value;
  // check email address before sending to backend
  if (!email_addr) {
    alert(emptyMsg);
  } else {
    //if (!email_pattern.test(email_addr.toLowerCase())){
    email_addr = email_addr.toLowerCase();
    if (!email_addr.match(emailRE)) {
      alert(invalidMsg);
    } else {
      // onlinebanking/SubscribeAlerts

      // show waiting message if response is slow
      var slowTimeoutID = setTimeout('handleInterstitialSlow()', interstitialSlowTimeout);

      var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

      var url =
        'https://' +
        domain +
        subscribeEstatementURL +
        '?magicId=' +
        magicId +
        '&' +
        'email=' +
        encodeURIComponent(email_addr);
      xmlhttp.open('POST', url, true);

      xmlhttp.timeout = interstitialSubscribeAlertsResponseTimeout;

      // xmlhttp.ontimeout = function (e) { handleInterstitialTimeout( url ); };

      xmlhttp.onreadystatechange = function () {
        try {
          if (xmlhttp.readyState == 4) {
            window.clearTimeout(slowTimeoutID);

            if (xmlhttp.status == 200) {
              var subAlertJson = null;
              try {
                // respose will be empty in case of timeout
                subAlertJson = JSON.parse(xmlhttp.responseText);
              } catch (e) {
                trace('log: subAlert, failed to parse json');
                subAlertJson = null;
              }
              trace('log: subAlert, email = ' + email_addr);
              // var subAlertJson = JSON.parse(test_subAlert_success);
              if (subAlertJson && typeof subAlertJson.Status != 'undefined' && subAlertJson.Status) {
                if (subAlertJson.Status === success) {
                  ctaClicked = false;
                  sendLMETrackingCode(LME_Mgmt_Pref_tc);
                  showDiv(nextDiv);
                } else {
                  if (typeof subAlertJson.ErrorCode != 'undefined' && subAlertJson.ErrorCode) {
                    sendError(errorDiv, 'subscribeAlerts : ' + subAlertJson.ErrorCode);
                  } else {
                    sendError2(generalErrorDiv, 'generalError_errorCode', '3020 : invalid response from ' + url);
                  }
                }
              } else {
                sendError2(generalErrorDiv, 'generalError_errorCode', '3030 : invalid response from ' + url);
              }
            } else {
              sendError(errorDiv, 'subscribeAlerts : ' + subAlertJson.ErrorCode);
            }
          }
        } catch (e) {
          sendError(errorDiv, 'subscribeAlerts : ' + subAlertJson.ErrorCode);
        }
      };

      xmlhttp.send();
    }
  }
  return false;
}

function doNoThanks() {
  closeInterstitial(LME_Not_Interested_tc);
  return false;
}

function doRemindMeLater() {
  closeInterstitial(LME_Remind_Me_Later_tc);
  return false;
}

function denyAlert() {
  closeInterstitial(LME_Not_Interested_tc);
  return false;
}

function gotoMyAlert() {
  // redirect code to my_ALert
  //  onlinebanking/OLB/ppr/alr
  trace('redirect to OLB My Alert page. ');
  return false;
}

function gotoPreference() {
  // redirect code to Preference
  //  onlinebanking/OLB/ppr
  trace('redirect to OLB My Alert page. ');
  return false;
}

function sendLMETrackingCode(LMETrackingCode) {
  // add ajax code to
  trace('adding LME tracking code : ' + LMETrackingCode);

  if (typeof LMETrackingCode == 'undefined' || null == LMETrackingCode || '' == LMETrackingCode) {
    return false;
  }

  var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xmlhttp.onreadystatechange = function () {
    try {
      // don't care return code
    } catch (e) {
      trace('sendLMETrackingCode response error, ignored');
    }
  };
  url = 'https://' + domain + trackMarketingURL + '?trackingCode=' + LMETrackingCode + '&magicId=' + magicId;
  try {
    xmlhttp.open('POST', url, false); // syncronous, as async might get cancelled.
    xmlhttp.send();
  } catch (e) {
    trace('sendLMETrackingCode send error, ignored');
  }
  // close window
  return false;
}

function notifyOlbDb() {
  trace('notify olb that a redirect is happening');
  var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

  var olbNotifyURL = 'https://' + domain + olbPath + continueToOLBURL;
  if (continueToOLBURL.indexOf('?') !== -1) {
    olbNotifyURL = olbNotifyURL + '&z=' + new Date().getTime();
  } else {
    olbNotifyURL = olbNotifyURL + '?z=' + new Date().getTime();
  }
  olbNotifyURL = olbNotifyURL + '&' + 'refreshMessage=Y';

  xmlhttp.onreadystatechange = function () {
    // don't care return code
  };
  xmlhttp.open('POST', olbNotifyURL, false); // syncronous, as async might get cancelled.
  xmlhttp.send();
  // close window
  return false;
}

function sendError(errorDiv, errorCode) {
  return sendError2(errorDiv, errorCodeID, errorCode);
}

function sendError2(errorDiv, errorMsgDiv, errorCode) {
  trace('error occurred : ' + errorCode);

  if (trackError && typeof trackError === typeof Function) {
    try {
      trackError('error occurred : ' + errorCode);
    } catch (e) {}
  }

  // hard coding the error code, if it needed to be added
  if (document.getElementById(errorMsgDiv)) document.getElementById(errorMsgDiv).innerHTML = errorCode;
  showDiv(errorDiv);

  return false;
}

function sendErrorTimeout(errorDiv, errorMsgDiv, errorCode) {
  trace('error occurred : ' + errorCode);

  if (trackError && typeof trackError === typeof Function) {
    try {
      trackError('error occurred : ' + errorCode);
    } catch (e) {}
  }

  closeInterstitial(null);

  return false;
}

function setMessages() {
  var lang = document.documentElement.lang || 'en';

  if (lang.toLowerCase() == 'fr') {
    emptyMsg = emptyEmailFR;
    invalidMsg = emptyInvalidEmailFR;
  } else {
    emptyMsg = emptyEmailEN;
    invalidMsg = emptyInvalidEmailEN;
  }
}

function closeWindowX() {
  // LME tracking code LogFollowUp
  sendLMETrackingCode(LME_Remind_Me_Later_tc);
  closeWin();
}

function closeWin() {
  trace('Closing the window.');
  window.close();
}

function closeInterstitial(_lmeTrackingCode) {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }

  sendLMETrackingCode(_lmeTrackingCode);

  var olbUrl = 'https://' + domain + olbPath + continueToOLBURL;
  if (continueToOLBURL.indexOf('?') !== -1) {
    olbUrl = olbUrl + '&z=' + new Date().getTime();
  } else {
    olbUrl = olbUrl + '?z=' + new Date().getTime();
  }
  if (magicId != undefined) {
    var tForm = document.createElement('form');
    tForm.action = olbUrl;
    tForm.target = '_top';
    tForm.method = 'post';
    tForm.style.visibility = 'hidden';
    _createFormElement('refreshMessage', 'Y', tForm, 'hidden');

    document.body.appendChild(tForm);
    tForm.submit();
    return false;
  }
  return false;
}

function interstitialOAB() {
  if (inprint != undefined && (inprint == 'Y' || inprint == 'y')) {
    return false;
  }

  sendLMETrackingCode(LogAppointmentOAB);
  notifyOlbDb();

  showOaiDialog(
    this,
    'OVERLAY',
    '/onlinebanking/OLBmain/ssoOai?mode=confirmation&olb=y&oai_jump_app=OAB&oai_jump_entry=new',
    {
      width: 1000,
      height: 750,
    },
    'OABFrame',
    'OABDialog'
  );
  return false;
}

function trace(msg) {
  if (typeof trace_enabled != 'undefined' && trace_enabled)
    try {
      console.log(msg);
    } catch (e) {
      // window.alert(msg);
    }
}

// Opener for Popup Windows
function popup(url, width, height) {
  popupWidth = width == null ? 500 : width;
  popupHeight = height == null ? 600 : height;
  var newPopupWindow = window.open(
    url,
    'popup',
    'scrollbars=1,resizable=1,width=' + popupWidth + ',height=' + popupHeight
  );
}
