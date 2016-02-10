var options = {
  previewTemplate: document.querySelector('#dropzone-preview-container').innerHTML,
  maxFilesize: 100,
  uploadMultiple: false,
  createImageThumbnails: false,
  init: function() {
    this.on("success", function(file, resp) {
      var elem = file.previewElement.querySelector(".btn-share");
      elem.setAttribute('data-dz-fileref', resp.href);
      elem.setAttribute('data-dz-filename', file.name);
    });
  },
  accept: function(file, done) {
    // TODO call server to create and sign policy so that we can upload file to S3
    console.log("name=" + file.name + ", type=" + file.type + ", size=" + file.size);
    file.key = '1234324132';
    done();
  },
  sending: function(file, xhr, formData) {
    formData.append('key', file.key);
    // TODO add the ACL policy to the request data
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