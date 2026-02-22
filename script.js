
window.showView = function(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + viewId).classList.add('active');
};


window.handleLogin = function() {
    document.getElementById('guest-nav').style.display = 'none';
    document.getElementById('user-nav').style.display = 'block';
    showView('profile');
};

window.handleRegister = function() {
    const email = document.getElementById('reg-email').value;
    if(!email) return alert("Please enter an email");
    document.getElementById('display-reg-email').innerText = email;
    showView('verify-email');
};

window.simulateVerify = function() {
    alert("Email Verified Successfully!");
    showView('login');
};

window.handleLogout = function() {
    location.reload();
};


window.toggleForm = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = (el.style.display === 'none') ? 'block' : 'none';
    }
};


window.openModal = function() { 
    document.getElementById('request-modal').style.display = 'block'; 
};

window.closeModal = function() { 
    document.getElementById('request-modal').style.display = 'none'; 
};


window.addRequestRow = function() {
    const container = document.getElementById('modal-items');
    const div = document.createElement('div');
    div.className = 'item-row';
    div.style.marginTop = "10px";
    
    div.innerHTML = `
        <input type="text" placeholder="Item name">
        <input type="number" value="1" style="width: 60px;">
        <button onclick="this.parentElement.remove()" style="border: 1px solid #dc3545; color: #dc3545; background: none; border-radius: 4px; padding: 2px 8px; cursor: pointer;">×</button>
    `;
    container.appendChild(div);
};