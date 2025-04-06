document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const response = await fetch("https://recipe-website-backend-zeta.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (username == "azad814") {
        if (response.status = 200) {
            const authToken = await response.json();
            document.cookie = "authToken=" + authToken;
            window.location.href = "/admin.html";
        }
        else if (response.status == 403) {
            window.alert("Admin User Already Exists! Please Login.");
        }
        else {
            window.alert("Please Enter a valid Username or Password");
        }
    }
    else {
        if (response.status == 200) {
            const authToken = await response.json();
            console.log(authToken);
            document.cookie = "authToken=" + authToken;
            window.location.href = "/index.html";
        }
        else if (response.status == 403) {
            window.alert("User Already Exists! Please Login.");
        }
        else {
            window.alert("Please Enter a valid Username or Password");
        }
    }
});