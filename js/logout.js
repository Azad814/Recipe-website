// Function to check if user is logged in
function checkLoginStatus() {
    const authToken = getCookie('authToken');
    const loginItem = document.getElementById('loginNavItem');
    const logoutItem = document.getElementById('logoutNavItem');
    
    if (authToken) {
        // User is logged in
        if (loginItem) loginItem.style.display = 'none';
        if (logoutItem) logoutItem.style.display = 'block';
    } else {
        // User is not logged in
        if (loginItem) loginItem.style.display = 'block';
        if (logoutItem) logoutItem.style.display = 'none';
    }
}

// Helper function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Logout function
async function logout() {
    try {
        const response = await fetch('https://recipe-website-backend-zeta.vercel.app/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('authToken')}`
            }
        });

        if (response.ok) {
            // Clear the cookie
            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // Update UI
            checkLoginStatus();
            
            // Redirect to home page
            window.location.href = '/index.html';
        } else {
            console.error('Logout failed:', await response.text());
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Add logout event listener
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});