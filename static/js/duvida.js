$(document).ready(function () {
   $('#duvida_btn_menu').on('click', function (e) {
      $('#duvida_container').center().fadeIn(100);
      $("#modal").addClass("loading")
      $('#duvida_titulo').focus();
      placeholder_start = '<br><span style="color:#888">------ TEXTO SELECIONADO --------<br>';
      placeholder_end = '<br>------------------------------------------<br></span>';
      placeholder_link = 'Endereço: ';

      link_pagina = window.location.href;
      texto = selected_text.replace(/\s+/g, ' ').trim();
      $('#duvida_conteudo').html(placeholder_start +
         texto + placeholder_end + placeholder_link + link_pagina);
   });

   $('#duvida_btn_cancelar').on('click', function () {
      $('#duvida_conteudo').val('')
      $('#duvida_container').fadeOut(100)
      $("#modal").removeClass("loading")

   });

   $('#duvida_btn_enviar').on('click', function () {
      $('#duvida_conteudo').val('')
      $('#duvida_container').fadeOut(100)
      $("#modal").removeClass("loading")
   });
})