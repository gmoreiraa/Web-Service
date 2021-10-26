from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import re

with open("db.json") as data_file:
    data = json.load(data_file)

with open("login.json") as data_file:
    login = json.load(data_file)


class ServiceHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
        self.send_header('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
        self.end_headers()

    def _get_request_content(self):
        length = int(self.headers['Content-Length'])
        content = self.rfile.read(length)
        req = str(content).strip('b\'')
        return req

#GET Method Defination

    def do_GET(self):
        has_number = re.compile('\d')
        if self.path == '/users' or self.path == '/users/':
            self.do_users()
        elif has_number.search(self.path):
            self.do_user()

    def do_users(self):
        self.send_response(200)
        self._set_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_user(self):
        id = self.path.split('/')
        id = id[len(id) - 1]

        found = False
        for user in range(len(data)):
            if data[user]["id"] == id:
                self.send_response(200)
                self._set_headers()
                self.wfile.write(json.dumps(data[user]).encode())
                found = True
                break

        if not found:
            self.send_response(404)
            self._set_headers()
            error = "NOT FOUND!"
            self.wfile.write(bytes(error, 'utf-8'))

#POST method defination

    def do_POST(self):
        if self.path == '/users' or self.path == '/users/':
            self.do_create()
        elif self.path == '/login':
            self.do_login()

    def do_create(self):
        req = self._get_request_content()
        req = json.loads(req)["data"]

        index = int(data[len(data) - 1]["id"]) + 1

        req["id"] = str(index)
        data.append(req)
        with open("db.json", 'w+') as file_data:
            json.dump(data, file_data)

        self.send_response(200)
        self._set_headers()
        self.wfile.write(json.dumps(req).encode())

    def do_login(self):
        req = self._get_request_content()
        req = json.loads(req)["data"]

        found = False
        for user in range(len(data)):
            if data[user]["email"] == req["email"] and data[user][
                    "password"] == req["password"]:
                self.send_response(200)
                self._set_headers()
                self.wfile.write(json.dumps(req).encode())
                login.append(req)
                with open("login.json", 'w+') as file_data:
                    json.dump(login, file_data)
                found = True
                break

        if not found:
            self.send_response(404)
            self._set_headers()
            error = "NOT FOUND!"
            self.wfile.write(bytes(error, 'utf-8'))

#PUT method Defination

    def do_PUT(self):
        self.send_response(200)
        self._set_headers()
        req = self._get_request_content()
        req = json.loads(req)["data"]

        for user in range(len(data)):
            if data[user]["id"] == req["id"]:
                data[user] = req
                with open("db.json", 'w+') as file_data:
                    json.dump(data, file_data)
                self.wfile.write(json.dumps(req).encode())
                break

#DELETE method defination

    def do_DELETE(self):
        if self.path == '/users' or self.path == '/users/':
            self.do_del()
        elif self.path == '/logout':
            self.do_logout()

    def do_del(self):
        req = self._get_request_content()
        found = False
        for user in range(len(data)):
            if data[user]["id"] == req:
                self.send_response(200)
                self._set_headers()
                self.wfile.write(json.dumps(data[user]).encode())
                del data[user]
                with open("db.json", 'w+') as file_data:
                    json.dump(data, file_data)
                found = True
                break

        if not found:
            self.send_response(404)
            self._set_headers()
            error = "NOT FOUND!"
            self.wfile.write(bytes(error, 'utf-8'))

    def do_logout(self):
        req = self._get_request_content().replace('"', '')

        found = False
        for user in range(len(login)):
            if login[user]["email"] == req:
                self.send_response(200)
                self._set_headers()
                self.wfile.write(json.dumps(login[user]).encode())
                del login[user]
                with open("login.json", 'w+') as file_data:
                    json.dump(login, file_data)
                found = True
                break

        if not found:
            self.send_response(404)
            self._set_headers()
            error = "NOT FOUND!"
            self.wfile.write(bytes(error, 'utf-8'))

#OPTIONS method defination

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_headers()


#Server Initialization
server = HTTPServer(('localhost', 8080), ServiceHandler)
server.serve_forever()