console.log("Running the injection script")

function inject() {
  // Handle on Change function for approveRadio button
  approveRadio = Array.from(document.getElementsByName("pull_request_review[event]")).filter((elem) => {
    return elem.value === "approve"
  })[0];
  if (!approveRadio) {
    setTimeout(inject, 500)
    return
  }
  approveRadio.onchange = (checkbox) => {
    textarea = document.getElementsByName("pull_request_review[body]")[0]
    if (textarea.textLength === 0) {
      textarea.value = "LGTM"
    }
  }
  
  // Handle on uncheck function for approveRadio button
  uncheckLGTM = (checkbox) => {
    textarea = document.getElementsByName("pull_request_review[body]")[0]
    if (textarea.value === "LGTM") {
      textarea.value = ""
    }
  }
  Array.from(document.getElementsByName("pull_request_review[event]")).filter((elem) => {
    return elem.value !== "approve"
  }).forEach((elem) => {
    elem.onchange = uncheckLGTM
  });
}
let re = new RegExp('https://github\.com/.*/.*/pull/.*/files')
if (re.exec(window.location.href)) {
  inject()
}
fileChanges = Array.from(document.getElementsByClassName("tabnav-tab js-pjax-history-navigate"))
  .filter((elem) => new RegExp('https://github\.com/.*/.*/pull/.*/files').exec(elem.href))[0]
fileChanges.onclick = inject
console.log("Finished the injection script")
