// Elements
const billForm = document.getElementById('bill-form');
const billList = document.getElementById('bill-list');
const searchBar = document.getElementById('search-bar');
const logoutButton = document.getElementById('logout-button');

// Event Listeners
billForm.addEventListener('submit', addBill);
searchBar.addEventListener('input', searchBills);
logoutButton.addEventListener('click', logout);

// Load bills from local storage on page load
document.addEventListener('DOMContentLoaded', loadBills);

// Add a new bill to the list and local storage
function addBill(e) {
    e.preventDefault();

    const amount = document.getElementById('bill-amount').value;
    const currency = document.getElementById('currency').value;
    const location = document.getElementById('location').value;
    const date = new Date().toLocaleDateString();

    const bill = { amount, currency, location, date };
    saveBillToStorage(bill);
    renderBill(bill);

    billForm.reset();
}

// Render a single bill
function renderBill(bill) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>${bill.currency} ${bill.amount}</strong> - ${bill.location} (Date: ${bill.date})
    `;
    billList.appendChild(listItem);
}

// Load bills from local storage and display them
function loadBills() {
    const bills = getBillsFromStorage();
    bills.forEach(renderBill);
}

// Save a new bill to local storage
function saveBillToStorage(bill) {
    const bills = getBillsFromStorage();
    bills.push(bill);
    localStorage.setItem('bills', JSON.stringify(bills));
}

// Retrieve bills from local storage
function getBillsFromStorage() {
    const bills = localStorage.getItem('bills');
    return bills ? JSON.parse(bills) : [];
}

// Search bills by currency or location
function searchBills(e) {
    const searchTerm = e.target.value.toLowerCase();
    const bills = getBillsFromStorage();

    billList.innerHTML = ''; // Clear current list
    const filteredBills = bills.filter(bill =>
        bill.currency.toLowerCase().includes(searchTerm) ||
        bill.location.toLowerCase().includes(searchTerm)
    );

    filteredBills.forEach(renderBill);
}

// Logout function
function logout() {
    alert('Logging out...');
    window.location.href = 'index.html'; // Redirect to login page
}
