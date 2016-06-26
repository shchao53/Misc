eng = 'abcdefghijklmnopqrstuvwxyz'
txt = open('2.ocr.html').read().rstrip('\n')
url = [ x for x in txt if eng.find(x) != -1]


print ''.join(url)
