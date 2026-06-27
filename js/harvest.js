async function loadHarvest() {
  const response = await fetch("data/harvest.json");

  const members = await response.json();

  const container = document.getElementById("membersContainer");

  members.forEach((member, index) => {
    const card = document.createElement("div");

    card.className = "member-card";

    card.setAttribute("data-aos", "fade-up");

    card.setAttribute("data-aos-delay", index * 150);

    card.innerHTML = `

            <img src="${member.avatar}">

            <h3>${member.name}</h3>

            <span>${member.role}</span>

            <p>${member.description}</p>

        `;

    container.appendChild(card);
  });
}

loadHarvest();