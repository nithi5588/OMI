/**
 * Home Screen
 * Main chat interface with navigation to history
 * Displays ChatWindow and provides conversation management
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ChatWindow from '../components/ChatWindow';
import { useConversation } from '../context/ConversationContext';
import { COLORS } from '../constants/colors';

const HomeScreen = ({ navigation }) => {
  const { startNewConversation, currentConversation } = useConversation();

  const handleNewConversation = () => {
    startNewConversation();
  };

  const handleOpenHistory = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.PRIMARY} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleOpenHistory}
        >
          <Text style={styles.headerButtonText}>☰</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>MCP Orchestrator</Text>
          <Text style={styles.headerSubtitle}>
            {currentConversation
              ? `${currentConversation.messages.length} messages`
              : 'No active conversation'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleNewConversation}
        >
          <Text style={styles.headerButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Window */}
      <ChatWindow />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_INVERSE,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_INVERSE,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_INVERSE,
    opacity: 0.8,
    marginTop: 2,
  },
});

export default HomeScreen;
