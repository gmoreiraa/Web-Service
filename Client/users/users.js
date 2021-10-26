function get_infos() {
  // PUT
  // axios
  //   .put("http://localhost:8080/", {
  //     headers: { "Content-type": "application/json" },
  //     withCredentials: false,
  //     data: {
  //       id: "4",
  //       name: "Novo Nominho",
  //       rg: "533.522.522-52",
  //       matricula: "5423",
  //       address: "Rua Cinco, Teresina",
  //       password: "05dFfr5",
  //     },
  //   })
  //   .then((response) => console.log(response))
  //   .catch((e) => console.log(e));
  // DELETE
  // axios
  //   .delete("http://localhost:8080/", {
  //     headers: { "Content-type": "application/json" },
  //     withCredentials: false,
  //     data: "4",
  //   })
  //   .then((response) => console.log(response))
  //   .catch((e) => console.log(e));
  // GET
  axios
    .get("http://localhost:8080/users", {
      headers: { "Content-type": "application/json" },
      withCredentials: false,
    })
    .then((response) => {
      console.log(response);
      renderHTML(response["data"]);
    })
    .catch((e) => console.log(e));
  // POST
  // axios
  //   .post("http://localhost:8080/", {
  //     headers: { "Content-type": "application/json" },
  //     withCredentials: false,
  //     data: {
  //       id: "",
  //       name: "Nominho",
  //       rg: "133.222.222-22",
  //       matricula: "3425",
  //       address: "Rua Tres, Teresina",
  //       password: "03dFfr3",
  //     },
  //   })
  //   .then((response) => console.log(response))
  //   .catch((e) => console.log(e));
}

function renderHTML(data) {
  console.log(data);
  let list = document.getElementById("users-list");
  data.forEach((user) => {
    console.log(user);
    list.innerHTML += `<div class="user-card">
                        <h4 class="user-name">${user["name"]}</h4>
                        <p>RG: ${user["rg"]}</p>
                        <p>Matricula: ${user["matricula"]}</p>
                        <p>Endereco: ${user["address"]}</p>
                      </div>`;
  });
}

function get_base_url() {
  localStorage.setItem("base_url", window.location.href);
}
