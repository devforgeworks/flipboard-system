// Firestore Database Functions

// Spara ett kort till databasen
async function saveCardToDatabase(cardData) {
    if (!currentUser) return null;

    try {
        const docRef = await db.collection('users')
            .doc(currentUser.uid)
            .collection('cards')
            .add({
                ...cardData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        return docRef;
    } catch (error) {
        console.error('Error saving card:', error);
        alert('Kunde inte spara kortet: ' + error.message);
        return null;
    }
}

// Ladda alla kort från databasen
async function loadUserCards() {
    if (!currentUser) return;

    try {
        const snapshot = await db.collection('users')
            .doc(currentUser.uid)
            .collection('cards')
            .orderBy('createdAt', 'asc')
            .get();

        // Rensa befintliga kort först
        clearAllCards();

        // Skapa kort från databasen
        snapshot.forEach((doc) => {
            const cardData = doc.data();
            createCardFromDatabase(doc.id, cardData);
        });
    } catch (error) {
        console.error('Error loading cards:', error);
        alert('Kunde inte ladda kort: ' + error.message);
    }
}

// Skapa kort från databasdata
function createCardFromDatabase(cardId, cardData) {
    const card = document.createElement('div');
    card.className = 'card';
    if (cardData.status === 'green') {
        card.classList.add('flipped');
    }
    card.draggable = true;
    card.dataset.status = cardData.status;
    card.dataset.description = cardData.description;
    card.dataset.cardId = cardId; // Spara database ID

    card.innerHTML = `
        <div class="card-flipper">
            <div class="card-front">
                <div class="card-tab">${cardData.activityName}</div>
                <div class="card-body">
                    <button class="flip-btn" title="Markera som klar">✓</button>
                </div>
            </div>
            <div class="card-back">
                <div class="card-tab">${cardData.activityName}</div>
                <div class="card-body">
                    <button class="flip-btn" title="Markera som klar">✓</button>
                </div>
            </div>
        </div>
    `;

    // Event listeners
    card.addEventListener('click', (e) => {
        // Förhindra modal om man klickar på flip-knappen
        if (e.target.closest('.flip-btn')) {
            return;
        }
        openModal(card, cardData.activityName, cardData.description);
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
            if (cardId) {
                await updateCardStatus(cardId, newStatus);
            }
        });
    });

    card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    // Lägg till i rätt dag
    const container = document.getElementById(`cards-${cardData.day}`);
    if (container) {
        container.appendChild(card);

        // Justera font-storlek baserat på textlängd
        adjustCardTabFontSize(card);
    }
}

// Uppdatera kortets status i databasen
async function updateCardStatus(cardId, newStatus) {
    if (!currentUser || !cardId) return;

    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('cards')
            .doc(cardId)
            .update({
                status: newStatus,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('Error updating card status:', error);
    }
}

// Radera kort från databasen
async function deleteCardFromDatabase(cardId) {
    if (!currentUser || !cardId) return;

    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('cards')
            .doc(cardId)
            .delete();
    } catch (error) {
        console.error('Error deleting card:', error);
        alert('Kunde inte radera kortet: ' + error.message);
    }
}

// Uppdatera kortets dag när det flyttas
async function updateCardDay(cardId, newDay) {
    if (!currentUser || !cardId) return;

    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('cards')
            .doc(cardId)
            .update({
                day: newDay,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('Error updating card day:', error);
    }
}

// Återställ alla kort till röd status
async function resetAllCardsInDatabase() {
    if (!currentUser) return;

    try {
        const snapshot = await db.collection('users')
            .doc(currentUser.uid)
            .collection('cards')
            .get();

        const batch = db.batch();

        snapshot.forEach((doc) => {
            batch.update(doc.ref, {
                status: 'red',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });

        await batch.commit();
    } catch (error) {
        console.error('Error resetting cards:', error);
        alert('Kunde inte återställa korten: ' + error.message);
    }
}

// Ta bort alla kort från databasen
async function deleteAllCardsFromDatabase() {
    if (!currentUser) return;

    try {
        const snapshot = await db.collection('users')
            .doc(currentUser.uid)
            .collection('cards')
            .get();

        const batch = db.batch();

        snapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
    } catch (error) {
        console.error('Error deleting all cards:', error);
        alert('Kunde inte radera alla kort: ' + error.message);
    }
}
