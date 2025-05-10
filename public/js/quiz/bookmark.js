const button = document.getElementById("bookmark-btn");
const img = document.getElementById("btn-img");

let isFilled = false;

button.addEventListener("click", () => {
isFilled = !isFilled;
img.src = isFilled ? "/assets/filled_bookmark.svg" : "/assets/empty_bookmark.svg";
});
