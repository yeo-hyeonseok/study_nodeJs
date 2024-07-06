document.addEventListener("DOMContentLoaded", function () {
  const goBackButton = document.getElementById("goBackButton");

  if (goBackButton) {
    goBackButton.addEventListener("click", function () {
      window.history.back();
    });
  }
});
