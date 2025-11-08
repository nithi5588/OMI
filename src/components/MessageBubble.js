/**
 * Message Bubble Component
 * Displays individual messages in the chat interface
 * Supports user, assistant, and system message types
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { COLORS } from '../constants/colors';

const MessageBubble = ({ message }) => {
  const { type, content, timestamp } = message;

  const isUser = type === 'user';
  const isAssistant = type === 'assistant';
  const isSystem = type === 'system';

  const getBubbleStyle = () => {
    if (isUser) return styles.userBubble;
    if (isSystem) return styles.systemBubble;
    return styles.aiBubble;
  };

  const getTextStyle = () => {
    if (isUser) return styles.userText;
    if (isSystem) return styles.systemText;
    return styles.aiText;
  };

  const getContainerStyle = () => {
    if (isUser) return styles.userContainer;
    if (isSystem) return styles.systemContainer;
    return styles.aiContainer;
  };

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm');
    } catch (error) {
      return '';
    }
  };

  return (
    <View style={getContainerStyle()}>
      <View style={[styles.bubble, getBubbleStyle()]}>
        <Text style={[styles.messageText, getTextStyle()]}>{content}</Text>
        {timestamp && (
          <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
            {formatTime(timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container styles
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 4,
    marginHorizontal: 12,
  },
  aiContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 4,
    marginHorizontal: 12,
  },
  systemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 12,
  },

  // Bubble styles
  bubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: COLORS.USER_MESSAGE_BG,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.AI_MESSAGE_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    borderBottomLeftRadius: 4,
  },
  systemBubble: {
    backgroundColor: COLORS.SYSTEM_MESSAGE_BG,
    maxWidth: '85%',
  },

  // Text styles
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.USER_MESSAGE_TEXT,
  },
  aiText: {
    color: COLORS.AI_MESSAGE_TEXT,
  },
  systemText: {
    color: COLORS.SYSTEM_MESSAGE_TEXT,
    fontSize: 14,
    textAlign: 'center',
  },

  // Timestamp styles
  timestamp: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: COLORS.USER_MESSAGE_TEXT,
    opacity: 0.7,
  },
});

export default MessageBubble;
