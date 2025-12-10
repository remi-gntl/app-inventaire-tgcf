// --- VARIABLES ---
let currentUser = "";
let currentScan = "";
let historyLog = []; 

const qtyModal = new bootstrap.Modal(document.getElementById('modalQty'));

const inputUser = document.getElementById('input-user');
const inputScan = document.getElementById('input-scan');
const inputQty = document.getElementById('input-qty');
const scanList = document.getElementById('scan-list');
const emptyState = document.getElementById('empty-state');
const toast = document.getElementById('custom-toast');

// Modales personnalisées
const logoutModal = document.getElementById('modal-logout');
const logoutBackdrop = document.getElementById('modal-logout-backdrop');

// --- THEME ---
// Stockage en variable JS au lieu de localStorage pour compatibilité
let currentTheme = 'light';
try {
    const stored = localStorage.getItem('theme');
    if (stored) currentTheme = stored;
} catch(e) {
    // localStorage non supporté, on garde 'light'
}

document.documentElement.setAttribute('data-bs-theme', currentTheme);
updateThemeIcon(currentTheme);

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    currentTheme = newTheme;
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    try {
        localStorage.setItem('theme', newTheme);
    } catch(e) {
        // Pas grave si localStorage ne fonctionne pas
    }
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-btn');
    if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// --- LOGIN ---
inputUser.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') triggerLogin();
});

function triggerLogin() {
    let val = inputUser.value.trim().toUpperCase();
    if (val.startsWith('U') && val.length > 1) {
        loginSuccess(val);
        inputUser.value = '';
    } else {
        document.getElementById('login-error').classList.remove('hidden');
        inputUser.value = '';
        inputUser.focus();
    }
}

function loginSuccess(user) {
    currentUser = user;
    document.getElementById('nav-username').innerText = currentUser;
    
    document.getElementById('nav-user-badge').classList.remove('hidden');
    document.getElementById('btn-logout').classList.remove('hidden');
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('screen-inventory').classList.remove('hidden');
    document.getElementById('login-error').classList.add('hidden');

    setTimeout(function() {
        inputScan.focus();
    }, 200);
}

// --- INVENTAIRE ---
// Gestion Touche Entrée
inputScan.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') triggerScan();
});

function triggerScan() {
    let val = inputScan.value.trim();
    if (val !== "") {
        currentScan = val;
        inputScan.value = ''; 
        openQtyModal();
    }
}

function openQtyModal() {
    document.getElementById('modal-code-display').innerText = currentScan;
    inputQty.value = "1"; 
    qtyModal.show();
    setTimeout(function() {
        inputQty.focus();
        inputQty.select();
    }, 400); 
}

function adjustQty(delta) {
    let val = parseInt(inputQty.value) || 0;
    val += delta;
    if(val < 1) val = 1;
    inputQty.value = val;
    inputQty.focus();
}

inputQty.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') confirmAndSend();
});

// --- ENVOI DIRECT ---
function confirmAndSend() {
    let qty = parseInt(inputQty.value);
    if (isNaN(qty) || qty < 1) return; 

    qtyModal.hide();

    const dataToSend = {
        user: currentUser,
        scans: [
            { code: currentScan, qty: qty }
        ]
    };

    // Appel API
    fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.status === 'success') {
            addToHistory(currentScan, qty);
            showToastSuccess();
        } else {
            alert("❌ Erreur enregistrement : " + data.message);
        }
    })
    .catch(function(err) {
        alert("❌ Erreur réseau : " + err);
    })
    .finally(function() {
        // Reset pour le prochain scan
        currentScan = "";
        setTimeout(function() {
            inputScan.value = "";
            inputScan.focus();
        }, 200);
    });
}

function cancelQty() {
    inputQty.value = "1";
    currentScan = ""; 
    qtyModal.hide();
    setTimeout(function() {
        inputScan.value = ""; 
        inputScan.focus();
    }, 200);
}

// --- GESTION HISTORIQUE VISUEL ---
function addToHistory(code, qty) {
    historyLog.unshift({ code: code, qty: qty });
    
    // On garde que les 50 derniers pour pas surcharger le DOM
    if (historyLog.length > 50) historyLog.pop();

    renderTable();
}

function renderTable() {
    scanList.innerHTML = '';
    
    if(historyLog.length > 0) {
        emptyState.classList.add('hidden');
    } else {
        emptyState.classList.remove('hidden');
    }

    historyLog.forEach(function(item) {
        let row = '<tr>' +
            '<td class="product-code text-break">' + item.code + '</td>' +
            '<td class="text-end product-qty">' + item.qty + '</td>' +
            '</tr>';
        scanList.innerHTML += row;
    });
    
    document.getElementById('count-total').innerText = historyLog.length;
}

// --- TOAST ---
function showToastSuccess() {
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 2000);
}

// --- MODALE DECONNEXION ---
function showLogoutModal() {
    logoutBackdrop.classList.add('show');
    logoutModal.classList.add('show');
}

function hideLogoutModal() {
    logoutBackdrop.classList.remove('show');
    logoutModal.classList.remove('show');
}

function confirmLogout() {
    hideLogoutModal();
    resetApp();
}

// --- LOGOUT ---
function resetApp() {
    currentUser = "";
    currentScan = "";
    historyLog = [];
    renderTable();
    
    document.getElementById('nav-user-badge').classList.add('hidden');
    document.getElementById('btn-logout').classList.add('hidden');
    document.getElementById('screen-inventory').classList.add('hidden');
    document.getElementById('screen-login').classList.remove('hidden');
    inputUser.value = "";
    inputUser.focus();
}