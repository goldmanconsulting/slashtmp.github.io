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

function onShareBtnClick() {
  var filename = $(this).data('dz-filename');
  var fileref = $(this).data('dz-fileref');
  var metaref = $(this).data('dz-metaref');

  var filepath = toFilePath(fileref, metaref);

  $('#share-link-fileref').val(filepath);
  $('#share-link-filename').text(filename);
}

$('#share-link-dialog').on('shown.bs.modal', function () {
  $('#share-link-fileref').focus();
});

$("#share-link-fileref").focus(function(){
  this.select();
});

$(document).on('click', '.btn-share', onShareBtnClick);
$(document).on('click', '.share-btn', onShareBtnClick);
