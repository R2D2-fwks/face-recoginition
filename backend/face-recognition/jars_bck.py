import os
from flask import Flask, make_response, Response , send_file
from flask import g as ephermal_values
import random
from flask import request
from werkzeug.utils import secure_filename
from facerec import face_rec1 as face_rec
import urllib
import json
import Image
import StringIO


#sys.path.insert(0, '/home/ashtosh/Codes/Image/Face/facerec')
app = Flask(__name__)
app.config['ALLOWED_EXTENSIONS'] = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])



@app.before_request
def set_on_g_object():
      x = random.randint(0, 9)
      ephermal_values.x = x
      print( ephermal_values.x )

@app.after_request
def get_on_g_object(response):
      print(ephermal_values.x)
      return response


@app.route('/hello')
def hello():
      headers = {'Content-Type': 'text/plain'}
      return make_response('Hello, world! flask' + str(ephermal_values.x), headers)


FILE_FOLDER = './uploaded_images'
@app.route('/upload', methods=['POST'])
def upload():
      print("*********** received a request *********************")
      print(request.headers )

      filestorage = request.files['file']
      filename = secure_filename(filestorage.filename)
      dest = os.path.join(FILE_FOLDER, filename)
      print (dest)
      filestorage.save(dest)
     # return 
      conf = face_rec.Config()
      import scipy
      from scipy import misc
      
      fc = face_rec.facerec(conf)
      display_img,display_name = fc.recognize(conf , './uploaded_images/'+filename)
      #Z=zip(display_name,display_img)
      #dic=dict(Z)
      #conv_json = json.dumps(dic)
      #print conv_json
      #return conv_json
      return "#".join(display_name) 


ENROLL_FILE_FOLDER = './enrolled_image'
@app.route('/enroll', methods=['POST'])
def enroll():
      print("*********** received a request *********************")
      filestorage = request.files['file']
      actor_name = request.form['name']
      print("****************************"+ actor_name)
      filename = secure_filename(filestorage.filename)
      dest = os.path.join(ENROLL_FILE_FOLDER, filename)
      filestorage.save(dest)
      conf = face_rec.Config()
      import scipy
      from scipy import misc
      print("*****"+dest) 
      fc = face_rec.facerec(conf)
      fc.enroll_img(dest,actor_name)
      return "OK"











@app.route('/<name>', methods=['GET'])
def get_image(name):
    dir = "/home/vinoo/tmptraining/eval_160/"
    filename = dir + name
    print name
    return send_file(filename, mimetype='image/jpg')


 

if __name__ == '__main__':
      app.config.update(PERMANENT_SESSION_LIFETIME=2000000)
      app.run(host= '0.0.0.0')

