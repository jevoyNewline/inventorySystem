$(' div #menu-optoin,#fa').on('click', function(){
    $('div #menu-optoin').removeClass('active');
    $('div #menu-optoin').children('div').removeClass('active');
    $('div #menu-optoin').find('#fa').removeClass('active');
    $('div #menu-optoin').children('a').removeClass('active');
    

    $(this ).addClass('active');
    $(this).children('div').addClass('active');
    $(this).find('i').addClass('active');
    $(this).children('a').addClass('active');

    
 })

$('.order-data').on('click',function(){
  $('.order-data').removeClass('active');
  $('.data').removeClass('active');
  $('.invoiceData').removeClass('active');
  $(this).addClass('active');

})

$('.data').on('click',function(){
  $('.data').removeClass('active');
  $('.order-data').removeClass('active');
  $('.invoiceData').removeClass('active');
  $(this).addClass('active');

})
$('.invoiceData,.checkout-data').on('click',function(){
  $('.data').removeClass('active');
  $('.order-data').removeClass('active');
  $('.invoiceData').removeClass('active');
  $('.checkout-data').removeClass('active');
  $(this).addClass('active');

})
/*=============================================
=            Reload Page             =
=============================================*/
let time = new Date().getTime();
const setActivityTime = (e) => {
  time = new Date().getTime();
}
document.body.addEventListener("mousemove", setActivityTime);
document.body.addEventListener("keypress", setActivityTime);
const refresh = () => {
  if (new Date().getTime() - time >= 60000 && navigator.onLine) {
    window.location.reload(true);
  } else {
    setTimeout(refresh, 10000);
  }
}
setTimeout(refresh, 10000);

$(document).ready(function () {
  setDefaultActive ()
})

var setDefaultActive = function() {
  var path = window.location.pathname;
  var text=path.split("/");
  var textA='.'+text[1];
  $('div #menu-optoin').removeClass('active');
  $('div #menu-optoin').children('div').removeClass('active');
  $('div #menu-optoin').find('#fa').removeClass('active');
  $('div #menu-optoin').children('a').removeClass('active');
  

  $(textA ).addClass('active');
  $(textA).children('div').addClass('active');
  $(textA).find('i').addClass('active');
  $(textA).children('a').addClass('active');
}

/*=====  End of Reload Page   ======*/
