from collections import defaultdict, Counter
from nltk.tokenize import word_tokenize
from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import stopwords
from sklearn.naive_bayes import MultinomialNB
import json
import math
import glob
import re
import nltk


def clean(words):
    """Data Cleaning
    """
    words = [w.lower() for w in words]
    words = [re.sub('\.$', '', w) for w in words]
    words = [w for w in words if w.isalpha()]
    words = [w for w in words if w not in stopwords.words('english')]
    words = [SnowballStemmer('english').stem(w) for w in words]
    return words


def lyrics2words(lyrics):
    """Convert raw text to tokenized clean words
    """
    words = word_tokenize(lyrics.decode('utf8'))
    words = clean(words)
    return words


def get_songs(path):
    """Get all the information of songs in the path
    """
    song_list = []
    genre_paths = glob.glob(path + '/*')
    for genre_path in genre_paths:
        artist_paths = glob.glob(genre_path + '/*')
        for artist_path in artist_paths:
            album_paths = glob.glob(artist_path + '/*')
            for album_path in album_paths:
                lyrics_paths = glob.glob(album_path + '/*.txt')
                for lyrics_path in lyrics_paths:
                    song = {}
                    song["genre"] = genre_path.replace(path + '/', '')
                    song["artist"] = artist_path.replace(genre_path + '/', '')
                    song["album"] = album_path.replace(artist_path + '/', '')
                    song["lyrics"] = open(lyrics_path).read()
                    song["name"] = lyrics_path[:-4].replace(album_path + '/', '')
                    song["x"] = 0
                    song["y"] = 0
                    song_list.append(song)
    return song_list
        
    
def define_y(words):
    """Calculate y values by text entropy
    """
    num_words = len(words)
    loglam = math.log10(num_words)
    freq = nltk.FreqDist(words)
    
    entropy = 0.0
    for w in freq:
        pi = freq[w]
        entropy += pi * (loglam - math.log10(pi)) / float(num_words)
    rel_entropy = entropy / loglam
    return rel_entropy


def combine_genre(songs):
    """Combine all the lyrics of input songs
    """
    combined = ""
    for song in songs:
        combined += song["lyrics"]
    return combined


def feature_values(words, word_features):
    """derive feature values for input words
    """
    freq = nltk.FreqDist(words)
    values = []
    for wf in word_features:
        if wf in freq:
            values.append(freq[wf])
        else:
            values.append(0)
    return values
    

def do_compute():
    return 1
    path = 'res'

    # get songs info from files, type: list of dictionaries
    songs = get_songs(path)
    
    # Combine lyrics for each genre into one string
    combined_words = defaultdict()
    for genre in ['Pop', 'Country']:
        song_list = [song for song in songs if song["genre"] == genre]
        combined_words[genre] = lyrics2words(combine_genre(song_list))

    # Construct training set for the model
    all_words_freq = nltk.FreqDist(combined_words['Pop'] + \
                                   combined_words['Country'])
    word_features = list(all_words_freq)[:500]
    train_y = []
    train_X = []
    for song in songs:
        song_words = lyrics2words(song["lyrics"])
        X_i = feature_values(song_words, word_features)
        train_X.append(X_i)
        if song['genre'] == 'Country':
            train_y.append(1)
        else:
            train_y.append(0)

    # train the model
    clf = MultinomialNB()
    clf.fit(train_X, train_y)
        
    # calculate the x and y value
    for song in songs:
        song_words = lyrics2words(song["lyrics"])
        song_feature_values = feature_values(song_words, word_features)
        song["x"] = clf.predict_proba(song_feature_values)[0][1]
        song["y"] = define_y(song_words)
        print song["genre"], song["artist"], \
            song["album"], song['name'], song['y'], song['x']
        
    # write to the json file
    f = open("res/songs.json", 'w')
    s = json.dumps(songs, indent=4)
    f.write(s)

