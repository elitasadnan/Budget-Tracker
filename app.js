// 1. STATE (VERİ DEPOSU)
// Sayfa açıldığında önce LocalStorage'a bakıyoruz. Veri varsa yüklüyoruz, yoksa boş dizi [] oluşturuyoruz.
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// 2. DOM ELEMANLARI
const balanceEl = document.querySelector('.balance-card .card-amount');
const incomeEl = document.querySelector('.income-card .card-amount');
const expenseEl = document.querySelector('.expense-card .card-amount');

const transactionForm = document.querySelector('.transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const transactionList = document.querySelector('.transaction-list');

// 3. YARDIMCI FONKSİYONLAR (Clean Code: Hesaplama ve Depolama Ayrı Fonksiyonlar)

// Verileri LocalStorage'a kaydeder
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Hesaplamaları yapar
function calculateTotals() {
  const totalIncome = transactions
    .filter(item => item.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpense = transactions
    .filter(item => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);

  const balance = totalIncome - totalExpense;

  incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  expenseEl.textContent = `$${totalExpense.toFixed(2)}`;
  balanceEl.textContent = `$${balance.toFixed(2)}`;
}

// Listeyi ekrana basar (Empty State Kontrolü Dahil)
function renderList() {
  transactionList.innerHTML = '';

  // Sprint 3: Empty State Kontrolü
  if (transactions.length === 0) {
    transactionList.innerHTML = `<li class="empty-state" style="text-align: center; color: var(--text-muted); padding: 15px;">Henüz bir işlem eklenmedi.</li>`;
    return;
  }

  transactions.forEach((item) => {
    const li = document.createElement('li');
    li.className = `transaction-item ${item.type}`;
    
    // Dataset kullanarak id'yi HTML elemanına yüklüyoruz (Event Delegation için)
    li.innerHTML = `
      <span class="item-description">${item.description}</span>
      <span class="item-amount">${item.type === 'income' ? '+' : '-'}$${item.amount.toFixed(2)}</span>
      <button class="delete-btn" data-id="${item.id}">x</button>
    `;

    transactionList.appendChild(li);
  });
}

// Ana UI Güncelleyici
function updateUI() {
  calculateTotals();
  renderList();
  updateLocalStorage(); // Sprint 3: Her değişiklikte veriyi kaydet
}

// 4. İŞLEM EKLEME (Validation Dahil)
function addTransaction(e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  // Sprint 3: Validation Edge Cases (Geçersiz Değer Kontrolü)
  if (!description) {
    alert('Lütfen geçerli bir açıklama girin.');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert('Lütfen 0\'dan büyük geçerli bir miktar girin.');
    return;
  }

  const newTransaction = {
    id: Date.now(),
    description: description,
    amount: amount,
    type: typeSelect.value
  };

  transactions.push(newTransaction);

  // Formu sıfırla
  descriptionInput.value = '';
  amountInput.value = '';

  updateUI();
}

// 5. İŞLEM SİLME (Event Delegation Mantığı)
function handleListClick(e) {
  // Tıklanan eleman 'delete-btn' sınıfına sahipse
  if (e.target.classList.contains('delete-btn')) {
    const idToDelete = Number(e.target.getAttribute('data-id'));
    transactions = transactions.filter(item => item.id !== idToDelete);
    updateUI();
  }
}

// 6. DINLEYICILER (EVENT LISTENERS)
transactionForm.addEventListener('submit', addTransaction);

// Event Delegation: Tıklamayı direkt sil butonuna değil, ana listeye bağlıyoruz (Modern Yaklaşım)
transactionList.addEventListener('click', handleListClick);

// Sayfa ilk yüklendiğinde verileri ekrana bas
document.addEventListener('DOMContentLoaded', updateUI);

