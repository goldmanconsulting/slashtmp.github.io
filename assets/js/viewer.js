// require('jquery')

function getPathToFile() {
  return window.location.href.split('f=')[1];
}

$(document).ready(function() {
    var path = getPathToFile();
    $('#content-viewer').attr('src', 'http://storage.slashtmp.io/' + path);
});
