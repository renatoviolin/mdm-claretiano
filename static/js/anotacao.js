jQuery(document).ready(function() {
  var limite = 140;
  jQuery("#anotacao_textarea").on("input", function() {
    var caracteresDigitados = $(this).val().length;
    var caracteresRestantes = limite - caracteresDigitados;
    $("#caracteres_restantes").text(caracteresRestantes);
  });

  // ========== ABRE A CAIXA DE ANOTAÇÃO =============
  jQuery("#anotacao_btn_menu").on("click", function(e) {
    //  console.log("Anotar: ", selected_text);
    $("#caracteres_restantes").text(limite);
    if (selected_text == "") {
      alert("Selecione um texto");
      return;
    }
    if (
      jQuery(element_mouse_selected)
        .html()
        .includes("x-anotacao-destaque")
    ) {
      alert("Apenas um comentário por parágrafo");
      return;
    }

    jQuery("#modal").addClass("loading");
    jQuery("#anotacao_textarea").val("");
    jQuery("#anotacao_container")
      .center()
      .fadeIn(100);
    jQuery("#anotacao_textarea").focus();
    console.log(selected_text);
  });

  // ========== FECHA A CAIXA DE ANOTAÇÃO =============
  jQuery("#anotacao_btn_cancelar").on("click", function() {
    selected_text = "";
    jQuery("#anotacao_container").fadeOut(100);
    jQuery("#modal").removeClass("loading");
  });

  // ========== SALVA O ANOTAÇÃO ===============
  jQuery("#anotacao_btn_salvar").on("click", function() {
    var anotacao = jQuery("#anotacao_textarea").val();
    if (anotacao == "") return;

    anotacao_html =
      "<x-anotacao-post_it id='" +
      jQuery(element_mouse_selected).attr("id") +
      "' status=0><div class='anotacao_conteudo'>" +
      anotacao +
      "</div><div class='anotacao_excluir'>X</div></x-anotacao-post_it>";
    jQuery(element_mouse_selected).before(anotacao_html);
    var newNode = document.createElement("x-anotacao-destaque");
    newNode.setAttribute("id", jQuery(element_mouse_selected).attr("id"));
    range.surroundContents(newNode);
    par = jQuery(element_mouse_selected).html();
    id_paragrafo = jQuery(element_mouse_selected).attr("id");
    tag_split = '<x-anotacao-destaque id="' + jQuery(element_mouse_selected).attr("id") + '">';
    inicio = par.split(tag_split)[0].length;
    final = par.split("</x-anotacao-destaque")[0].length - tag_split.length;
    text_par = jQuery("p[id=" + id_paragrafo + "]")
      .text()
      .split(" ");
    texto_par = "";
    for (i = 0; i < Math.min(min_split, text_par.length); i++) texto_par += " " + text_par[i];
    texto_par = texto_par.trim();

    jQuery
      .ajax({
        url: BASE_URL + "/api_insert_note",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          ra_aluno: ra_aluno,
          pagina: pagina_atual,
          id_paragrafo: id_paragrafo,
          comentario: anotacao,
          inicio: inicio,
          fim: final,
          texto: texto_par
        }),
        beforeSend: function() {
          jQuery("#modal").addClass("loading");
          jQuery("#anotacao_container").fadeOut(100);
        }
      })
      .done(function(jsondata) {
        jQuery("#modal").removeClass("loading");
        console.log(jsondata);
      })
      .fail(function(jqXHR, textStatus, jsondata) {
        jQuery("#modal").removeClass("loading");
        console.log(textStatus);
        alert("Erro ao inserir a anotação");
        jQuery("x-anotacao-destaque[id='" + id_paragrafo + "']")
          .contents()
          .unwrap();
        jQuery("x-anotacao-post_it[id='" + id_paragrafo + "']").remove();
      });
    range = null;
    selected_text = "";
  });

  // ========== REMOVE A ANOTAÇÃO ===============
  jQuery(document).on("click", ".anotacao_excluir", function(e) {
    x_anotacao_post_it = this.parentNode;
    id_paragrafo = x_anotacao_post_it.id;
    x_destaque_amarelo = jQuery("x-anotacao-destaque[id='" + id_paragrafo + "']");

    jQuery
      .ajax({
        url: BASE_URL + "/api_delete_note",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          ra_aluno: ra_aluno,
          pagina: pagina_atual,
          id_paragrafo: id_paragrafo
        }),
        beforeSend: function() {
          jQuery("#modal").addClass("loading");
        }
      })
      .done(function(jsondata) {
        jQuery("#modal").removeClass("loading");
        jQuery(x_destaque_amarelo)
          .contents()
          .unwrap();
        jQuery(x_anotacao_post_it).remove();
      })
      .fail(function(jqXHR, textStatus, jsondata) {
        jQuery("#modal").removeClass("loading");
        console.log(textStatus);
        alert("Erro ao excluir comentário");
      });
  });

  // ================  CARREGA TODAS AS ANOTAÇÕES NO LOAD DA PÁGINA ============
  jQuery
    .ajax({
      url: BASE_URL + "/api_get_notes",
      type: "post",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        ra_aluno: ra_aluno,
        pagina: pagina_atual
      }),
      beforeSend: function() {
        jQuery("#modal").addClass("loading");
      }
    })
    .done(function(jsondata) {
      items = jsondata;
      for (j = 0; j < items.length; j++) {
        item = items[j];
        par = jQuery("p[id=" + item.id_paragrafo + "]").html();
        inicio = item.inicio;
        final = item.fim;
        texto_final =
          par.slice(0, inicio) +
          '<x-anotacao-destaque id="' +
          item.id_paragrafo +
          '">' +
          par.slice(inicio, final) +
          "</x-anotacao-destaque>" +
          par.slice(final);
        jQuery("p[id=" + item.id_paragrafo + "]").html(texto_final);
        jQuery("p[id=" + item.id_paragrafo + "]").before(
          "<x-anotacao-post_it id='" +
            item.id_paragrafo +
            "' status=0'><div class='anotacao_conteudo'>" +
            item.comentario +
            "</div><div class='anotacao_excluir'>X</div></x-anotacao-post_it>"
        );
      }
      jQuery("#modal").removeClass("loading");
    })
    .fail(function(jqXHR, textStatus, jsondata) {
      console.log(textStatus);
      alert("Falha ao carregar anotações");
      jQuery("#modal").removeClass("loading");
    });
});
