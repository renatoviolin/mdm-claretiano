jQuery(document).ready(function () {
   jQuery('#trilha_btn_menu').on('click', function () {
      jQuery('#form_ra_aluno').val(ra_aluno)
      jQuery('#form_pagina').val(pagina_atual)
      jQuery('form').attr('action', '/static_trilha');
      jQuery('form').submit()
   })

})

function gerar_trilha(ra_aluno, pagina) {
   ra_aluno = ra_aluno
   pagina = pagina
   jQuery.ajax({
         // url: BASE_URL + "/api_get_trilha",
         url: "/api_get_trilha",
         type: 'post',
         contentType: "application/json",
         dataType: 'json',
         data: JSON.stringify({
            'ra_aluno': ra_aluno,
            'pagina': pagina,
         }),
      })
      .done(function (data_json) {
         console.log(data_json)
         mes_aux = data_json[0].date.split('/')[1]

         for (j = 0; j < data_json.length; j++) {
            conteudo = data_json[j].conteudo
            date = data_json[j].date
            mes = date.split('/')[1]
            texto_par = data_json[j].texto_par
            tipo = data_json[j].tipo // 1 pesquisa 2 definicao 3 anotacao 4 importante 5 dificil

            texto_html = ''
            if (tipo == 1) { // PESQUISAS
               container = `<div class='trilha_pesquisa'><div class="header_trilha_box">Pesquisou na internet</div>`
               data = `<p class='data'>${date}</p>`
               texto_html = container + data + `<p>Você pesquisou sobre o conteúdo "<b>${conteudo}</b>"</p></div>`
            }

            if (tipo == 2) { // DICIONÁRIO
               container = `<div class='trilha_definicao'><div class="header_trilha_box">Pesquisou na dicionário</div>`
               data = `<p class='data'>${date}</p>`
               texto_html = container + data + `<p>Você pesquisou sobre o termo "<b>${conteudo}</b>"</p></div>`
            }

            if (tipo == 3) { // ANOTAÇÃO
               container = `<div class='trilha_anotacao'><div class="header_trilha_box">Anotou</div>`
               data = `<p class='data'>${date}</p>`
               texto_html = container + data + `<p>No conteúdo "${texto_par}..." você fez a anotação: <b>${conteudo}</b></p></div>`
            }

            jQuery('div[id=mes_' + mes + ']').next().append(texto_html)
            jQuery('div[id=mes_' + mes + ']').parent().show()
         }

      })
      .fail(function (jqXHR, textStatus, jsondata) {
         console.log(jqXHR);
         alert('Falhou ao gerar a trilha')
      })
}