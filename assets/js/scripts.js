document.addEventListener('DOMContentLoaded', function () {
    const birthdayDate = new Date("2025-02-11T00:00:00");
    const card = document.querySelector(".bdayCard");
    const cardContainer = document.querySelector(".bday-card-container");
    const audio = document.getElementById("audio");

    function updateTimerElement(id, value) {
        document.getElementById(id).textContent = value;
    }

    function updateCountdown() {
        const now = new Date();
        const timeDiff = birthdayDate - now;

        if (timeDiff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = 'It\'s your birthday! 🎉';
            document.querySelector('.openme-btn').style.display = 'block';
            return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        const daysStr = String(days).padStart(2, '0');
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');

        updateTimerElement("days1", daysStr[0]);
        updateTimerElement("days2", daysStr[1]);
        updateTimerElement("hours1", hoursStr[0]);
        updateTimerElement("hours2", hoursStr[1]);
        updateTimerElement("minutes1", minutesStr[0]);
        updateTimerElement("minutes2", minutesStr[1]);
        updateTimerElement("seconds1", secondsStr[0]);
        updateTimerElement("seconds2", secondsStr[1]);
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    const titleElement = document.querySelector(".countdown-title");
    const texts = ["save the date", "habadu kayra!"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriterEffect() {
        const currentText = texts[textIndex];

        if (!isDeleting) {
            titleElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentText.length) {
                let delay = textIndex === 1 ? 6000 : 2000;
                setTimeout(() => {
                    isDeleting = true;
                    typeWriterEffect();
                }, delay);
                return;
            }
        } else {
            titleElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }

        let speed = isDeleting ? 100 : 200;
        setTimeout(typeWriterEffect, speed);
    }

    typeWriterEffect();

    function toggleCard() {
        if (card.classList.contains("open")) {
            card.classList.remove("open");
            audio.pause();
            audio.currentTime = 0; // Reset audio
        } else {
            card.classList.add("open");
            audio.play();
        }
    }

    // Show the card container and add click event
    window.openBdayCard = function () {
        cardContainer.style.display = "flex";
    };

    card.addEventListener("click", toggleCard);
});

function openBdayCard() {
    document.querySelector('.bday-card-container').style.display = 'flex';
}