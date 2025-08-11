import web
import json


def notfound():
    return web.notfound( json.dumps({'ok':0 , 'errcode':404 }  ))

def internalerror():
    return web.notfound( json.dumps({'ok':0 , 'errcode':500} ))

urls = (
    '/(.*)', 'handleRequest'
)

app = web.application(urls,globals())
app.notfound = notfound
app.internalerror = internalerror

class handleRequest:
    def GET(self,method_id):
        if not method_id:
            return web.notfound()
        else:
            return json.dumps({'ok': method_id})


    def POST(self,method_id):
        web_input = web.input()
        _filename_ = web_input.image
        print _filename_
        with open( "vinoo.jpg" , 'wb' ) as f :
            f.write( web_input.image )             
        
        return web_input
    
if __name__  == "__main__":
    app.run()


