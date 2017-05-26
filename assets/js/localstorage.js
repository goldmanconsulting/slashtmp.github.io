var localStoreRef = 'localstorage.slashtmp.io';

function getStore() {
  var store = localStorage.getItem(localStoreRef);
  if (!store) {
    localStorage.setItem(localStoreRef, JSON.stringify({'workspace': {'files': []}}));
    store = localStorage.getItem(localStoreRef);
  }
  return JSON.parse(store);
}

function saveToLocalStorage(file) {
  var store = getStore();
  store.workspace.files.push({name: file.name, preSignedUrl: file.preSignedUrl, uploadTime: new Date()});
  localStorage.setItem(localStoreRef, JSON.stringify(store));
}

function expireFilesInLocalStorage() {
  var files = _getNonExpiredFilesFromLocalStorage();
  localStorage.setItem(localStoreRef, JSON.stringify({workspace: {files: files}}));
}

function getFilesFromLocalStorage() {
  return getStore().workspace.files;
}

// private functions

function _getNonExpiredFilesFromLocalStorage() {
  var now = new Date();
  return getStore().workspace.files.filter(function (file) {
    // expire date is uploadTime + 24 hours
    var expireAt = new Date(file.uploadTime).getTime() + 24*60*60*1000;
    return now.getTime() < expireAt;
  });
}
