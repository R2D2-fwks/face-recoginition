import sys
import os,os.path
from collections import defaultdict
import numpy as np
from sklearn.cluster import KMeans

def foo():
    embfile='/home/ashtosh/Experiments/embeddings/facescrub.npz'
    dataset=np.load(os.path.expanduser(embfile))
    embeddings=dataset['embedding']
    paths=dataset['paths']

    return embeddings,paths

def foo1(emb,paths,nC=5):

    #emb,paths=foo()
    adict=defaultdict(list)
    pdict=defaultdict(list)
    for i,pp in enumerate(paths):
        aa=pp.split('/')[-2]
        adict[aa].append(i)
        pdict[aa].append(pp)

    bdict={}
    for k in adict.keys():
        ll=adict[k]
        vecs=emb[ll]
        k1=pdict[k][0]
        #bdict[k1]=np.mean(vecs,axis=0)

        if 1:
            km=KMeans(init='k-means++', n_clusters=5, n_init=1)
            km.fit(vecs)
            for k2 in range(min(len(pdict[k]),nC)):
                k1=pdict[k][k2]
                bdict[k1]=km.cluster_centers_[k2]

    pp1,vv1=[],[]
    for k1,v in bdict.iteritems():
        pp1.append(k1)
        vv1.append(v)

    #return adict,bdict
    return pp1,np.asarray(vv1)
