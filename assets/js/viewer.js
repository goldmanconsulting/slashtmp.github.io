// require('jquery')
// require('url.utils')

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

function getPath() {
  return URL_PREFIX + awsify(window.location.href).split('f=')[1];
}

function isSupportedContentType(contentType) {
  return SUPPORTED_CONTENT_TYPES.indexOf(contentType) != -1;
}

function initViewer(filename, filepath, metapath, contentType) {
  $('.navbar-brand').text(filename);

  var downloadBtn = $('.download-btn');
  downloadBtn.attr('href', filepath);
  downloadBtn.attr('download', filename);

  var shareBtn = $('.share-btn');
  shareBtn.attr('data-dz-metaref', metapath);
  shareBtn.attr('data-dz-fileref', filepath);
  shareBtn.attr('data-dz-filename', filename);

  if (isSupportedContentType(contentType)) {
    $('.viewer-frame').attr('src', filepath);
  } else {
    $('.viewer-frame').attr('src', 'http://slashtmp.io/default.html?filename=' + filename);
  }
}

$(document).ready(function() {
  var path = getPath();
  var pathToFile = s3Get(path);
  var pathToMeta = s3Head(path);

  $.ajax({
    type: 'HEAD',
    url: pathToMeta
  }).error(function(xhr) {
    $('.share-btn').addClass('disabled');
    $('.download-btn').addClass('disabled');
  }).success(function(data, status, xhr) {
    var filename = xhr .getResponseHeader('Content-Disposition').split('filename=')[1];
    var contentType = xhr.getResponseHeader('Content-Type');
    initViewer(filename, pathToFile, pathToMeta, contentType);
  });
});
