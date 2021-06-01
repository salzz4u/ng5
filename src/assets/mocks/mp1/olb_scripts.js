// OLB Marketing scripts
var domain;
var olbPath;
var inprint;
var magicId;

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
  document.cookie = name + '=; expires=0; path=/; domain=bmo.com';
}

function getParam(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null) return '';
  else return results[1];
}

function init() {
  domain = readCookie('SetDomainToBMO');
  olbPath = readCookie('OlbServletPath');
  inprint = readCookie('InPrint');
  removeCookie('InPrint');
  magicId = getParam('magicId');
}

function customPopup(url, features) {
  window.open(url, '', features);
}
