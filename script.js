function isLoggedIn() {
  return document.body.classList.contains("logged-in");
}

function go(pageId) {
  if (!isLoggedIn()) return;
  document.querySelectorAll(".page").forEach(function (page) {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

function openLink(url) {
  if (!isLoggedIn()) return;
  window.location.href = url;
}
