from http.server import HTTPServer, BaseHTTPRequestHandler
import json

#open json file and give it to data variable as a dictionary
with open("db.json") as data_file:
    data = json.load(data_file)


#Defining a HTTP request Handler class
class ServiceHandler(BaseHTTPRequestHandler):
    #sets basic headers for the server
    def _set_headers(self):
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
        self.send_header('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
        self.end_headers()

    def _get_request_content(self):
        #reads the length of the Headers
        length = int(self.headers['Content-Length'])
        #reads the contents of the request
        content = self.rfile.read(length)
        temp = str(content).strip('b\'')
        return temp

######

#LIST#
######
#GET Method Defination

    def do_GET(self):
        self.send_response(200)
        #defining all the headers
        self._set_headers()
        #prints all the keys and values of the json file
        self.wfile.write(json.dumps(data).encode())

######
#VIEW#
######
#VIEW method defination

    def do_VIEW(self):
        #dict var. for pretty print
        display = {}
        temp = self._get_request_content()

        #check if the key is present in the dictionary
        if temp in data:
            display[temp] = data[temp]
            #print the keys required from the json file
            self.wfile.write(json.dumps(display).encode())
            self.send_response(200)
            self._set_headers()
        else:
            self.send_response(404)
            self._set_headers()
            error = "NOT FOUND!"
            self.wfile.write(bytes(error, 'utf-8'))

########
#CREATE#
########
#POST method defination

    def do_POST(self):
        temp = self._get_request_content()
        temp = json.loads(temp)["data"]

        index = int(data[len(data) - 1]["id"]) + 1

        temp["id"] = str(index)
        data.append(temp)
        #write the changes to the json file
        with open("db.json", 'w+') as file_data:
            json.dump(data, file_data)

        self.send_response(200)
        self._set_headers()
        self.wfile.write(json.dumps(temp).encode())

########
#UPDATE#
########
#PUT method Defination

    def do_PUT(self):
        self.send_response(200)
        self._set_headers()
        temp = self._get_request_content()
        temp = json.loads(temp)["data"]

        for user in range(len(data)):
            if data[user]["id"] == temp["id"]:
                data[user] = temp
                #write the changes to the json file
                with open("db.json", 'w+') as file_data:
                    json.dump(data, file_data)
                self.wfile.write(json.dumps(temp).encode())
                break

########
#DELETE#
########
#DELETE method defination

    def do_DELETE(self):
        temp = self._get_request_content()
        found = False
        for user in range(len(data)):
            if data[user]["id"] == temp:
                self.send_response(200)
                self._set_headers()
                self.wfile.write(json.dumps(data[user]).encode())
                del data[user]
                #write the changes to json file
                with open("db.json", 'w+') as file_data:
                    json.dump(data, file_data)
                found = True
                break

        if not found:
            self.send_response(404)
            self._set_headers()
            error = "NOT FOUND!"
            self.wfile.write(bytes(error, 'utf-8'))

########
#OPTIONS#
########
#OPTIONS method defination

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_headers()


#Server Initialization
server = HTTPServer(('localhost', 8080), ServiceHandler)
server.serve_forever()