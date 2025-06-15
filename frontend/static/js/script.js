// DOM Elements
const appContainer = document.getElementById('app-container');
const generatedPassword = document.getElementById('generated-password');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

const settings = {
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    numbers: document.getElementById('numbers'),
    symbols: document.getElementById('symbols')
};

let passwordHistory = [];
let currentPasswordIndex = -1;

const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const SAVED_PASSWORDS_KEY = 'saved_passwords';

document.addEventListener('DOMContentLoaded', () => {
    // Length slider event
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });
    // Add keyboard event listener for password input
    generatedPassword.addEventListener('input', handlePasswordInput);
    generatedPassword.addEventListener('keydown', handlePasswordKeydown);
    showApp();
});

function showApp() {
    appContainer.classList.remove('hidden');
    // Optionally, display a placeholder username or nothing
    document.getElementById('display-username').textContent = '';
}

function handlePasswordInput(e) {
    const password = e.target.value;
    if (password) {
        addToPasswordHistory(password);
        checkPasswordStrength(password);
    }
}

function handlePasswordKeydown(e) {
    const allowedKeys = [8, 9, 13, 27, 46, 37, 38, 39, 40];
    if (allowedKeys.includes(e.keyCode)) return true;
    if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(e.keyCode)) return true;
    if (e.keyCode >= 35 && e.keyCode <= 39) return true;
    const char = String.fromCharCode(e.keyCode);
    if (/[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(char)) return true;
    e.preventDefault();
    return false;
}

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let password = '';
    if (settings.uppercase.checked) password += charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)];
    if (settings.lowercase.checked) password += charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)];
    if (settings.numbers.checked) password += charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)];
    if (settings.symbols.checked) password += charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
    if (password === '') {
        alert('Please select at least one character type!');
        return;
    }
    const allChars = charSets.uppercase + charSets.lowercase + charSets.numbers + charSets.symbols;
    while (password.length < length) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    addToPasswordHistory(password);
    generatedPassword.value = password;
    checkPasswordStrength(password);
}

function addToPasswordHistory(password) {
    passwordHistory = passwordHistory.slice(0, currentPasswordIndex + 1);
    passwordHistory.push(password);
    currentPasswordIndex = passwordHistory.length - 1;
    updateUndoButton();
}

function undoPassword() {
    if (currentPasswordIndex > 0) {
        currentPasswordIndex--;
        const previousPassword = passwordHistory[currentPasswordIndex];
        generatedPassword.value = previousPassword;
        checkPasswordStrength(previousPassword);
        updateUndoButton();
    }
}

function redoPassword() {
    if (currentPasswordIndex < passwordHistory.length - 1) {
        currentPasswordIndex++;
        const nextPassword = passwordHistory[currentPasswordIndex];
        generatedPassword.value = nextPassword;
        checkPasswordStrength(nextPassword);
        updateUndoButton();
    }
}

function updateUndoButton() {
    const undoButton = document.getElementById('undo-btn');
    const redoButton = document.getElementById('redo-btn');
    if (undoButton && redoButton) {
        undoButton.disabled = currentPasswordIndex <= 0;
        redoButton.disabled = currentPasswordIndex >= passwordHistory.length - 1;
        undoButton.style.opacity = undoButton.disabled ? '0.5' : '1';
        redoButton.style.opacity = redoButton.disabled ? '0.5' : '1';
    }
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    const strengthPercent = (strength / 6) * 100;
    strengthBar.style.width = `${strengthPercent}%`;
    if (strength <= 2) {
        strengthBar.style.backgroundColor = '#ff4d4d';
        strengthText.textContent = 'Password Strength: Weak';
    } else if (strength <= 4) {
        strengthBar.style.backgroundColor = '#ffa500';
        strengthText.textContent = 'Password Strength: Medium';
    } else {
        strengthBar.style.backgroundColor = '#28a745';
        strengthText.textContent = 'Password Strength: Strong';
    }
}

function copyPassword() {
    if (generatedPassword.value) {
        generatedPassword.select();
        document.execCommand('copy');
        alert('Password copied to clipboard!');
    }
}

async function savePassword() {
    const password = generatedPassword.value;
    if (!password) {
        alert('Please generate or enter a password first!');
        return;
    }
    const title = prompt('Enter a title for this password (e.g., "Gmail", "Facebook")');
    if (!title) return;
    const savedPasswords = JSON.parse(localStorage.getItem(SAVED_PASSWORDS_KEY) || '{}');
    if (!savedPasswords['default']) {
        savedPasswords['default'] = [];
    }
    savedPasswords['default'].push({
        id: Date.now().toString(),
        title: title,
        password: password,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem(SAVED_PASSWORDS_KEY, JSON.stringify(savedPasswords));
    alert('Password saved successfully!');
}

async function showSavedPasswords() {
    const savedPasswords = JSON.parse(localStorage.getItem(SAVED_PASSWORDS_KEY) || '{}');
    const userPasswords = savedPasswords['default'] || [];
    const modal = document.getElementById('saved-passwords-modal');
    const listContainer = document.getElementById('saved-passwords-list');
    if (userPasswords.length === 0) {
        listContainer.innerHTML = '<p>No saved passwords yet.</p>';
    } else {
        listContainer.innerHTML = userPasswords.map(pwd => `
            <div class="saved-password-item">
                <div class="password-info">
                    <h4>${pwd.title}</h4>
                    <p>Created: ${new Date(pwd.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="password-actions">
                    <button onclick="showPassword('${pwd.id}')" class="show-btn">
                        <i class="fas fa-eye"></i> Show
                    </button>
                    <button onclick="editPassword('${pwd.id}')" class="edit-btn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="copySavedPassword('${pwd.id}')" class="copy-btn">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button onclick="deleteSavedPassword('${pwd.id}')" class="delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
    modal.classList.remove('hidden');
}

function showPassword(passwordId) {
    const savedPasswords = JSON.parse(localStorage.getItem(SAVED_PASSWORDS_KEY) || '{}');
    const userPasswords = savedPasswords['default'] || [];
    const password = userPasswords.find(p => p.id === passwordId);
    if (password) {
        alert(`Password for ${password.title}: ${password.password}`);
    }
}

function copySavedPassword(passwordId) {
    const savedPasswords = JSON.parse(localStorage.getItem(SAVED_PASSWORDS_KEY) || '{}');
    const userPasswords = savedPasswords['default'] || [];
    const password = userPasswords.find(p => p.id === passwordId);
    if (password) {
        navigator.clipboard.writeText(password.password)
            .then(() => alert('Password copied to clipboard!'))
            .catch(err => alert('Failed to copy password: ' + err));
    }
}

function deleteSavedPassword(passwordId) {
    if (!confirm('Are you sure you want to delete this password?')) return;
    const savedPasswords = JSON.parse(localStorage.getItem(SAVED_PASSWORDS_KEY) || '{}');
    if (savedPasswords['default']) {
        savedPasswords['default'] = savedPasswords['default'].filter(p => p.id !== passwordId);
        localStorage.setItem(SAVED_PASSWORDS_KEY, JSON.stringify(savedPasswords));
        showSavedPasswords();
    }
}

function editPassword(passwordId) {
    const savedPasswords = JSON.parse(localStorage.getItem(SAVED_PASSWORDS_KEY) || '{}');
    const userPasswords = savedPasswords['default'] || [];
    const password = userPasswords.find(p => p.id === passwordId);
    if (!password) return;
    const newTitle = prompt('Enter new title:', password.title);
    if (!newTitle) return;
    const newPassword = prompt('Enter new password:', password.password);
    if (!newPassword) return;
    const updatedPasswords = userPasswords.map(p => {
        if (p.id === passwordId) {
            return {
                ...p,
                title: newTitle,
                password: newPassword,
                updatedAt: new Date().toISOString()
            };
        }
        return p;
    });
    savedPasswords['default'] = updatedPasswords;
    localStorage.setItem(SAVED_PASSWORDS_KEY, JSON.stringify(savedPasswords));
    showSavedPasswords();
    alert('Password updated successfully!');
}

function showContact() {
    document.getElementById('contact-modal').classList.remove('hidden');
}

function showHelp() {
    document.getElementById('help-modal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
} 