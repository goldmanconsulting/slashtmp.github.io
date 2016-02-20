var options = {
  previewTemplate: document.querySelector('#dropzone-preview-container').innerHTML,
  maxFilesize: 100,
  uploadMultiple: false,
  createImageThumbnails: false,
  init: function() {
    this.on("success", function(file, resp) {
      var elem = file.previewElement.querySelector(".btn-share");
      elem.setAttribute('data-dz-fileref', file.preSignedUrl);
      elem.setAttribute('data-dz-filename', file.name);
    });
  },
  accept: function(file, done) {
    $.get('https://jr612kw3nk.execute-api.ap-northeast-1.amazonaws.com/prod/s3-upload-policy', function(data) {
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