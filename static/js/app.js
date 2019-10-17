var element_mouse_over;
var element_mouse_selected;
var pageX;
var pageY;
var selected_text = ''
var all_p;
var pagina_atual = ''
var ra_aluno = 1;
var range
var min_split = 10;
// var BASE_URL = 'http://renato.dynu.net:8000'
var BASE_URL = ''

$(document).ready(function () {

   jQuery.fn.center = function () {
      this.css("position", "absolute");
      this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
         $(window).scrollTop()) + "px");
      this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
         $(window).scrollLeft()) + "px");
      return this;
   }

   if (!window.x) x = {};
   x.Selector = {};
   x.Selector.getSelected = function () {
      var t = '';
      if (window.getSelection) {
         t = window.getSelection();
      } else if (document.getSelection) {
         t = document.getSelection();
      } else if (document.selection) {
         t = document.selection.createRange().text;
      }
      return t;
   }

   // ra_aluno = prompt("Digite seu RA", "1");
   _pag = window.location.href.split('/')
   pagina_atual = _pag[_pag.length - 2]

   $(document).on("mousedown", function (e) {
      pageX = e.pageX;
      pageY = e.pageY;
   });


   // $('.fl-rich-text').mousedown(function (e) {
   $('.col-sm-8, .fl-rich-text').mousedown(function (e) {
      element_mouse_over = document.elementFromPoint(e.clientX, e.clientY);
      selected_text = ''
   });

   all_p = $('p');
   for (i = 0; i < all_p.length; i++) all_p[i].id = i;

   $('.col-sm-8').bind("mouseup", function (e) {
      selected_text = x.Selector.getSelected().getRangeAt(0).toString();
      element_mouse_selected = element_mouse_over
      range = x.Selector.getSelected().getRangeAt(0)
   });




   // ========== ADICIONA LINHAS AO REDOR DOS HEADERS ================ 
   // all_h = $('h2')
   // for (i = 0; i < all_h.length; i++) {
   //   h = all_h[i]
   //   $(h).nextUntil('h2').add($(h)).wrapAll('<div class="linha" id=' + i + '>')
   // }
})