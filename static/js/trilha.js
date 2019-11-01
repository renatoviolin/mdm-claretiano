jQuery(document).ready(function() {
  // jQuery("#trilha_btn_menu").on("click", function() {
  //   jQuery("#form_ra_aluno").val(ra_aluno);
  //   jQuery("#form_pagina").val(pagina_atual);
  //   jQuery("form").attr("action", "/static_trilha");
  //   jQuery("form").submit();
  // });

  jQuery("#trilha_btn_menu").on("click", function() {
    window.open("http://renato.dynu.net:8000/static/static_trilha.html", "_blank");
  });
});
function revelar(e) {
  jQuery(e.parentElement.nextElementSibling).slideToggle("fast");
}

function gerar_trilha(ra_aluno, pagina) {
  ra_aluno = ra_aluno;
  pagina = pagina;
  jQuery
    .ajax({
      // url: BASE_URL + "/api_get_trilha",
      url: "/api_get_trilha",
      type: "post",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        ra_aluno: ra_aluno,
        pagina: pagina
      })
    })
    .done(function(data_json) {
      console.log(data_json);
      mes_aux = data_json[0].date.split("/")[1];

      for (j = 0; j < data_json.length; j++) {
        conteudo = data_json[j].conteudo;
        resposta = data_json[j].resposta;
        titulo = data_json[j].titulo;
        date = data_json[j].date;
        mes = date.split("/")[1];
        texto_par = data_json[j].texto_par;
        resultado = data_json[j].resultado;
        tipo = data_json[j].tipo; // 1 pesquisa 2 definicao 3 anotacao 4 importante 5 dificil
        dia = date.split("/")[0];
        mes = date.split("/")[1];

        texto_html = "";
        if (tipo == 1) {
          // PESQUISAS
          resultados = resultado.split("\n");
          links = "";
          for (i = 0; i < resultados.length; i++) {
            links += `<a href="${resultados[i]}">${resultados[i]}</a><br>`;
          }
          console.log(links);

          texto_html = `
               <div class="trilha_row">
                  <div class="trilha_icon_search"><i class="fa fa-search fa-2x" aria-hidden="true"></i></div>
                  <div class="data_hor">${dia}/${mes}</div>
                  <div class="data">
                     <div class="data_dia">${dia}</div>
                     <div class="data_mes">${mes}</div>
                  </div>
                  <div class="trilha_texto">
                     <div class="header_trilha_box">Na internet</div>
                     <p>você pesquisou por <em>${conteudo}</em> e obteve os <a href="#" onClick="revelar(this)">links</a></p>
                     <div id='ver_detalhe' class='pesquisa_destaque'>${links}</div>
                  </div>
               </div>
               `;
        }

        if (tipo == 2) {
          // DICIONÁRIO
          texto_html = `
               <div class="trilha_row">
                  <div class="trilha_icon_dicio"><i class="fa fa-book fa-2x" aria-hidden="true"></i></div>
                  <div class="data_hor">${dia}/${mes}</div>
                  <div class="data">
                     <div class="data_dia">${dia}</div>
                     <div class="data_mes">${mes}</div>
                  </div>
                  <div class="trilha_texto">
                     <div class="header_trilha_box">No dicionário</div>
                     <p>você procurou pelo termo <em>${conteudo}</em>, e obteve a seguinte <a href="#" onClick="revelar(this)">definição</a></p>
                     <div id='ver_detalhe' class='dicionario_destaque'>${resultado}</div>
                     </div>
               </div>
               `;
        }

        if (tipo == 3) {
          // ANOTAÇÃO
          texto_html = `
               <div class="trilha_row">
                  <div class="trilha_icon_stick"><i class="fa fa-sticky-note fa-2x" aria-hidden="true"></i></div>
                  <div class="data_hor">${dia}/${mes}</div>
                  <div class="data">
                     <div class="data_dia">${dia}</div>
                     <div class="data_mes">${mes}</div>
                  </div>
                  <div class="trilha_texto">
                     <div class="header_trilha_box">Você anotou</div>
                     <p><em>${conteudo}</em>, <a href="#" onClick="revelar(this)">no trecho</a></p>
                     <div id='ver_detalhe' class='anotacao_destaque'>${texto_par}</div>
                  </div>
               </div>
               `;
        }

        if (tipo == 4) {
          // Dúvida
          texto_html = `
               <div class="trilha_row">
               <div class="trilha_icon_duvida"><i class="fa fa-question-circle fa-2x" aria-hidden="true"></i></div>
                  <div class="data_hor">${dia}/${mes}</div>
                  <div class="data">
                     <div class="data_dia">${dia}</div>
                     <div class="data_mes">${mes}</div>
                  </div>
                  <div class="trilha_texto">
                     <div class="header_trilha_box">Você enviou a dúvida</div>
                     <p><em>${titulo}</em> <a href="#" onClick="revelar(this)">ver</a></p>
                     <div id='ver_detalhe' class='duvida_destaque'>${conteudo}</div>

                  </div>
               </div>
               `;
        }

        jQuery("div[id=mes_" + mes + "]")
          .next()
          .append(texto_html);
        jQuery("div[id=mes_" + mes + "]")
          .parent()
          .show();
      }
    })
    .fail(function(jqXHR, textStatus, jsondata) {
      console.log(jqXHR);
      alert("Falhou ao gerar a trilha");
    });
}
