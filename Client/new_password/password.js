const form = document.querySelector("#new_pass");
form.addEventListener("submit", updatePass);

async function updatePass(event) {
  // stop form submission
  event.preventDefault();

  // validate the form
  let passValid = hasValue(form.elements["password"], INSERT_VALUE);

  // if valid, submit the form.
  if (passValid) {
    let pass = form.elements["password"].value;

    let data = await get_user();

    axios
      .put("http://localhost:8080/users", {
        headers: { "Content-type": "application/json" },
        withCredentials: false,
        data: {
          id: data["id"],
          name: data["name"],
          rg: data["rg"],
          matricula: data["matricula"],
          address: data["address"],
          email: data["email"],
          password: pass,
        },
      })
      .then((response) => {
        if (response["status"] == 200) finishUpdate();
      })
      .catch((e) => console.log(e));
  }
}

async function get_user() {
  let data;
  await axios
    .get(`http://localhost:8080/users/${localStorage.getItem("id")}`, {
      headers: { "Content-type": "application/json" },
      withCredentials: false,
    })
    .then((response) => (data = response["data"]))
    .catch((e) => console.log(e));
  return data;
}

function finishUpdate() {
  window.location.replace(localStorage.getItem("base_url"));
}
