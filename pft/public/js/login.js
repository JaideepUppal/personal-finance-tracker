const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton?.addEventListener("click", () => {
  container?.classList.add("right-panel-active");
});

signInButton?.addEventListener("click", () => {
  container?.classList.remove("right-panel-active");
});

document.querySelectorAll(".password-toggle").forEach((button) => {
  const field = button.closest(".password-field");
  const input = field?.querySelector('input[type="password"], input[type="text"]');
  const label = button.querySelector("span");

  if (!input) return;

  button.addEventListener("click", () => {
    const shouldShow = input.type === "password";
    input.type = shouldShow ? "text" : "password";
    button.setAttribute(
      "aria-label",
      shouldShow ? "Hide password" : "Show password"
    );
    if (label) label.textContent = shouldShow ? "Hide" : "Show";
  });
});
