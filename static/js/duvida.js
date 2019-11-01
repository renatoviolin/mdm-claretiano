jQuery(document).ready(function() {
  jQuery("#duvida_btn_menu").on("click", function(e) {
    jQuery("#duvida_container")
      .center()
      .fadeIn(100);
    jQuery("#modal").addClass("loading");
    jQuery("#duvida_titulo").focus();
    placeholder_start = '<br><span style="color:#888">------ TEXTO SELECIONADO --------<br>';
    placeholder_end = "<br>------------------------------------------<br></span>";
    placeholder_link = "Endereço: ";

    link_pagina = window.location.href;
    texto = selected_text.replace(/\s+/g, " ").trim();
    jQuery("#duvida_conteudo").html(placeholder_start + texto + placeholder_end + placeholder_link + link_pagina);
  });

  jQuery("#duvida_btn_cancelar").on("click", function() {
    jQuery("#duvida_conteudo").val("");
    jQuery("#duvida_container").fadeOut(100);
    jQuery("#modal").removeClass("loading");
  });

  jQuery("#duvida_btn_enviar").on("click", function() {
    jQuery
      .ajax({
        url: BASE_URL + "/api_insert_duvida",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          ra_aluno: ra_aluno,
          pagina: pagina_atual,
          titulo: jQuery("#duvida_titulo").val(),
          conteudo: jQuery("#duvida_conteudo").html()
        }),
        beforeSend: function() {
          jQuery("#modal").addClass("loading");
        }
      })
      .done(function(jsondata) {
        jQuery("#duvida_conteudo").val("");
        jQuery("#duvida_titulo").val("");
        jQuery("#duvida_container").fadeOut(100);
        jQuery("#modal").removeClass("loading");
      })
      .fail(function(jqXHR, textStatus, jsondata) {
        console.log(jsondata);
        jQuery("#duvida_conteudo").val("");
        jQuery("#duvida_titulo").val("");
        jQuery("#duvida_container").fadeOut(100);
        jQuery("#modal").removeClass("loading");
      });
  });
});
