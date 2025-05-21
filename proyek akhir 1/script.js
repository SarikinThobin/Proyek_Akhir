// Data untuk kuis dan game
const quizData = [
    {
        question: "Apa arti kata 'manyukup' dalam Bahasa Indonesia?",
        options: ["Makan", "Minum", "Tidur", "Jalan"],
        answer: 2
    },
    {
        question: "Kata 'guring' dalam Bahasa Banjar artinya...",
        options: ["Lapar", "Makan", "Tidur", "Marah"],
        answer: 3
    },
    {
        question: "Apa arti 'kada' dalam Bahasa Indonesia?",
        options: ["Boleh", "Tidak", "Mau", "Sudah"],
        answer: 2
    },
    {
        question: "'Bubuhan' dalam Bahasa Banjar merujuk pada...",
        options: ["Keluarga", "Teman", "Tetangga", "Semua orang"],
        answer: 1
    },
    {
        question: "Apa arti 'handak' dalam Bahasa Indonesia?",
        options: ["Mau", "Tidak mau", "Pergi", "Datang"],
        answer: 1
    }
    
];

// Data untuk game mencocokkan
const matchingPairs = [
    { indonesian: "Makan", banjar: "Mamakan" },
    { indonesian: "Minum", banjar: "Manyukup" },
    { indonesian: "Tidur", banjar: "Tidur" },
    { indonesian: "Jalan", banjar: "Jalan" },
    { indonesian: "Rumah", banjar: "Rumah" },
    { indonesian: "Air", banjar: "Banyu" }
];

// Fungsi untuk navigasi antar section
document.addEventListener('DOMContentLoaded', function() {
    // Navigasi menu
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Sembunyikan semua section
            sections.forEach(section => {
                section.classList.remove('active-section');
            });
            
            // Tampilkan section yang dipilih
            document.getElementById(targetSection).classList.add('active-section');
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Tombol explore
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            document.querySelector('.nav-link[data-section="sejarah"]').click();
        });
    }
    
    // Tombol show stories
    const showStoriesBtn = document.querySelector('.show-stories-btn');
    if (showStoriesBtn) {
        showStoriesBtn.addEventListener('click', function() {
            document.querySelector('.nav-link[data-section="cerita"]').click();
        });
    }
    
    // Cerita rakyat tabs
    const storyBtns = document.querySelectorAll('.story-btn');
    storyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const storyId = this.getAttribute('data-story');
            
            // Update active button
            storyBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Sembunyikan semua cerita
            document.querySelectorAll('.story-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Tampilkan cerita yang dipilih
            document.getElementById(storyId).classList.remove('hidden');
        });
    });
    
    // Inisialisasi game mencocokkan
    initMatchingGame();
    
    // Inisialisasi kuis
    initQuiz();
});

// Game mencocokkan kata
function initMatchingGame() {
    const words = document.querySelectorAll('.word');
    const matchesArea = document.querySelector('.matches-area');
    const resetBtn = document.querySelector('.reset-game-btn');
    let score = 0;
    let selectedWord = null;
    
    // Drag and drop functionality
    words.forEach(word => {
        word.addEventListener('dragstart', dragStart);
        word.addEventListener('dragover', dragOver);
        word.addEventListener('drop', drop);
    });
    
    // Reset game
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    function dragStart(e) {
        selectedWord = this;
        e.dataTransfer.setData('text/plain', this.dataset.word);
        setTimeout(() => this.style.opacity = '0.4', 0);
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
    function drop(e) {
        e.preventDefault();
        const draggedWord = e.dataTransfer.getData('text/plain');
        
        // Cek apakah pasangan cocok
        if (selectedWord.dataset.word === this.dataset.word) {
            // Buat elemen pasangan yang cocok
            const matchElement = document.createElement('div');
            matchElement.classList.add('match-pair');
            
            // Cari teks asli dari kata yang ditarik
            let draggedText, droppedText;
            
            if (selectedWord.parentElement.classList.contains('indonesian-words')) {
                draggedText = selectedWord.textContent;
                droppedText = this.textContent;
            } else {
                draggedText = this.textContent;
                droppedText = selectedWord.textContent;
            }
            
            matchElement.innerHTML = `
                <span class="indonesian-match">${draggedText}</span>
                <i class="fas fa-arrows-alt-h"></i>
                <span class="banjar-match">${droppedText}</span>
            `;
            
            matchesArea.appendChild(matchElement);
            
            // Hapus kata dari daftar
            selectedWord.remove();
            this.remove();
            
            // Update skor
            score++;
            document.getElementById('score').textContent = score;
            
            // Cek jika semua pasangan sudah cocok
            if (document.querySelectorAll('.word').length === 0) {
                const congrats = document.createElement('div');
                congrats.classList.add('congrats-message');
                congrats.innerHTML = `
                    <h3>Selamat!</h3>
                    <p>Kamu berhasil mencocokkan semua kata!</p>
                `;
                matchesArea.appendChild(congrats);
            }
        } else {
            // Jika tidak cocok, kembalikan ke posisi semula
            selectedWord.style.opacity = '1';
        }
    }
    
    function resetGame() {
        // Reset tampilan game
        const indonesianWords = document.querySelector('.indonesian-words');
        const banjarWords = document.querySelector('.banjar-words');
        
        // Kosongkan area matches
        matchesArea.innerHTML = '<h4>Pasangan yang Cocok</h4>';
        
        // Kembalikan semua kata ke posisi semula
        const allWords = Array.from(document.querySelectorAll('.word'));
        allWords.forEach(word => {
            word.style.opacity = '1';
            if (word.textContent === "Makan" || word.textContent === "Minum" || 
                word.textContent === "Tidur" || word.textContent === "Jalan") {
                indonesianWords.appendChild(word);
            } else {
                banjarWords.appendChild(word);
            }
        });
        
        // Reset skor
        score = 0;
        document.getElementById('score').textContent = score;
    }
}

// Kuis pilihan ganda
function initQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;
    
    const questionElement = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.quiz-options');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const feedbackElement = document.querySelector('.quiz-feedback');
    const feedbackText = document.getElementById('feedback-text');
    const nextButton = document.querySelector('.next-question-btn');
    const resultElement = document.querySelector('.quiz-result');
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');
    const restartButton = document.querySelector('.restart-quiz-btn');
    
    let currentQuestion = 0;
    let score = 0;
    let shuffledQuestions = [...quizData];
    
    // Set total questions
    totalQuestionsElement.textContent = shuffledQuestions.length;
    
    // Acak pertanyaan
    shuffleArray(shuffledQuestions);
    
    // Tampilkan pertanyaan pertama
    loadQuestion();
    
    // Fungsi untuk memuat pertanyaan
    function loadQuestion() {
        const question = shuffledQuestions[currentQuestion];
        questionElement.textContent = question.question;
        
        // Acak opsi jawaban
        const shuffledOptions = [...question.options];
        shuffleArray(shuffledOptions);
        
        // Kosongkan container opsi
        optionsContainer.innerHTML = '';
        
        // Buat tombol opsi
        shuffledOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.textContent = option;
            button.dataset.option = question.options.indexOf(option) + 1;
            button.addEventListener('click', selectOption);
            optionsContainer.appendChild(button);
        });
        
        // Update nomor pertanyaan
        currentQuestionElement.textContent = currentQuestion + 1;
        
        // Sembunyikan feedback dan hasil
        feedbackElement.classList.add('hidden');
        resultElement.classList.add('hidden');
    }
    
    // Fungsi untuk memilih opsi
    function selectOption(e) {
        const selectedButton = e.target;
        const correctAnswer = shuffledQuestions[currentQuestion].answer;
        const selectedOption = parseInt(selectedButton.dataset.option);
        
        // Nonaktifkan semua tombol
        Array.from(optionsContainer.children).forEach(button => {
            button.disabled = true;
        });
        
        // Tandai jawaban yang benar dan salah
        if (selectedOption === correctAnswer) {
            selectedButton.style.backgroundColor = '#2ecc71';
            score++;
            feedbackText.textContent = "Jawaban kamu benar!";
        } else {
            selectedButton.style.backgroundColor = '#e74c3c';
            const correctButton = Array.from(optionsContainer.children).find(
                btn => parseInt(btn.dataset.option) === correctAnswer
            );
            correctButton.style.backgroundColor = '#2ecc71';
            feedbackText.textContent = `Jawaban yang benar adalah: ${shuffledQuestions[currentQuestion].options[correctAnswer - 1]}`;
        }
        
        // Tampilkan feedback
        feedbackElement.classList.remove('hidden');
    }
    
    // Fungsi untuk pertanyaan berikutnya
    function nextQuestion() {
        currentQuestion++;
        
        if (currentQuestion < shuffledQuestions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }
    
    // Fungsi untuk menampilkan hasil
    function showResult() {
        questionElement.textContent = '';
        optionsContainer.innerHTML = '';
        feedbackElement.classList.add('hidden');
        
        resultTitle.textContent = "Hasil Kuis";
        resultText.textContent = `Kamu menjawab benar ${score} dari ${shuffledQuestions.length} pertanyaan!`;
        
        resultElement.classList.remove('hidden');
    }
    
    // Fungsi untuk mengulang kuis
    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        shuffleArray(shuffledQuestions);
        loadQuestion();
    }
    
    // Event listeners
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);
    
    // Fungsi untuk mengacak array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}