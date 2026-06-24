console.log("main.js loaded");

async function loadLatestEvents() {
  const response = await fetch("data/events.json");

  const events = await response.json();

  console.log(events);

  events.sort((a, b) => new Date(b.date) - new Date(a.date));

  const latest = events.slice(0, 3);

  const container = document.getElementById("latestEvents");

  latest.forEach((event, index) => {
    container.innerHTML += `

        <div
            class="mini-card"
            data-aos="fade-up"
            data-aos-delay="${index * 150}">

            <img src="${event.banner}">

            <h3>${event.title}</h3>

            <p>${event.date}</p>

        </div>

    `;
  });
  AOS.refresh();
}

loadLatestEvents();

async function loadLatestAnnouncements() {
  const response = await fetch("data/announcements.json");

  const announcements = await response.json();

  announcements.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;

    if (!a.pinned && b.pinned) return 1;

    return new Date(b.date) - new Date(a.date);
  });

  const latest = announcements.slice(0, 3);

  const container = document.getElementById("latestAnnouncements");

  latest.forEach((item, index) => {
    container.innerHTML += `

            <div class="announcement-preview"
            data-aos="fade-up"
            data-aos-delay="${index * 150}">

                <span>

                    ${item.tag}

                </span>

                <h3>

                    ${item.title}

                </h3>

            </div>

        `;
  });
  AOS.refresh();
}

loadLatestAnnouncements();

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("http")) {
      return;
    }

    e.preventDefault();

    document.body.classList.add("page-exit");

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});
