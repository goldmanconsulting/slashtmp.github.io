function doSendEmail(email, filename, fileref) {
  var url = 'https://fwhc9dx93f.execute-api.ap-northeast-1.amazonaws.com/latest/emails'
  var data = JSON.stringify({email: email, filename: filename, fileref: fileref});
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    contentType: 'application/json',
    success: onSendEmailSuccess,
    error: onSendEmailError
  });
}

function sendEmail() {
  toggleSendButton();
  var email = $('#share-link-via-email').val();
  var fileref = $('#share-link-fileref').val();
  var filename = $('#share-link-filename').text();
  doSendEmail(email, filename, fileref);
}

function toggleSendButton() {
  var btn = $('.btn-send');
  btn.prop('disabled', !btn.prop('disabled'));
}

function onSendEmailSuccess() {
  toggleSendButton();
  $('#share-link-dialog').modal('hide');
}

function onSendEmailError() {
  toggleSendButton();
}

$(document).on('click', '.btn-send', sendEmail);
