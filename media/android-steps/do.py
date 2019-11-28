#!/usr/bin/env python3

# This script generates a number of images with a numeric text overlay in its current working
# directory. To run it, you will need to change some parameters:

# 1. The location of the font to use will need to be changed to reflect your own user / directory structure.
# 2. The size of the icon will need to be updated if the icon size has changed.
# 3. Again if the size has changed, you will need to update the position of the text (x,y)
# 4. I recommend running this in 2 passes; first for single digits 1-9 and then again for double digits 
# 10-99. This is so that you can have double digits moved left slightly to simulate centered alignment.
# (you may need to run it a few tries to find the sweet spot if the size has changed)

print("starting")

import subprocess
import os

curr_path = os.path.dirname(os.path.abspath(__file__))

print("current path " + curr_path)

#---
number_of_tickets = 99
bg_file = curr_path+"/steps.png"
font = '/Users/appceleratordeveloper/Library/Fonts/Rui Abreu - Gesta-Bold.otf'
#---

def command(string, layer, position):
    return "convert -size 512x512 xc:None -fill black -font "+'"'+font+'"'+\
        " -stroke None -fill white -pointsize 56 -style Normal -gravity west -draw "+\
            position+"'"+string+"'"+'" '+layer

def print_tofile(string, number):
    print("creating file "+number+"."*3)
    layer_1 = curr_path+"/"+number+"_a.png"
    layer_2 = curr_path+"/"+number+"_b.png"
    cmd_1 = command(string, layer_1, '"text 386,-160') #398 for single digit
    cmd_2 = command(string, layer_2, '"text 386,-160') #387 for double digit
    subprocess.call(["/bin/bash", "-c", cmd_1])
    subprocess.call(["/bin/bash", "-c", cmd_2])
    cmd_3 = "convert "+bg_file+" "+layer_1+" "+layer_2+\
        " -background None -layers merge " + curr_path + "/steps_" + number + ".png"
    subprocess.call(["/bin/bash", "-c", cmd_3])
    os.remove(layer_1)
    os.remove(layer_2)
    print("done")

ns = [str(n) for n in range(9, number_of_tickets+1)][1:]

for item in ns:
    number = str(item)
    print("printing " + number)
    string = number
    print_tofile(string, number)
