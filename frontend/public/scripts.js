// Fungsi untuk login
async function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    console.log('Mengirim permintaan login ke server...');
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Login berhasil. Token diterima:', result.token);
      localStorage.setItem('token', result.token); // Simpan token
      localStorage.setItem('username', username); // Simpan username
      alert('Login berhasil');
      window.location.href = '/dashboard'; // Arahkan ke dashboard
    } else {
      console.error('Login gagal:', result.message);
      alert(result.message || 'Login gagal.');
    }
  } catch (error) {
    console.error('Kesalahan saat login:', error);
    alert('Terjadi kesalahan saat login. Periksa koneksi atau server.');
  }
}

// Fungsi untuk registrasi
async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      alert('Registrasi berhasil!');
      window.location.href = '/login'; // Arahkan ke halaman login
    } else {
      const result = await response.json();
      console.error('Registrasi gagal:', result.message);
      alert(result.message || 'Registrasi gagal.');
    }
  } catch (error) {
    console.error('Kesalahan saat registrasi:', error);
    alert('Terjadi kesalahan saat registrasi. Periksa koneksi atau server.');
  }
}

// Fungsi untuk memuat snippets
 const loadSnippets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('User is not authenticated.');

  try {
    const response = await fetch('http://localhost:3000/api/snippets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 403) {
      throw new Error('Access denied. Token might be invalid.');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch snippets');
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading snippets:', error);
    throw error;
  }
};

// Fungsi untuk menambahkan snippets baru
async function addSnippets(snippets) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak ditemukan di localStorage.');
    alert('Anda belum login. Harap login terlebih dahulu.');
    return null;
  }

  try {
    console.log('Menambahkan snippet...');
    const response = await fetch('http://localhost:3000/api/snippets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pastikan token dikirim dengan benar
      },
      body: JSON.stringify(snippets),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Gagal menambahkan snippet.');
    }

    const result = await response.json();
    console.log('Snippet berhasil ditambahkan:', result);
    return result;
  } catch (error) {
    console.error('Kesalahan saat menambahkan snippet:', error);
    alert(error.message || 'Gagal menambahkan snippet.');
    return null;
  }
}

// Fungsi untuk memperbarui snippets
async function updateSnippets(id, updatedData) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak ditemukan di localStorage.');
    alert('Anda belum login. Harap login terlebih dahulu.');
    return null;
  }

  try {
    console.log('Data yang dikirim ke server:', JSON.stringify(updatedData));

    const response = await fetch(`http://localhost:3000/api/snippets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData), // Pastikan ini adalah objek valid
    });

    console.log('Status respons server:', response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Gagal memperbarui snippet.');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Kesalahan saat memperbarui snippet:', error);
    alert(error.message || 'Gagal memperbarui snippet.');
    return null;
  }
}




// Fungsi untuk menghapus snippets
async function deleteSnippets(id) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak ditemukan di localStorage.');
    alert('Anda belum login. Harap login terlebih dahulu.');
    return false;
  }

  if (!confirm('Apakah Anda yakin ingin menghapus snippet ini?')) {
    return false;
  }

  try {
    console.log('Menghapus snippet...');
    const response = await fetch(`http://localhost:3000/api/snippets/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Pastikan token dikirim
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Gagal menghapus snippet.');
    }

    console.log('Snippet berhasil dihapus.');
    return true;
  } catch (error) {
    console.error('Kesalahan saat menghapus snippet:', error);
    alert(error.message || 'Gagal menghapus snippet.');
    return false;
  }
}

// Fungsi untuk memperbarui status share snippet
async function shareSnippets(id) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak ditemukan di localStorage.');
    alert('Anda belum login. Harap login terlebih dahulu.');
    return null;
  }

  try {
    console.log('Mengirim permintaan PATCH ke server untuk berbagi snippet...');
    const response = await fetch(`http://localhost:3000/api/snippets/${id}/share`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status respons:', response.status);

    const result = await response.json();
    console.log('Data respons dari server:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Gagal memperbarui status berbagi snippets.');
    }

    return result;
  } catch (error) {
    console.error('Kesalahan saat memperbarui status berbagi snippets:', error);
    alert(error.message || 'Gagal memperbarui status berbagi snippets.');
    return null;
  }
}





// Fungsi untuk logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = '/login';
}

export {
  loginUser,registerUser,loadSnippets, addSnippets, updateSnippets, deleteSnippets, shareSnippets, logout,};
