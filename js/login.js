document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const response = await fetch("https://recipe-website-backend-zeta.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    // alert(await response.text());
    if(response.status(200))
    const authToken = await response.text();
    document.cookie = "authToken=" + authToken;
    window.location.href = "/index.html";
});