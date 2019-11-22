var pagina = "http://mdm.claretiano.edu.br/matdid-0000-2020-01-grad-ead/2017/03/17/ciclo1/";
var data;

function exibir_links() {
	jQuery.ajax({
		url: BASE_URL + "/api_get_dashboard",
		type: "post",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({
			pagina: pagina
		})
	}).done(function (data_json) {
		html_todos = jQuery("#pesquisa_list").find(".fl-html")[0];
		todos_html = ''
		for (i = 0; i < data_json.pesquisa_clicado.length; i++) {
			link = data_json.pesquisa_clicado[i]
			todos_html += `<a href="${link}">${link}</a><br>`
		}
		for (i = 0; i < data_json.pesquisa_nao_clicado.length; i++) {
			link = data_json.pesquisa_nao_clicado[i]
			todos_html += `<a href="${link}">${link}</a><br>`
		}

		html_clicado = jQuery("#pesquisa_list_result").find(".fl-html")[0];
		clicado_html = ''
		for (i = 0; i < data_json.pesquisa_clicado.length; i++) {
			link = data_json.pesquisa_clicado[i]
			clicado_html += `<a href="${link}">${link}</a><br>`
		}

		html_util = jQuery("#pesquisa_list_uteis").find(".fl-html")[0];
		util_html = ''
		for (i = 0; i < data_json.pesquisa_util.length; i++) {
			link = data_json.pesquisa_util[i]
			util_html += `<a href="${link}">${link}</a><br>`
		}

		html_evidencia = jQuery("#pesquisa_list_evidencia").find(".fl-html")[0];
		evidencia_html = ''
		for (i = 0; i < data_json.top_10.length; i++) {
			link = data_json.top_10[i]
			evidencia_html += `<a href="${link}">${link}</a><br>`
		}

		html_qtde_total = jQuery("#pesquisa_qte").find(".fl-html")[0];
		html_qtde_clicado = jQuery("#pesquisa_qte_conversao").find(".fl-html")[0];
		html_qtde_util = jQuery("#pesquisa_qte_conversao_uteis").find(".fl-html")[0];
		html_qtde_evidencia = jQuery("#pesquisa_qte_uteis_relevante").find(".fl-html")[0];

		html_qtde_total.innerHTML = data_json['total_links']
		html_qtde_clicado.innerHTML = data_json['pesquisa_clicado'].length
		html_qtde_util.innerHTML = data_json['pesquisa_util'].length
		html_qtde_evidencia.innerHTML = data_json['top_10'].length

		html_todos.innerHTML = todos_html
		html_clicado.innerHTML = clicado_html
		html_util.innerHTML = util_html
		html_evidencia.innerHTML = evidencia_html
	})

}

function gerar_dashboard() {
	jQuery.ajax({
		url: BASE_URL + "/api_get_dashboard",
		type: "post",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({
			pagina: pagina
		})
	}).done(function (data_json) {
		data = data_json;
		html_anotacao_click = jQuery("#anotações_qte").find(".fl-html")[0];
		html_anotacao_realizada = jQuery("#anotações_qte_conversao").find(".fl-html")[0];
		html_duvida_click = jQuery("#duvida_qte").find(".fl-html")[0];
		html_duvida_realizada = jQuery("#duvida_qte_conversao").find(".fl-html")[0];
		html_anotacao_porcentagem = jQuery('#anotacao_perc_resul').find('.fl-html')[0];
		html_duvida_porcentagem = jQuery('#duvida_perc_resul').find('.fl-html')[0];
		html_pesquisa_porcentagem = jQuery('#pesquisa_perc_resul').find('.fl-html')[0];
		html_pesquisa_realizada_porcentagem = jQuery('#pesquisa_perc_pesq_rel').find('.fl-html')[0];
		html_pesquisa_util_porcentagem = jQuery('#pesquisa_perc_uteis').find('.fl-html')[0];

		html_pesquisa_click = jQuery("#pesquisa_total_cliques").find(".fl-html")[0];
		html_pesquisa_total_link = jQuery("#pesquisa_total_links").find(".fl-html")[0];
		html_pesquisa_realizada = jQuery("#pesquisa_qte").find(".fl-html")[0];
		html_pesquisa_resultado = jQuery("#pesquisa_qte_conversao").find(".fl-html")[0];
		html_pesquisa_util = jQuery("#pesquisa_qte_conversao_uteis").find(".fl-html")[0];

		html_dicionario_click = jQuery("#dicionario_qte").find(".fl-html")[0];
		html_impressao_click = jQuery("#print_qte").find(".fl-html")[0];
		html_audio_click = jQuery("#audio_qte").find(".fl-html")[0];
		html_trilha_click = jQuery("#trilha_qte").find(".fl-html")[0];
		html_link_externo = jQuery("#links_externos_qte").find(".fl-html")[0];


		html_anotacao_click.innerHTML = data_json['clicks_anotacao']
		html_anotacao_realizada.innerHTML = data_json['anotacao_realizada']

		if (data_json['clicks_anotacao'] > 0)
			_valor = parseInt(data_json['anotacao_realizada'] / data_json['clicks_anotacao'] * 100) + '%'
		else
			_valor = '0%'
		html_anotacao_porcentagem.innerHTML = _valor
		html_duvida_click.innerHTML = data_json['clicks_duvida']
		html_duvida_realizada.innerHTML = data_json['duvida_enviada']


		if (data_json['clicks_duvida'] > 0)
			_valor = parseInt(data_json['duvida_enviada'] / data_json['clicks_duvida'] * 100) + '%'
		else
			_valor = '0%'
		html_duvida_porcentagem.innerHTML = _valor

		html_pesquisa_click.innerHTML = data_json['clicks_pesquisa']
		html_pesquisa_realizada.innerHTML = data_json['total_pesquisa']
		html_pesquisa_total_link.innerHTML = data_json['total_links']
		html_pesquisa_resultado.innerHTML = data_json['pesquisa_clicado'].length
		html_pesquisa_util.innerHTML = data_json['pesquisa_util'].length


		if (data_json['clicks_pesquisa'] > 0)
			_valor = parseInt(data_json['total_pesquisa'] / data_json['clicks_pesquisa'] * 100) + '%'
		else
			_valor = '0%'
		html_pesquisa_realizada_porcentagem.innerHTML = _valor


		if (data_json['total_links'] > 0)
			_valor = parseInt(data_json['pesquisa_clicado'].length / data_json['total_links'] * 100) + '%'
		else
			_valor = '0%'
		html_pesquisa_porcentagem.innerHTML = _valor


		if (data_json['pesquisa_clicado'].length > 0)
			_valor = parseInt(data_json['pesquisa_util'].length / data_json['pesquisa_clicado'].length * 100) + '%'
		else
			_valor = '0%'
		html_pesquisa_util_porcentagem.innerHTML = _valor

		html_dicionario_click.innerHTML = data_json['clicks_dicionario']
		html_impressao_click.innerHTML = data_json['clicks_imprimir']
		html_audio_click.innerHTML = data_json['clicks_ouvir']
		html_trilha_click.innerHTML = data_json['clicks_trilha']
		html_link_externo.innerHTML = data_json['clicks_link_externo'].length


		console.log(data_json);
	}).fail(function (jqXHR, textStatus, jsondata) {
		console.log(jqXHR);
		alert("Falhou ao gerar o dashboard");
	});
}
