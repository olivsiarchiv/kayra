document.addEventListener('DOMContentLoaded', function () {
    // Set the target date for the birthday
    const birthdayDate = new Date("2025-02-11T00:00:00");

    // Function to update each digit separately
    function updateTimerElement(id, value) {
        document.getElementById(id).textContent = value;
    }

    // Countdown function
    function updateCountdown() {
        const now = new Date();
        const timeDiff = birthdayDate - now;

        if (timeDiff <= 0) {
            clearInterval(countdownInterval); // Stop the countdown
            document.getElementById('countdown').innerHTML = 'It\'s your birthday! 🎉';
            return;
        }

        // Calculate time units
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Convert numbers to two-digit format
        const daysStr = String(days).padStart(2, '0');
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');

        // Update the HTML elements
        updateTimerElement("days1", daysStr[0]);
        updateTimerElement("days2", daysStr[1]);
        updateTimerElement("hours1", hoursStr[0]);
        updateTimerElement("hours2", hoursStr[1]);
        updateTimerElement("minutes1", minutesStr[0]);
        updateTimerElement("minutes2", minutesStr[1]);
        updateTimerElement("seconds1", secondsStr[0]);
        updateTimerElement("seconds2", secondsStr[1]);
    }

    // Start the countdown timer
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Initial call to display the correct time immediately
    updateCountdown();
});