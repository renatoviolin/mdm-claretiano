from flask import Flask
import flask
from flask import render_template, jsonify, request, redirect, url_for
import banco
import banco_log
import json
from flask_cors import CORS
import pandas as pd
import keywords
import network
from dicio import Dicio

app = Flask(__name__)
app.config["DEBUG"] = True
app.config["CACHE_TYPE"] = "null"
CORS(app)
dicio = Dicio()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api_get_notes', methods=["POST"])
def get_notes():
    ra_aluno = request.json['ra_aluno']
    pagina = request.json['pagina']
    results = []
    try:
        if ra_aluno is not None and pagina != '':
            results = banco.select_notes_by_ra(ra_aluno, pagina)
            return app.response_class(response=json.dumps(results), status=200, mimetype='application/json')
    except Exception as error:
        return app.response_class(response=json.dumps(error), status=500, mimetype='application/json')


@app.route('/api_insert_note', methods=["POST"])
def insert_note():
    d = {}
    d['ra_aluno'] = request.json['ra_aluno']
    d['id_paragrafo'] = request.json['id_paragrafo']
    d['pagina'] = request.json['pagina']
    d['comentario'] = request.json['comentario']
    d['inicio'] = request.json['inicio']
    d['fim'] = request.json['fim']
    d['texto'] = request.json['texto']
    try:
        if d['ra_aluno'] is not None and d['pagina'] != '' and d['id_paragrafo'] is not None:
            banco.insert_note(d)
            return app.response_class(response=json.dumps("Gravado com sucesso"),
                                      status=200, mimetype='application/json')
    except Exception as error:
        return app.response_class(response=json.dumps(error), status=500, mimetype='application/json')


@app.route('/api_delete_note', methods=["POST"])
def delete_note():
    ra_aluno = request.json['ra_aluno']
    id_paragrafo = request.json['id_paragrafo']
    pagina = request.json['pagina']
    try:
        banco.delete_note(ra_aluno, id_paragrafo, pagina)
        return app.response_class(response=json.dumps("Removido com sucesso"),
                                  status=200, mimetype='application/json')
    except Exception as error:
        return app.response_class(response=json.dumps(error), status=500, mimetype='application/json')


@app.route('/api_search', methods=["POST"])
def search_web():
    texto = request.json['texto']
    pagina = request.json['pagina']
    ra_aluno = request.json['ra_aluno']
    text_pro = keywords.pre_process(texto)
    print(len(texto))
    try:
        if len(texto) > 100:
            gensim_keys = keywords.from_gensim(text_pro)
            raku_keys = keywords.from_raku(text_pro)
            results = network.google_search(' '.join(raku_keys))
        else:
            results = network.google_search(''.join(text_pro))
        text_log = ' '.join(text_pro.split()[0:10]) + '...'
        banco_log.insert_log(ra_aluno, pagina, 1, text_log)
        return app.response_class(response=json.dumps(results),
                                  status=200, mimetype='application/json')
    except Exception as error:
        return app.response_class(response=json.dumps(error), status=500, mimetype='application/json')


@app.route('/api_dictionary', methods=["POST"])
def search_dictionary():
    r = 'none'
    palavra = request.json['palavra']
    ra_aluno = request.json['ra_aluno']
    pagina = request.json['pagina']
    try:
        if palavra != '':
            res = dicio.search(palavra)
            print(res.meaning)
            if res is not None:
                r = app.response_class(response=json.dumps(res.meaning),
                                       status=200,
                                       mimetype='application/json')
            else:
                r = app.response_class(response=json.dumps('Não encontramos uma definição para a palavra ' + palavra),
                                       status=200,
                                       mimetype='application/json')
            banco_log.insert_log(ra_aluno, pagina, 2, palavra)
    except Exception as error:
        r = app.response_class(response=json.dumps(error),
                               status=500,
                               mimetype='application/json')
    return r


@app.route('/static_trilha', methods=["POST"])
def trilha():
    d = request.form.to_dict()
    ra_aluno = d['form_ra_aluno']
    pagina = d['form_pagina']
    return render_template('trilha.html', ra_aluno=ra_aluno, pagina=pagina)


@app.route('/api_get_trilha', methods=["POST"])
def get_trilha():
    r = 'none'
    ra = request.json['ra_aluno']
    pagina = request.json['pagina']
    try:
        if ra is not None and pagina is not None:
            an = banco_log.select_log_anotacoes(ra, pagina)
            pe = banco_log.select_log_pesquisa(ra, pagina, tipo=1)
            de = banco_log.select_log_pesquisa(ra, pagina, tipo=2)

            an_d = pd.read_json(json.dumps(an))
            pe_d = pd.read_json(json.dumps(pe))
            de_d = pd.read_json(json.dumps(de))

            todos = pd.concat([an_d, pe_d, de_d], ignore_index=True, sort=True)
            if len(todos) > 0:
                todos.sort_values('date', axis=0, ascending=True, inplace=True, kind='quicksort', na_position='last')
                todos_json = json.loads(todos.to_json(orient='records'))
                r = app.response_class(response=json.dumps(todos_json),
                                       status=200,
                                       mimetype='application/json')
            else:
                r = app.response_class(response=json.dumps("nenhum registro encontrado"),
                                       status=200,
                                       mimetype='application/json')
    except Exception as error:
        r = app.response_class(response=json.dumps(error),
                               status=500,
                               mimetype='application/json')
    return r


if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=8000, ssl_context=('cert.pem', 'key.pem'))
    app.run(host='0.0.0.0', port=8000)
