import zipfile

zf = zipfile.ZipFile('6.channel.zip')
n = '90052'
ans = ''

while n > 0:
    try:
        filename = n + '.txt'
        text = zf.read(filename)
        n = text[16:]
        comment = zf.getinfo(filename).comment     # files in zip file have comments!!
        ans += comment
    except:
        print ans
        break
    
