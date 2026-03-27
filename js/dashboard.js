
const role = sessionStorage.getItem("userRole");

if (!role) {
    window.location.href = "login.html";
}


const currentPage = window.location.pathname;

if (currentPage.includes("citizen") && role !== "citizen") {
    window.location.href = "login.html";
}
if (currentPage.includes("staff") && role !== "staff") {
    window.location.href = "login.html";
}
if (currentPage.includes("oversight") && role !== "oversight") {
    window.location.href = "login.html";
}
if (currentPage.includes("admin") && role !== "admin") {
    window.location.href = "login.html";
}



function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}


function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add("active");
    }
}



// Shared complaint storage
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

/* ==============================
   CITIZEN DASHBOARD LOGIC
============================== */

function renderCitizenComplaints() {
    const list = document.getElementById("complaintList");
    if (!list) return;

    list.innerHTML = "";

    complaints.forEach((c, index) => {
        list.innerHTML += `
            <div class="complaint-item">
                <strong>${c.title}</strong>
                <p>Status: ${c.status}</p>
            </div>
        `;
    });
}

function submitComplaint() {
    const titleInput = document.getElementById("complaintTitle");
    const message = document.getElementById("submitMessage");

    if (!titleInput) return;

    const title = titleInput.value.trim();

    if (title === "") {
        message.innerText = "Please enter a complaint title.";
        message.style.color = "red";
        return;
    }

    const newComplaint = {
        title: title,
        status: "Pending"
    };

    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    titleInput.value = "";
    message.innerText = "Complaint submitted successfully!";
    message.style.color = "green";

    renderCitizenComplaints();
}

/* ==============================
   STAFF DASHBOARD LOGIC
============================== */

function renderStaffComplaints() {
    const list = document.getElementById("assignedList");
    if (!list) return;

    list.innerHTML = "";

    complaints.forEach((c, index) => {
        list.innerHTML += `
            <div class="complaint-item">
                <strong>${c.title}</strong>
                <p>Status: ${c.status}</p>
                <button onclick="updateStatus(${index}, 'In Progress')">Start</button>
                <button onclick="updateStatus(${index}, 'Resolved')">Resolve</button>
            </div>
        `;
    });
}

function updateStatus(index, newStatus) {
    complaints[index].status = newStatus;
    localStorage.setItem("complaints", JSON.stringify(complaints));

    renderStaffComplaints();
    renderCitizenComplaints();
}

/* ==============================
   OVERSIGHT DASHBOARD LOGIC
============================== */

function renderOversightSummary() {
    const summary = document.getElementById("oversightSummary");
    if (!summary) return;

    const total = complaints.length;
    const pending = complaints.filter(c => c.status === "Pending").length;
    const inProgress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    summary.innerHTML = `
        <p>Total Complaints: ${total}</p>
        <p>Pending: ${pending}</p>
        <p>In Progress: ${inProgress}</p>
        <p>Resolved: ${resolved}</p>
    `;
}

/* ==============================
   ADMIN DASHBOARD LOGIC
============================== */

function renderAdminPanel() {
    const adminArea = document.getElementById("adminPanel");
    if (!adminArea) return;

    adminArea.innerHTML = `
        <p>System Users:</p>
        <ul>
            <li>Citizen Users</li>
            <li>Staff Users</li>
            <li>Oversight Users</li>
            <li>Admin Users</li>
        </ul>
        <p>Total Complaints in System: ${complaints.length}</p>
    `;
}

/* ==============================
   AUTO INITIALIZATION
============================== */

document.addEventListener("DOMContentLoaded", function() {

    if (role === "citizen") {
        renderCitizenComplaints();
    }

    if (role === "staff") {
        renderStaffComplaints();
    }

    if (role === "oversight") {
        renderOversightSummary();
    }

    if (role === "admin") {
        renderAdminPanel();
    }

});