// Fungsi untuk login
async function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });

      const result = await response.json();
      if (response.ok) {
          localStorage.setItem('token', result.token);  // Simpan token
          localStorage.setItem('username', username);
          alert('Login berhasil');
          window.location.href = 'dashboard.html';
      } else {
          alert(result.message);  // Tampilkan pesan error
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat login');
  }
}

// Fungsi Register
async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
  });

  const result = await response.json();
  if (response.ok) {
      alert('Registrasi berhasil! Silakan login.');
      window.location.href = 'login.html';
  } else {
      alert(result.message);
  }
}

// Fungsi untuk menampilkan snippets pengguna
async function loadSnippets() {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:3000/api/snippets', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) throw new Error('Gagal mengambil snippet dari server');

      const result = await response.json();
      const snippets = result.data;
      const snippetList = document.getElementById('snippets');
      snippetList.innerHTML = '';

      snippets.forEach(snippet => {
          const snippetItem = document.createElement('div');
          snippetItem.className = 'bg-gray-100 p-4 rounded-md shadow-md';
          snippetItem.innerHTML = `
              <h4 class="text-xl font-semibold">${snippet.title}</h4>
              <p class="text-gray-700">${snippet.content}</p>
              <div class="mt-2 flex space-x-2">
                  <button onclick="openEditModal('${snippet._id}', '${snippet.title}', '${snippet.content}')" class="text-blue-500">Edit</button>
                  <button onclick="deleteSnippet('${snippet._id}')" class="text-red-500">Delete</button>
                  <button onclick="shareSnippet('${snippet._id}')" class="text-green-500">Share</button>
              </div>
          `;
          snippetList.appendChild(snippetItem);
      });
  } catch (error) {
      console.error(error);
      alert("Gagal memuat snippet. Periksa kembali koneksi atau status server.");
  }
}

// Fungsi untuk membuka modal edit
function openEditModal(id, title, content) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-content').value = content;
  document.getElementById('editModal').classList.remove('hidden');
}

// Fungsi untuk memperbarui snippet
async function updateSnippet(event) {
  event.preventDefault();
  const id = document.getElementById('edit-id').value;
  const title = document.getElementById('edit-title').value;
  const content = document.getElementById('edit-content').value;
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:3000/api/snippets/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
  });

  if (response.ok) {
      alert('Snippet berhasil diubah');
      loadSnippets();
      closeModal();
  } else {
      alert('Gagal mengedit snippet');
  }
}

// Fungsi untuk menghapus snippet
async function deleteSnippet(id) {
  const token = localStorage.getItem('token');

  if (confirm("Apakah Anda yakin ingin menghapus snippet ini?")) {
      const response = await fetch(`http://localhost:3000/api/snippets/${id}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          alert('Snippet berhasil dihapus');
          loadSnippets();
      } else {
          alert('Gagal menghapus snippet');
      }
  }
}

// Fungsi untuk membagikan snippet
function shareSnippet(id) {
  const shareLink = `http://localhost:3000/api/snippets/shared/${id}`;
  prompt("Bagikan link ini:", shareLink);
}

// Fungsi logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

// Memuat snippets saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  document.getElementById('username').textContent = username || 'User';
  loadSnippets();
});
