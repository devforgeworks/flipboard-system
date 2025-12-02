// Hämta element
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarActivityInput = document.getElementById('sidebarActivityInput');
const sidebarDescriptionInput = document.getElementById('sidebarDescriptionInput');
const dayButtons = document.getElementById('dayButtons');
const sidebarAddBtn = document.getElementById('sidebarAddBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const resetBtn = document.getElementById('resetBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalCard = document.getElementById('modalCard');
const modalClose = document.getElementById('modalClose');
const modalDelete = document.getElementById('modalDelete');
const modalTitleFront = document.getElementById('modalTitleFront');
const modalDescriptionFront = document.getElementById('modalDescriptionFront');
const modalTitleBack = document.getElementById('modalTitleBack');
const modalDescriptionBack = document.getElementById('modalDescriptionBack');
const daysContainer = document.getElementById('daysContainer');
const mobileNavDots = document.getElementById('mobileNavDots');

let currentCard = null;

// Funktion för att automatiskt justera font-storlek i card-tab baserat på textlängd
function adjustCardTabFontSize(cardElement) {
    const cardTabs = cardElement.querySelectorAll('.card-tab');

    cardTabs.forEach(tab => {
        const text = tab.textContent;
        const textLength = text.length;

        // Justera font-storlek baserat på textlängd
        if (textLength <= 10) {
            tab.style.fontSize = '11px';
        } else if (textLength <= 15) {
            tab.style.fontSize = '10px';
        } else if (textLength <= 20) {
            tab.style.fontSize = '9px';
        } else if (textLength <= 30) {
            tab.style.fontSize = '8px';
        } else {
            tab.style.fontSize = '7px';
        }
    });
}

// Skapa navigation dots för mobil
const days = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'];
days.forEach((day, index) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    if (index === 0) dot.classList.add('active');
    dot.dataset.dayIndex = index;
    dot.addEventListener('click', () => {
        scrollToDay(index);
    });
    mobileNavDots.appendChild(dot);
});

// Scroll to specific day
function scrollToDay(index) {
    const dayColumns = document.querySelectorAll('.day-column');
    if (dayColumns[index]) {
        dayColumns[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// Uppdatera active dot baserat på scroll position
function updateActiveDot() {
    const dayColumns = document.querySelectorAll('.day-column');
    const dots = document.querySelectorAll('.nav-dot');

    const containerRect = daysContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    dayColumns.forEach((column, index) => {
        const rect = column.getBoundingClientRect();
        const columnCenter = rect.left + rect.width / 2;
        const distance = Math.abs(columnCenter - containerCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    dots.forEach((dot, index) => {
        if (index === closestIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Lyssna på scroll events
let scrollTimeout;
daysContainer.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 50);
});

// Touch swipe support för bättre mobil-upplevelse
let touchStartX = 0;
let touchEndX = 0;

daysContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

daysContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        const dots = document.querySelectorAll('.nav-dot');
        const currentIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));

        if (diff > 0 && currentIndex < days.length - 1) {
            // Swipe left - go to next day
            scrollToDay(currentIndex + 1);
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe right - go to previous day
            scrollToDay(currentIndex - 1);
        }
    }
}

// Toggle sidebar
hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
});

// Day button selection
const dayBtns = dayButtons.querySelectorAll('.day-btn');
dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
    });
});


// Stäng sidebar när man klickar utanför
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active')) {
        // Om klicket inte är inuti sidebaren eller hamburger-knappen
        if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Funktion för att skapa ett nytt kort
async function createCard(activityName, description, day) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.status = 'red';
    card.dataset.description = description;

    card.innerHTML = `
        <div class="card-flipper">
            <div class="card-front">
                <div class="card-tab">${activityName}</div>
                <div class="card-body">
                    <button class="flip-btn" title="Markera som klar">✓</button>
                </div>
            </div>
            <div class="card-back">
                <div class="card-tab">${activityName}</div>
                <div class="card-body">
                    <button class="flip-btn" title="Markera som klar">✓</button>
                </div>
            </div>
        </div>
    `;

    // Öppna modal när man klickar på kortet
    card.addEventListener('click', (e) => {
        // Förhindra modal om man klickar på flip-knappen
        if (e.target.closest('.flip-btn')) {
            return;
        }
        openModal(card, activityName, description);
    });

    // Flip-knapp funktionalitet på båda sidorna
    const flipBtns = card.querySelectorAll('.flip-btn');
    flipBtns.forEach(flipBtn => {
        flipBtn.addEventListener('click', async (e) => {
            e.stopPropagation();

            // Växla flip-klass för animation
            card.classList.toggle('flipped');

            // Växla status
            const newStatus = card.dataset.status === 'red' ? 'green' : 'red';
            card.dataset.status = newStatus;

            // Uppdatera i Firebase
            const cardId = card.dataset.cardId;
            if (cardId) {
                await updateCardStatus(cardId, newStatus);
            }
        });
    });

    // Drag and drop events
    card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    // Lägg till kortet i rätt dag
    const container = document.getElementById(`cards-${day}`);
    container.appendChild(card);

    // Justera font-storlek baserat på textlängd
    adjustCardTabFontSize(card);

    // Spara till Firebase
    const cardData = {
        activityName,
        description,
        day,
        status: 'red'
    };

    try {
        const docRef = await saveCardToDatabase(cardData);
        if (docRef) {
            card.dataset.cardId = docRef.id;
        }
    } catch (error) {
        console.error('Error creating card:', error);
    }
}

// Öppna modal popup
function openModal(card, activityName, description) {
    currentCard = card;

    // Sätt titel och beskrivning
    modalTitleFront.textContent = activityName;
    modalDescriptionFront.textContent = description;
    modalTitleBack.textContent = activityName;
    modalDescriptionBack.textContent = description;

    // Sätt rätt flip-status baserat på kortets flipped-klass
    if (card.classList.contains('flipped')) {
        modalCard.classList.add('flipped');
    } else {
        modalCard.classList.remove('flipped');
    }

    modalOverlay.classList.add('active');
}

// Stäng modal
function closeModal() {
    modalOverlay.classList.remove('active');
    currentCard = null;
}

// Flippa kortet i modal
modalCard.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.closest('.modal-close')) return;
    if (e.target.closest('.modal-delete')) return;

    modalCard.classList.toggle('flipped');

    // Uppdatera det riktiga kortet
    if (currentCard) {
        const isFlipped = modalCard.classList.contains('flipped');
        const newStatus = isFlipped ? 'green' : 'red';

        // Synka flipped-klass med det riktiga kortet
        if (isFlipped) {
            currentCard.classList.add('flipped');
            currentCard.dataset.status = 'green';
        } else {
            currentCard.classList.remove('flipped');
            currentCard.dataset.status = 'red';
        }

        // Uppdatera i Firebase
        const cardId = currentCard.dataset.cardId;
        if (cardId) {
            await updateCardStatus(cardId, newStatus);
        }
    }
});

// Radera kort från modal
modalDelete.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (currentCard) {
        const cardId = currentCard.dataset.cardId;

        // Ta bort från UI
        currentCard.remove();
        closeModal();

        // Ta bort från Firebase
        if (cardId) {
            await deleteCardFromDatabase(cardId);
        }
    }
});

// Stäng modal events
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Lägg till nytt kort
sidebarAddBtn.addEventListener('click', () => {
    const activityName = sidebarActivityInput.value.trim();
    const description = sidebarDescriptionInput.value.trim();

    // Hämta alla valda dagar från knappar
    const selectedBtns = dayButtons.querySelectorAll('.day-btn.selected');
    const selectedDays = Array.from(selectedBtns).map(btn => btn.dataset.day);

    if (activityName === '') {
        alert('Skriv in ett aktivitetsnamn!');
        return;
    }

    if (selectedDays.length === 0) {
        alert('Välj minst en dag!');
        return;
    }

    // Skapa kort för varje vald dag
    selectedDays.forEach(day => {
        createCard(activityName, description, day);
    });

    // Rensa fälten
    sidebarActivityInput.value = '';
    sidebarDescriptionInput.value = '';

    // Avmarkera alla dag-knappar
    selectedBtns.forEach(btn => btn.classList.remove('selected'));

    sidebarActivityInput.focus();
});

// Lägg till kort med Enter i aktivitetsnamn-fältet
sidebarActivityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sidebarAddBtn.click();
    }
});

// Återställ alla kort till röda
resetBtn.addEventListener('click', async () => {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.dataset.status = 'red';
        card.classList.remove('flipped');
    });

    // Uppdatera i Firebase
    await resetAllCardsInDatabase();
});

// Ta bort alla kort
deleteAllBtn.addEventListener('click', async () => {
    if (confirm('Är du säker på att du vill ta bort alla kort? Detta kan inte ångras.')) {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => card.remove());
        sidebar.classList.remove('active');

        // Ta bort från Firebase
        await deleteAllCardsFromDatabase();
    }
});

// Dag-kolumnerna behöver ingen click-handler längre
// Användaren väljer dagar direkt i sidebaren istället

// Drag and drop för att flytta kort mellan dagar
const cardsContainers = document.querySelectorAll('.cards-container');

cardsContainers.forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            container.appendChild(draggingCard);
        }
    });

    container.addEventListener('drop', async (e) => {
        e.preventDefault();

        // Hitta vilket dag kortet flyttades till
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            const newDay = container.id.replace('cards-', '');
            const cardId = draggingCard.dataset.cardId;

            // Uppdatera i Firebase
            if (cardId && newDay) {
                await updateCardDay(cardId, newDay);
            }
        }
    });
});
