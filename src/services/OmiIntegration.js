/**
 * Omi Integration Service
 * Handles integration with Omi transcript system
 * Processes incoming transcripts and formats them for orchestration
 */

class OmiIntegration {
  constructor() {
    this.isConnected = false;
    this.listeners = [];
    this.config = {
      apiUrl: null,
      apiKey: null,
    };
  }

  /**
   * Configure Omi connection
   */
  configure(config) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * Connect to Omi API/webhook
   */
  async connectToOmi(config) {
    try {
      this.configure(config);

      // TODO: Implement actual connection logic when Omi API is available
      // This is a placeholder for future integration

      this.isConnected = true;

      console.log('Omi Integration: Connected (mock mode)');

      return {
        success: true,
        message: 'Connected to Omi (mock mode)',
      };
    } catch (error) {
      console.error('Omi Integration: Connection failed', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from Omi
   */
  async disconnect() {
    try {
      // TODO: Implement actual disconnection logic

      this.isConnected = false;
      this.listeners = [];

      console.log('Omi Integration: Disconnected');

      return {
        success: true,
        message: 'Disconnected from Omi',
      };
    } catch (error) {
      console.error('Omi Integration: Disconnection failed', error);
      throw error;
    }
  }

  /**
   * Process incoming Omi transcript
   */
  async processTranscript(transcript) {
    try {
      if (!transcript) {
        throw new Error('Invalid transcript data');
      }

      // Parse transcript
      const parsed = this.parseTranscript(transcript);

      // Validate parsed transcript
      this.validateTranscript(parsed);

      // Format for conversation
      const formatted = this.formatForConversation(parsed);

      // Notify listeners
      this.notifyListeners('transcript', formatted);

      return formatted;
    } catch (error) {
      console.error('Omi Integration: Error processing transcript', error);
      throw error;
    }
  }

  /**
   * Parse raw transcript data
   */
  parseTranscript(transcript) {
    // If transcript is already an object, use it
    if (typeof transcript === 'object') {
      return {
        id: transcript.id || this.generateTranscriptId(),
        text: transcript.text || transcript.content || '',
        timestamp: transcript.timestamp || new Date().toISOString(),
        segments: transcript.segments || [],
        metadata: transcript.metadata || {},
      };
    }

    // If transcript is a string, create a simple structure
    if (typeof transcript === 'string') {
      return {
        id: this.generateTranscriptId(),
        text: transcript,
        timestamp: new Date().toISOString(),
        segments: [
          {
            speaker: 'user',
            text: transcript,
            timestamp: new Date().toISOString(),
          },
        ],
        metadata: {
          source: 'direct',
          confidence: 1.0,
        },
      };
    }

    throw new Error('Unsupported transcript format');
  }

  /**
   * Validate transcript structure
   */
  validateTranscript(transcript) {
    if (!transcript.id) {
      throw new Error('Transcript missing ID');
    }

    if (!transcript.text || transcript.text.trim() === '') {
      throw new Error('Transcript missing text content');
    }

    return true;
  }

  /**
   * Format transcript for conversation
   */
  formatForConversation(parsed) {
    return {
      id: parsed.id,
      type: 'omi_transcript',
      content: parsed.text,
      timestamp: parsed.timestamp,
      metadata: {
        source: 'omi',
        segments: parsed.segments,
        confidence: parsed.metadata?.confidence || 1.0,
        language: parsed.metadata?.language || 'en',
        duration: parsed.metadata?.duration || null,
      },
    };
  }

  /**
   * Stream transcript in real-time
   * For live transcription scenarios
   */
  async streamTranscript(onChunk) {
    if (typeof onChunk !== 'function') {
      throw new Error('onChunk must be a function');
    }

    // TODO: Implement streaming logic when Omi API supports it
    // This is a placeholder for future implementation

    return {
      success: true,
      message: 'Streaming not yet implemented',
    };
  }

  /**
   * Register listener for transcript events
   */
  addListener(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.listeners.push({
      event,
      callback,
    });
  }

  /**
   * Remove listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(
      listener => listener.callback !== callback
    );
  }

  /**
   * Notify all listeners of an event
   */
  notifyListeners(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => {
        try {
          listener.callback(data);
        } catch (error) {
          console.error('Omi Integration: Listener error', error);
        }
      });
  }

  /**
   * Generate unique transcript ID
   */
  generateTranscriptId() {
    return `transcript_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      config: {
        hasApiUrl: !!this.config.apiUrl,
        hasApiKey: !!this.config.apiKey,
      },
      listenerCount: this.listeners.length,
    };
  }

  /**
   * Extract user intent from transcript
   * Simplified version - delegates to intent recognition
   */
  extractIntent(transcript) {
    // This will be used by the orchestrator
    // Just return the text for now
    return transcript.text || transcript.content || '';
  }

  /**
   * Mock transcript for testing
   */
  createMockTranscript(text) {
    return {
      id: this.generateTranscriptId(),
      text,
      timestamp: new Date().toISOString(),
      segments: [
        {
          speaker: 'user',
          text,
          timestamp: new Date().toISOString(),
        },
      ],
      metadata: {
        source: 'mock',
        confidence: 1.0,
        language: 'en',
        duration: text.split(' ').length * 0.5, // Approximate duration
      },
    };
  }

  /**
   * Process webhook payload from Omi
   */
  async processWebhook(payload) {
    try {
      // Validate webhook payload
      if (!payload) {
        throw new Error('Invalid webhook payload');
      }

      // Extract transcript data from payload
      const transcript = payload.transcript || payload.data || payload;

      // Process as normal transcript
      return await this.processTranscript(transcript);
    } catch (error) {
      console.error('Omi Integration: Webhook processing failed', error);
      throw error;
    }
  }

  /**
   * Get transcript history (if Omi supports it)
   */
  async getTranscriptHistory(options = {}) {
    try {
      const { limit = 10, offset = 0 } = options;

      // TODO: Implement when Omi API is available
      console.log('Omi Integration: getTranscriptHistory not yet implemented');

      return {
        transcripts: [],
        total: 0,
        limit,
        offset,
      };
    } catch (error) {
      console.error('Omi Integration: Failed to get history', error);
      throw error;
    }
  }
}

// Export singleton instance
const omiIntegration = new OmiIntegration();
export default omiIntegration;
