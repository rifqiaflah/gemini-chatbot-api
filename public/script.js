const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  input.focus();

  // Tampilkan indikator "thinking..." dan dapatkan referensi elemen pesannya
  const thinkingMessage = appendMessage('bot', 'Gemini is thinking...');
  thinkingMessage.classList.add('thinking');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend Anda mengirimkan key `reply` untuk error, jadi kita gunakan itu.
      throw new Error(data.reply || `Server error: ${response.status}`);
    }

    // Perbarui pesan "thinking..." dengan balasan yang sebenarnya
    thinkingMessage.textContent = data.reply;
  } catch (error) {
    console.error('Fetch error:', error);
    thinkingMessage.textContent = `Error: ${error.message}`;
  } finally {
    thinkingMessage.classList.remove('thinking');
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Kembalikan elemen yang dibuat
}
