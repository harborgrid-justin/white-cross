/**
 * White Cross Intelligent Navigation - Frontend Application
 * 
 * Enterprise-grade web interface for semantic code search and analysis
 */

class NavigationApp {
  constructor() {
    this.ws = null;
    this.currentView = 'search';
    this.isConnected = false;
    this.searchResults = [];
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.connectWebSocket();
    this.loadSystemStats();
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });

    searchBtn.addEventListener('click', () => {
      this.performSearch();
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.dataset.view;
        this.switchView(view);
      });
    });

    // Auto-refresh stats every 30 seconds
    setInterval(() => {
      this.loadSystemStats();
    }, 30000);
  }

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.updateConnectionStatus(true);
        this.isConnected = true;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.updateConnectionStatus(false);
        this.isConnected = false;
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          this.connectWebSocket();
        }, 5000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateConnectionStatus(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.updateConnectionStatus(false);
    }
  }

  handleWebSocketMessage(data) {
    switch (data.type) {
      case 'welcome':
        console.log('Welcome message:', data.message);
        break;
      
      case 'search_results':
        this.displaySearchResults(data.results);
        break;
      
      case 'stats_update':
        this.updateStats(data.data);
        break;
      
      case 'search':
        // Real-time search notification
        this.showNotification(`Search performed: "${data.query}" (${data.results} results)`);
        break;
      
      default:
        console.log('Unknown WebSocket message:', data);
    }
  }

  updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connectionStatus');
    const icon = statusEl.querySelector('i');
    const text = statusEl.querySelector('span');
    
    if (connected) {
      statusEl.className = 'status-indicator status-connected';
      icon.className = 'fas fa-circle';
      text.textContent = 'Connected';
    } else {
      statusEl.className = 'status-indicator status-disconnected';
      icon.className = 'fas fa-exclamation-circle';
      text.textContent = 'Disconnected';
    }
  }

  async loadSystemStats() {
    try {
      const response = await fetch('/api/stats');
      const result = await response.json();
      
      if (result.success) {
        this.updateStats(result.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  updateStats(stats) {
    document.getElementById('statEmbeddings').textContent = 
      stats.total_embeddings ? stats.total_embeddings.toLocaleString() : '-';
    document.getElementById('statRelationships').textContent = 
      stats.total_relationships ? stats.total_relationships.toLocaleString() : '-';
    document.getElementById('statFiles').textContent = 
      stats.total_files ? stats.total_files.toLocaleString() : '-';
    document.getElementById('statOpenAI').textContent = 
      stats.openai_embeddings ? stats.openai_embeddings.toLocaleString() : '-';
  }

  async performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
      this.showNotification('Please enter a search query', 'warning');
      return;
    }

    this.showLoading('searchResults');

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          limit: 20,
          threshold: 0.1
        })
      });

      const result = await response.json();
      
      if (result.success) {
        this.searchResults = result.data;
        this.displaySearchResults(result.data);
      } else {
        this.showError('Search failed: ' + result.error);
      }
    } catch (error) {
      console.error('Search error:', error);
      this.showError('Search request failed');
    }
  }

  displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.className = 'search-results active';
    
    if (!results || results.length === 0) {
      searchResults.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>No results found</h3>
          <p>Try adjusting your search terms or reducing the threshold</p>
        </div>
      `;
      return;
    }

    const resultsHtml = results.map(result => `
      <div class="result-item" onclick="app.selectResult('${result.file_path}')">
        <div class="result-header">
          <div class="result-title">${this.escapeHtml(result.header_name || 'Unknown')}</div>
          <div class="result-score">${(result.similarity_score * 100).toFixed(1)}%</div>
        </div>
        <div class="result-path">${this.escapeHtml(result.file_path)}</div>
        <div class="result-type">${this.escapeHtml(result.header_type || 'unknown')}</div>
        ${result.line_number ? `<div class="result-line">Line ${result.line_number}</div>` : ''}
      </div>
    `).join('');

    searchResults.innerHTML = resultsHtml;
  }

  async selectResult(filePath) {
    console.log('Selected file:', filePath);
    
    // Navigate to related files
    try {
      const response = await fetch('/api/navigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath,
          context: 'all',
          limit: 10
        })
      });

      const result = await response.json();
      
      if (result.success) {
        this.showNavigationResults(result.data);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  showNavigationResults(navigationData) {
    if (navigationData.error) {
      this.showNotification(navigationData.error, 'error');
      return;
    }

    const modal = this.createModal('Related Files', `
      <div class="navigation-results">
        <h4>File: ${navigationData.current_file}</h4>
        <p>Headers: ${navigationData.file_info?.header_count || 0}</p>
        
        ${navigationData.related_files?.length > 0 ? `
          <h5>Related Files:</h5>
          <div class="related-files">
            ${navigationData.related_files.map(file => `
              <div class="related-file-item">
                <strong>${file.file_path.split('/').pop()}</strong>
                <span class="score">${(file.similarity_score * file.relevance * 100).toFixed(1)}%</span>
                <div class="file-path">${file.file_path}</div>
              </div>
            `).join('')}
          </div>
        ` : '<p>No related files found</p>'}
      </div>
    `);
  }

  switchView(viewName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.style.display = 'none';
    });

    // Show selected view
    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
      targetView.style.display = 'block';
    }

    this.currentView = viewName;

    // Load view-specific data
    switch (viewName) {
      case 'relationships':
        this.loadRelationships();
        break;
      case 'patterns':
        this.loadPatterns();
        break;
      case 'files':
        this.loadFiles();
        break;
    }
  }

  async loadRelationships() {
    try {
      const response = await fetch('/api/relationships');
      const result = await response.json();
      
      if (result.success) {
        this.displayRelationships(result.data);
      }
    } catch (error) {
      console.error('Failed to load relationships:', error);
    }
  }

  displayRelationships(data) {
    const container = document.getElementById('relationshipStats');
    
    const html = `
      <h4>Relationship Statistics</h4>
      <div class="relationship-stats">
        ${data.stats.map(stat => `
          <div class="stat-row">
            <span class="stat-name">${stat.relationship_type}</span>
            <span class="stat-count">${stat.count}</span>
            <span class="stat-similarity">Sim: ${stat.avg_similarity}</span>
            <span class="stat-confidence">Conf: ${stat.avg_confidence}</span>
          </div>
        `).join('')}
      </div>
      
      <h4>Common Patterns</h4>
      <div class="pattern-stats">
        ${data.patterns.map(pattern => `
          <div class="pattern-row">
            <span class="pattern-name">${pattern.source_type} → ${pattern.target_type}</span>
            <span class="pattern-type">${pattern.relationship_type}</span>
            <span class="pattern-frequency">${pattern.frequency}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    container.innerHTML = html;
  }

  async loadPatterns() {
    try {
      const response = await fetch('/api/patterns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain: 'all',
          minOccurrence: 3
        })
      });

      const result = await response.json();
      
      if (result.success) {
        this.displayPatterns(result.data);
      }
    } catch (error) {
      console.error('Failed to load patterns:', error);
    }
  }

  displayPatterns(data) {
    const container = document.getElementById('patternAnalysis');
    
    if (data.error) {
      container.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

    const html = `
      <div class="pattern-summary">
        <h4>Pattern Summary</h4>
        <p>Total analyzed: ${data.summary?.total_analyzed || 0}</p>
        <p>Unique types: ${data.summary?.unique_types || 0}</p>
        <p>Common patterns: ${data.summary?.common_patterns || 0}</p>
      </div>
      
      <div class="pattern-details">
        <h4>Type Distribution</h4>
        ${Object.entries(data.patterns?.type_patterns || {})
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 10)
          .map(([type, items]) => `
            <div class="type-row">
              <span class="type-name">${type}</span>
              <span class="type-count">${items.length}</span>
            </div>
          `).join('')}
      </div>
    `;
    
    container.innerHTML = html;
  }

  async loadFiles() {
    try {
      const response = await fetch('/api/files?limit=50');
      const result = await response.json();
      
      if (result.success) {
        this.displayFiles(result.data);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  }

  displayFiles(files) {
    const container = document.getElementById('fileExplorer');
    
    const html = `
      <div class="file-list">
        ${files.map(file => `
          <div class="file-item" onclick="app.selectResult('${file.file_path}')">
            <div class="file-name">${file.file_path.split('/').pop()}</div>
            <div class="file-path">${file.file_path}</div>
            <div class="file-stats">
              <span>Headers: ${file.header_count}</span>
              <span>Embeddings: ${file.embedding_count}</span>
              <span>Relationships: ${file.relationship_count}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    container.innerHTML = html;
  }

  showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <span>Loading...</span>
      </div>
    `;
  }

  showError(message) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle" style="color: var(--error-color);"></i>
        <h3>Error</h3>
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#2563eb'};
      color: white;
      border-radius: 6px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    modal.innerHTML = `
      <div class="modal-content" style="
        background: var(--surface);
        padding: 24px;
        border-radius: 8px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: var(--shadow-lg);
      ">
        <div class="modal-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
        ">
          <h3>${title}</h3>
          <button class="modal-close" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-secondary);
          ">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;

    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
    return modal;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the application
const app = new NavigationApp();

// Add some global styles
const styles = document.createElement('style');
styles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .relationship-stats, .pattern-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }

  .stat-row, .pattern-row, .type-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--background);
    border-radius: 4px;
    font-size: 14px;
  }

  .file-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .file-item {
    padding: 16px;
    background: var(--background);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .file-item:hover {
    background: var(--border);
  }

  .file-name {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .file-path {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .file-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .related-file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }

  .score {
    font-weight: 600;
    color: var(--primary-color);
  }
`;
document.head.appendChild(styles);
