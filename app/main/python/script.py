import sys
import os
import time

print("Command executed from Python script")
print(os.getcwd())
time.sleep(3) 
file =  open(os.getcwd()+'/app/render/html/output.html', 'w')
file.write("<p>Function output from python</p>")
# print(fil)
sys.stdout.flush()

