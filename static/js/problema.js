jQuery(document).ready(function () {

	// ====== OPEN WINDOW =======
	jQuery('#problema_btn_menu').on('click', function () {
		jQuery('.problema_fixed').slideToggle('fast');
		jQuery("#problema_conteudo").focus();
	})


	// ===== CLOSE WINDOW ==========
	jQuery('.problema_header, #problema_btn_cancelar').on('click', function () {
		jQuery('.problema_fixed').slideToggle('fast');
		jQuery("#problema_conteudo").html("");
	})


	// ===== ENVIAR PROBLEMA ==========
	jQuery("#problema_btn_enviar").on("click", function () {
		if (jQuery("#problema_conteudo").html() == "") {
			alert('Digite o problema ocorrido e clique em enviar');
			return;
		}

		jQuery.ajax({
			url: BASE_URL + "/api_insert_problema",
			type: "post",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({
				ra_aluno: ra_aluno,
				pagina: pagina_atual,
				tipo: 1,
				conteudo: jQuery("#problema_conteudo").html()
			}),
			beforeSend: function () {
				jQuery("#modal").addClass("loading");
			}
		}).done(function (jsondata) {
			alert('O problema foi reportado com sucesso.\nEm breve entraremos em contato.\nObrigado pelo seu feedback.')
			jQuery("#modal").removeClass("loading");
			jQuery("#problema_conteudo").html("");
			jQuery('.problema_fixed').slideToggle('fast');
		}).fail(function (jqXHR, textStatus, jsondata) {
			console.log(jsondata);
			jQuery("#problema_conteudo").html("");
			jQuery("#modal").removeClass("loading");
			jQuery('.problema_fixed').slideToggle('fast');
		});
	});
});
