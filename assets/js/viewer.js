// require('jquery')

var URL_PREFIX = 'http://storage.slashtmp.io/';
var SUPPORTED_CONTENT_TYPES = [
  'text/css',
  'text/xml',
  'text/html',
  'text/plain',
  'text/javascript',

  'image/bmp',
  'image/gif',
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/pjpeg',
  'image/svg+xml',

  'application/xml',
  'application/pdf',
  'application/javascript',
  'application/x-javascript'
];

function getPathToFile() {
  return window.location.href.split('f=')[1];
}

function getPathToMeta(path) {
  // the path looks like this:
  // [UUID]?AWSAccessKeyId=[ALPHANUMERIC]
  //   &Expires=[EXPIRY for GET requests]&Signature=[SIGNATURE for GET requests]
  //   &Expires=[EXPIRY for HEAD requests]&Sisgnature=[SIGNATURE for HEAD requests]

  var params = path.split('&');
  var signature = params.pop(); // signature for HEAD requests
  var expiry = params.pop(); // expiry for HEAD requests

  // remove the exprity and signature for GET requests as we don't want it when doing 
  // a HEAD request
  params.pop();
  params.pop();

  // re-add the expiry and signature for HEAD requests back to the path
  params.push(expiry);
  params.push(signature);

  return params.join('&');
}

function isSupportedContentType(contentType) {
  return SUPPORTED_CONTENT_TYPES.indexOf(contentType) != -1;
}

function initViewer(filename, filepath, contentType) {
  $('.navbar-brand').text(filename);
  $('.download-btn').attr('href', filepath);
  $('.download-btn').attr('download', filename);
  if (isSupportedContentType(contentType)) {
    $('.viewer-frame').attr('src', filepath);
  } else {
    $('.viewer-frame').attr('src', 'http://slashtmp.io/default.html?filename=' + filename);
  }
}

$(document).ready(function() {
  var path = getPathToFile();
  var pathToMeta = getPathToMeta(path);

  $.ajax({
    type: 'HEAD',
    url: URL_PREFIX + pathToMeta
  }).error(function(xhr) {
    $('.download-btn').addClass('disabled');
  }).success(function(data, status, xhr) {
    var filename = xhr .getResponseHeader('Content-Disposition').split('filename=')[1];
    var contentType = xhr.getResponseHeader('Content-Type');
    initViewer(filename, URL_PREFIX + path, contentType);
  });
});
