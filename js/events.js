async function loadEvents() {
  const response = await fetch("data/events.json");

  const events = await response.json();

  events.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const container = document.getElementById("eventsContainer");

  events.forEach((event, index) => {
    function getEventStatus(startDate, endDate) {
      const now = new Date();

      const start = new Date(startDate);

      const end = new Date(endDate);

      if (now < start) {
        return "upcoming";
      }

      if (now >= start && now <= end) {
        return "ongoing";
      }

      return "finished";
    }

    function getCountdown(startDate) {
      const now = new Date();

      const start = new Date(startDate);

      const diff = start - now;

      if (diff <= 0) return null;

      const days = Math.floor(diff / 86400000);

      const hours = Math.floor((diff % 86400000) / 3600000);

      return `${days} ngày ${hours} giờ`;
    }

    const status = getEventStatus(event.startDate, event.endDate);

    let statusText = "";
    let statusClass = "";

    if (status === "upcoming") {
      statusText = `⏳ Còn ${getCountdown(event.startDate)}`;

      statusClass = "event-upcoming";
    }

    if (status === "ongoing") {
      statusText = "Đang diễn ra";

      statusClass = "event-ongoing";
    }

    if (status === "finished") {
      statusText = "Đã kết thúc";

      statusClass = "event-finished";
    }
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
                
                <h3>

                    ${event.description}

                </h3>

                <p class="${statusClass}">
                    ${statusText}
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
