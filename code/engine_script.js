
// loading smpledata
let mockData = {};

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM fully loaded. Initializing scripts...');

    try {
        const response = await fetch('smplData.json');
        mockData = await response.json();
        console.log('JSON data loaded:', mockData);

        populateDropdowns();
        setupEventListeners();
        initializeModeToggle();
    } catch (error) {
        console.error('Error loading mockData.json:', error);
    }
});

// document.addEventListener('DOMContentLoaded', function() {
//     console.log('DOM fully loaded. Initializing scripts...');
    
//     // Call initialization functions
//     populateDropdowns();
//     setupEventListeners();
//     initializeModeToggle();
    
//     console.log('All interactive features initialized.');
// });

// Function to populate dropdowns from mock data
function populateDropdowns() {
    const educationSelect = document.getElementById('education');
    const internshipTypeSelect = document.getElementById('internship-type');
    const durationSelect = document.getElementById('internship-duration');
    const languageSelector = document.getElementById('language-selector');

    mockData.education.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        educationSelect.appendChild(option);
    });

    mockData.internship_types.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        internshipTypeSelect.appendChild(option);
    });

    mockData.durations.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        durationSelect.appendChild(option);
    });

    // Populate language selector with a placeholder and a list of languages
    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Translate the page into:";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    languageSelector.appendChild(placeholderOption);

    const languages = Object.keys(mockData.translations);
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = mockData.translations[lang].languageName;
        languageSelector.appendChild(option);
    });

    console.log('Dropdowns populated with mock data.');
}

// Function to set up all event listeners
function setupEventListeners() {
    const form = document.getElementById('user-input-form');
    const searchInput = document.getElementById('search-input');
    const exploreBtn = document.getElementById('explore-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const faqBtn = document.getElementById('faq-queries-btn');
    const faqBtnMobile = document.getElementById('faq-queries-btn-mobile');
    const backBtn = document.getElementById('back-to-home');
    const languageSelector = document.getElementById('language-selector');
    const feedbackForm = document.getElementById('feedback-form');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    form.addEventListener('submit', handleExploreInternships);
    searchInput.addEventListener('input', handleSearch);
    saveProfileBtn.addEventListener('click', handleSaveProfile);
    backBtn.addEventListener('click', showMainPage);
    languageSelector.addEventListener('change', handleLanguageChange);
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    if (faqBtn) faqBtn.addEventListener('click', showFaqPage);
    if (faqBtnMobile) faqBtnMobile.addEventListener('click', showFaqPage);


    // Toggle mobile menu
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-times', isOpen);
            icon.classList.toggle('fa-bars', !isOpen);
        });
    }

    // Handle navigation links for mobile menu
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
}

// Handles the "Explore Internships" button click
function handleExploreInternships(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate logging data to a temporary file (logs.json)
    console.log('Data logged for session:', JSON.stringify(data, null, 2));

    // Simulate ML model logic to get top 5 internships
    const recommendedInternships = mockData.internships.sort(() => 0.5 - Math.random()).slice(0, 5);
    displayInternshipResults(recommendedInternships);
    
    // Show the results section
    document.getElementById('results-section').classList.remove('hidden');
}

// Handles the "Save Profile" button click
function handleSaveProfile() {
    console.log('Simulating redirect to login/signup page. Entered data will be saved to users.json upon successful signup.');
    // Here, you would redirect the user to a login/signup page.
    // For this demo, we'll just log the action.
}

// Handles the search input functionality with a dropdown
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const dropdown = document.getElementById('search-results-dropdown');
    const displayArea = document.getElementById('search-display-area');
    
    dropdown.innerHTML = '';
    displayArea.innerHTML = '';
    
    if (searchTerm.length > 1) {
        const filteredInternships = mockData.internships.filter(internship => 
            internship.title.toLowerCase().includes(searchTerm) ||
            internship.company.toLowerCase().includes(searchTerm) ||
            internship.skills_required.some(skill => skill.toLowerCase().includes(searchTerm))
        );

        if (filteredInternships.length > 0) {
            filteredInternships.forEach(internship => {
                const item = document.createElement('div');
                item.classList.add('search-results-item', 'hover:bg-gray-200', 'p-2');
                item.textContent = `${internship.title} at ${internship.company}`;
                item.addEventListener('click', () => {
                    displaySelectedInternship(internship);
                    dropdown.style.display = 'none';
                    event.target.value = '';
                });
                dropdown.appendChild(item);
            });
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    } else {
        dropdown.style.display = 'none';
    }
}

// Displays details for a selected internship from the search
function displaySelectedInternship(internship) {
    const displayArea = document.getElementById('search-display-area');
    displayArea.innerHTML = `
        <div class="card p-6 border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-gray-800">${internship.title}</h3>
            <p class="text-gray-600 mb-2"><strong>Company:</strong> ${internship.company}</p>
            <p class="text-gray-600 mb-2"><strong>Duration:</strong> ${internship.duration}</p>
            <p class="text-gray-600 mb-2"><strong>Stipend:</strong> ${internship.stipend}</p>
            <p class="text-gray-600 mb-2"><strong>Location:</strong> ${internship.location}</p>
            <p class="text-gray-600"><strong>Skills:</strong> ${internship.skills_required.join(', ')}</p>
        </div>
    `;
}

// Dynamically renders the internship cards
function displayInternshipResults(internships) {
    const container = document.getElementById('internship-results-container');
    container.innerHTML = '';
    internships.forEach(internship => {
        const card = document.createElement('div');
        card.classList.add('card', 'p-6');
        card.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 mb-2">${internship.title}</h3>
            <p class="text-gray-600 mb-1"><strong>Company:</strong> ${internship.company}</p>
            <p class="text-gray-600 mb-1"><strong>Duration:</strong> ${internship.duration}</p>
            <p class="text-gray-600 mb-1"><strong>Stipend:</strong> ${internship.stipend}</p>
            <p class="text-gray-600 mb-1"><strong>Location:</strong> ${internship.location}</p>
            <p class="text-gray-600 mt-2"><strong>Skills:</strong> ${internship.skills_required.join(', ')}</p>
        `;
        container.appendChild(card);
    });
}

// Language translation functionality
function handleLanguageChange(event) {
    const lang = event.target.value;
    const translations = mockData.translations[lang];
    if (translations) {
        document.getElementById('find-internship-title').textContent = translations.find_internship_title;
        document.querySelector('label[for="name"]').textContent = translations.name;
        document.querySelector('label[for="education"]').textContent = translations.education;
        document.querySelector('label[for="skills"]').textContent = translations.skills;
        document.querySelector('label[for="internship-type"]').textContent = translations.internship_type;
        document.querySelector('label[for="internship-duration"]').textContent = translations.internship_duration;
        document.getElementById('explore-btn').textContent = translations.explore_btn;
        document.getElementById('save-profile-btn').textContent = translations.save_profile_btn;
        document.getElementById('search-title').textContent = translations.search_title;
        document.getElementById('search-input').placeholder = translations.search_placeholder;
        document.getElementById('feedback-title').textContent = translations.feedback_title;
        document.getElementById('feedback-message').placeholder = translations.feedback_placeholder;
        document.getElementById('submit-feedback-btn').textContent = translations.submit_feedback_btn;
        document.getElementById('faq-title').textContent = translations.faq_title;
        document.getElementById('back-to-home').textContent = translations.back_to_home;
        document.getElementById('toggle-label-simple').textContent = translations.simple_mode;
        document.getElementById('toggle-label-advanced').textContent = translations.advanced_mode;
        document.getElementById('faq-queries-btn').textContent = translations.faq_queries;
        document.getElementById('faq-queries-btn-mobile').textContent = translations.faq_queries;

        // Update the language selector placeholder
        document.querySelector('#language-selector option[value=""]').textContent = translations.language_placeholder_text;
    }
}

// Simulates submitting feedback to a JSON file
function handleFeedbackSubmit(event) {
    event.preventDefault();
    const message = document.getElementById('feedback-message').value;
    if (message.trim() !== '') {
        const feedbackData = {
            userId: 'mock-user-123',
            message: message,
            timestamp: new Date().toISOString()
        };
        console.log('Feedback submitted:', JSON.stringify(feedbackData, null, 2));
        // Clear the form
        document.getElementById('feedback-message').value = '';
        // Show a simple success message
        showTemporaryMessage('Thank you for your feedback!');
    }
}

// Toggles between simple and advanced modes
function initializeModeToggle() {
    const toggle = document.getElementById('mode-toggle');
    const formSection = document.getElementById('user-input-form-section');
    const feedbackSection = document.getElementById('feedback-section');
    
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            // Simple Mode
            formSection.classList.add('hidden');
            feedbackSection.classList.add('hidden');
            document.getElementById('toggle-label-simple').classList.add('text-gray-700');
            document.getElementById('toggle-label-simple').classList.remove('text-gray-400');
            document.getElementById('toggle-label-advanced').classList.add('text-gray-400');
            document.getElementById('toggle-label-advanced').classList.remove('text-gray-700');
            showTemporaryMessage('Switched to Simple Mode');
        } else {
            // Advanced Mode
            formSection.classList.remove('hidden');
            feedbackSection.classList.remove('hidden');
            document.getElementById('toggle-label-simple').classList.add('text-gray-400');
            document.getElementById('toggle-label-simple').classList.remove('text-gray-700');
            document.getElementById('toggle-label-advanced').classList.add('text-gray-700');
            document.getElementById('toggle-label-advanced').classList.remove('text-gray-400');
            showTemporaryMessage('Switched to Advanced Mode');
        }
    });
}

// Simple message box to replace alert()
function showTemporaryMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.textContent = message;
    messageBox.classList.add('fixed', 'bottom-16', 'right-4', 'bg-gray-800', 'text-white', 'p-4', 'rounded-lg', 'shadow-lg', 'z-50', 'transition-all', 'duration-500', 'transform', 'translate-y-full', 'opacity-0');
    document.body.appendChild(messageBox);
    
    setTimeout(() => {
        messageBox.classList.remove('translate-y-full', 'opacity-0');
        messageBox.classList.add('translate-y-0', 'opacity-100');
    }, 100);

    setTimeout(() => {
        messageBox.classList.remove('translate-y-0', 'opacity-100');
        messageBox.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => messageBox.remove(), 500);
    }, 3000);
}

// Function to show the FAQ page and hide the main content
function showFaqPage() {
    // Hide all main content sections
    document.getElementById('user-input-form-section').classList.add('hidden');
    document.getElementById('search-section').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
    document.getElementById('feedback-section').classList.add('hidden');

    // Show FAQ page
    document.getElementById('faq-page').classList.remove('hidden');
    
    // Populate FAQ content
    const faqContent = document.getElementById('faq-content');
    faqContent.innerHTML = '';
    mockData.faq.content.forEach(item => {
        if (item.type === 'text') {
            const p = document.createElement('p');
            p.classList.add('mb-4', 'text-gray-700');
            p.textContent = item.text;
            faqContent.appendChild(p);
        } else if (item.type === 'qa') {
            const div = document.createElement('div');
            div.classList.add('mb-4');
            div.innerHTML = `<h3 class="font-bold text-lg text-gray-800">${item.question}</h3><p class="text-gray-600">${item.answer}</p>`;
            faqContent.appendChild(div);
        } else if (item.type === 'video') {
            const iframe = document.createElement('iframe');
            iframe.src = item.url;
            iframe.classList.add('w-full', 'aspect-video', 'rounded-lg', 'mt-4');
            iframe.title = "FAQ Video";
            iframe.setAttribute("allowfullscreen", "");
            faqContent.appendChild(iframe);
        }
    });
    console.log('FAQ page shown');
}

// Function to show the main page and hide the FAQ page
function showMainPage() {
    // Hide FAQ page
    document.getElementById('faq-page').classList.add('hidden');
    
    // Show all main content sections
    document.getElementById('user-input-form-section').classList.remove('hidden');
    document.getElementById('search-section').classList.remove('hidden');
    // results and feedback are hidden by default and shown by other logic
    document.getElementById('feedback-section').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
    
    // Reset the mode toggle to Advanced mode
    const modeToggle = document.getElementById('mode-toggle');
    modeToggle.checked = false;
    modeToggle.dispatchEvent(new Event('change'));

    console.log('Main page shown');
}
