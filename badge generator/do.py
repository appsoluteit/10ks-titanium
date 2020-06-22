#!/usr/bin/env python3

print("starting");

import subprocess
import os

curr_path = os.path.dirname(os.path.abspath(__file__))

print("current path " + curr_path);

#---
number_of_tickets = 10
bg_file = curr_path+"/steps.png"
font = '/Users/appceleratordeveloper/Library/Fonts/Rui Abreu - Gesta-Regular.otf'
#---

def command(string, layer, position):
    return "convert -size 196x221 xc:None -fill black -font "+'"'+font+'"'+\
        " -stroke None -fill white -pointsize 16 -style Normal -gravity west -draw "+\
            position+"'"+string+"'"+'" '+layer

def print_tofile(string, number):
    print("creating file "+number+"."*3)
    layer_1 = curr_path+"/"+number+"_a.png"
    layer_2 = curr_path+"/"+number+"_b.png"
    cmd_1 = command(string, layer_1, '"text 149,-80 ')
    cmd_2 = command(string, layer_2, '"text 149,-80 ')
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
    print("printing " + number);
    string = number
    print_tofile(string, number)
