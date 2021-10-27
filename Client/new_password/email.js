const form = document.querySelector("#email");

form.addEventListener("submit", function (event) {
  // stop form submission
  event.preventDefault();

  // validate the form
  let emailValid = validateEmail(
    form.elements["email"],
    EMAIL_REQUIRED,
    EMAIL_INVALID
  );

  // if valid, submit the form.
  if (emailValid) {
    let email = form.elements["email"].value;

    axios
      .post("http://localhost:8080/new-pass", {
        headers: { "Content-type": "application/json" },
        withCredentials: false,
        data: email,
      })
      .then((response) => {
        if (response["status"] == 200) getNewPass(response["data"]);
      })
      .catch((e) => {
        console.log(e);
        showMessage(form.elements["email"], EMAIL_INVALID, false);
      });
  }
});

function getNewPass(data) {
  saveUserID(data);
  let url = localStorage.getItem("base_url");
  url = url.slice(0, url.length - 16);
  url += "new_password/password.html";
  window.location.replace(url);
}

function saveUserID(data) {
  localStorage.setItem("id", data["id"]);
}
