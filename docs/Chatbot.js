
const input = document.getElementById('user-input');

const chatBox = document.getElementById('chat-box');

async function sendMessage() 

  const userText = input.value.trim();
  if (!userText) return;

  appendMessage('user', userText);
  input.value = '';
  input.disabled = true;

  appendMessage('bot', 'Typing...');

  try 
  {
    const response = await fetch('https://ai-chatbot-5j6c.onrender.com/api/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: userText })
    });

    const data = await response.json();
    updateLastBotMessage(data.reply || '⚠️ No response');
  } 
  catch (err) 
  {
    updateLastBotMessage('❌ Error: Unable to fetch reply.');
    console.error(err);
  } 
  finally 
  {
    input.disabled = false;
    input.focus();
  }
}

function appendMessage(sender, text) 
{
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;

  const timestampDiv = document.createElement('div');
  timestampDiv.className = 'timestamp';
  timestampDiv.textContent = getCurrentTime();
  messageDiv.appendChild(timestampDiv);

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastBotMessage(text) 
{
  const botMessages = document.querySelectorAll('.message.bot');
  const lastBotMsg = botMessages[botMessages.length - 1];
  if (lastBotMsg) 
  {
    lastBotMsg.textContent = text;

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'timestamp';
    timestampDiv.textContent = getCurrentTime();
    lastBotMsg.appendChild(timestampDiv);
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getCurrentTime() 
{
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function toggleTheme() 
{
  document.body.classList.toggle('light-theme');
}

function clearChat() 
{
  document.getElementById('chat-box').innerHTML = '';
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
