// 1. STATE (VERİ DEPOSU): Eklenen tüm harcamaları bu dizide (array) tutacağız.
let transactions = [];

// 2. DOM ELEMANLARI (HTML'deki kutuları JS tarafında yakalıyoruz)
const balanceEl = document.querySelector('.balance-card .card-amount');
const incomeEl = document.querySelector('.income-card .card-amount');
const expenseEl = document.querySelector('.expense-card .card-amount');

const transactionForm = document.querySelector('.transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const transactionList = document.querySelector('.transaction-list');

// 3. ARAYÜZÜ VE HESAPLAMALARI GÜNCELLEYEN FONKSİYON
function updateUI() {
  // A) Önce listedeki eski elemanları temizle
  transactionList.innerHTML = '';

  let totalIncome = 0;
  let totalExpense = 0;

  // B) Dizedeki her bir harcamayı döngüye al ve ekrana bas
  transactions.forEach((item) => {
    // Toplamları hesapla
    if (item.type === 'income') {
      totalIncome += item.amount;
    } else {
      totalExpense += item.amount;
    }

    // Yeni bir <li> elementi oluştur
    const li = document.createElement('li');
    li.className = `transaction-item ${item.type}`;
    
    // HTML içeriğini hazırla (Sil butonu X dahil)
    li.innerHTML = `
      <span class="item-description">${item.description}</span>
      <span class="item-amount">${item.type === 'income' ? '+' : '-'}$${item.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${item.id})">x</button>
    `;

    // Listeye ekle
    transactionList.appendChild(li);
  });

  // C) Kartları Güncelle
  const balance = totalIncome - totalExpense;
  
  incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  expenseEl.textContent = `$${totalExpense.toFixed(2)}`;
  balanceEl.textContent = `$${balance.toFixed(2)}`;
}

// 4. YENİ İŞLEM EKLEME (Form Gönderildiğinde Çalışır)
function addTransaction(e) {
  // Sayfanın yenilenmesini engelle! (Çok Önemli)
  e.preventDefault();

  // Yeni işlem nesnesini (Object) oluştur
  const newTransaction = {
    id: Date.now(), // Benzersiz bir kimlik (ID) üretir
    description: descriptionInput.value,
    amount: Number(amountInput.value), // Metni sayıya çevirir
    type: typeSelect.value
  };

  // Veriyi dizimize ekle
  transactions.push(newTransaction);

  // Form inputlarını temizle
  descriptionInput.value = '';
  amountInput.value = '';

  // Ekrana yansıt
  updateUI();
}

// 5. İŞLEM SİLME
function deleteTransaction(id) {
  // Tıklanan ID dışındaki tüm elemanları koru (Seçileni siler)
  transactions = transactions.filter(item => item.id !== id);
  updateUI();
}

// 6. DINLEYICILER (EVENT LISTENERS)
// Form gönderilince 'addTransaction' fonksiyonunu çalıştır
transactionForm.addEventListener('submit', addTransaction);