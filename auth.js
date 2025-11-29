// Auth State Management
let currentUser = null;

// Auth UI Elements
const authOverlay = document.getElementById('authOverlay');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');

// Sidebar User Info Elements
const sidebarUserInfo = document.getElementById('sidebarUserInfo');
const sidebarUserName = document.getElementById('sidebarUserName');
const sidebarUserEmail = document.getElementById('sidebarUserEmail');
const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');

// Lyssna på autentiseringsändringar
auth.onAuthStateChanged((user) => {
    if (user) {
        // Användare inloggad
        currentUser = user;
        authOverlay.style.display = 'none';

        // Uppdatera användarinfo i UI
        userName.textContent = user.displayName;
        userEmail.textContent = user.email;
        userAvatar.src = user.photoURL;

        // Uppdatera användarinfo i sidebar
        sidebarUserInfo.style.display = 'flex';
        sidebarUserName.textContent = user.displayName;
        sidebarUserEmail.textContent = user.email;
        sidebarUserAvatar.src = user.photoURL;

        // Ladda användarens kort från Firestore
        loadUserCards();
    } else {
        // Ingen användare inloggad
        currentUser = null;
        authOverlay.style.display = 'flex';
        sidebarUserInfo.style.display = 'none';

        // Rensa alla kort
        clearAllCards();
    }
});

// Google Login
googleLoginBtn.addEventListener('click', async () => {
    try {
        await auth.signInWithPopup(googleProvider);
    } catch (error) {
        console.error('Login error:', error);
        alert('Kunde inte logga in: ' + error.message);
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Kunde inte logga ut: ' + error.message);
    }
});

// Sidebar logout
sidebarLogoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Kunde inte logga ut: ' + error.message);
    }
});

// Rensa alla kort från UI
function clearAllCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.remove());
}
