import Tkinter as tk
from PIL import Image
from PIL import ImageTk
import tkFileDialog
import cv2
from scipy import misc

import face_rec

conf=face_rec.Config()

fc=face_rec.facerec(conf)

display_img,display_names=fc.recognize(conf,'/home/ashtosh/Downloads/rich_franklin2.jpg')

def populate(frame,frame1):
    '''Put in some fake data'''
    if 0:
        path='/home/ashtosh/Downloads/rich_franklin2.jpg'
        image=cv2.imread(path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edged = cv2.Canny(gray, 50, 100)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        image = Image.fromarray(image)
        edged = Image.fromarray(edged)

        # ...and then to ImageTk format
        image = ImageTk.PhotoImage(image)
        edged = ImageTk.PhotoImage(edged)

    if 0:
        path = tkFileDialog.askopenfilename()
        image=misc.imread(path)
        display_img,display_names=fc.recognize(conf,path)
        edged=display_img

    for row in range(1):
        if 1:
            path = tkFileDialog.askopenfilename()
            image=misc.imread(path)
            display_img,display_names=fc.recognize(conf,path)
            edged=display_img
        panelA=tk.Label(frame, image=image)
        panelA.grid(row=row, column=0)
        panelA.image = image
        panelA.pack(side="left", padx=10, pady=10)
        #t="this is the second column for row %s" %row
        panelB=tk.Label(frame1, image=edged)
        panelB.grid(row=row, column=1)
        panelB.image = edged
        panelB.pack(side="right", padx=10, pady=10)

def onFrameConfigure(canvas):
    '''Reset the scroll region to encompass the inner frame'''
    canvas.configure(scrollregion=canvas.bbox("all"))

root = tk.Tk()
canvas = tk.Canvas(root, borderwidth=0, background="#ffffff")
frame = tk.Frame(canvas, background="#ffffff")
vsb = tk.Scrollbar(root, orient="vertical", command=canvas.yview)
canvas.configure(yscrollcommand=vsb.set)

vsb.pack(side="right", fill="y")
canvas.pack(side="left", fill="both", expand=True)
canvas.create_window((4,4), window=frame, anchor="nw")

frame.bind("<Configure>", lambda event, canvas=canvas: onFrameConfigure(canvas))

canvas1 = tk.Canvas(root, borderwidth=0, background="#ffffff")
frame1 = tk.Frame(canvas1, background="#ffffff")
vsb1 = tk.Scrollbar(root, orient="vertical", command=canvas1.yview)
canvas1.configure(yscrollcommand=vsb1.set)

vsb1.pack(side="right", fill="y")
canvas1.pack(side="left", fill="both", expand=True)
canvas1.create_window((4,4), window=frame1, anchor="nw")

frame1.bind("<Configure>", lambda event, canvas=canvas1: onFrameConfigure(canvas1))
populate(frame,frame1)

btn = tk.Button(root, text="Select an image", command=select_image)
btn.pack(side="bottom", fill="both", expand="yes", padx="10", pady="10")

root.mainloop()
