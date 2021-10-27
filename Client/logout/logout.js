function logout() {
  axios
    .delete("http://localhost:8080/logout", {
      headers: { "Content-type": "application/json" },
      withCredentials: false,
      data: localStorage.getItem("id"),
    })
    .then((response) => {
      console.log(response);
      if (response["status"] == 200) {
        localStorage.setItem("login", "");
        localStorage.setItem("id", "");
        window.location.replace(localStorage.getItem("base_url"));
      }
    })
    .catch((e) => console.log(e));
}
