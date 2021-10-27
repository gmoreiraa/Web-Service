const form = document.querySelector("#singup");

form.addEventListener("submit", function (event) {
  // stop form submission
  event.preventDefault();

  // validate the form
  let nameValid = hasValue(form.elements["name"], INSERT_VALUE);
  let rgValid = hasValue(form.elements["rg"], INSERT_VALUE);
  let matValid = hasValue(form.elements["matricula"], INSERT_VALUE);
  let addressValid = hasValue(form.elements["address"], INSERT_VALUE);
  let emailValid = validateEmail(
    form.elements["email"],
    EMAIL_REQUIRED,
    EMAIL_INVALID
  );
  let passValid = hasValue(form.elements["password"], INSERT_VALUE);

  // if valid, submit the form.
  if (
    nameValid &&
    rgValid &&
    matValid &&
    addressValid &&
    emailValid &&
    passValid
  ) {
    let name = form.elements["name"].value;
    let rg = form.elements["rg"].value;
    let mat = form.elements["matricula"].value;
    let address = form.elements["address"].value;
    let email = form.elements["email"].value;
    let pass = form.elements["password"].value;

    axios
      .post("http://localhost:8080/users", {
        headers: { "Content-type": "application/json" },
        withCredentials: false,
        data: {
          id: "",
          name: name,
          rg: rg,
          matricula: mat,
          address: address,
          email: email,
          password: pass,
        },
      })
      .then((response) => {
        if (response["status"] == 201) finishCreate();
      })
      .catch((e) => console.log(e));
  }
});

function finishCreate() {
  window.location.replace(localStorage.getItem("base_url"));
}
