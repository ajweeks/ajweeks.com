document.addEventListener("DOMContentLoaded",function(){new SweetScroll({});});

function onLoad() {
  var r = Math.random() * 90  + 60;
  var g = Math.random() * 115 + 60;
  var b = Math.random() * 110 + 60;
  $('#page-header').css('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
}
