jQuery(document).ready(function() {
  function logar_ferramenta(acao) {
    jQuery
      .ajax({
        url: BASE_URL + "/api_insert_log_ferramentas",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          ra_aluno: ra_aluno,
          pagina: pagina_atual,
          acao: acao
        })
      })
      .fail(function(jqXHR, textStatus, jsondata) {
        console.log(jqXHR);
      });
  }

  jQuery(document).on("click", "#anotacao_btn_menu", function(e) {
    logar_ferramenta(1);
  });
  jQuery(document).on("click", "#duvida_btn_menu", function(e) {
    logar_ferramenta(2);
  });
  jQuery(document).on("click", "#pesquisa_btn_menu", function(e) {
    logar_ferramenta(3);
  });
  jQuery(document).on("click", "#dicionario_btn_menu", function(e) {
    logar_ferramenta(4);
  });
  jQuery(document).on("click", "#trilha_btn_menu", function(e) {
    logar_ferramenta(5);
  });
  jQuery(document).on("click", "#btn-print", function(e) {
    logar_ferramenta(6);
  });
  jQuery(document).on("click", "#btn-voice-2", function(e) {
    logar_ferramenta(7);
  });
});
