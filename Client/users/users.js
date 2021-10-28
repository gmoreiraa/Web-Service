function get_infos() {
  axios
    .get("http://localhost:8080/users", {
      headers: { "Content-type": "application/json" },
      withCredentials: false,
    })
    .then((response) => {
      renderHTML(response["data"]);
    })
    .catch((e) => console.log(e));
}

function renderHTML(data) {
  let list = document.getElementById("users-list");
  data.forEach((user) => {
    list.innerHTML += `<div class="user-card">
                        <button class="delete" id="delete" onclick="del(${user["id"]})">Apagar</button>
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
