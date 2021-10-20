package main

import (
	"encoding/json"
	"net/http"
	"regexp"
	"sync"
	"fmt"
    "io/ioutil"
    "log"
)

var (
	listUserRe   = regexp.MustCompile(`^\/users[\/]*$`)
	getUserRe    = regexp.MustCompile(`^\/users\/(\d+)$`)
	createUserRe = regexp.MustCompile(`^\/users[\/]*$`)
)

type user struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	RG string `json:"rg"`
	Matricula string `json:"matricula"`
	Address string `json:"address"`
	Password string `json:"password"`
}

type datastore struct {
	m map[string]user
	*sync.RWMutex
}

type userHandler struct {
	store *datastore
}

func (h *userHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	switch {
	case r.Method == http.MethodGet && listUserRe.MatchString(r.URL.Path):
		h.List(w, r)
		break
	case r.Method == http.MethodGet && getUserRe.MatchString(r.URL.Path):
		h.Get(w, r)
		break
	case r.Method == http.MethodPost && createUserRe.MatchString(r.URL.Path):
		h.Create(w, r)
		break
	case r.Method == http.MethodPut && createUserRe.MatchString(r.URL.Path):
		h.Update(w, r)
		break
	case r.Method == http.MethodDelete && getUserRe.MatchString(r.URL.Path):
		h.Delete(w, r)
		break
	default:
		notFound(w, r)
		break
	}
	h.WriteFile()
}

func (h *userHandler) List(w http.ResponseWriter, r *http.Request) {
	h.store.RLock()
	users := make([]user, 0, len(h.store.m))
	for _, v := range h.store.m {
		users = append(users, v)
	}
	h.store.RUnlock()
	jsonBytes, err := json.Marshal(users)
	if err != nil {
		internalServerError(w, r)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func (h *userHandler) Get(w http.ResponseWriter, r *http.Request) {
	matches := getUserRe.FindStringSubmatch(r.URL.Path)
	if len(matches) < 2 {
		notFound(w, r)
		return
	}
	h.store.RLock()
	u, ok := h.store.m[matches[1]]
	h.store.RUnlock()
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("user not found"))
		return
	}
	jsonBytes, err := json.Marshal(u)
	if err != nil {
		internalServerError(w, r)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func (h *userHandler) Create(w http.ResponseWriter, r *http.Request) {
	var u user
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		internalServerError(w, r)
		return
	}
	h.store.Lock()
	h.store.m[u.ID] = u
	h.store.Unlock()
	jsonBytes, err := json.Marshal(u)
	if err != nil {
		internalServerError(w, r)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func (h *userHandler) Update(w http.ResponseWriter, r *http.Request) {
	var u user
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		internalServerError(w, r)
		return
	}

	h.store.RLock()
	_, ok := h.store.m[u.ID]
	h.store.RUnlock()
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("user not found"))
		return
	}

	h.store.Lock()
	h.store.m[u.ID] = u
	h.store.Unlock()
	jsonBytes, err := json.Marshal(u)
	if err != nil {
		internalServerError(w, r)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func (h *userHandler) Delete(w http.ResponseWriter, r *http.Request) {
	matches := getUserRe.FindStringSubmatch(r.URL.Path)
	if len(matches) < 2 {
		notFound(w, r)
		return
	}
	h.store.RLock()
	u, ok := h.store.m[matches[1]]
	h.store.RUnlock()
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("user not found"))
		return
	}

	h.store.Lock()
	delete(h.store.m, u.ID)
	h.store.Unlock()
	jsonBytes, err := json.Marshal(u)
	if err != nil {
		internalServerError(w, r)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func internalServerError(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("internal server error"))
}

func notFound(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("not found"))
}

func (h *userHandler) WriteFile() { 
	h.store.RLock()
	users := make([]user, 0, len(h.store.m))
	for _, v := range h.store.m {
		users = append(users, v)
	}
	h.store.RUnlock()
	jsonBytes, err := json.Marshal(users)
	if err != nil {
		log.Fatal("failed to write data: %s", err)
		return
	}

	err = ioutil.WriteFile("data.json", jsonBytes, 0666)
    if err != nil {
        log.Fatal("failed to write data: %s", err)
    }
}
 
func ReadFile() []user {
    fmt.Printf("\nReading a file in Go lang\n")
    fileName := "data.json"
    
    data, err := ioutil.ReadFile(fileName)
    if err != nil {
        log.Panicf("failed reading data from file: %s", err)
    }

	u := []user{}
	
	err = json.Unmarshal(data, &u)
	if err != nil {
        log.Panicf("failed to convert json: %s", err)
    }

    fmt.Printf("\nFile Name: %s", fileName)
    fmt.Printf("\nSize: %d bytes", len(data))
    fmt.Printf("\nData: %s\n", data)
	return u
}

func main() {
	data := ReadFile()
	my_map := map[string]user{}
	for i := range data {
		my_map[data[i].ID] = data[i]
	}

	mux := http.NewServeMux()
	userH := &userHandler{
		store: &datastore{
			m: my_map,
			RWMutex: &sync.RWMutex{},
		},
	}
	mux.Handle("/users", userH)
	mux.Handle("/users/", userH)

	http.ListenAndServe("localhost:8080", mux)
}