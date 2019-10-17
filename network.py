from googlesearch import search
import requests
import re
import random


# =============================== SOCKET TOR =========================
import socks
import socket
from stem import Signal
from stem.control import Controller


def no_proxy():
    socks.setdefaultproxy()
    socket.socket = socks.socksocket


def tor_proxy():
    socks.setdefaultproxy(socks.PROXY_TYPE_SOCKS4, '127.0.0.1', 9050, True)
    socket.socket = socks.socksocket


def new_ip():
    no_proxy()
    with Controller.from_port(port=9051) as controller:
        controller.authenticate()
        controller.signal(Signal.NEWNYM)
    tor_proxy()
# =============================== SOCKET TOR =========================


with open('user_agents_en.txt') as fp:
    user_agents_list = [_.strip() for _ in fp.readlines()]


def get_random_user_agent():
    return random.choice(user_agents_list)


def google_search(text):
    print('Texto de Busca')
    print(text)
    links = []
    user_agent = get_random_user_agent()
    urls = search(text, tld='com.br', lang='pt-BR', safe='on', stop=5,
                  user_agent=user_agent, return_title=True)
    for url in urls:
        url['title'] = url['title'] if url['title'] != '' else url['link']
        links.append(url)
    print('=== GOOGLE ===')
    print(links)
    return links
