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
    let confettiActive = false;
    let micPermissionGranted = false;
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    
    // countdown timer
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

    // typing effect
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

    // birthday card

    function resetCandles() {
        candles.forEach(candle => candle.remove());
        candles = [];
        updateCandleCount();
    }

    function startConfetti() {
        const confettiContainer = document.createElement("div");
        confettiContainer.classList.add("confetti-container");
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 100; i++) {
            let confettiPiece = document.createElement("div");
            confettiPiece.classList.add("confetti");
            confettiPiece.style.left = Math.random() * 100 + "vw";
            confettiPiece.style.backgroundColor = 
                `hsl(${Math.random() * 360}, 100%, 50%)`;
            confettiPiece.style.animationDuration = Math.random() * 3 + 2 + "s";
            confettiContainer.appendChild(confettiPiece);
        }
        
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }
    
     // Update event listeners for both click and touch
     cake.addEventListener("click", function(event) {
        event.stopPropagation();
        if (isMobile && candles.length > 0) {
            handleMobileBlowOut();
        } else {
            addCandle(event.clientX, event.clientY);
        }
    });

    cake.addEventListener("touchstart", handleTouch);

    function addCandle(clientX, clientY) {
        const rect = cake.getBoundingClientRect();
        const relativeX = clientX - rect.left;
        const relativeY = clientY - rect.top;
        
        const candle = document.createElement("div");
        candle.className = "candle";
        
        // Adjust position to be relative to the cake's dimensions
        candle.style.left = `${relativeX}px`;
        candle.style.top = `${relativeY - 20}px`; // Offset to position candle better
        
        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);
        
        cake.appendChild(candle);
        candles.push(candle);
        updateCandleCount();
    }

    // Mobile-specific touch handler
    function handleTouch(event) {
        event.preventDefault(); // Prevent scrolling
        const touch = event.touches[0];
        if (candles.length > 0) {
            handleMobileBlowOut();
        } else {
            addCandle(touch.clientX, touch.clientY);
        }
    }

    // Handle mobile blow out
    function handleMobileBlowOut() {
        if (candles.length === 0) return;

        candles.forEach(candle => {
            if (!candle.classList.contains("out")) {
                candle.classList.add("out");
            }
        });

        updateCandleCount();
        startConfetti();
    }

    function updateCandleCount() {
        candleCountDisplay.textContent = candles.filter(c => !c.classList.contains("out")).length;
    }

    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        return average > 50;
    }

    function blowOutCandles() {
        if (candles.length === 0) {
            return;
        }
    
        if (isBlowing()) {
            let allCandlesOut = true;
    
            candles.forEach(candle => {
                if (!candle.classList.contains("out")) {
                    candle.classList.add("out");
                }
            });
    
            updateCandleCount();
    
            allCandlesOut = candles.every(candle => candle.classList.contains("out"));
    
            if (allCandlesOut) {
                console.log("All candles blown out! 🎉");
                startConfetti();
            }
        }
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
    
                // Check blowing every 300ms
                setInterval(() => {
                    if (isBlowing()) {
                        console.log("Detected blowing sound! 🌬️");
                        blowOutCandles();
                    }
                }, 300);
            }).catch(error => {
                alert("Microphone access is required for blowing out candles.");
                console.error("Microphone access denied: ", error);
            });
        }
    }
    
    window.openBdayCard = function () {
        cardContainer.style.display = "flex";
        if (!micPermissionGranted) {
            requestMicrophoneAccess();
        }
    };

    function toggleCard(event) {
        event.stopPropagation();
        if (card.classList.contains("open")) {
            card.classList.remove("open");
            audio.pause();
            audio.currentTime = 0;
            if (confettiActive) stopConfetti();
            resetCandles();
        } else {
            card.classList.add("open");
            audio.play();
        }
    }

    card.addEventListener("click", toggleCard);

    document.addEventListener("click", function (event) {
        if (!card.contains(event.target) && !cake.contains(event.target)) {
            return;
        }
    });
});