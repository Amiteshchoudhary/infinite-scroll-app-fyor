<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo-icon">⚡</span>
        <span class="brand-name">ActivityHub</span>
      </div>
      <div class="nav-links">
        <a v-for="tab in tabs" :key="tab.id" :class="['nav-link', { active: activeTab === tab.id }]" @click="activeTab = tab.id">
          <span class="nav-icon">{{ tab.icon }}</span>
          <span class="nav-text">{{ tab.name }}</span>
        </a>
      </div>
      <div class="nav-actions">
        <button class="notification-btn" @click="showNotifications = !showNotifications">
          <span class="notif-icon">🔔</span>
          <span v-if="notifications.length" class="notif-badge">{{ notifications.length }}</span>
        </button>
      </div>
    </nav>
    <div v-if="showNotifications" class="notifications-dropdown">
      <div class="notif-header">
        <h3>Notifications</h3>
        <button @click="clearNotifications" class="clear-btn">Clear All</button>
      </div>
      <div class="notif-list">
        <div v-for="notif in notifications" :key="notif.id" class="notif-item">
          <span class="notif-emoji">🔔</span>
          <div class="notif-content">
            <p>{{ notif.message }}</p>
            <span class="notif-time">{{ notif.time }}</span>
          </div>
        </div>
        <div v-if="notifications.length === 0" class="no-notif">No notifications</div>
      </div>
    </div>
    <main class="app-main">
      <div v-if="activeTab === 'home'" class="tab-content">
        <header class="app-header">
          <div class="header-content">
            <h1>Activity Feed</h1>
            <p class="header-subtitle">Stay updated with the latest posts</p>
          </div>
        </header>
        <ActivityFeed />
      </div>
        <div v-if="activeTab === 'login'" class="tab-content">
          <div class="login-container">
            <div class="login-card">
              <h2>{{ loginMode === 'login' ? 'Sign In' : 'Sign Up' }}</h2>
              <p>{{ loginMode === 'login' ? 'Enter your details to continue' : 'Create your account' }}</p>
              <form @submit.prevent="loginMode === 'login' ? handleLogin() : handleRegister()">
                <div class="form-group">
                  <label>Username</label>
                  <input v-model="loginForm.username" type="text" placeholder="Username" required />
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <input v-model="loginForm.password" type="password" placeholder="Password" required />
                </div>
                <button type="submit" class="submit-btn">{{ loginMode === 'login' ? 'Sign In' : 'Sign Up' }}</button>
              </form>
              <div class="auth-toggle">
                <button type="button" @click="loginMode = loginMode === 'login' ? 'register' : 'login'" class="toggle-btn">
                  {{ loginMode === 'login' ? 'Create Account' : 'Have Account? Sign In' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      <div v-if="activeTab === 'ai'" class="tab-content">
        <div class="ai-container">
          <div class="ai-card">
            <div class="ai-header">
              <div class="ai-avatar">🤖</div>
              <div class="ai-title">
                <h2>AI Assistant</h2>
                <p>Smart Chatbot</p>
              </div>
            </div>
            <div class="chat-container" ref="chatContainer">
              <div v-for="(msg, index) in chatMessages" :key="index" :class="['chat-message', msg.role]">
                <div class="message-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
                <div class="message-content">
                  <div class="message-text">{{ msg.content }}</div>
                  <div class="message-time">{{ msg.time }}</div>
                </div>
              </div>
              <div v-if="isLoading" class="chat-message bot">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                  <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            <form @submit.prevent="sendMessage" class="chat-input-form">
              <input v-model="userMessage" type="text" placeholder="Ask me anything..." class="chat-input" :disabled="isLoading" />
              <button type="submit" class="send-btn" :disabled="isLoading || !userMessage.trim()">➤</button>
            </form>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'profile'" class="tab-content">
        <div class="profile-card">
          <div class="profile-avatar">👤</div>
          <h2>User Profile</h2>
          <div class="profile-info">
            <div class="info-row"><span>Username:</span><span>{{ currentUser ? currentUser.username : 'Demo User' }}</span></div>
            <div class="info-row"><span>User ID:</span><span>{{ currentUser ? currentUser.id : 'demo-id' }}</span></div>
            <div class="info-row"><span>Joined:</span><span>{{ currentUser ? new Date().toLocaleDateString() : 'March 2026' }}</span></div>
          </div>
          <button @click="activeTab = 'home'" class="logout-btn">Logout</button>
        </div>
      </div>
      <div v-if="activeTab === 'settings'" class="tab-content">
        <div class="settings-card">
          <h2>Settings</h2>
          <div class="settings-list">
            <div class="setting-row">
              <span>Dark Mode</span>
              <label class="toggle">
                <input type="checkbox" v-model="isDarkMode" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-row">
              <span>Email Notifications</span>
              <label class="toggle">
                <input type="checkbox" v-model="settings.emailNotif" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>
    <nav class="mobile-nav">
      <a v-for="tab in tabs" :key="tab.id" :class="['mobile-nav-item', { active: activeTab === tab.id }]" @click="activeTab = tab.id">
        <span>{{ tab.icon }}</span>
        <span>{{ tab.name }}</span>
      </a>
    </nav>
  </div>
</template>

<script>
import ActivityFeed from './components/ActivityFeed.vue';

export default {
  name: 'App',
  components: {
    ActivityFeed
  },
  data() {
    return {
      activeTab: 'home',
      isDarkMode: false,
      showNotifications: false,
      loginMode: 'login',
      tabs: [
        { id: 'home', name: 'Home', icon: '🏠' },
        { id: 'ai', name: 'AI Chat', icon: '🤖' },
        { id: 'login', name: 'Login', icon: '🔐' },
        { id: 'profile', name: 'Profile', icon: '👤' },
        { id: 'settings', name: 'Settings', icon: '⚙️' }
      ].filter(tab => !this.isLoggedIn || tab.id !== 'login'),
      notifications: [
        { id: 1, message: 'New activity posted!', time: '2 min ago' },
        { id: 2, message: 'Welcome to ActivityHub!', time: '1 hour ago' }
      ],
      loginForm: { username: '', password: '' },
      currentUser: null,
      token: '',
      isLoggedIn: false,
      settings: { emailNotif: true },
      loginMode: 'login',
      userMessage: '',
      chatMessages: [
        { role: 'bot', content: "Hello! I'm your AI assistant. How can I help you today?", time: '12:00 PM' }
      ],
      isLoading: false
    };
  },
  watch: {
    isDarkMode(newVal) {
      if (newVal) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    getCurrentTime() {
      return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },
    addNotification(message) {
      this.notifications.unshift({ id: Date.now(), message, time: 'Just now' });
    },
    clearNotifications() {
      this.notifications = [];
    },
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginForm)
        });
        const data = await response.json();
        if (response.ok) {
          this.token = data.token;
          this.currentUser = data.user;
          this.isLoggedIn = true;
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.addNotification(`Welcome back, ${data.user.username}!`);
          this.activeTab = 'home';
          this.loginForm = { username: '', password: '' };
        } else {
          this.addNotification(data.error || 'Login failed');
        }
      } catch (error) {
        this.addNotification('Login error. Check if backend is running.');
      }
    },

    async handleRegister() {
      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginForm)
        });
        const data = await response.json();
        if (response.ok) {
          this.addNotification('Registration successful! Please log in.');
          this.loginMode = 'login';
        } else {
          this.addNotification(data.error || 'Registration failed');
        }
      } catch (error) {
        this.addNotification('Registration error. Check if backend is running.');
      }
    },

    logout() {
      this.token = '';
      this.currentUser = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.addNotification('Logged out successfully');
      this.activeTab = 'login';
    },

    checkAuth() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.token = token;
        this.currentUser = JSON.parse(user);
        this.isLoggedIn = true;
      }
    },
    sendMessage() {
      if (!this.userMessage.trim() || this.isLoading) return;
      const userMsg = this.userMessage.trim();
      this.userMessage = '';
      this.chatMessages.push({ role: 'user', content: userMsg, time: this.getCurrentTime() });
      this.isLoading = true;
      const responses = [
        "That's an interesting question! Let me think about it.",
        "Great question! Start with understanding fundamentals.",
        "Thanks for asking! Stay curious and keep learning.",
        "I understand. Keep experimenting and don't fear mistakes!"
      ];
      setTimeout(() => {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.chatMessages.push({ role: 'bot', content: randomResponse, time: this.getCurrentTime() });
        this.isLoading = false;
      }, 1000);
    }
  }
};
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #ffb6c1, #ffc1cc); min-height: 100vh; }
#app { min-height: 100vh; display: flex; flex-direction: column; }

.navbar { background: white; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
.nav-brand { display: flex; align-items: center; gap: 8px; }
.brand-name { font-size: 20px; font-weight: 700; color: #667eea; }
.nav-links { display: flex; gap: 8px; }
.nav-link { padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #666; text-decoration: none; }
.nav-link:hover, .nav-link.active { background: #667eea; color: white; }
.notification-btn { background: none; border: none; font-size: 20px; cursor: pointer; position: relative; }
.notif-badge { position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; font-size: 10px; padding: 2px 5px; border-radius: 10px; }

.notifications-dropdown { position: absolute; top: 60px; right: 20px; width: 280px; background: white; border-radius: 12px; box-shadow: 10px 10px 30px rgb(174, 255, 0); z-index: 101; }
.notif-header { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; }
.notif-list { max-height: 200px; overflow-y: auto; }
.notif-item { display: flex; gap: 10px; padding: 10px 12px; border-bottom: 1px solid #f5f5f5; }
.notif-content p { margin: 0; font-size: 14px; }
.notif-time { font-size: 11px; color: #999; }

.app-main { flex: 1; max-width: 1200px; margin: 0 auto; padding: 30px 20px; width: 100%; }

.app-header { background: linear-gradient(135deg, #667eea, #764ba2); padding: 24px; border-radius: 16px; margin-bottom: 24px; text-align: center; }
.app-header h1 { color: white; font-size: 28px; }
.header-subtitle { color: rgba(255,255,255,0.8); margin-top: 4px; }

.login-container { display: flex; justify-content: center; padding: 40px 20px; }
.login-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); width: 100%; max-width: 400px; }
.login-card h2 { color: #333; margin-bottom: 8px; }
.login-card p { color: #666; margin-bottom: 24px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; color: #333; font-weight: 500; }
.form-group input { width: 100%; padding: 12px; border: 2px solid #e8e8e8; border-radius: 8px; font-size: 14px; }
.form-group input:focus { outline: none; border-color: #667eea; }
.submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }

.ai-container { display: flex; justify-content: center; padding: 20px; }
.ai-card { background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); width: 100%; max-width: 600px; overflow: hidden; }
.ai-header { background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; display: flex; align-items: center; gap: 12px; }
.ai-avatar { width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.ai-title h2 { color: white; font-size: 20px; margin: 0; }
.ai-title p { color: rgba(255,255,255,0.8); font-size: 12px; margin: 0; }
.chat-container { padding: 20px; min-height: 300px; max-height: 400px; overflow-y: auto; background: #f8f9fa; }
.chat-message { display: flex; gap: 10px; margin-bottom: 16px; }
.chat-message.user { flex-direction: row-reverse; }
.message-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.chat-message.user .message-avatar { background: linear-gradient(135deg, #42b983, #359268); }
.message-content { max-width: 70%; }
.message-text { padding: 12px 16px; border-radius: 16px; background: white; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.chat-message.user .message-text { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
.message-time { font-size: 10px; color: #999; margin-top: 4px; }
.typing-indicator { display: flex; gap: 4px; padding: 12px 16px; background: white; border-radius: 16px; }
.typing-indicator span { width: 8px; height: 8px; background: #667eea; border-radius: 50%; animation: typing 1s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.chat-input-form { display: flex; gap: 10px; padding: 16px; background: white; border-top: 1px solid #eee; }
.chat-input { flex: 1; padding: 12px 16px; border: 2px solid #e8e8e8; border-radius: 24px; font-size: 14px; }
.chat-input:focus { outline: none; border-color: #667eea; }
.send-btn { width: 44px; height: 44px; background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 50%; color: white; font-size: 18px; cursor: pointer; }
.send-btn:disabled { opacity: 0.6; }

.profile-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); max-width: 400px; margin: 0 auto; text-align: center; }
.profile-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 40px; }
.profile-card h2 { color: #333; margin-bottom: 20px; }
.profile-info { text-align: left; margin-bottom: 20px; }
.info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
.info-row span:first-child { color: #666; }
.info-row span:last-child { color: #333; font-weight: 500; }
.logout-btn { padding: 12px 24px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; }

.settings-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); max-width: 500px; margin: 0 auto; }
.settings-card h2 { color: #333; margin-bottom: 20px; }
.setting-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #eee; }
.toggle { position: relative; width: 48px; height: 26px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #ccc; transition: 0.3s; border-radius: 26px; }
.toggle-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background: white; transition: 0.3s; border-radius: 50%; }
.toggle input:checked + .toggle-slider { background: #667eea; }
.toggle input:checked + .toggle-slider:before { transform: translateX(22px); }

.mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 8px 0; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); }
.mobile-nav-item { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px; color: #666; font-size: 10px; cursor: pointer; }
.mobile-nav-item.active { color: #667eea; }

.auth-toggle {
  margin-top: 20px;
}
.toggle-btn {
  width: 100%;
  padding: 12px;
  background: none;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
}
.toggle-btn:hover {
  background: #f8f9fa;
}

.dark-mode {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #e0e0e0;
}

.dark-mode .navbar {
  background: #2a2a3a;
}

.dark-mode .login-card,
.dark-mode .ai-card,
.dark-mode .profile-card,
.dark-mode .settings-card {
  background: #2a2a3a;
  color: #e0e0e0;
}

.dark-mode .form-group input {
  background: #3a3a4a;
  color: #e0e0e0;
  border-color: #4a4a5a;
}

.dark-mode .form-group input:focus {
  border-color: #667eea;
}

.dark-mode .toggle-slider {
  background: #4a4a5a;
}

.dark-mode .toggle-slider:before {
  background: #e0e0e0;
}

.dark-mode .toggle input:checked + .toggle-slider {
  background: #667eea;
}

.mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 8px 0; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); }
.mobile-nav-item { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px; color: #666; font-size: 10px; cursor: pointer; }
.mobile-nav-item.active { color: #667eea; }

@media (max-width: 768px) {
  .nav-links { display: none; }
  .mobile-nav { display: flex; justify-content: space-around; }
  .app-main { padding-bottom: 70px; }
}
</style>

