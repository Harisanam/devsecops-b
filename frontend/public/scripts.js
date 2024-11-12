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
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', username);
        alert('Login berhasil');
        window.location.href = 'dashboard.js';  // Sesuaikan dengan path dashboard
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat login');
    }
  }
  
  // Fungsi untuk registrasi
  async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
  
      if (response.ok) {
        alert("Registration successful!");
        window.location.href = 'login.js';  // Sesuaikan dengan path login
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred during registration");
    }
  }
  
  // Fungsi untuk memuat snippets
  async function loadSnippets() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/snippets', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (!response.ok) throw new Error('Gagal mengambil snippet dari server');
  
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(error);
      alert("Gagal memuat snippet. Periksa kembali koneksi atau status server.");
      return [];
    }
  }
  
  // Fungsi untuk menambahkan snippet baru
  async function addSnippet(snippet) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(snippet)
      });
  
      if (!response.ok) throw new Error('Gagal menambahkan snippet');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan snippet");
      return null;
    }
  }
  
  // Fungsi untuk memperbarui snippet
  async function updateSnippet(id, updatedData) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/snippets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
  
      if (!response.ok) throw new Error('Gagal memperbarui snippet');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(error);
      alert("Gagal mengedit snippet");
      return null;
    }
  }
  
  // Fungsi untuk menghapus snippet
  async function deleteSnippet(id) {
    const token = localStorage.getItem('token');
  
    if (confirm("Apakah Anda yakin ingin menghapus snippet ini?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/snippets/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        if (!response.ok) throw new Error('Gagal menghapus snippet');
        alert('Snippet berhasil dihapus');
        return true;
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus snippet");
        return false;
      }
    }
  }
  
  // Fungsi untuk logout
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  }
  
  // Fungsi untuk membagikan snippet (opsional, sesuai kebutuhan)
  function shareSnippet(id) {
    const shareLink = `http://localhost:3000/api/snippets/shared/${id}`;
    prompt("Bagikan link ini:", shareLink);
  }
  
  // Memuat data saat halaman dibuka
  document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
      document.getElementById('username').textContent = username;
      loadSnippets();
    }
  });
  
  export { loginUser, registerUser, loadSnippets, addSnippet, updateSnippet, deleteSnippet, logout, shareSnippet };
  