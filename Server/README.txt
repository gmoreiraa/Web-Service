Go Version:
go version go1.17.2 linux/amd64
Install:
sudo snap install go --classic

Server Run:
➜ go run server.go

Server Usage:
➜ curl http://localhost:8080/users
[{"id":"1","name":"bob"}]

➜ curl http://localhost:8080/users/1
{"id":"1","name":"bob"}

➜ curl -X POST -H 'content-type: application/json' --data '{"id": "5", "name": "Joao das Neves", "rg": "111.222.222-22", "matricula": "342", "address": "Rua Dois, Teresina", "password": "02sDde2"}' http://localhost:8080/users

➜ curl -X PUT -H 'content-type: application/json' --data '{"id": "5", "name": "Maria do Bairo", "rg": "111.222.222-22", "matricula": "342", "address": "Rua Bairro, Bairro", "password": "02ddsde2"}' http://localhost:8080/users

➜ curl -X DELETE http://localhost:8080/users/5
