console.debug("Running the injection script")
// Handle on Change function for approveRadio button
approveRadio = Array.from(document.getElementsByName("pull_request_review[event]")).filter((elem) => {
  return elem.value === "approve"
})[0];
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
console.debug("Finished the injection script")
