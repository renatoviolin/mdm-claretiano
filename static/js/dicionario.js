jQuery(document).ready(function () {
   // ----------- BUSCAR NO DICIONÁRIO E EXIBIR O RESULTADO ------------------
   jQuery('#dicionario_btn_menu').on("click", function (e) {
      if (selected_text == '') return
      texto = selected_text.replace(/\s+/g, ' ').trim();
      qtde = texto.split(' ').length
      if (qtde != 1) {
         alert('selecione apenas uma palavra')
         selected_text = ''
         return;
      }
      jQuery.ajax({
            url: BASE_URL + "/api_dictionary",
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({
               'ra_aluno': ra_aluno,
               'pagina': pagina_atual,
               'palavra': selected_text,
            }),
            beforeSend: function () {
               jQuery("#modal").addClass("loading");
            }
         })
         .done(function (jsondata) {
            console.log(jsondata)
            jQuery("#modal").removeClass("loading");
            jQuery('#dicionario_palavra').text(selected_text)
            jQuery('#dicionario_resultado').text(jsondata)
            jQuery('#dicionario_container').center().fadeIn(100);
            selected_text = ''
         })
         .fail(function (jqXHR, textStatus, jsondata) {
            console.log(jsondata);
            jQuery("#modal").removeClass("loading");
            selected_text = ''
         })
   })

   // ----------- FECHAR JANELA DICIONÁRIO ------------------
   jQuery('#dicionario_btn_fechar').on('click', function () {
      jQuery('#dicionario_container').fadeOut(100);
   })
})