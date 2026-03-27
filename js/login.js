document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // SIMPLE MOCK USERS
    const users = {
        "citizen@test.com": { password: "1234", role: "citizen" },
        "staff@test.com": { password: "1234", role: "staff" },
        "oversight@test.com": { password: "1234", role: "oversight" },
        "admin@test.com": { password: "1234", role: "admin" }
    };

    if(users[email] && users[email].password === password) {

        const role = users[email].role;

        sessionStorage.setItem("userRole", role);
        sessionStorage.setItem("userEmail", email);

        if(role === "citizen") {
            window.location.href = "citizen-dashboard.html";
        }
        if(role === "staff") {
            window.location.href = "staff-dashboard.html";
        }
        if(role === "oversight") {
            window.location.href = "oversight-dashboard.html";
        }
        if(role === "admin") {
            window.location.href = "admin-dashboard.html";
        }

    } else {
        alert("Invalid login credentials");
    }
});
