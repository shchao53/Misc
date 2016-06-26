import re

# eng = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'


txt = open('3.equality.html').read().rstrip('\n')


letters = re.findall('[^A-Z][A-Z][A-Z][A-Z][a-z][A-Z][A-Z][A-Z][^A-Z]', txt)

url = ''
for i in letters:
    url =  url + i[4]

print url
