console.log("main.js loaded");

// DỮ LIỆU ROADMAP (Bạn có thể dễ dàng thêm, sửa các mốc tại đây)
const roadmaps = {
  game: [
    {
      date: "Q4/2026",
      title: "Thiết kế Prototype",
      desc: "Hoàn thiện tạo hình nhân vật và cốt truyện chương 1.",
      active: false,
    },
    {
      date: "2027",
      title: "Bản thử nghiệm đầu tiên",
      desc: "Giai đoạn Pre-Alpha nội bộ.",
      active: true,
    },
  ],
  minecraft: [
    {
      date: "Tháng 04/2026",
      title: "Phát hành Modpack v1.0",
      desc: "Bản build thô sơ đầu tiên trên CurseForge.",
      active: false,
    },
    {
      date: "Tháng 06/2026",
      title: "Bản cập nhật v2.0 Remastered",
      desc: "Tối ưu hóa dung lượng Modpack và vá lỗi crash.",
      active: true,
    },
  ],
  bot: [
    {
      date: "Tháng 05/2026",
      title: "Khởi chạy Alpha Bot",
      desc: "Thử nghiệm hệ thống lệnh cơ bản.",
      active: false,
    },
    {
      date: "Tháng 07/2026",
      title: "Hệ thống Phó bản & Bang hội",
      desc: "Khai mở PVP liên server.",
      active: true,
    },
  ],
};

function renderSpecificRoadmap(roadmapArray, elementId) {
  const container = document.getElementById(elementId);
  if (!container) return;
  container.innerHTML = "";
  roadmapArray.forEach((milestone) => {
    container.innerHTML += `
      <div class="timeline-item ${milestone.active ? "current-node" : ""}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="milestone-date">${milestone.date}</span>
          <h4>${milestone.title}</h4>
          <p>${milestone.desc}</p>
        </div>
      </div>
    `;
  });
}

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

// Hàm khởi tạo tính năng Click chuyển hướng cho card
function initClickableCards() {
  document.body.addEventListener("click", function (e) {
    const card = e.target.closest(".clickable-card");
    if (card) {
      const url = card.getAttribute("data-url");
      if (url && url !== "#" && url !== "undefined") {
        window.open(url, "_blank");
      }
    }
  });
}

// Render Roadmap
function renderRoadmap() {
  const container = document.getElementById("roadmapTimeline");
  if (!container) return;
  container.innerHTML = "";
  roadmapData.forEach((milestone) => {
    container.innerHTML += `
      <div class="timeline-item ${milestone.active ? "current-node" : ""}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="milestone-date">${milestone.date}</span>
          <h4>${milestone.title}</h4>
          <p>${milestone.desc}</p>
        </div>
      </div>
    `;
  });
}

async function loadLatestEvents() {
  const container = document.getElementById("latestEvents");
  const harvestContainer = document.getElementById("harvestEventsPage");
  if (!harvestContainer && !container) return;

  let filePath = "data/events.json"; // Tệp tin mặc định của trang chủ[cite: 2]

  // Rẽ nhánh xác định tệp tải tùy theo trang đang đứng
  if (harvestContainer) {
    if (document.getElementById("gameRoadmapTimeline"))
      filePath = "data/game_events.json";
    else if (document.getElementById("mcRoadmapTimeline"))
      filePath = "data/mc_events.json";
    else if (document.getElementById("botRoadmapTimeline"))
      filePath = "data/bot_events.json";
  }

  try {
    const response = await fetch(filePath);
    const events = await response.json();
    events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    if (container) {
      renderEventCards(events.slice(0, 8), container); // Trang chủ giới hạn 8[cite: 2]
    } else if (harvestContainer) {
      renderEventCards(events, harvestContainer); // Các trang con hiện TẤT CẢ
    }
  } catch (error) {
    console.log("Chưa có dữ liệu sự kiện cho phân mục này.");
  }
}

function renderEventCards(dataArray, targetContainer) {
  targetContainer.innerHTML = "";
  dataArray.forEach((event, index) => {
    const status = getEventStatus(event.startDate, event.endDate);
    let statusText = "",
      statusClass = "";

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

    targetContainer.innerHTML += `
        <div class="mini-card clickable-card" data-aos="fade-up" data-aos-delay="${index * 150}" data-url="${event.link || "#"}">
            <img src="${event.banner}">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p class="${statusClass}">${statusText}</p>
        </div>
    `;
  });
}

async function loadLatestAnnouncements() {
  const container = document.getElementById("latestAnnouncements");
  const harvestContainer = document.getElementById("harvestAnnouncementsPage");
  if (!harvestContainer && !container) return;

  let filePath = "data/announcements.json"; // Tệp tin mặc định[cite: 2]

  if (harvestContainer) {
    if (document.getElementById("gameRoadmapTimeline"))
      filePath = "data/game_announcements.json";
    else if (document.getElementById("mcRoadmapTimeline"))
      filePath = "data/mc_announcements.json";
    else if (document.getElementById("botRoadmapTimeline"))
      filePath = "data/bot_announcements.json";
  }

  try {
    const response = await fetch(filePath);
    const announcements = await response.json();
    announcements.sort((a, b) =>
      a.pinned && !b.pinned
        ? -1
        : !a.pinned && b.pinned
          ? 1
          : new Date(b.date) - new Date(a.date),
    );

    if (container) {
      renderAnnouncementCards(announcements.slice(0, 8), container); // Trang chủ giới hạn 8[cite: 2]
    } else if (harvestContainer) {
      renderAnnouncementCards(announcements, harvestContainer); // Các trang con hiện TẤT CẢ
    }
  } catch (error) {
    console.log("Chưa có dữ liệu thông báo cho phân mục này.");
  }
}

function renderAnnouncementCards(dataArray, targetContainer) {
  targetContainer.innerHTML = "";
  dataArray.forEach((item, index) => {
    targetContainer.innerHTML += `
        <div class="announcement-preview clickable-card" data-aos="fade-up" data-aos-delay="${index * 150}" data-url="#">
            <span>${item.tag}</span>
            <h3>${item.title}</h3>
            <p>${item.content}</p>
        </div>
    `;
  });
}

// Xử lý đóng mở Menu Mobile toàn diện
const menuBtn = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Lắng nghe sự kiện click vào mục "The Harvest" trên giao diện Mobile
const dropdownToggle = document.querySelector(".dropdown-toggle");
if (dropdownToggle) {
  dropdownToggle.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault(); // Ngăn chặn chuyển hướng hoặc giật trang
      dropdownToggle.parentElement.classList.toggle("mobile-open");
    }
  });
}

document
  .querySelectorAll(".nav-links a:not(.dropdown-toggle)")
  .forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const openedDropdown = document.querySelector(".nav-dropdown");
      if (openedDropdown) openedDropdown.classList.remove("mobile-open");
    });
  });

// Khởi chạy các hàm
document.addEventListener("DOMContentLoaded", () => {
  loadLatestEvents();
  loadLatestAnnouncements();

  // Render đúng lộ trình phát triển cho từng trang cụ thể
  renderSpecificRoadmap(roadmaps.game, "gameRoadmapTimeline");
  renderSpecificRoadmap(roadmaps.minecraft, "mcRoadmapTimeline");
  renderSpecificRoadmap(roadmaps.bot, "botRoadmapTimeline");

  // Khởi tạo thanh cuộn mượt mà[cite: 2]
  setupHorizontalScroll("latestEvents", "eventLeft", "eventRight");
  setupHorizontalScroll(
    "latestAnnouncements",
    "announcementLeft",
    "announcementRight",
  );
  setupHorizontalScroll("harvestEventsPage", "hEventLeft", "hEventRight");
  setupHorizontalScroll(
    "harvestAnnouncementsPage",
    "hAnnounceLeft",
    "hAnnounceRight",
  );
});

function setupHorizontalScroll(containerId, leftId, rightId) {
  const container = document.getElementById(containerId);
  const left = document.getElementById(leftId);
  const right = document.getElementById(rightId);
  if (!container) return;

  const getStep = () => {
    const card = container.querySelector(".mini-card, .announcement-preview");
    if (!card) return 345;
    return card.offsetWidth + 25;
  };

  left?.addEventListener("click", () => {
    container.scrollTo({
      left: container.scrollLeft - getStep(),
      behavior: "smooth",
    });
  });
  right?.addEventListener("click", () => {
    container.scrollTo({
      left: container.scrollLeft + getStep(),
      behavior: "smooth",
    });
  });
}
