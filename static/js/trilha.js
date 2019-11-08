jQuery(document).ready(function() {
  jQuery("#trilha_btn_menu").on("click", function() {
    // jQuery("#form_ra_aluno").val(ra_aluno);
    // jQuery("#form_pagina").val(pagina_atual);
    // jQuery("form").attr("action", "/static_trilha");
    // jQuery("form").submit();
    window.open("http://renato.dynu.net:8000/static/wp_trilha.html", "_blank");
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

      for (j = 0; j < data_json.length; j++) {
        date = data_json[j].date;
        tipo = data_json[j].tipo;
        c2 = data_json[j].c2;
        c3 = data_json[j].c3;
        c4 = data_json[j].c4;
        c5 = data_json[j].c5;
        console.log(date)
        dia = date.split("/")[0];
        mes = date.split("/")[1];

        texto_html = "";
        if (tipo == 1) {
          // PESQUISAS
          conteudo = c2;
          resultados = c3.split(",");
          links = "";
          for (i = 0; i < resultados.length; i++) {
            links += `<a href="${resultados[i]}">${resultados[i]}</a><br>`;
          }

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
                     <p>você pesquisou por <em class='trilha'>${conteudo}</em> e obteve os <a onClick="revelar(this)">links</a></p>
                     <div id='ver_detalhe' class='pesquisa_destaque'>${links}</div>
                  </div>
               </div>
               `;
        }

        if (tipo == 2) {
          // DICIONÁRIO
          conteudo = c2;
          resultado = c3;
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
                     <p>você procurou pelo termo <em class='trilha'>${conteudo}</em>, e obteve a seguinte <a onClick="revelar(this)">definição</a></p>
                     <div id='ver_detalhe' class='dicionario_destaque'>${resultado}</div>
                     </div>
               </div>
               `;
        }

        if (tipo == 3) {
          // ANOTAÇÃO
          conteudo = c2;
          texto_par = c3;
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
                     <p><em class='trilha'>${conteudo}</em>, <a onClick="revelar(this)">no trecho</a></p>
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
                     <p><em class='trilha'>${titulo}</em> <a onClick="revelar(this)">ver</a></p>
                     <div id='ver_detalhe' class='duvida_destaque'>${conteudo}</div>

                  </div>
               </div>
               `;
        }

        if (tipo == 5) {
          // LINK EXTERNO
          link = c2;
          texto_html = `
               <div class="trilha_row">
                  <div class="trilha_icon_search"><i class="fa fa-search fa-2x" aria-hidden="true"></i></div>
                  <div class="data_hor">${dia}/${mes}</div>
                  <div class="data">
                     <div class="data_dia">${dia}</div>
                     <div class="data_mes">${mes}</div>
                  </div>
                  <div class="trilha_texto">
                     <div class="header_trilha_box">Durante seus estudos</div>
                     <p>você acessou o link <em class='trilha'><a href="${link}">${link}</a></em> </p>                    
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
