function doSendEmail(email, fileref) {
  var url = 'https://fwhc9dx93f.execute-api.ap-northeast-1.amazonaws.com/latest/emails'
  var data = JSON.stringify({email: email, fileref: fileref});
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    contentType: 'application/json',
    success: function() { console.log('email sent') },
    error: function() { console.log('email failed') }
  });
}

function sendEmail() {
  var email = $('#share-link-via-email').val();
  var fileref = $('#share-link-fileref').val();
  doSendEmail(email, fileref);
}

$(document).on('click', '.btn-send', sendEmail);
