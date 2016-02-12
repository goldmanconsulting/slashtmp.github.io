var options = {
  previewTemplate: document.querySelector('#dropzone-preview-container').innerHTML,
  maxFilesize: 100,
  uploadMultiple: false,
  createImageThumbnails: false,
  init: function() {
    this.on("success", function(file, resp) {
      var elem = file.previewElement.querySelector(".btn-share");
      // TODO why is the resp only represents the body of the response, need the 'Location' HTTP Header attribute but can't get to it...
      elem.setAttribute('data-dz-fileref', 'http://slashtmp.io.s3.amazonaws.com/' + file.key);
      elem.setAttribute('data-dz-filename', file.name);
    });
  },
  accept: function(file, done) {
    $.get('https://lew6jvdlod.execute-api.ap-northeast-1.amazonaws.com/prod/uuid', function(data) {
      console.log('key=' + data.uuid);
      file.key = data.uuid;
      done();
    });
  },
  sending: function(file, xhr, formData) {
    formData.append('key', file.key);
    formData.append('acl', 'public-read');
    formData.append('x-amz-date', '20160211T004131Z');
    formData.append('x-amz-algorithm', 'AWS4-HMAC-SHA256');
    formData.append('x-amz-storage-class', 'REDUCED_REDUNDANCY');
    formData.append('x-amz-credential', 'AKIAJBWJ4FGQSURTZVXQ/20160211/ap-southeast-2/s3/aws4_request');
    formData.append('x-amz-signature', 'e19d5258474056af9d7334bf44cf6af8213060d2a86b5df604826c57791d7526');
    formData.append('policy', 'eyAiZXhwaXJhdGlvbiI6ICIyMTAwLTEyLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJhY2wiOiAicHVibGljLXJlYWQifSwKICAgIHsiYnVja2V0IjogInNsYXNodG1wLmlvIn0sCiAgICB7IngtYW16LXN0b3JhZ2UtY2xhc3MiOiAiUkVEVUNFRF9SRURVTkRBTkNZIn0sCiAgICB7IngtYW16LWNyZWRlbnRpYWwiOiAiQUtJQUpCV0o0RkdRU1VSVFpWWFEvMjAxNjAyMTEvYXAtc291dGhlYXN0LTIvczMvYXdzNF9yZXF1ZXN0In0sCiAgICB7IngtYW16LWFsZ29yaXRobSI6ICJBV1M0LUhNQUMtU0hBMjU2In0sCiAgICB7IngtYW16LWRhdGUiOiAiMjAxNjAyMTFUMDA0MTMxWiJ9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgIiJdLAogICAgWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDAsIDEwNDg1NzYwMF0KICBdCn0=');
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