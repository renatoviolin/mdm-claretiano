from mrakun import RakunDetector
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import spacy
import gensim.summarization
import re
import os
# from multi_rake import Rake
import uuid

hyperparameters = {"distance_threshold": 2,
                   "num_keywords": 5,
                   "pair_diff_length": 2,
                   "distance_method": "editdistance",
                   "stopwords": stopwords.words('english'),
                   "bigram_count_threshold": 2,
                   "lemmatizer": WordNetLemmatizer(),
                   "num_tokens": [1]}

keyword_detector = RakunDetector(hyperparameters)
keyword_detector.verbose = False

# rake = Rake()


def from_gensim(text):
    keys = gensim.summarization.keywords(text, scores=False, lemmatize=True, deacc=True)
    result = keys.split()[:5]
    print('==== GENSIM ====')
    print(result)
    return result


def from_rake(text):
    keys = rake.apply(text)
    result = []
    for k in keys:
        result.append(k[0])
    print('==== RAKE ====')
    print(result[:5])


def from_raku(text):
    file_name = str(uuid.uuid4())
    text_file = open(file_name, "w")
    text_file.write(text)
    text_file.close()

    keys = keyword_detector.find_keywords(file_name)
    os.remove(file_name)
    result = []
    for k in keys:
        result.append(k[0])
    print('==== RAKU ====')
    print(result)
    return result


def pre_process(text):
    allowed_postags = ['NOUN', 'ADJ', 'VERB', 'ADV']
    # text = text.lower()
    text = re.sub("</?.*?>", " <> ", text)  # remove tags
    text = re.sub('(\\d|\\W)+', ' ', text)  # remove digits and special chars
    text = re.sub('\s+', ' ', text)   # remove new line
    text = re.sub("\'", '', text)  # remove single quotes
    return text
