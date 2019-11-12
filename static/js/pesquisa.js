var log_selected_text = "";
var texto_busca_processado = "";
var id_pesquisa;


jQuery(document).ready(function() {
  // ----------- FAZER A PESQUISA E MOSTRAR O RESULTADO -----------------------
  jQuery("#pesquisa_btn_menu").on("click", function(e) {
    if (selected_text == "") return;
    log_selected_text = selected_text;
    jQuery
      .ajax({
        url: BASE_URL + "/api_search",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          texto: selected_text,
          ra_aluno: ra_aluno,
          pagina: pagina_atual
        }),
        beforeSend: function() {
          jQuery("#modal").addClass("loading");
        }
      })
      .done(function(jsondata) {
        id_pesquisa = jsondata.id_pesquisa;
        response = jsondata.response;
        console.log(id_pesquisa);
        h = "";
        for (i = 0; i < response.length; i++) {
          h += '<div><a href="' + response[i].link + '" target="_blank" class="pesquisa_link"><span class="titulo">' + response[i].title + "</span></a><br>";
          h += '<p class="link">' + response[i].link + "</p></div>";
			  h += '<div class="pesquisa_util"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></div>';
        }
        jQuery("#modal").removeClass("loading");
        jQuery("#pesquisa_conteudo").html(h);
        jQuery("#pesquisa_container")
          .center()
          .fadeIn(100);
      })
      .fail(function(jqXHR, textStatus, jsondata) {
        alert("Falha ao acessar o servidor");
        jQuery("#modal").removeClass("loading");
      });
    selected_text = "";
  });

  // ----------------- FECHAR JANELA DE PESQUISA ----------------------
  jQuery("#pesquisa_btn_fechar").on("click", function(e) {
    jQuery("#modal").removeClass("loading");
    jQuery("#pesquisa_container").fadeOut(100);
    selected_text = "";
  });

  // ----------------- LOGAR OS CLICKS NOS LINKS ----------------------
  jQuery(document).on("click", ".pesquisa_link", function(e) {
    link_clicado = e.currentTarget.href;
    console.log(link_clicado);

    jQuery
      .ajax({
        url: BASE_URL + "/api_update_log_link_pesquisa",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          ra_aluno: ra_aluno,
          pagina: pagina_atual,
          id_pesquisa: id_pesquisa,
          link_clicado: link_clicado
        })
      })
      .fail(function(jqXHR, textStatus, jsondata) {
        console.log(jqXHR);
      });
  });

  // ------ MARCAR LINK DA PESQUISA COMO UTIL ------------------
  jQuery(document).on("click", ".pesquisa_util", function(e) {
    link_tag = e.currentTarget;
    link_clicado = link_tag.previousSibling.childNodes[0].href;
    jQuery
      .ajax({
        url: BASE_URL + "/api_update_log_link_like",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          ra_aluno: ra_aluno,
          pagina: pagina_atual,
          id_pesquisa: id_pesquisa,
          link: link_clicado
        })
      })
      .fail(function(jqXHR, textStatus, jsondata) {
        console.log(jqXHR);
      });
    jQuery(link_tag).toggle();
  });
});
