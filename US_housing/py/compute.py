# imports/modules
import os
import json
from PIL import Image

def redline(im):
    changed = im.copy()
    w,h = changed.size
    pixels = changed.load()

    for x in range(w):
        y = (h/float(w)) * x
        pixels[x,y] = (255,0,0)

    return changed


def do_compute():
    return 1
    #set up file names to use for I/O
    orig_img_name = "res/yosemite.jpg"
    new_img_name = "res/redline.jpg"

    # bring data into memory
    orig_img = Image.open(orig_img_name)

    new_img = redline(orig_img)
    new_img.save(new_img_name)

    # build dictionary containing orig and new
    outData = {'orig': orig_img_name, 'new': new_img_name }

    f = open("res/data.json", "w")
    s = json.dumps(outData, indent = 4)
    f.write(s)

