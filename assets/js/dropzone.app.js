var options = {
  previewTemplate: document.querySelector('#dropzone-preview-container').innerHTML,
  maxFilesize: 100,
  uploadMultiple: false,
  createImageThumbnails: false,
  init: function() {
    this.on("success", function(file, resp) {
      var elem = file.previewElement.querySelector(".btn-share");
      // TODO why is the resp only represents the body of the response, need the 'Location' HTTP Header attribute but can't get to it...
      elem.setAttribute('data-dz-fileref', 'http://storage.slashtmp.io/' + file.key);
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
    formData.append('x-amz-signature', '6aee09143325b9365def661c4557b8683f6b5706cc87fd7e28cdb64763d3bbfc');
    formData.append('policy', 'eyAiZXhwaXJhdGlvbiI6ICIyMTAwLTEyLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJhY2wiOiAicHVibGljLXJlYWQifSwKICAgIHsiYnVja2V0IjogInN0b3JhZ2Uuc2xhc2h0bXAuaW8ifSwKICAgIHsieC1hbXotc3RvcmFnZS1jbGFzcyI6ICJSRURVQ0VEX1JFRFVOREFOQ1kifSwKICAgIHsieC1hbXotY3JlZGVudGlhbCI6ICJBS0lBSkJXSjRGR1FTVVJUWlZYUS8yMDE2MDIxMS9hcC1zb3V0aGVhc3QtMi9zMy9hd3M0X3JlcXVlc3QifSwKICAgIHsieC1hbXotYWxnb3JpdGhtIjogIkFXUzQtSE1BQy1TSEEyNTYifSwKICAgIHsieC1hbXotZGF0ZSI6ICIyMDE2MDIxMVQwMDQxMzFaIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRjb250ZW50LXR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRjb250ZW50LWRpc3Bvc2l0aW9uIiwgIiJdLAogICAgWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDAsIDEwNDg1NzYwMF0KICBdCn0=');
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