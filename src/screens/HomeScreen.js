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
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButtonText: {
    fontSize: 26,
    color: COLORS.TEXT_INVERSE,
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_INVERSE,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_INVERSE,
    opacity: 0.9,
    marginTop: 3,
    fontWeight: '500',
  },
});

export default HomeScreen;
