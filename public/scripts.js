// Menyembunyikan dan menampilkan form login dan register
function toggleForms() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
  }
  

  // Fungsi Register
  async function registerUser(event) {
    event.preventDefault(); // Cegah form dari submit default
    console.log("registerUser function called");
  
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
  
    console.log("Data to be sent:", { username, email, password });
  
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
  
    const result = await response.json();
    if (response.ok) {
      alert('Registrasi berhasil! Silakan login.');
      window.location.href = 'login.html'; // Arahkan ke halaman login
    } else {
      alert(result.message);
    }
  }
  
  async function loginUser(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        // Simpan token JWT di localStorage
        localStorage.setItem('token', result.token);
        alert('Login berhasil');
        window.location.href = 'dashboard.html'; // Arahkan ke halaman dashboard atau halaman lain setelah login
      } else {
        alert(result.message); // Tampilkan pesan error jika login gagal
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat login');
    }
  }
  
  
  // Tampilkan Profil Setelah Login
  function displayProfile(username) {
    document.getElementById('profile-username').innerText = `Welcome, ${username}`;
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('profile-section').classList.remove('hidden');
  }
  
  // Fungsi Logout
  function logout() {
    localStorage.removeItem('token');
    document.getElementById('profile-section').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    alert('Anda telah logout');
    window.location.href = 'login.html';
  }
  
// Fungsi untuk menampilkan nama pengguna
document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  document.getElementById('username').textContent = username || 'User';

  // Panggil fungsi untuk mendapatkan snippet pengguna
  loadSnippets();
});

// Menghilangkan duplikasi fungsi loadSnippets dan memastikan hasil JSON diakses dengan benar
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

// Fungsi untuk membuka modal edit dan mengisi data
function openEditModal(id, title, content) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-content').value = content;
  document.getElementById('editModal').classList.remove('hidden');
}

// Fungsi untuk menutup modal
function closeModal() {
  document.getElementById('editModal').classList.add('hidden');
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

// Fungsi untuk membagikan snippet
function shareSnippet(id) {
  const shareLink = `http://localhost:3000/api/snippets/shared/${id}`;
  prompt("Bagikan link ini:", shareLink);
}




// Fungsi untuk menambahkan snippet baru
async function addSnippet(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/api/snippets', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
  });

  if (response.ok) {
      alert('Snippet added successfully');
      loadSnippets(); // Refresh list
  } else {
      alert('Failed to add snippet');
  }
}



// Fungsi untuk mengedit snippet
async function editSnippet(id) {
  const title = prompt("Masukkan judul baru:");
  const content = prompt("Masukkan konten baru:");
  const token = localStorage.getItem('token');

  if (title && content) {
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
          loadSnippets(); // Refresh list
      } else {
          alert('Gagal mengedit snippet');
      }
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
          loadSnippets(); // Refresh list
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
