function del(data) {
  axios
    .delete("http://localhost:8080/users", {
      headers: { "Content-type": "application/json" },
      withCredentials: false,
      data: data,
    })
    .then((response) => {
      console.log(response);
      if (response["status"] == 200) location.reload();
    })
    .catch((e) => console.log(e));
}
