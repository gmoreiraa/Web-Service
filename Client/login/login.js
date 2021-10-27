const form = document.querySelector("#login");

form.addEventListener("submit", function (event) {
  // stop form submission
  event.preventDefault();

  // validate the form
  let passValid = hasValue(form.elements["password"], PASS_REQUIRED);
  let emailValid = validateEmail(
    form.elements["email"],
    EMAIL_REQUIRED,
    EMAIL_INVALID
  );
  // if valid, submit the form.
  if (passValid && emailValid) {
    let email = form.elements["email"].value;
    let pass = form.elements["password"].value;

    axios
      .post("http://localhost:8080/login", {
        headers: { "Content-type": "application/json" },
        withCredentials: false,
        data: {
          email: email,
          password: pass,
        },
      })
      .then((response) => {
        if (response["status"] == 201) finishLogin(response["data"]);
      })
      .catch((e) => {
        console.log(e);
        showMessage(form.elements["email"], FAILED_LOGIN, false);
        showMessage(form.elements["password"], FAILED_LOGIN, false);
      });
  }
});
