const DB_NAME = 'fullstack_app_final_v6';
let currentUser = null;

function init() {
    let data = JSON.parse(localStorage.getItem(DB_NAME)) || { 
        accounts: [{ fname: 'Admin', lname: 'User', email: 'admin@example.com', pass: 'Admin123.', role: 'Admin', verified: true }], 
        departments: [{ name: 'Engineering', desc: 'Software team' }, { name: 'HR', desc: 'Human Resources' }], 
        employees: [], 
        requests: [] 
    };
    window.db = data;
    saveDB();
    renderAll();
}

function saveDB() { localStorage.setItem(DB_NAME, JSON.stringify(window.db)); }

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('reg-email').value;
    window.db.accounts.push({
        fname: document.getElementById('reg-fname').value,
        lname: document.getElementById('reg-lname').value,
        email: email,
        pass: document.getElementById('reg-pass').value,
        role: 'User', verified: false
    });
    saveDB();
    document.getElementById('display-verify-email').innerText = email;
    window.location.hash = '#/verify';
}

function simulateVerification() {
    alert("Email verified!");
    const lastAcc = window.db.accounts[window.db.accounts.length - 1];
    if(lastAcc) lastAcc.verified = true;
    saveDB();
    const btn = document.getElementById('btn-go-login');
    btn.classList.replace('btn-outline-secondary', 'btn-primary');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('log-email').value;
    const pass = document.getElementById('log-pass').value;
    const user = window.db.accounts.find(u => u.email === email && u.pass === pass);
    if (user) {
        currentUser = user;
        document.body.classList.replace('not-authenticated', 'authenticated');
        document.getElementById('userDrop').innerText = user.fname;
        if (user.role === 'Admin') document.body.classList.add('is-admin');
        window.location.hash = '#/profile';
        renderAll();
    } else { alert("Invalid credentials."); }
}

function logout() { location.href = '#/'; location.reload(); }

// --- Profile Edit Functions ---
function toggleProfileEdit(isEditing) {
    const display = document.getElementById('profile-display');
    const form = document.getElementById('profile-edit-form');
    if (isEditing) {
        display.classList.add('d-none');
        form.classList.remove('d-none');
        document.getElementById('edit-fname').value = currentUser.fname;
        document.getElementById('edit-lname').value = currentUser.lname;
    } else {
        display.classList.remove('d-none');
        form.classList.add('d-none');
    }
}

function updateProfile(e) {
    e.preventDefault();
    const newFname = document.getElementById('edit-fname').value;
    const newLname = document.getElementById('edit-lname').value;
    
    currentUser.fname = newFname;
    currentUser.lname = newLname;
    
    const accIndex = window.db.accounts.findIndex(a => a.email === currentUser.email);
    if (accIndex !== -1) {
        window.db.accounts[accIndex].fname = newFname;
        window.db.accounts[accIndex].lname = newLname;
        saveDB();
    }
    
    document.getElementById('userDrop').innerText = newFname;
    document.getElementById('p-name').innerText = newFname + " " + newLname;
    alert("Profile updated!");
    toggleProfileEdit(false);
}
// ------------------------------

function addRequestRow() {
    const container = document.getElementById('item-rows');
    const div = document.createElement('div');
    div.className = 'd-flex gap-2 mb-2';
    div.innerHTML = `
        <input type="text" class="form-control form-control-sm" placeholder="Item name" required>
        <input type="number" class="form-control form-control-sm" value="1" style="width: 55px;">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(div);
}

function handleRequestSubmit(e) {
    e.preventDefault();
    alert("Request Submitted!");
    const modal = bootstrap.Modal.getInstance(document.getElementById('newRequestModal'));
    modal.hide();
}

function saveData(e, type) {
    e.preventDefault();
    const index = document.getElementById(type === 'employees' ? 'emp-index' : type === 'departments' ? 'dept-index' : 'acc-index').value;
    let obj = {};

    if (type === 'employees') {
        obj = { id: document.getElementById('emp-id').value, email: document.getElementById('emp-email').value, pos: document.getElementById('emp-pos').value, dept: document.getElementById('emp-dept').value, date: document.getElementById('emp-date').value };
    } else if (type === 'departments') {
        obj = { name: document.getElementById('dept-name').value, desc: document.getElementById('dept-desc').value };
    } else if (type === 'accounts') {
        obj = { fname: document.getElementById('acc-fname').value, lname: document.getElementById('acc-lname').value, email: document.getElementById('acc-email').value, pass: document.getElementById('acc-pass').value, role: document.getElementById('acc-role').value, verified: document.getElementById('acc-verified').checked };
    }

    if (index === "") window.db[type].push(obj);
    else window.db[type][index] = obj;
    
    saveDB(); renderAll(); resetForm(type === 'employees' ? 'employee' : type === 'departments' ? 'dept' : 'acc');
}

function deleteData(type, index) {
    if (confirm("Delete this?")) { window.db[type].splice(index, 1); saveDB(); renderAll(); }
}

function editData(type, index) {
    const item = window.db[type][index];
    if (type === 'employees') {
        document.getElementById('emp-index').value = index;
        document.getElementById('emp-id').value = item.id;
        document.getElementById('emp-email').value = item.email;
        document.getElementById('emp-pos').value = item.pos;
        document.getElementById('emp-dept').value = item.dept;
        document.getElementById('emp-date').value = item.date;
    } else if (type === 'departments') {
        document.getElementById('dept-index').value = index;
        document.getElementById('dept-name').value = item.name;
        document.getElementById('dept-desc').value = item.desc;
    } else if (type === 'accounts') {
        document.getElementById('acc-index').value = index;
        document.getElementById('acc-fname').value = item.fname;
        document.getElementById('acc-lname').value = item.lname;
        document.getElementById('acc-email').value = item.email;
        document.getElementById('acc-pass').value = item.pass;
        document.getElementById('acc-role').value = item.role;
        document.getElementById('acc-verified').checked = item.verified;
    }
}

function resetForm(prefix) { 
    const form = document.getElementById('form-' + prefix);
    if(form) form.reset(); 
    const idx = document.getElementById(prefix.substring(0,3) + '-index');
    if(idx) idx.value = ""; 
}

function renderAll() {
    const empBody = document.querySelector('#table-employees tbody');
    if(empBody) {
        empBody.innerHTML = window.db.employees.length ? '' : '<tr><td colspan="5" class="text-muted">No employees.</td></tr>';
        window.db.employees.forEach((e, i) => {
            empBody.innerHTML += `<tr><td>${e.id}</td><td>${e.email}</td><td>${e.pos}</td><td>${e.dept}</td><td><button class="btn btn-outline-primary btn-xs" onclick="editData('employees', ${i})">Edit</button> <button class="btn btn-outline-danger btn-xs" onclick="deleteData('employees', ${i})">Delete</button></td></tr>`;
        });
    }

    const deptBody = document.querySelector('#table-depts tbody');
    const empDeptSelect = document.getElementById('emp-dept');
    if(deptBody) {
        deptBody.innerHTML = ''; if(empDeptSelect) empDeptSelect.innerHTML = '';
        window.db.departments.forEach((d, i) => {
            deptBody.innerHTML += `<tr><td>${d.name}</td><td>${d.desc}</td><td><button class="btn btn-outline-primary btn-xs" onclick="editData('departments', ${i})">Edit</button> <button class="btn btn-outline-danger btn-xs" onclick="deleteData('departments', ${i})">Delete</button></td></tr>`;
            if(empDeptSelect) empDeptSelect.innerHTML += `<option>${d.name}</option>`;
        });
    }

    const accBody = document.querySelector('#table-accounts tbody');
    if(accBody) {
        accBody.innerHTML = '';
        window.db.accounts.forEach((a, i) => {
            accBody.innerHTML += `
            <tr>
                <td>${a.fname} ${a.lname}</td>
                <td>${a.email}</td>
                <td>${a.role}</td>
                <td>${a.verified?'✅':'❌'}</td>
                <td>
                    <button class="btn btn-outline-primary btn-xs" onclick="editData('accounts', ${i})">Edit</button>
                    <button class="btn btn-outline-warning btn-xs" onclick="alert('Password reset link sent to '+ '${a.email}')">Reset Password</button>
                    <button class="btn btn-outline-danger btn-xs" onclick="deleteData('accounts', ${i})">Delete</button>
                </td>
            </tr>`;
        });
    }
}

window.onhashchange = () => {
    const hash = window.location.hash || '#/';
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    let route = hash.replace('#/', '') || 'home';
    const target = document.getElementById('view-' + route);
    if (target) {
        target.classList.add('active');
        if (route === 'profile' && currentUser) {
            document.getElementById('p-name').innerText = currentUser.fname + " " + currentUser.lname;
            document.getElementById('p-email').innerText = currentUser.email;
            document.getElementById('p-role').innerText = currentUser.role;
            toggleProfileEdit(false); // Sigurohon nga display mode ang una makita
        }
    }
};

window.onload = () => { init(); window.onhashchange(); };
