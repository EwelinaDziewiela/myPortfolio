$('body').scrollspy({target: ".navbar"});

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

$('.show-more_btn').click(function() {
  $(".show-more_mobile").toggleClass("show-less_mobile");
  if ($(this).text() === "Show more") {
    $(this).text("Show less")
  }
  else {
    $(this).text("Show more")
  }
});

$(document).on('click','.navbar-collapse.in',function(e) {
  if( $(e.target).is('a') ) {
    $(this).collapse('hide');
  }
});
