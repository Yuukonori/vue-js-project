<template>
  <div class="app-container">
    <FuturisticSidebar />
    <main class="main-content">
      <div class="content-wrapper">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back, Ruki Nasa!</p>
        
        <div class="demo-grid">
          <div class="demo-card">
            <h3>System Health</h3>
            <div class="metric">98.5%</div>
          </div>
          <div class="demo-card">
            <h3>Active Users</h3>
            <div class="metric">1,234</div>
          </div>
          <div class="demo-card">
            <h3>Server Uptime</h3>
            <div class="metric">1h 22m 10s</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import FuturisticSidebar from './components/FuturisticSidebar.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 40px;
  transition: margin-left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 18px;
  color: rgba(226, 232, 240, 0.6);
  margin-bottom: 40px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.demo-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 24px;
  padding: 32px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.demo-card:hover {
  transform: translateY(-4px);
  border-color: rgba(96, 165, 250, 0.4);
  box-shadow: 0 12px 48px rgba(96, 165, 250, 0.2);
}

.demo-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.metric {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
