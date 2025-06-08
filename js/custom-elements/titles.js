document.addEventListener("DOMContentLoaded", function () {
  const titles = ["Computer Engineer", "Bachelor's Degree"];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const span = document.getElementById("intro-titles");
  const typingSpeed = 100;
  const pauseAfterTyping = 1000;

  function typeWriter() {
    const currentTitle = titles[titleIndex];
    if (isDeleting) {
      charIndex--;
      span.textContent = currentTitle.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(typeWriter, 400);
      } else {
        setTimeout(typeWriter, typingSpeed / 2);
      }
    } else {
      charIndex++;
      span.textContent = currentTitle.substring(0, charIndex);
      if (charIndex === currentTitle.length) {
        isDeleting = true;
        setTimeout(typeWriter, pauseAfterTyping);
      } else {
        setTimeout(typeWriter, typingSpeed);
      }
    }
  }
  typeWriter();
});
