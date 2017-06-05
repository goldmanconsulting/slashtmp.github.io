// dependencies required to be loaded in index.html
// require('jquery')
// require('dropzone')
// require('localstorage')

var options = {
  previewTemplate: document.querySelector('#dropzone-preview-container').innerHTML,
  maxFilesize: 250,
  uploadMultiple: false,
  createImageThumbnails: false,
  init: function() {
    this.on("success", function(file, resp) {
      var elem = file.previewElement.querySelector(".btn-share");
      elem.setAttribute('data-dz-metaref', file.metadataPreSignedUrl);
      elem.setAttribute('data-dz-fileref', file.preSignedUrl);
      elem.setAttribute('data-dz-filename', file.name);
      // if uploadTime attribute exists then we know we're dealing with a file loaded from local storage,
      // hence there is no need to save it, otherwise, every time the user visits the page we'll be duplicating
      // the local storage contents
      if (!file.uploadTime) saveToLocalStorage(file);
    });
    initDropzoneFromLocalStorage();
  },
  accept: function(file, done) {
    $.get('https://d1cm91qzfl.execute-api.ap-northeast-1.amazonaws.com/latest/s3/upload/policy', function(data) {
      file.key = data.key;
      file.date = data.date;
      file.policy = data.policy;
      file.signature  = data.signature;
      file.credential = data.credential;
      file.preSignedUrl = data.preSignedUrl;
      file.metadataPreSignedUrl = data.metadataPreSignedUrl;
      done();
    });
  },
  sending: function(file, xhr, formData) {
    formData.append('key', file.key);
    formData.append('x-amz-date', file.date);
    formData.append('x-amz-algorithm', 'AWS4-HMAC-SHA256');
    formData.append('x-amz-storage-class', 'REDUCED_REDUNDANCY');
    formData.append('x-amz-credential', file.credential);
    formData.append('x-amz-signature', file.signature);
    formData.append('policy', file.policy);
    formData.append('Content-Type', file.type);
    formData.append('Content-Disposition', 'inline; filename=' + file.name);
  }
};

Dropzone.options.fileDropTop = options;
Dropzone.options.fileDropBottom = options;

function toFilePath(fileref, metaref) {
  // get the last two query params from the metaref url, which represents the expiry and signature,
  // which happen to be the only 2 values that are different from the fileref url
  var params = metaref.split('&');

  var signature = params.pop();
  var expiry = params.pop();

  // appending second expiry and signature query params to the end of the url,
  // which will have to be interpreted by the viewer if it wants to do a HEAD request
  // (see assets/js/viewer.js)
  fileref += '&' + expiry + '&' + signature;

  // we don't want users to naviate straight to the file but instead we want them
  // to go to slashtmp viewer so that they can preview the file before choosing
  // whether to download it or not
  // TODO move this logic to backend so that the url is correct to begin with
  return fileref.replace('storage.slashtmp.io/', 'slashtmp.io/view?f=');
}

$(document).on('click', '.btn-share', function() {
  var filename = $(this).data('dz-filename');
  var fileref = $(this).data('dz-fileref');
  var metaref = $(this).data('dz-metaref');

  var filepath = toFilePath(fileref, metaref);
  
  $('#share-link-fileref').val(filepath);
  $('#share-link-filename').text(filename);
});

$('#share-link-dialog').on('shown.bs.modal', function () {
  $('#share-link-fileref').focus()
});

$("#share-link-fileref").focus(function(){
  this.select();
});

var dzInitialised = false;
function initDropzoneFromLocalStorage() {
  // there are 2 dropzones on the page, hence this method will be called twice,
  // so without this flag each file in local storage will be added to the dropzone twice
  if (!dzInitialised) {
    dzInitialised = true;

    // remove files from local storage that are older than 24 hours since they have been deleted on the server
    expireFilesInLocalStorage();

    // display previously uploaded files that were persisted to local storage, which have not yet expired
    var dz = Dropzone.forElement('#file-drop-top');
    getFilesFromLocalStorage().forEach(function (file) {
      dz.emit('addedfile', file);
      dz.emit('success', file);
      dz.emit('complete', file);
    });
  }
}
