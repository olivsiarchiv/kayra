document.addEventListener('DOMContentLoaded', function () {
    const birthdayDate = new Date("2025-02-11T00:00:00");
    const card = document.querySelector(".bdayCard");
    const cardContainer = document.querySelector(".bday-card-container");
    const audio = document.getElementById("audio");
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
    let micPermissionGranted = false;

    // Countdown Timer
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

        const daysStr = String(Math.floor(timeDiff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hoursStr = String(Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutesStr = String(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const secondsStr = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, '0');

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

    // Typing Effect
    const titleElement = document.querySelector(".countdown-title");
    const texts = ["save the date", "habadu kayra!"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriterEffect() {
        const currentText = texts[textIndex];

        titleElement.textContent = isDeleting ? currentText.substring(0, charIndex - 1) : currentText.substring(0, charIndex + 1);
        charIndex += isDeleting ? -1 : 1;

        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => { isDeleting = true; typeWriterEffect(); }, textIndex === 1 ? 6000 : 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(typeWriterEffect, isDeleting ? 100 : 200);
    }

    typeWriterEffect();

    // Candle Mechanics
    function updateCandleCount() {
        candleCountDisplay.textContent = candles.filter(c => !c.classList.contains("out")).length;
    }

    function addCandle(left, top) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = `${left}px`;
        candle.style.top = `${top}px`;
        
        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);
        
        cake.appendChild(candle);
        candles.push(candle);
        updateCandleCount();
    }

    cake.addEventListener("click", function (event) {
        event.stopPropagation();
        const rect = cake.getBoundingClientRect();
        addCandle(event.clientX - rect.left, event.clientY - rect.top);
    });

    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        return dataArray.reduce((sum, val) => sum + val, 0) / bufferLength > 40;
    }

    function blowOutCandles() {
        if (candles.length === 0) return;
        
        let blownOut = 0;
        if (isBlowing()) {
            candles.forEach(candle => {
                if (!candle.classList.contains("out") && Math.random() > 0.5) {
                    candle.classList.add("out");
                    blownOut++;
                }
            });
        }

        if (blownOut > 0) updateCandleCount();
    }

    function requestMicrophoneAccess() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                micPermissionGranted = true;
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                setInterval(blowOutCandles, 300);
            }).catch(error => {
                alert("Microphone access is required for blowing out candles.");
                console.error("Microphone access denied: ", error);
            });
        }
    }

    window.openBdayCard = function () {
        cardContainer.style.display = "flex";
        if (!micPermissionGranted) requestMicrophoneAccess();
    };

    card.addEventListener("click", function (event) {
        event.stopPropagation();
        if (card.classList.contains("open")) {
            card.classList.remove("open");
            audio.pause();
            audio.currentTime = 0;
            candles.forEach(candle => candle.remove());
            candles = [];
            updateCandleCount();
        } else {
            card.classList.add("open");
            audio.play();
        }
    });
});
