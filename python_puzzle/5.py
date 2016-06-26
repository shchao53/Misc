# pickle

import requests
import pickle 


URL = 'http://www.pythonchallenge.com/pc/def/banner.p'

text = requests.get(URL).text
# print text                     

# print pickle.loads(text)

file = open('5.banner.p', 'rb')
a = pickle.load(file)

for i in range(len(a)):
    line = ''
    for j in range(len(a[i])):
        line += a[i][j][0]*a[i][j][1]
        if j == len(a[i])-1:
            print line
        

