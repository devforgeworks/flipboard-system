// Dark Mode Functionality

const darkModeToggle = document.getElementById('darkModeToggle');

// Kolla om användaren har sparat dark mode-preferens
const savedDarkMode = localStorage.getItem('darkMode');

// Sätt dark mode baserat på sparad preferens
if (savedDarkMode === 'enabled') {
    document.body.classList.add('dark-mode');
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Spara preferensen
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});
