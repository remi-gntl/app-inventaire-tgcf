let currentUser = "";
let currentScan = "";
let scansBuffer = []; 

const qtyModal = new bootstrap.Modal(document.getElementById('modalQty'));
const inputUser = document.getElementById('input-user');
const inputScan = document.getElementById('input-scan');
const inputQty = document.getElementById('input-qty');
const scanList = document.getElementById('scan-list');
const emptyState = document.getElementById('empty-state');

// THEME
const storedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-bs-theme', storedTheme);
updateThemeIcon(storedTheme);

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-btn');
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// LOGIN
inputUser.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let val = this.value.trim().toUpperCase();
        if (val.startsWith('U') && val.length > 1) {
            loginSuccess(val);
            this.value = '';
        } else {
            document.getElementById('login-error').classList.remove('hidden');
            this.value = '';
        }
    }
});

function loginSuccess(user) {
    currentUser = user;
    document.getElementById('nav-username').innerText = currentUser;
    
    document.getElementById('nav-user-badge').classList.remove('hidden');
    document.getElementById('btn-logout').classList.remove('hidden');
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('screen-inventory').classList.remove('hidden');
    document.getElementById('login-error').classList.add('hidden');

    setTimeout(() => inputScan.focus(), 200);
}

// INVENTAIRE
inputScan.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let val = this.value.trim();
        if (val !== "") {
            currentScan = val;
            this.value = ''; 
            openQtyModal();
        }
    }
});

function openQtyModal() {
    document.getElementById('modal-code-display').innerText = currentScan;
    inputQty.value = "1"; 
    qtyModal.show();
    setTimeout(() => inputQty.focus(), 400); 
}

function adjustQty(delta) {
    let val = parseInt(inputQty.value) || 0;
    val += delta;
    if(val < 1) val = 1;
    inputQty.value = val;
    inputQty.focus();
}

inputQty.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') confirmQty();
});

function confirmQty() {
    let qty = parseInt(inputQty.value);
    if (isNaN(qty) || qty < 1) return; 

    scansBuffer.unshift({ code: currentScan, qty: qty });
    updateTable();
    qtyModal.hide();
    setTimeout(() => inputScan.focus(), 200);
}

function cancelQty() {
    qtyModal.hide();
    setTimeout(() => inputScan.focus(), 200);
}

function updateTable() {
    scanList.innerHTML = '';
    
    if(scansBuffer.length > 0) {
        emptyState.classList.add('hidden');
    } else {
        emptyState.classList.remove('hidden');
    }

    scansBuffer.forEach((item, index) => {
        let row = `<tr>
            <td class="product-code">${item.code}</td>
            <td class="text-center product-qty">${item.qty}</td>
            <td class="text-center">
                <button class="remove-btn" onclick="removeScan(${index})">×</button>
            </td>
        </tr>`;
        scanList.innerHTML += row;
    });
    
    document.getElementById('count-total').innerText = scansBuffer.length;
}

function removeScan(index) {
    Swal.fire({
        title: 'Retirer ce produit ?',
        text: scansBuffer[index].code,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e93a35',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Oui, retirer',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            scansBuffer.splice(index, 1);
            updateTable();
            inputScan.focus();
        }
    });
}

function logoutConfirm() {
    if(scansBuffer.length > 0) {
        Swal.fire({
            title: 'Attention',
            text: "Vous avez des scans non enregistrés. Quitter effacera tout.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e93a35',
            confirmButtonText: 'Quitter sans sauvegarder'
        }).then((result) => {
            if (result.isConfirmed) resetApp();
        });
    } else {
        resetApp();
    }
}

function finishInventory() {
    if (scansBuffer.length === 0) {
        Swal.fire({ 
            icon: 'info', 
            title: 'Liste vide', 
            text: 'Scannez des produits avant de valider.', 
            confirmButtonColor: '#e93a35' 
        });
        return;
    }

    Swal.fire({
        title: 'Confirmer l\'envoi ?',
        text: `${scansBuffer.length} références prêtes à être enregistrées.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#e93a35',
        confirmButtonText: 'Envoyer maintenant',
        cancelButtonText: 'Attendre'
    }).then((result) => {
        if (result.isConfirmed) {
            sendData();
        }
    });
}

function sendData() {
    Swal.fire({
        title: 'Envoi en cours...',
        didOpen: () => { Swal.showLoading() }
    });

    fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, scans: scansBuffer })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Parfait !',
                text: 'Inventaire enregistré.',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                resetApp();
            });
        } else {
            Swal.fire({ 
                icon: 'error', 
                title: 'Oups...', 
                text: data.message 
            });
        }
    })
    .catch(err => {
        Swal.fire({ 
            icon: 'error', 
            title: 'Erreur réseau', 
            text: err 
        });
    });
}

function resetApp() {
    currentUser = "";
    currentScan = "";
    scansBuffer = [];
    updateTable();
    
    document.getElementById('nav-user-badge').classList.add('hidden');
    document.getElementById('btn-logout').classList.add('hidden');
    document.getElementById('screen-inventory').classList.add('hidden');
    document.getElementById('screen-login').classList.remove('hidden');
    inputUser.value = "";
    inputUser.focus();
}