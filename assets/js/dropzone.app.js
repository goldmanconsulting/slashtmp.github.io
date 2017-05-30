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

$(document).on('click', '.btn-share', function() {
  $('#share-link-fileref').val($(this).data('dz-fileref'));
  $('#share-link-filename').text($(this).data('dz-filename'));
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
