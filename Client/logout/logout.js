function logout() {
  axios
    .delete("http://localhost:8080/logout", {
      headers: { "Content-type": "application/json" },
      withCredentials: false,
      data: localStorage.getItem("email"),
    })
    .then((response) => {
      console.log(response);
      if (response["status"] == 200) {
        localStorage.setItem("login", "");
        localStorage.setItem("email", "");
        document.location.reload(true);
      }
    })
    .catch((e) => console.log(e));
}
