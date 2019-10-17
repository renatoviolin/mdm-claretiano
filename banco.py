import json
import mysql.connector
from datetime import datetime

def get_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="renato",
        passwd="renato",
        database='db_comentarios')
    connection.autocommit = True
    return connection

def insert_note(data):
    date_time = str(datetime.now())
    con = get_connection()
    my_cursor = con.cursor()
    sql = '''
	  INSERT INTO comentarios (id_aluno, id_paragrafo, pagina, comentario, inicio, fim, date, texto)
	  VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
	  '''
    val = (data['ra_aluno'], data['id_paragrafo'], data['pagina'], data['comentario'],
           data['inicio'], data['fim'], date_time, data['texto'])
    my_cursor.execute(sql, val)
    con.commit()
    con.close()

def select_notes_by_ra(ra_aluno, pagina):
    con = get_connection()
    my_cursor = con.cursor()
    results = []
    sql = '''
	SELECT * FROM comentarios WHERE id_aluno = %s and pagina = %s
   '''
    val = (ra_aluno, pagina,)
    my_cursor.execute(sql, val)
    res = my_cursor.fetchall()
    for r in res:
        d = {}
        d['id'] = r[0]
        d['ra_aluno'] = r[1]
        d['id_paragrafo'] = r[2]
        d['pagina'] = r[3]
        d['comentario'] = r[4]
        d['inicio'] = r[5]
        d['fim'] = r[6]
        d['status'] = r[7]
        results.append(d)
    con.close()
    return results

def delete_note(ra_aluno, id_paragrafo, pagina):
    con = get_connection()
    my_cursor = con.cursor()
    sql = '''
   DELETE FROM comentarios WHERE id_aluno = %s and id_paragrafo = %s and pagina = %s
   '''
    val = (ra_aluno, id_paragrafo, pagina)
    my_cursor.execute(sql, val)
    con.commit()
    con.close()
