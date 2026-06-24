async function loadEvents() {
  const response = await fetch("data/events.json");

  const events = await response.json();

  events.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const container = document.getElementById("eventsContainer");

  events.forEach((event, index) => {
    const card = document.createElement("div");

    card.className = "event-card";

    card.setAttribute("data-aos", "fade-up");

    card.setAttribute("data-aos-delay", index * 100);

    card.innerHTML = `

            <img
            src="${event.banner}"
            class="event-banner">

            <div class="event-content">

                <h2>
                    ${event.title}
                </h2>

                <p class="event-date">

                    📅 ${event.date}

                </p>

                <p>

                    ${event.description}

                </p>

                <a
                href="${event.link}"
                class="event-btn">

                    Xem Chi Tiết

                </a>

            </div>

        `;

    container.appendChild(card);
  });
}

loadEvents();
