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
    formData.append('x-amz-signature', '78017f7fa1a4aa6e5e2125b84ab8b0d98d53a21d655d2f60db3ef5d0a3d62e76');
    formData.append('policy', 'eyAiZXhwaXJhdGlvbiI6ICIyMTAwLTEyLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJhY2wiOiAicHVibGljLXJlYWQifSwKICAgIHsiYnVja2V0IjogInNsYXNodG1wLmlvIn0sCiAgICB7IngtYW16LXN0b3JhZ2UtY2xhc3MiOiAiUkVEVUNFRF9SRURVTkRBTkNZIn0sCiAgICB7IngtYW16LWNyZWRlbnRpYWwiOiAiQUtJQUpCV0o0RkdRU1VSVFpWWFEvMjAxNjAyMTEvYXAtc291dGhlYXN0LTIvczMvYXdzNF9yZXF1ZXN0In0sCiAgICB7IngtYW16LWFsZ29yaXRobSI6ICJBV1M0LUhNQUMtU0hBMjU2In0sCiAgICB7IngtYW16LWRhdGUiOiAiMjAxNjAyMTFUMDA0MTMxWiJ9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgIiJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkY29udGVudC10eXBlIiwgIiJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkY29udGVudC1kaXNwb3NpdGlvbiIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCAxMDQ4NTc2MDBdCiAgXQp9');
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