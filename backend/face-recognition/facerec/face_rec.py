#from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import sys
import os,os.path
import time

import tensorflow as tf
import numpy as np
import argparse

from scipy import misc
import detect_face
from load_frozen_graph import load_graph

class Config(object):

    det_graph='/home/ashtosh/Experiments/models/facenet/mtcnn/mtcnn4.pb'
    rec_graph='/home/ashtosh/Experiments/models/facenet/frozen/lfw.pb'
    emb_file='/home/ashtosh/Experiments/embeddings/facescrub.npz'
#PS changed enrol location
    enroll_file='/home/vinoo/Experiments/embeddings/enroll.npz'
    #enroll_path='/home/vinoo/tmptraining/enroll_160/'
    enroll_path='enroll_emb/'
    image_size=160
    ntop=1
    enroll_is_same=False
    eval_path='/home/vinoo/tmptraining/eval_160/'


class facerec(object):

    def __init__(self,args):
        if args.enroll_is_same:
            args.emb_file=args.enroll_file
        self.args=args
        self.initialize_graphs_sessions()

    def prewhiten(self,x):
        mean = np.mean(x)
        std = np.std(x)
        std_adj = np.maximum(std, 1.0/np.sqrt(x.size))
        y = np.multiply(np.subtract(x, mean), 1/std_adj)
        return y

    def load_graph(self,frozen_file_name,prefix):
        g=load_graph(os.path.expanduser(frozen_file_name),prefix)
        return g

    def initialize_graphs_sessions(self):

        recprefix='rec'
        detprefix='det'
        self.recprefix=recprefix
        self.detprefix=detprefix

        self.load_embeddings()

        det_filename=self.args.det_graph
        self.gdet=self.load_graph(det_filename,detprefix)
        rec_filename=self.args.rec_graph
        self.grec=self.load_graph(rec_filename,recprefix)

        self.det_sess=tf.Session(graph=self.gdet)
        self.rec_sess=tf.Session(graph=self.grec)

        self.load_det_tensors()
        self.load_rec_tensors()
        dummy='/home/ashtosh/Downloads/rich_franklin1.jpg'
        pw,_=self.detect_faces(dummy)
        self.get_face_embedding(pw)

    def load_det_tensors(self,prefix=None):
        if prefix is None:
            prefix=self.detprefix

        graph_mtcnn=self.gdet
        pnet_bias=graph_mtcnn.get_tensor_by_name('{0}/pnet/conv4-2/BiasAdd:0'.format(prefix))
        pnet_prob=graph_mtcnn.get_tensor_by_name('{0}/pnet/prob1:0'.format(prefix))
        pnet_input=graph_mtcnn.get_tensor_by_name('{0}/pnet/input:0'.format(prefix))

        rnet_conv1=graph_mtcnn.get_tensor_by_name('{0}/rnet/conv5-2/conv5-2:0'.format(prefix))
        rnet_prob=graph_mtcnn.get_tensor_by_name('{0}/rnet/prob1:0'.format(prefix))
        rnet_input=graph_mtcnn.get_tensor_by_name('{0}/rnet/input:0'.format(prefix))

        onet_conv1=graph_mtcnn.get_tensor_by_name('{0}/onet/conv6-2/conv6-2:0'.format(prefix))
        onet_conv2=graph_mtcnn.get_tensor_by_name('{0}/onet/conv6-3/conv6-3:0'.format(prefix))
        onet_prob=graph_mtcnn.get_tensor_by_name('{0}/onet/prob1:0'.format(prefix))
        onet_input=graph_mtcnn.get_tensor_by_name('{0}/onet/input:0'.format(prefix))

        sess=self.det_sess
        self.pnet_fun=lambda img: sess.run((pnet_bias,pnet_prob),feed_dict={pnet_input:img})
        self.rnet_fun=lambda img: sess.run((rnet_conv1,rnet_prob),feed_dict={rnet_input:img})
        self.onet_fun=lambda img: sess.run((onet_conv1,onet_conv2,onet_prob),feed_dict={onet_input:img})

        #return pnet_fun,rnet_fun,onet_fun

    def detect_faces(self,image_path):
        args=self.args
        sess,pnet_fun,rnet_fun,onet_fun=self.det_sess,self.pnet_fun,self.rnet_fun,self.onet_fun
        minsize = 20 # minimum size of face
        threshold = [ 0.6, 0.7, 0.7 ]  # three steps's threshold
        factor = 0.709 # scale factor

        st_time=time.time()
        print ('loading image')
        img = misc.imread(os.path.expanduser(image_path))
        img_size = np.asarray(img.shape)[0:2]
        print ('detect face {0}'.format(time.time()-st_time))
        bounding_boxes, _ = detect_face.detect_face(img, minsize, pnet_fun, rnet_fun, onet_fun, threshold, factor)
        print ('no of faces is {0}-{1}'.format(len(bounding_boxes),time.time()-st_time))

        whitenedfaces,alignedfaces=[],[]
        nfaces=[]
        prewhitened=None
        margin=0
        image_size=args.image_size
        #if len(bounding_boxes) > 0:
        for i in range(len(bounding_boxes)):
            det = np.squeeze(bounding_boxes[i,0:4])
            bb = np.zeros(4, dtype=np.int32)
            bb[0] = np.maximum(det[0]-margin/2, 0)
            bb[1] = np.maximum(det[1]-margin/2, 0)
            bb[2] = np.minimum(det[2]+margin/2, img_size[1])
            bb[3] = np.minimum(det[3]+margin/2, img_size[0])
            cropped = img[bb[1]:bb[3],bb[0]:bb[2],:]
            aligned = misc.imresize(cropped, (image_size, image_size), interp='bilinear')
            prewhitened = self.prewhiten(aligned)
            #nfaces.append([cropped,prewhitened])
            whitenedfaces.append(prewhitened)
            alignedfaces.append(aligned)
        return whitenedfaces,alignedfaces

    def load_rec_tensors(self,recprefix=None):
        if recprefix is None:
            recprefix=self.recprefix
        graph=self.grec
        self.Timages_placeholder =graph.get_tensor_by_name("{0}/image_batch:0".format(recprefix))
        self.Tphase_train_placeholder = graph.get_tensor_by_name("{0}/phase_train:0".format(recprefix))
        self.Tembedding = graph.get_tensor_by_name("{0}/embeddings:0".format(recprefix))

    def get_face_embedding(self,image):
        args=self.args
        images_placeholder = self.Timages_placeholder
        phase_train_placeholder = self.Tphase_train_placeholder
        embedding = self.Tembedding
        sess=self.rec_sess
        image_size = args.image_size
        embedding_size = embedding.get_shape()[1]
        feed_dict = { images_placeholder:image ,phase_train_placeholder:False}
        emb_array = sess.run(embedding, feed_dict=feed_dict)
        emb_faces=emb_array
        #print (emb_array.shape)

        return emb_faces

    def load_embeddings(self,embfile=None):
        #args=self.args

#PS changed embeddings to only enrolled image 31/10/2017

#        if embfile is None:
#            embfile=self.args.emb_file
#        dataset=np.load(os.path.expanduser(embfile))
        #self.embeddings=dataset['embedding']
        #self.paths=dataset['paths']
        self.embeddings,self.paths=load_enroll_embeddings(self)

    def get_match(self,embeddings,paths,emb_test,args=None):
        if args is None:
            args=self.args
        print ('find closest matches')
        diff = np.subtract(embeddings, emb_test)
        dist = np.sum(np.square(diff),1)

        ntop=min(args.ntop,len(dist))
        #PS changed from sort to best fit - 31/10/2017
        #idx_sort=np.argsort(dist)[0:ntop]
        idx_sort=np.array([np.argmin(dist)])
        #print (paths[idx_sort])
        return paths[idx_sort],dist[idx_sort]

    def get_match_all(self,embeddings,paths,emb_test,args=None):
        st=time.time()
        if args is None:
            args=self.args
        print ('find closest matches')
        #diff = np.subtract(embeddings, emb_test[:,None])
        #dist = np.sum(np.square(diff),2)
        dist=((embeddings[:,None]-emb_test)**2).sum(axis=2)

        ntop=min(args.ntop,np.size(embeddings,0))
        idx_sort=np.argsort(dist,axis=0)[0:ntop,:].transpose()
        print (dist.shape,idx_sort.shape)
        print (time.time()-st)
        return paths[idx_sort]

    def merge_imgs(self,paths,orig):

        imgs=[]
        for p in paths:
            im=misc.imread(p)
            imgs.append(im)

        if orig.shape!=imgs[0].shape:
            image_size=imgs[0].shape[0]
            orig=misc.imresize(orig, (image_size, image_size), interp='bilinear')
        imgs.append(orig)

        merged=np.hstack(imgs)
        return merged

    def recognize1(self,args,inp):
        st=time.time()
        self.load_embeddings()
        embeddings,paths=self.embeddings,self.paths
        whitenedfaces,alignedfaces=self.detect_faces(inp)
        face_embeddings=self.get_face_embedding(whitenedfaces)
        nfaces=zip(face_embeddings,alignedfaces)
        nmerged=[]
        ret_names=[]
        for emb_test,aligned in nfaces:
            #emb_test=self.get_face_embedding(whitened,args)
            match_paths,dists=self.get_match(embeddings,paths,emb_test,args)
            merged=self.merge_imgs(match_paths,aligned)
            nmerged.append(merged)
            tmp_path=[path_.split('/')[-2] for path_ in match_paths]
            ret_names.append(tmp_path[0])

        print (time.time()-st)
        if len(nmerged) > 1:
            stacked_img=np.vstack(nmerged)
        else:
            stacked_img=nmerged[0]
        return stacked_img,ret_names

    def recognize(self,args,inp):
        st=time.time()
        self.load_embeddings()
        embeddings,paths=self.embeddings,self.paths
        whitenedfaces,alignedfaces=self.detect_faces(inp)
        face_embeddings=self.get_face_embedding(whitenedfaces)
        nfaces=zip(face_embeddings,alignedfaces)
        nmerged=[]
        ret_names=[]
        for emb_test,aligned in nfaces:
            #emb_test=self.get_face_embedding(whitened,args)
            match_paths,dists=self.get_match(embeddings,paths,emb_test,args)
            #merged=self.merge_imgs(match_paths,aligned)

            tmp_path=[path_.split('/')[-2] for path_ in match_paths]
            ret_names.append(tmp_path[0])
            ret_path=self.write_eval_one_img(aligned,tmp_path[0])
            nmerged.append(ret_path)

        print (time.time()-st)
        if len(nmerged) > 1:
            stacked_img=np.vstack(nmerged)
        else:
            stacked_img=nmerged[0]
        return nmerged,ret_names

    def recognize_all(self,args,inp):
        st=time.time()
        self.load_embeddings()
        embeddings,paths=self.embeddings,self.paths
        whitenedfaces,alignedfaces=self.detect_faces(inp)
        face_embeddings=self.get_face_embedding(whitenedfaces)
        nfaces=zip(face_embeddings,alignedfaces)

        print (face_embeddings.shape,embeddings.shape)
        pp=self.get_match_all(embeddings,paths,face_embeddings)
        print (time.time()-st)
        return pp,embeddings,paths,face_embeddings


    def load_enroll_embeddings(self,args=None):
        if args is None:
            args=self.args
        embfile=args.enroll_file
        if not os.path.isfile(os.path.expanduser(embfile)):
            return None,None
        print (os.path.isfile(embfile),args.enroll_file)
        dataset=np.load(os.path.expanduser(embfile))
        embeddings=dataset['embedding']
        paths=dataset['paths']

        return embeddings,paths



    def enroll_img(self,image_path,name,args=None):
        if args is None:
            args=self.args
        embeddings,paths=self.load_enroll_embeddings(args)
        whitened,aligned=self.detect_faces(image_path)
        emb_test=self.get_face_embedding(whitened)
        embeddings=np.vstack([embeddings,emb_test])

        enroll_path=os.path.join(self.args.enroll_path,name)
        if not os.path.isdir(enroll_path):
            os.makedirs(enroll_path)
        num=len(os.listdir(enroll_path))
        new_path=os.path.join(enroll_path,'{0}_{1}.png'.format(name,num+1))
        misc.imsave(new_path,aligned[0])
        paths=np.hstack([paths,[new_path]])
        np.savez(args.enroll_file,embedding=embeddings,paths=paths)
        return emb_test

    def write_eval_one_img(self,img,name):

        path_to_write=self.args.eval_path

        if not os.path.isdir(path_to_write):
            os.makedirs(path_to_write)

        imgpath=os.path.join(path_to_write,'{0}.jpg'.format(name))

        misc.imsave(imgpath,img)
        return imgpath
