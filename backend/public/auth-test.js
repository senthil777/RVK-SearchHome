const output = document.getElementById('output');
const tokenPreview = document.getElementById('tokenPreview');
const apiBaseUrlInput = document.getElementById('apiBaseUrl');
const saveApiUrlButton = document.getElementById('saveApiUrlButton');
const storageApiBaseUrlKey = 'myapp_api_base_url';
let accessToken = localStorage.getItem('myapp_access_token') || '';
let apiBaseUrl = localStorage.getItem(storageApiBaseUrlKey) || apiBaseUrlInput.value.trim();

apiBaseUrlInput.value = apiBaseUrl;

updateTokenPreview();
updateBaseUrlPreview();

document.getElementById('registerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  submitJson('/auth/register', formData(event.target), true);
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  submitJson('/auth/login', formData(event.target), true);
});

document.getElementById('forgotForm').addEventListener('submit', (event) => {
  event.preventDefault();
  submitJson('/auth/forgot-password', formData(event.target), false);
});

document.getElementById('resetForm').addEventListener('submit', (event) => {
  event.preventDefault();
  submitJson('/auth/reset-password', formData(event.target), false);
});

document.getElementById('meButton').addEventListener('click', async () => {
  await request('/users/me', {
    method: 'GET',
    headers: authHeaders(),
  });
});

document.getElementById('clearButton').addEventListener('click', () => {
  accessToken = '';
  localStorage.removeItem('myapp_access_token');
  updateTokenPreview();
  output.textContent = 'Token cleared.';
});

saveApiUrlButton.addEventListener('click', () => {
  apiBaseUrl = apiBaseUrlInput.value.trim().replace(/\/+$/, '');
  localStorage.setItem(storageApiBaseUrlKey, apiBaseUrl);
  updateBaseUrlPreview();
  output.textContent = `Saved API base URL: ${apiBaseUrl}`;
});

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function submitJson(path, body, saveToken) {
  const data = await request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (saveToken && data && data.accessToken) {
    accessToken = data.accessToken;
    localStorage.setItem('myapp_access_token', accessToken);
    updateTokenPreview();
  }
}

async function request(path, options) {
  try {
    const response = await fetch(buildUrl(path), options);
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    output.textContent = JSON.stringify(
      {
        status: response.status,
        ok: response.ok,
        data,
      },
      null,
      2,
    );

    return data;
  } catch (error) {
    output.textContent = String(error);
    return null;
  }
}

function authHeaders() {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function updateTokenPreview() {
  tokenPreview.textContent = accessToken || 'No token yet.';
}

function updateBaseUrlPreview() {
  apiBaseUrlInput.value = apiBaseUrl;
}

function buildUrl(path) {
  const base = apiBaseUrl.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
