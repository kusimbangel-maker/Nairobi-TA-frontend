const role = sessionStorage.getItem("userRole");

// Redirect if not logged in
if (!role) {
    window.location.href = "login.html";
}

function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => section.classList.remove("active"));

    const target = document.getElementById(sectionId);
    if (target) target.classList.add("active");
}

// Shared storage
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

/* ==============================
   CITIZEN LOGIC
============================== */
function submitComplaint() {
    const titleInput = document.getElementById("complaintTitle");
    const message = document.getElementById("submitMessage");
    const title = titleInput.value.trim();

    if (title === "") {
        message.innerText = "Please enter a title.";
        message.style.color = "red";
        return;
    }

    const newComplaint = {
        id: "NRB-" + Math.floor(1000 + Math.random() * 9000), // Tracking ID
        title: title,
        status: "Pending",
        date: new Date().toLocaleDateString(),
        citizen: sessionStorage.getItem("userEmail")
    };

    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    titleInput.value = "";
    message.innerHTML = `Success! Tracking ID: <strong>${newComplaint.id}</strong>`;
    message.style.color = "green";
    renderCitizenComplaints();
}

function renderCitizenComplaints() {
    const list = document.getElementById("complaintList");
    if (!list) return;

    list.innerHTML = complaints.length === 0 ? "<p>No complaints submitted.</p>" : "";
    complaints.forEach(c => {
        list.innerHTML += `
            <div class="complaint-item card">
                <strong>[${c.id}] ${c.title}</strong>
                <p>Status: <span class="badge ${c.status.toLowerCase()}">${c.status}</span></p>
                <small>Submitted on: ${c.date}</small>
            </div>
        `;
    });
}

/* ==============================
   STAFF LOGIC
============================== */
function renderStaffComplaints() {
    const list = document.getElementById("assignedList");
    if (!list) return;

    list.innerHTML = "";
    complaints.forEach((c, index) => {
        list.innerHTML += `
            <div class="complaint-item card">
                <strong>${c.id}: ${c.title}</strong>
                <p>Current Status: ${c.status}</p>
                <button class="btn-small" onclick="updateStatus(${index}, 'In Progress')">Start</button>
                <button class="btn-small resolve" onclick="updateStatus(${index}, 'Resolved')">Resolve</button>
            </div>
        `;
    });
}

function updateStatus(index, newStatus) {
    complaints[index].status = newStatus;
    localStorage.setItem("complaints", JSON.stringify(complaints));
    renderStaffComplaints();
}

/* ==============================
   OVERSIGHT LOGIC
============================== */
function renderOversightSummary() {
    const summaryArea = document.getElementById("oversightSummary");
    if (!summaryArea) return;

    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    summaryArea.innerHTML = `
        <div class="metrics-grid">
            <div class="metric-card"><h4>Total</h4><p>${total}</p></div>
            <div class="metric-card"><h4>Resolved</h4><p>${resolved}</p></div>
            <div class="metric-card"><h4>Pending</h4><p>${total - resolved}</p></div>
        </div>
    `;
}

/* ==============================
   AUTO INITIALIZATION
============================== */
document.addEventListener("DOMContentLoaded", () => {
    if (role === "citizen") renderCitizenComplaints();
    if (role === "staff") renderStaffComplaints();
    if (role === "oversight") renderOversightSummary();
});
