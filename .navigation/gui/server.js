#!/usr/bin/env node

/**
 * Enterprise-Grade Intelligent Code Navigation GUI Server
 * 
 * Provides a web-based interface for the White Cross intelligent code navigation system
 * Features:
 * - Real-time semantic search
 * - Interactive relationship visualization
 * - Pattern analysis dashboard
 * - Code navigation interface
 * - WebSocket-based real-time updates
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const { IntelligentCodeNavigator } = require('../intelligent_code_navigator');

class NavigationServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    this.navigator = new IntelligentCodeNavigator();
    this.clients = new Set();
    this.port = process.env.PORT || 3001;
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  setupMiddleware() {
    this.app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    }));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    // System statistics
    this.app.get('/api/stats', async (req, res) => {
      try {
        await this.navigator.connect();
        
        const stats = await this.navigator.assistant.client.query(`
          SELECT 
            (SELECT COUNT(*) FROM code_embeddings) as total_embeddings,
            (SELECT COUNT(*) FROM code_relationships) as total_relationships,
            (SELECT COUNT(DISTINCT relationship_type) FROM code_relationships) as relationship_types,
            (SELECT COUNT(*) FROM code_files) as total_files,
            (SELECT COUNT(*) FROM code_headers) as total_headers,
            (SELECT COUNT(*) FROM code_embeddings WHERE embedding_model LIKE '%openai%') as openai_embeddings
        `);
        
        await this.navigator.disconnect();
        
        res.json({
          success: true,
          data: stats.rows[0]
        });
      } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Semantic search endpoint
    this.app.post('/api/search', async (req, res) => {
      try {
        const { query, limit = 20, threshold = 0.1 } = req.body;
        
        if (!query) {
          return res.status(400).json({ success: false, error: 'Query is required' });
        }

        await this.navigator.connect();
        const results = await this.navigator.semanticCodeSearch(query, limit, threshold);
        await this.navigator.disconnect();
        
        // Broadcast search to connected clients
        this.broadcast({ type: 'search', query, results: results.length });
        
        res.json({ success: true, data: results });
      } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Navigation endpoint
    this.app.post('/api/navigate', async (req, res) => {
      try {
        const { filePath, context = 'all', limit = 10 } = req.body;
        
        if (!filePath) {
          return res.status(400).json({ success: false, error: 'File path is required' });
        }

        await this.navigator.connect();
        const results = await this.navigator.navigateToRelated(filePath, context, limit);
        await this.navigator.disconnect();
        
        res.json({ success: true, data: results });
      } catch (error) {
        console.error('Navigation error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Pattern discovery endpoint
    this.app.post('/api/patterns', async (req, res) => {
      try {
        const { domain = 'all', minOccurrence = 3 } = req.body;

        await this.navigator.connect();
        const results = await this.navigator.discoverPatterns(domain, minOccurrence);
        await this.navigator.disconnect();
        
        res.json({ success: true, data: results });
      } catch (error) {
        console.error('Pattern discovery error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Relationship analysis endpoint
    this.app.get('/api/relationships', async (req, res) => {
      try {
        await this.navigator.connect();
        
        const stats = await this.navigator.assistant.client.query(`
          SELECT 
            relationship_type,
            COUNT(*) as count,
            ROUND(AVG(similarity_score), 3) as avg_similarity,
            ROUND(AVG(confidence_score), 3) as avg_confidence
          FROM code_relationships
          GROUP BY relationship_type
          ORDER BY count DESC
        `);
        
        const patterns = await this.navigator.assistant.client.query(`
          SELECT 
            cr.relationship_type,
            ch1.header_type as source_type,
            ch2.header_type as target_type,
            COUNT(*) as frequency
          FROM code_relationships cr
          JOIN code_headers ch1 ON cr.source_header_id = ch1.id
          JOIN code_headers ch2 ON cr.target_header_id = ch2.id
          GROUP BY cr.relationship_type, ch1.header_type, ch2.header_type
          HAVING COUNT(*) >= 5
          ORDER BY frequency DESC
          LIMIT 20
        `);
        
        await this.navigator.disconnect();
        
        res.json({ 
          success: true, 
          data: { 
            stats: stats.rows, 
            patterns: patterns.rows 
          }
        });
      } catch (error) {
        console.error('Relationship analysis error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // File explorer endpoint
    this.app.get('/api/files', async (req, res) => {
      try {
        const { path: searchPath = '', limit = 100 } = req.query;
        
        await this.navigator.connect();
        
        const files = await this.navigator.assistant.client.query(`
          SELECT 
            cf.file_path,
            cf.file_type,
            COUNT(ch.id) as header_count,
            COUNT(ce.id) as embedding_count,
            COUNT(DISTINCT cr.id) as relationship_count
          FROM code_files cf
          LEFT JOIN code_headers ch ON cf.id = ch.file_id
          LEFT JOIN code_embeddings ce ON ch.id = ce.header_id
          LEFT JOIN code_relationships cr ON (cr.source_header_id = ch.id OR cr.target_header_id = ch.id)
          WHERE cf.file_path LIKE $1
          GROUP BY cf.file_path, cf.file_type
          ORDER BY cf.file_path
          LIMIT $2
        `, [`%${searchPath}%`, limit]);
        
        await this.navigator.disconnect();
        
        res.json({ success: true, data: files.rows });
      } catch (error) {
        console.error('File explorer error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Similar patterns endpoint
    this.app.post('/api/similar', async (req, res) => {
      try {
        const { referenceFile, referenceHeader, limit = 10 } = req.body;
        
        if (!referenceFile || !referenceHeader) {
          return res.status(400).json({ 
            success: false, 
            error: 'Reference file and header are required' 
          });
        }

        await this.navigator.connect();
        const results = await this.navigator.findSimilarPatterns(referenceFile, referenceHeader, limit);
        await this.navigator.disconnect();
        
        res.json({ success: true, data: results });
      } catch (error) {
        console.error('Similar patterns error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Serve the frontend
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('New WebSocket client connected');
      this.clients.add(ws);
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to White Cross Intelligent Navigation System',
        timestamp: new Date().toISOString()
      }));

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await this.handleWebSocketMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            error: error.message
          }));
        }
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });
    });
  }

  async handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'search':
        // Real-time search
        await this.navigator.connect();
        const results = await this.navigator.semanticCodeSearch(data.query, data.limit || 10);
        await this.navigator.disconnect();
        
        ws.send(JSON.stringify({
          type: 'search_results',
          requestId: data.requestId,
          results
        }));
        break;

      case 'subscribe_stats':
        // Send periodic stats updates
        this.sendStatsUpdate(ws);
        break;

      default:
        ws.send(JSON.stringify({
          type: 'error',
          error: `Unknown message type: ${data.type}`
        }));
    }
  }

  async sendStatsUpdate(ws) {
    try {
      await this.navigator.connect();
      const stats = await this.navigator.assistant.client.query(`
        SELECT 
          (SELECT COUNT(*) FROM code_embeddings) as embeddings,
          (SELECT COUNT(*) FROM code_relationships) as relationships
      `);
      await this.navigator.disconnect();
      
      ws.send(JSON.stringify({
        type: 'stats_update',
        data: stats.rows[0],
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Stats update error:', error);
    }
  }

  broadcast(message) {
    const data = JSON.stringify({
      ...message,
      timestamp: new Date().toISOString()
    });
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  async start() {
    try {
      // Test database connection
      await this.navigator.connect();
      console.log('✅ Database connection verified');
      await this.navigator.disconnect();
      
      this.server.listen(this.port, () => {
        console.log('🚀 White Cross Intelligent Navigation Server');
        console.log('==========================================');
        console.log(`🌐 Server running on http://localhost:${this.port}`);
        console.log(`🔌 WebSocket server running on ws://localhost:${this.port}`);
        console.log('📊 API endpoints available:');
        console.log('   GET  /api/health          - Health check');
        console.log('   GET  /api/stats           - System statistics');
        console.log('   POST /api/search          - Semantic search');
        console.log('   POST /api/navigate        - Code navigation');
        console.log('   POST /api/patterns        - Pattern discovery');
        console.log('   GET  /api/relationships   - Relationship analysis');
        console.log('   GET  /api/files           - File explorer');
        console.log('   POST /api/similar         - Similar patterns');
        console.log('==========================================');
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error.message);
      process.exit(1);
    }
  }
}

// Start the server
if (require.main === module) {
  const server = new NavigationServer();
  server.start();
}

module.exports = { NavigationServer };
