function go(pageId){
  document.querySelectorAll(".page").forEach(page=>page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0,0);
}
function openLink(url){
  window.location.href=url;
}
