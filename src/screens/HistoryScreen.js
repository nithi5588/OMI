/**
 * History Screen
 * Displays conversation history with search and filter capabilities
 * Shows statistics and allows opening previous conversations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useConversation } from '../context/ConversationContext';
import { COLORS } from '../constants/colors';
import { format } from 'date-fns';

const HistoryScreen = ({ navigation }) => {
  const {
    conversationHistory,
    loadConversation,
    deleteConversation,
    searchConversations,
    getStats,
    loadConversationHistory,
  } = useConversation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversationHistory]);

  const loadData = async () => {
    await loadConversationHistory();
    const statistics = await getStats();
    setStats(statistics);
  };

  const filterConversations = async () => {
    if (searchQuery.trim()) {
      const results = await searchConversations(searchQuery);
      setFilteredConversations(results);
    } else {
      setFilteredConversations(conversationHistory);
    }
  };

  const handleOpenConversation = async (conversation) => {
    await loadConversation(conversation.id);
    navigation.goBack();
  };

  const handleDeleteConversation = (conversation) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteConversation(conversation.id);
            loadData();
          },
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy • HH:mm');
    } catch (error) {
      return '';
    }
  };

  const getFirstMessage = (conversation) => {
    const firstUserMessage = conversation.messages.find(
      (msg) => msg.type === 'user'
    );
    if (firstUserMessage) {
      return firstUserMessage.content.substring(0, 60) + '...';
    }
    return 'No messages';
  };

  const getMCPIcons = (conversation) => {
    const mcps = conversation.metadata?.mcpsUsed || [];
    return mcps.slice(0, 3).join(' ');
  };

  const renderStatistics = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>📊 Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalConversations}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.recentConversations}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.successRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>
        {stats.mostUsedMCPs && stats.mostUsedMCPs.length > 0 && (
          <View style={styles.mostUsedContainer}>
            <Text style={styles.mostUsedLabel}>Most used:</Text>
            <Text style={styles.mostUsedValue}>
              {stats.mostUsedMCPs.map((m) => m.mcp).join(', ')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => handleOpenConversation(item)}
      onLongPress={() => handleDeleteConversation(item)}
      activeOpacity={0.7}
    >
      <View style={styles.conversationHeader}>
        <Text style={styles.conversationDate}>{formatDate(item.timestamp)}</Text>
        <Text style={styles.conversationMCPs}>{getMCPIcons(item)}</Text>
      </View>
      <Text style={styles.conversationPreview} numberOfLines={2}>
        {getFirstMessage(item)}
      </Text>
      <View style={styles.conversationFooter}>
        <Text style={styles.conversationStats}>
          {item.messages.length} messages
        </Text>
        {item.workflows && item.workflows.length > 0 && (
          <Text style={styles.conversationWorkflows}>
            {item.workflows.length} workflows
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptyDescription}>
        Start a conversation to see your history here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.PRIMARY} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Statistics */}
      {renderStatistics()}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          filteredConversations.length === 0 && styles.listContainerEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
      />
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_INVERSE,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_INVERSE,
  },
  headerSpacer: {
    width: 40,
  },

  // Statistics
  statsContainer: {
    backgroundColor: COLORS.SURFACE,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  mostUsedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  mostUsedLabel: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginRight: 6,
  },
  mostUsedValue: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    flex: 1,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 10,
  },
  clearButton: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    paddingLeft: 8,
  },

  // List
  listContainer: {
    paddingHorizontal: 12,
  },
  listContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Conversation Card
  conversationCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationDate: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  conversationMCPs: {
    fontSize: 16,
  },
  conversationPreview: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 21,
    marginBottom: 8,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conversationStats: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  conversationWorkflows: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HistoryScreen;
