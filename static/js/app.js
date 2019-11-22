var element_mouse_over;
var element_mouse_selected;
var element_mouse_selected_id;
var pageX;
var pageY;
var selected_text = "";
var all_p;
var pagina_atual = "";
var ra_aluno = 1;
var range;
var min_split = 10;
var BASE_URL = "http://renato.dynu.net:8000";
// var BASE_URL = "";
var link;

jQuery(document).ready(function () {
	alert(' d dd    dd')
	jQuery.fn.center = function () {
		this.css("position", "absolute");
		this.css("top", Math.max(0, (jQuery(window).height() - jQuery(this).outerHeight()) / 2 + jQuery(window).scrollTop()) + "px");
		this.css("left", Math.max(0, (jQuery(window).width() - jQuery(this).outerWidth()) / 2 + jQuery(window).scrollLeft()) + "px");
		return this;
	};

	if (!window.x) x = {};
	x.Selector = {};
	x.Selector.getSelected = function () {
		var t = "";
		if (window.getSelection) {
			t = window.getSelection();
		} else if (document.getSelection) {
			t = document.getSelection();
		} else if (document.selection) {
			t = document.selection.createRange().text;
		}
		return t;
	};


	if (window.localStorage['ra'] == null) {
		ra_aluno = prompt("Digite seu RA", "1");
		if (ra_aluno == null) {
			return;
		}
		window.localStorage['ra'] = ra_aluno
	}
	else {
		ra_aluno = window.localStorage['ra']
	}



	// _pag = window.location.href.split("/");
	// pagina_atual = _pag[_pag.length - 2];
	pagina_atual = window.location.href;

	jQuery(document).on("mousedown", function (e) {
		pageX = e.pageX;
		pageY = e.pageY;
	});

	jQuery(".col-sm-8, .fl-rich-text").mousedown(function (e) {
		element_mouse_over = document.elementFromPoint(e.clientX, e.clientY);
		selected_text = "";
	});

	all_p = jQuery("p");
	for (i = 0; i < all_p.length; i++) all_p[i].id = i;

	jQuery(".col-sm-8, .fl-rich-text").bind("mouseup", function (e) {
		selected_text = x.Selector.getSelected()
			.getRangeAt(0)
			.toString();
		element_mouse_selected = element_mouse_over;
		element_mouse_selected_id = element_mouse_over;
		range = x.Selector.getSelected().getRangeAt(0);
		// console.log(range)
		// se deu dois clicks e pegou o final do range como outro elemento
		if (range.endOffset == 0) {
			console.log("entrou no range");
			range.setEnd(range.startContainer, range.endContainer.previousElementSibling.innerHTML.length);
		}

		// se selecionou um conteúdo e a tag não é P, busca o parent para encontrar o P
		while (element_mouse_selected_id.parentElement != null && element_mouse_selected_id.nodeName != "P") {
			element_mouse_selected_id = element_mouse_selected_id.parentElement;
			if (element_mouse_selected_id.parentElement.nodeName != "P") break;
		}
	});

	function logar_link_clicado(texto, link) {
		jQuery
			.ajax({
				url: BASE_URL + "/api_insert_log_link_clicado",
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify({
					ra_aluno: ra_aluno,
					pagina: pagina_atual,
					texto: texto,
					link: link
				})
			})
	}

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
			.fail(function (jqXHR, textStatus, jsondata) {
				console.log(jqXHR);
			});
	}

	jQuery(document).on("click", "a", function (e) {
		link = jQuery(e.currentTarget).attr("href");
		console.log(link)
		logar_link_clicado("", link);
		// e.preventDefault();
	});

	jQuery(document).on("click", "#anotacao_btn_menu", function (e) {
		logar_ferramenta(1);
	});
	jQuery(document).on("click", "#duvida_btn_menu", function (e) {
		logar_ferramenta(2);
	});
	jQuery(document).on("click", "#pesquisa_btn_menu", function (e) {
		logar_ferramenta(3);
	});
	jQuery(document).on("click", "#dicionario_btn_menu", function (e) {
		logar_ferramenta(4);
	});
	jQuery(document).on("click", "#trilha_btn_menu", function (e) {
		logar_ferramenta(5);
	});
	jQuery(document).on("click", "#btn-print", function (e) {
		logar_ferramenta(6);
	});
	jQuery(document).on("click", "#btn-voice-2", function (e) {
		logar_ferramenta(7);
	});

	// ========== ADICIONA LINHAS AO REDOR DOS HEADERS ================
	// all_h = jQuery('h2')
	// for (i = 0; i < all_h.length; i++) {
	//   h = all_h[i]
	//   jQuery(h).nextUntil('h2').add(jQuery(h)).wrapAll('<div class="linha" id=' + i + '>')
	// }
});
