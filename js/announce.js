async function loadAnnouncements() {
  const response = await fetch("data/announcements.json");

  const announcements = await response.json();

  console.log(announcements);

  announcements.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;

    if (!a.pinned && b.pinned) return 1;

    return new Date(b.date) - new Date(a.date);
  });

  const container = document.getElementById("announceContainer");

  announcements.forEach((item, index) => {
    const card = document.createElement("div");

    card.className = "announce-card";

    card.setAttribute("data-aos", "fade-up");

    card.setAttribute("data-aos-delay", index * 100);

    card.innerHTML = `

            ${item.pinned ? '<div class="pinned">📌 ĐÃ GHIM</div>' : ""}

            <span class="announce-tag">

                ${item.tag}

            </span>

            <h2>

                ${item.title}

            </h2>

            <p class="announce-date">

                ${new Date(item.date).toLocaleString("vi-VN")}

            </p>

            <p>

                ${item.content}

            </p>

        `;

    container.appendChild(card);
  });
}

loadAnnouncements();
