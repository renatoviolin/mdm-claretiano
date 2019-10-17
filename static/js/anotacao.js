$(document).ready(function () {

   // ========== ABRE A CAIXA DE ANOTAÇÃO =============
   $('#anotacao_btn_menu').on("click", function (e) {
      if (selected_text == '') {
         alert('Selecione um texto')
         return;
      }
      if ($(element_mouse_selected).html().includes('x-anotacao-destaque')) {
         alert('Apenas um comentário por parágrafo');
         return;
      }

      $("#modal").addClass("loading")
      $('#anotacao_textarea').val('')
      $('#anotacao_textarea').focus()
      $('#anotacao_container').center().fadeIn(100);
      console.log(selected_text)
   });

   // ========== FECHA A CAIXA DE ANOTAÇÃO =============
   $('#anotacao_btn_cancelar').on('click', function () {
      selected_text = ''
      $('#anotacao_container').fadeOut(100)
      $("#modal").removeClass("loading");
   });

   // ========== SALVA O ANOTAÇÃO ===============
   $('#anotacao_btn_salvar').on('click', function () {
      var anotacao = $('#anotacao_textarea').val();
      if (anotacao == '') return

      anotacao_html = "<x-anotacao-post_it id='" + $(element_mouse_selected).attr('id') + "' status=0><div class='anotacao_conteudo'>" + anotacao + "</div><div class='anotacao_excluir'>X</div></x-anotacao-post_it>";
      $(element_mouse_selected).before(anotacao_html);
      var newNode = document.createElement("x-anotacao-destaque");
      newNode.setAttribute("id", $(element_mouse_selected).attr('id'));
      range.surroundContents(newNode);
      par = $(element_mouse_selected).html();
      id_paragrafo = $(element_mouse_selected).attr('id')
      tag_split = '<x-anotacao-destaque id="' + $(element_mouse_selected).attr('id') + '">'
      inicio = par.split(tag_split)[0].length
      final = par.split('</x-anotacao-destaque')[0].length - tag_split.length
      text_par = $('p[id=' + id_paragrafo + ']').text().split(' ')
      texto_par = ''
      for (i = 0; i < Math.min(min_split, text_par.length); i++) texto_par += ' ' + text_par[i]
      texto_par = texto_par.trim()

      $.ajax({
            url: BASE_URL + "/api_insert_note",
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({
               ra_aluno: ra_aluno,
               pagina: pagina_atual,
               id_paragrafo: id_paragrafo,
               comentario: anotacao,
               inicio: inicio,
               fim: final,
               texto: texto_par
            }),
            beforeSend: function () {
               $("#modal").addClass("loading");
               $('#anotacao_container').fadeOut(100);
            }
         })
         .done(function (jsondata) {
            $("#modal").removeClass("loading");
            console.log(jsondata)
         })
         .fail(function (jqXHR, textStatus, jsondata) {
            $("#modal").removeClass("loading");
            console.log(textStatus);
            alert('Erro ao inserir o comentário');
            $("x-anotacao-destaque[id='" + id_paragrafo + "']").contents().unwrap();
            $("x-anotacao-destaque[id='" + id_paragrafo + "']").remove();
         })
      range = null
      selected_text = ''

   });

   // ========== REMOVE A ANOTAÇÃO ===============
   $(document).on("click", ".anotacao_excluir", function (e) {
      x_anotacao_post_it = this.parentNode;
      id_paragrafo = x_anotacao_post_it.id
      x_destaque_amarelo = $("x-anotacao-destaque[id='" + id_paragrafo + "']")

      $.ajax({
            url: BASE_URL + "/api_delete_note",
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({
               ra_aluno: ra_aluno,
               pagina: pagina_atual,
               id_paragrafo: id_paragrafo,
            }),
            beforeSend: function () {
               $("#modal").addClass("loading");
            }
         })
         .done(function (jsondata) {
            $("#modal").removeClass("loading");
            $(x_destaque_amarelo).contents().unwrap();
            $(x_anotacao_post_it).remove();
         })
         .fail(function (jqXHR, textStatus, jsondata) {
            $("#modal").removeClass("loading");
            console.log(textStatus);
            alert('Erro ao excluir comentário');
         })
   });

   // ================  CARREGA TODAS AS ANOTAÇÕES NO LOAD DA PÁGINA ============
   $.ajax({
         url: BASE_URL + "/api_get_notes",
         type: 'post',
         contentType: "application/json",
         dataType: 'json',
         data: JSON.stringify({
            ra_aluno: ra_aluno,
            pagina: pagina_atual
         }),
         beforeSend: function () {
            $("#modal").addClass("loading");
         }
      })
      .done(function (jsondata) {
         items = jsondata
         for (j = 0; j < items.length; j++) {
            item = items[j]
            par = $('p[id=' + item.id_paragrafo + ']').html();
            inicio = item.inicio;
            final = item.fim;
            texto_final = par.slice(0, inicio) + '<x-anotacao-destaque id="' + item.id_paragrafo + '">' + par.slice(inicio, final) + '</x-anotacao-destaque>' + par.slice(final)
            $('p[id=' + item.id_paragrafo + ']').html(texto_final)
            $('p[id=' + item.id_paragrafo + ']').before("<x-anotacao-post_it id='" + item.id_paragrafo + "' status=0'><div class='anotacao_conteudo'>" + item.comentario + "</div><div class='anotacao_excluir'>X</div></x-anotacao-post_it>");
         }
         $("#modal").removeClass("loading");
      })
      .fail(function (jqXHR, textStatus, jsondata) {
         console.log(textStatus);
         alert('Falha ao carregar anotações')
         $("#modal").removeClass("loading");
      })

})