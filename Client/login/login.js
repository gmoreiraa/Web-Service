const form = document.querySelector("#signup");

const PASS_REQUIRED = "Please enter your password";
const EMAIL_REQUIRED = "Please enter your email";
const EMAIL_INVALID = "Please enter a correct email address format";
const FAILED_LOGIN = "Email or Password wrong";

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
        if (response["status"] == 200) finishLogin(response["data"]);
      })
      .catch((e) => {
        console.log(e);
        showMessage(form.elements["email"], FAILED_LOGIN, false);
        showMessage(form.elements["password"], FAILED_LOGIN, false);
      });
  }
});

// show a message with a type of the input
function showMessage(input, message, type) {
  // get the small element and set the message
  const msg = input.parentNode.querySelector("small");
  msg.innerText = message;
  // update the class for the input
  input.className = type ? "success" : "error";
  return type;
}

function showError(input, message) {
  return showMessage(input, message, false);
}

function showSuccess(input) {
  return showMessage(input, "", true);
}

function hasValue(input, message) {
  if (input.value.trim() === "") {
    return showError(input, message);
  }
  return showSuccess(input);
}

function validateEmail(input, requiredMsg, invalidMsg) {
  // check if the value is not empty
  if (!hasValue(input, requiredMsg)) {
    return false;
  }
  // validate email format
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const email = input.value.trim();
  if (!emailRegex.test(email)) {
    return showError(input, invalidMsg);
  }
  return true;
}

function finishLogin(data) {
  localStorage.setItem("login", "success");
  localStorage.setItem("email", data["email"]);
  window.location.replace(localStorage.getItem("base_url"));
}
