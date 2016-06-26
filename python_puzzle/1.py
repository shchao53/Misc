# list = 'g fmnc wms bgblr rpylqjyrc gr zw fylb. rfyrq ufyr amknsrcpq ypc dmp. bmgle gr gl zw fylb gq glcddgagclr ylb rfyrq ufw rfgq rcvr gq qm jmle. sqgle qrpgle.kyicrpylq() gq pcamkkclbcb. lmu ynnjw ml rfc spj.'

list='map'

eng = 'abcdefghijklmnopqrstuvwxyz'
engl = eng + 'ab'

newlist = ''
for i in list:
    idx = eng.find(i)
    if idx == -1:
        newlist = newlist + i
    else:
        newlist = newlist + engl[idx+2]

print newlist  
