document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const response = await fetch("https://recipe-website-backend-zeta.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (username == "azad814") {
        if (response.status = 200) {
            const authToken = await response.json();
            document.cookie = "authToken=" + authToken;
            window.location.href = "/admin_dash.html";
        }
        else {
            window.alert("Username or Password is incorrect");
        }
    }
    else {
        if (response.status == 200) {
            const authToken = await response.json();
            console.log(authToken);
            document.cookie = "authToken=" + authToken;
            window.location.href = "/index.html";
        }
        else {
            window.alert("Username or password is incorrect");
        }
    }
});

