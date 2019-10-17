$(document).ready(function () {
   // ----------- FAZER A PESQUISA E MOSTRAR O RESULTADO ------------------
   $('#pesquisa_btn_menu').on("click", function (e) {
      if (selected_text == '') return
      console.log(selected_text)
      $.ajax({
            url: BASE_URL + "/api_search",
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({
               texto: selected_text,
               ra_aluno: ra_aluno,
               pagina: pagina_atual
            }),
            beforeSend: function () {
               $("#modal").addClass("loading");
            }
         })
         .done(function (jsondata) {
            console.log(jsondata)
            response = jsondata
            h = '';
            for (i = 0; i < response.length; i++) {
               h += '<a href="' + response[i].link + '"target="_blank"><span class="titulo">' + response[i].title + '</span></a><br>'
               h += '<p class="link">' + response[i].link + '</p>'
            }
            $("#modal").removeClass("loading");
            $('#pesquisa_conteudo').html(h);
            $('#pesquisa_container').center().fadeIn(100);
         })
         .fail(function (jqXHR, textStatus, jsondata) {
            alert('Falha ao acessar o servidor');
            $("#modal").removeClass("loading");
         })
         selected_text = ''
   })

   // ----------------- FECHAR JANELA DE PESQUISA ----------------------
   $('#pesquisa_btn_fechar').on("click", function (e) {
      $("#modal").removeClass("loading");
      $('#pesquisa_container').fadeOut(100);
      selected_text = ''
   })


})