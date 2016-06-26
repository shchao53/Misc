import requests

URL_prefix = 'http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing='
n = '12345'
# n = '66831'

while n > 0:

    URL = URL_prefix + n
    text = requests.get(URL).text
    n = text[-5:]
    print text

# some n are less than 5 digits
# but the game designer make space(%20) work in URL
