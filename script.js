
document.addEventListener("DOMContentLoaded", function () {

    // 1. MOBILE MENU
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.textContent = isOpen ? "×" : "☰";
        });
    }


    // 2. BOOKING FORM ELEMENTS
    const bookingForm = document.getElementById("booking-form");
    const roomSelect = document.getElementById("room");
    const checkIn = document.getElementById("checkin");
    const checkOut = document.getElementById("checkout");
    const estimate = document.getElementById("estimate");
    const bookingMessage = document.getElementById("booking-message");
    const guestsInput = document.getElementById("guests");


    // 3. SET MINIMUM BOOKING DATE
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const today = formatDate(new Date());

    if (checkIn) {
        checkIn.min = today;
    }

    if (checkOut) {
        checkOut.min = today;
    }

    if (checkIn && checkOut) {
        checkIn.addEventListener("change", function () {
            checkOut.min = checkIn.value || today;

            if (checkOut.value && checkOut.value <= checkIn.value) {
                checkOut.value = "";
            }

            updateEstimate();
        });

        checkOut.addEventListener("change", updateEstimate);
    }


    // 4. PRESELECT A ROOM FROM THE URL
    if (roomSelect) {
        const roomNames = {
            deluxe: "Deluxe Room",
            executive: "Executive Suite",
            presidential: "Presidential Suite",
            twin: "Twin Room",
            family: "Family Room",
            villa: "Luxury Villa"
        };

        const parameters = new URLSearchParams(window.location.search);
        const roomCode = parameters.get("room");

        if (roomCode && roomNames[roomCode]) {
            roomSelect.value = roomNames[roomCode];
        }
    }


    // 5. CALCULATE THE ESTIMATED BOOKING COST
    function updateEstimate() {
        if (!roomSelect || !checkIn || !checkOut || !estimate) {
            return;
        }

        const selectedOption = roomSelect.options[roomSelect.selectedIndex];

        if (
            !selectedOption ||
            !roomSelect.value ||
            !checkIn.value ||
            !checkOut.value
        ) {
            estimate.textContent =
                "Select a room and your dates to see an estimate.";
            return;
        }

        const price = Number(selectedOption.dataset.price);

        if (!Number.isFinite(price) || price < 0) {
            estimate.textContent =
                "Please check the room price in the HTML.";
            return;
        }

        const start = new Date(checkIn.value + "T00:00:00");
        const end = new Date(checkOut.value + "T00:00:00");

        const nights = Math.round((end - start) / 86400000);

        if (nights <= 0) {
            estimate.textContent =
                "Check-out must be after check-in.";
            return;
        }

        const total = nights * price;

        estimate.textContent =
            `${nights} night(s) × ₦${price.toLocaleString("en-NG")} = ` +
            `₦${total.toLocaleString("en-NG")} estimated total.`;
    }

    if (roomSelect) {
        roomSelect.addEventListener("change", updateEstimate);
    }

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!bookingForm.reportValidity()) {
                return;
            }

            if (
                !roomSelect ||
                !checkIn ||
                !checkOut ||
                !roomSelect.value ||
                !checkIn.value ||
                !checkOut.value ||
                checkOut.value <= checkIn.value
            ) {
                if (bookingMessage) {
                    bookingMessage.textContent =
                        "Please select a room and valid check-in and check-out dates.";
                    bookingMessage.hidden = false;
                }
                return;
            }

            const selectedOption = roomSelect.options[roomSelect.selectedIndex];
            const price = Number(selectedOption.dataset.price);

            if (!Number.isFinite(price) || price < 0) {
                if (bookingMessage) {
                    bookingMessage.textContent =
                        "The selected room price is missing or invalid.";
                    bookingMessage.hidden = false;
                }
                return;
            }

            const start = new Date(checkIn.value + "T00:00:00");
            const end = new Date(checkOut.value + "T00:00:00");
            const nights = Math.round((end - start) / 86400000);
            const total = nights * price;
            const guests = guestsInput ? guestsInput.value : "1";

            if (bookingMessage) {
                bookingMessage.textContent =
                    `Demo request: ${roomSelect.value}; ` +
                    `${guests} guest(s); ${nights} night(s); ` +
                    `estimated total ₦${total.toLocaleString("en-NG")}. ` +
                    `This is not a confirmed reservation. Contact the hotel to confirm availability.`;

                bookingMessage.hidden = false;
            }
        });

        updateEstimate();
    }


    // 6. CONTACT FORM
    const contactForm = document.getElementById("contact-form");
    const contactMessage = document.getElementById("contact-message");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            if (contactMessage) {
                contactMessage.textContent =
                    "The form is valid, but no message has been sent. " +
                    "A backend is needed to receive enquiries.";

                contactMessage.hidden = false;
            }

            contactForm.reset();
        });
    }


    // 7. AUTOMATIC FOOTER YEAR
    document.querySelectorAll(".current-year").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

});
