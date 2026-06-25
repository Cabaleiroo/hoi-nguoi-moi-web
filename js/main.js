console.log("main.js loaded");

function getEventStatus(startDate, endDate) {
  const now = new Date();

  const start = new Date(startDate);

  const end = new Date(endDate);

  if (now < start) return "upcoming";

  if (now >= start && now <= end) return "ongoing";

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

async function loadLatestEvents() {
  const response = await fetch("data/events.json");

  const events = await response.json();

  console.log(events);

  events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const latest = events.slice(0, 8);

  const container = document.getElementById("latestEvents");

  if (!container) return;

  latest.forEach((event, index) => {
    const status = getEventStatus(event.startDate, event.endDate);

    let statusText = "";

    let statusClass = "";

    if (status === "upcoming") {
      statusText = `⏳ Còn ${getCountdown(event.startDate)}`;

      statusClass = "event-upcoming";
    } else if (status === "ongoing") {
      statusText = "🟢 Đang diễn ra";

      statusClass = "event-ongoing";
    } else {
      statusText = "🔴 Đã kết thúc";

      statusClass = "event-finished";
    }
    container.innerHTML += `

        <div
            class="mini-card"
            data-aos="fade-up"
            data-aos-delay="${index * 150}">

            <img src="${event.banner}">

            <h3>${event.title}</h3>

            <p>${event.description}</p>

            <p class="${statusClass}">
                ${statusText}
            </p>

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

  const latest = announcements.slice(0, 8);

  const container = document.getElementById("latestAnnouncements");

  if (!container) return;

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

                <p>
                    ${item.content}
                </p>

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

const menuBtn = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

function setupHorizontalScroll(containerId, leftId, rightId) {
  const container = document.getElementById(containerId);
  const left = document.getElementById(leftId);
  const right = document.getElementById(rightId);

  if (!container) return;

  const getStep = () => {
    const card = container.querySelector(".mini-card, .announcement-preview");
    if (!card) return 345;
    const cardWidth = card.offsetWidth;
    const computedStyle = window.getComputedStyle(container);
    const gap = parseInt(computedStyle.gap) || 25;
    return cardWidth + gap;
  };

  const scrollToNext = (dir) => {
    const step = getStep();

    container.scrollTo({
      left: container.scrollLeft + dir * step,
      behavior: "smooth",
    });
  };

  left?.addEventListener("click", () => scrollToNext(-1));
  right?.addEventListener("click", () => scrollToNext(1));
}

setupHorizontalScroll("latestEvents", "eventLeft", "eventRight");

setupHorizontalScroll(
  "latestAnnouncements",
  "announcementLeft",
  "announcementRight",
);
