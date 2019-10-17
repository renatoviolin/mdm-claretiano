import json
import mysql.connector
import banco
from datetime import datetime


def insert_log(ra, pagina, acao, conteudo):
    date_time = str(datetime.now())
    con = banco.get_connection()
    my_cursor = con.cursor()
    sql = '''
      INSERT INTO log_pesquisas (date, ra, pagina, acao, conteudo)
      VALUES (%s, %s, %s, %s, %s)
      '''
    val = (date_time, ra, pagina, acao, conteudo)
    my_cursor.execute(sql, val)
    con.commit()
    con.close()


def select_log_pesquisa(ra, pagina, tipo):  # 1-Pesquisa 2-Definicão
    con = banco.get_connection()
    my_cursor = con.cursor()
    results = []
    sql = '''
   SELECT date, acao, conteudo FROM log_pesquisas WHERE ra = %s and pagina = %s and acao = %s ORDER BY date asc
   '''
    val = (ra, pagina, tipo)
    my_cursor.execute(sql, val)
    res = my_cursor.fetchall()
    for r in res:
        d = {}
        d['date'] = r[0].strftime("%d/%m/%Y as %H:%M")
        d['tipo'] = r[1]  # 1 - pesquisa  2-definicao
        d['conteudo'] = r[2]
        d['texto_par'] = ''
        results.append(d)
    con.close()
    return results


def select_log_anotacoes(ra, pagina):
    con = banco.get_connection()
    my_cursor = con.cursor()
    results = []
    sql = '''
    SELECT date, comentario, texto FROM comentarios WHERE id_aluno = %s and pagina = %s ORDER BY date asc
    '''
    val = (ra, pagina,)
    my_cursor.execute(sql, val)
    res = my_cursor.fetchall()
    for r in res:
        d = {}
        d['date'] = r[0].strftime("%d/%m/%Y as %H:%M")
        d['tipo'] = 3
        d['conteudo'] = r[1]
        d['texto_par'] = r[2]
        results.append(d)
    con.close()
    return results


def select_log_importante(ra, pagina):
    con = banco.get_connection()
    my_cursor = con.cursor()
    results = []
    sql = '''
      SELECT date, texto FROM importantes WHERE pagina = %s and id_aluno = %s ORDER BY date asc
       '''
    val = (pagina, ra)
    my_cursor.execute(sql, val)
    res = my_cursor.fetchall()
    for r in res:
        d = {}
        d['date'] = r[0].strftime("%d/%m/%Y as %H:%M")
        d['tipo'] = 4
        d['conteudo'] = ''
        d['texto_par'] = r[1]
        results.append(d)
    con.close()
    return results


def select_log_dificil(ra, pagina):
    con = banco.get_connection()
    my_cursor = con.cursor()
    results = []
    sql = '''
      SELECT date, texto FROM dificil WHERE pagina = %s and id_aluno = %s ORDER BY date asc
       '''
    val = (pagina, ra)
    my_cursor.execute(sql, val)
    res = my_cursor.fetchall()
    for r in res:
        d = {}
        d['date'] = r[0].strftime("%d/%m/%Y as %H:%M")
        d['tipo'] = 5
        d['conteudo'] = ''
        d['texto_par'] = r[1]
        results.append(d)
    con.close()
    return results


def select_log_duvidas_mentor(ra):
    con = banco.get_connection()
    my_cursor = con.cursor()
    results = []
    sql = '''
      SELECT date, conteudo FROM duvidas_mentor WHERE ra = %s ORDER BY date asc
       '''
    val = (ra,)
    my_cursor.execute(sql, val)
    res = my_cursor.fetchall()
    for r in res:
        d = {}
        d['date'] = r[0].strftime("%d/%m/%Y as %H:%M")
        d['tipo'] = 6
        d['conteudo'] = r[1]
        d['texto_par'] = ''
        results.append(d)
    con.close()
    return results


# %%
# r = select_log_importante(1, 'localhost:8000')

# # %%
# ra = 1
# pagina = 'localhost:8000'
# an = select_log_anotacoes(ra, pagina)
# pe = select_log_pesquisa(ra, pagina, tipo=1)
# de = select_log_pesquisa(ra, pagina, tipo=2)
# im = select_log_importante(ra, pagina)
# di = select_log_dificil(ra, pagina)
# todos = []
# for el in an:
#     todos.append(el)
# for el in pe:
#     todos.append(el)
# for el in de:
#     todos.append(de)
# for el in im:
#     todos.append(im)
# for el in di:
#     todos.append(di)


# #%%
# import pandas as pd
# # pd.DataFrame(an, columns=['1', '2', '3', '4'])
# an_d = pd.read_json(json.dumps(an))
# pe_d = pd.read_json(json.dumps(pe))
# de_d = pd.read_json(json.dumps(de))
# im_d = pd.read_json(json.dumps(im))
# di_d = pd.read_json(json.dumps(di))

# #%%
# todos = pd.concat([an_d, pe_d, de_d, im_d, di_d], ignore_index=True)

# #%%
# todos.sort_values('date', axis=0, ascending=True, inplace=True, kind='quicksort', na_position='last')

# #%%
# todos.to_json(orient='records')

# #%%
