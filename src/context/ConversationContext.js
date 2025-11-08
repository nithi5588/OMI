/**
 * Conversation Context
 * Manages global conversation state and provides actions
 * for message management and conversation operations
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storageService from '../services/StorageService';
import aiOrchestrator from '../services/AIOrchestrator';

const ConversationContext = createContext();

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
};

export const ConversationProvider = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load conversation history on mount
  useEffect(() => {
    loadConversationHistory();
  }, []);

  /**
   * Load conversation history from storage
   */
  const loadConversationHistory = async () => {
    try {
      setIsLoading(true);
      const conversations = await storageService.loadConversations();
      setConversationHistory(conversations);

      // If no current conversation, start a new one
      if (!currentConversation && conversations.length === 0) {
        startNewConversation();
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Start a new conversation
   */
  const startNewConversation = useCallback(() => {
    const newConversation = {
      id: generateConversationId(),
      timestamp: new Date().toISOString(),
      messages: [],
      workflows: [],
      metadata: {
        totalMessages: 0,
        mcpsUsed: [],
        duration: 0,
      },
    };

    setCurrentConversation(newConversation);
    return newConversation;
  }, []);

  /**
   * Add a message to the current conversation
   */
  const addMessage = useCallback(async (message) => {
    if (!currentConversation) {
      startNewConversation();
    }

    const newMessage = {
      id: generateMessageId(),
      timestamp: new Date().toISOString(),
      ...message,
    };

    setCurrentConversation(prev => {
      if (!prev) return null;

      const updated = {
        ...prev,
        messages: [...prev.messages, newMessage],
        metadata: {
          ...prev.metadata,
          totalMessages: prev.messages.length + 1,
        },
      };

      // Save to storage asynchronously
      storageService.saveConversation(updated).catch(error => {
        console.error('Error saving conversation:', error);
      });

      return updated;
    });

    return newMessage;
  }, [currentConversation, startNewConversation]);

  /**
   * Add a workflow to the current conversation
   */
  const addWorkflow = useCallback(async (workflow) => {
    if (!currentConversation) {
      return;
    }

    setCurrentConversation(prev => {
      if (!prev) return null;

      const mcpsUsed = new Set(prev.metadata.mcpsUsed || []);
      mcpsUsed.add(workflow.primaryMCP);
      if (workflow.secondaryMCPs) {
        workflow.secondaryMCPs.forEach(mcp => mcpsUsed.add(mcp));
      }

      const updated = {
        ...prev,
        workflows: [...(prev.workflows || []), workflow],
        metadata: {
          ...prev.metadata,
          mcpsUsed: Array.from(mcpsUsed),
        },
      };

      // Save to storage asynchronously
      storageService.saveConversation(updated).catch(error => {
        console.error('Error saving conversation:', error);
      });

      return updated;
    });
  }, [currentConversation]);

  /**
   * Update a workflow in the current conversation
   */
  const updateWorkflow = useCallback(async (workflowId, updates) => {
    if (!currentConversation) {
      return;
    }

    setCurrentConversation(prev => {
      if (!prev) return null;

      const updated = {
        ...prev,
        workflows: prev.workflows.map(wf =>
          wf.id === workflowId ? { ...wf, ...updates } : wf
        ),
      };

      // Save to storage asynchronously
      storageService.saveConversation(updated).catch(error => {
        console.error('Error saving conversation:', error);
      });

      return updated;
    });
  }, [currentConversation]);

  /**
   * Process user input through AI orchestrator
   */
  const processUserInput = useCallback(async (input) => {
    if (!input || !input.trim()) {
      return;
    }

    try {
      setIsProcessing(true);

      // Add user message
      await addMessage({
        type: 'user',
        content: input,
      });

      // Process through orchestrator
      const conversationMessages = currentConversation?.messages || [];

      const result = await aiOrchestrator.processUserInput(
        input,
        conversationMessages,
        {
          onWorkflowUpdate: (workflow) => {
            updateWorkflow(workflow.id, workflow);
          },
          onStepUpdate: (stepIndex, step) => {
            // Update workflow step in real-time if needed
            console.log('Step update:', stepIndex, step);
          },
        }
      );

      // Add workflow if present
      if (result.workflow) {
        await addWorkflow(result.workflow);
      }

      // Add AI response
      await addMessage({
        type: 'assistant',
        content: result.response,
        mcpWorkflow: result.workflow ? {
          id: result.workflow.id,
          intent: result.workflow.intent,
          primaryMCP: result.workflow.primaryMCP,
          secondaryMCPs: result.workflow.secondaryMCPs,
        } : null,
      });

      return result;
    } catch (error) {
      console.error('Error processing user input:', error);

      // Add error message
      await addMessage({
        type: 'system',
        content: `Error: ${error.message}`,
      });

      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [currentConversation, addMessage, addWorkflow, updateWorkflow]);

  /**
   * Load a specific conversation
   */
  const loadConversation = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const conversation = await storageService.getConversation(id);

      if (conversation) {
        setCurrentConversation(conversation);
      }

      return conversation;
    } catch (error) {
      console.error('Error loading conversation:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a conversation
   */
  const deleteConversation = useCallback(async (id) => {
    try {
      const success = await storageService.deleteConversation(id);

      if (success) {
        // Reload history
        await loadConversationHistory();

        // If deleted conversation was current, start new one
        if (currentConversation?.id === id) {
          startNewConversation();
        }
      }

      return success;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }, [currentConversation, startNewConversation]);

  /**
   * Search conversations
   */
  const searchConversations = useCallback(async (query) => {
    try {
      const results = await storageService.searchConversations(query);
      return results;
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }, []);

  /**
   * Get conversation statistics
   */
  const getStats = useCallback(async () => {
    try {
      const stats = await storageService.getStats();
      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  }, []);

  /**
   * Export conversation
   */
  const exportConversation = useCallback(async (id, format = 'json') => {
    try {
      const exported = await storageService.exportConversation(id, format);
      return exported;
    } catch (error) {
      console.error('Error exporting conversation:', error);
      throw error;
    }
  }, []);

  const value = {
    // State
    currentConversation,
    conversationHistory,
    isLoading,
    isProcessing,

    // Actions
    addMessage,
    addWorkflow,
    updateWorkflow,
    processUserInput,
    loadConversation,
    startNewConversation,
    deleteConversation,
    searchConversations,
    getStats,
    exportConversation,
    loadConversationHistory,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

/**
 * Generate unique conversation ID
 */
function generateConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique message ID
 */
function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default ConversationContext;
