// Handle Logout
document.getElementById('logout-button').addEventListener('click', () => {
    alert('Logging out...');
    // Redirect to login page
    window.location.href = 'index.html';
});

// Handle Form Submission
const form = document.getElementById('currency-form');
const transactionList = document.getElementById('transaction-list');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    addTransaction(description, amount, type);
    form.reset();
});

// Function to Add Transaction
function addTransaction(description, amount, type) {
    const transaction = document.createElement('div');
    transaction.className = `transaction ${type}`;

    transaction.innerHTML = `
        <p>${description}</p>
        <p>${type === 'income' ? '+' : '-'}$${amount.toFixed(2)}</p>
    `;

    transactionList.appendChild(transaction);
}
