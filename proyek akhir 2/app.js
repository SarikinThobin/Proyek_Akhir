// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Load history content from Firebase
document.addEventListener('DOMContentLoaded', function() {
    // Load history
    const historyRef = database.ref('history');
    historyRef.on('value', (snapshot) => {
        const historyData = snapshot.val();
        document.getElementById('history-content').innerHTML = `
            <p>${historyData.content}</p>
            <h3>Asal Usul</h3>
            <p>${historyData.origin}</p>
            <h3>Pengaruh Bahasa Lain</h3>
            <p>${historyData.influences}</p>
        `;
    });

    // Load vocabulary from JSON
    fetch('data/vocabulary.json')
        .then(response => response.json())
        .then(data => {
            const vocabularyList = document.getElementById('vocabulary-list');
            vocabularyList.innerHTML = data.map(item => `
                <div class="vocabulary-card">
                    <h3>${item.banjar}</h3>
                    <p><strong>Indonesia:</strong> ${item.indonesia}</p>
                    ${item.example ? `<p><strong>Contoh:</strong> ${item.example}</p>` : ''}
                </div>
            `).join('');
        });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        const contactsRef = database.ref('contacts');
        contactsRef.push({
            name: name,
            email: email,
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        alert('Pesan Anda telah terkirim. Terima kasih!');
        contactForm.reset();
    });
});