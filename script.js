document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("dashboard.html")) {
        loadGreetings();
    } else if (window.location.pathname.includes("edit.html")) {
        loadEditGreeting();
    }
});

function register() {
    let name = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let confirmPassword = document.getElementById("regConfirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
        alert("All fields are required!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(user => user.email === email)) {
        alert("Email already registered!");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Please log in.");
    window.location.href = "login.html";
}

function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function addGreeting() {
    let greetingMsg = document.getElementById("greetingMsg").value;
    if (!greetingMsg) {
        alert("Enter a greeting!");
        return;
    }

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    let greetings = JSON.parse(localStorage.getItem("greetings")) || [];
    let newGreeting = { id: Date.now(), message: greetingMsg, email: currentUser.email };

    greetings.push(newGreeting);
    localStorage.setItem("greetings", JSON.stringify(greetings));

    document.getElementById("greetingMsg").value = "";
    loadGreetings();
}

function loadGreetings() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userName").textContent = currentUser.name;

    let greetings = JSON.parse(localStorage.getItem("greetings")) || [];
    let userGreetings = greetings.filter(greeting => greeting.email === currentUser.email);

    let greetingsList = document.getElementById("greetingsList");
    greetingsList.innerHTML = "";

    userGreetings.forEach(greeting => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${greeting.message}
            <button onclick="editGreeting(${greeting.id})">Edit</button>
            <button onclick="deleteGreeting(${greeting.id})">Delete</button>
        `;
        greetingsList.appendChild(li);
    });
}

function deleteGreeting(id) {
    let greetings = JSON.parse(localStorage.getItem("greetings")) || [];
    greetings = greetings.filter(greeting => greeting.id !== id);
    localStorage.setItem("greetings", JSON.stringify(greetings));
    loadGreetings();
}

function editGreeting(id) {
    localStorage.setItem("editGreetingId", id);
    window.location.href = "edit.html";
}

function loadEditGreeting() {
    let id = parseInt(localStorage.getItem("editGreetingId"));
    let greetings = JSON.parse(localStorage.getItem("greetings")) || [];
    let greeting = greetings.find(g => g.id === id);

    if (greeting) {
        document.getElementById("editGreetingMsg").value = greeting.message;
    }
}

function updateGreeting() {
    let id = parseInt(localStorage.getItem("editGreetingId"));
    let newMessage = document.getElementById("editGreetingMsg").value;
    let greetings = JSON.parse(localStorage.getItem("greetings")) || [];

    let greetingIndex = greetings.findIndex(g => g.id === id);
    if (greetingIndex !== -1) {
        greetings[greetingIndex].message = newMessage;
    }

    localStorage.setItem("greetings", JSON.stringify(greetings));
    localStorage.removeItem("editGreetingId");
    window.location.href = "dashboard.html";
}

function cancelEdit() {
    window.location.href = "dashboard.html";
}
