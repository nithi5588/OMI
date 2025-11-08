/**
 * MCP Workflow Card Component
 * Displays MCP workflow execution with real-time status updates
 * Shows intent, selected MCPs, execution steps, and parameters
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import { MCP_TOOLS } from '../constants/mcpTools';

const MCPWorkflowCard = ({ workflow }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!workflow) return null;

  const {
    intent,
    primaryMCP,
    secondaryMCPs = [],
    steps = [],
    parameters = {},
    status = 'pending',
  } = workflow;

  const getPrimaryMCPInfo = () => {
    return Object.values(MCP_TOOLS).find(t => t.id === primaryMCP);
  };

  const getSecondaryMCPInfo = (mcpId) => {
    return Object.values(MCP_TOOLS).find(t => t.id === mcpId);
  };

  const getStatusIcon = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '⏳';
      case 'failed':
        return '✗';
      default:
        return '○';
    }
  };

  const getStatusColor = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return COLORS.MCP_COMPLETED;
      case 'in_progress':
        return COLORS.MCP_IN_PROGRESS;
      case 'failed':
        return COLORS.MCP_FAILED;
      default:
        return COLORS.MCP_PENDING;
    }
  };

  const primaryMCPInfo = getPrimaryMCPInfo();

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.intentIcon}>🎯</Text>
          <View style={styles.headerText}>
            <Text style={styles.intentLabel}>Intent</Text>
            <Text style={styles.intentText} numberOfLines={1}>
              {intent}
            </Text>
          </View>
        </View>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.content}>
          {/* MCPs Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 MCPs</Text>
            <View style={styles.mcpContainer}>
              <View style={styles.mcpItem}>
                <Text style={styles.mcpIcon}>{primaryMCPInfo?.icon}</Text>
                <Text style={styles.mcpName}>{primaryMCPInfo?.name}</Text>
                <View style={styles.mcpBadge}>
                  <Text style={styles.mcpBadgeText}>Primary</Text>
                </View>
              </View>
              {secondaryMCPs.length > 0 && (
                <>
                  {secondaryMCPs.map((mcpId, index) => {
                    const mcpInfo = getSecondaryMCPInfo(mcpId);
                    return (
                      <View key={index} style={styles.mcpItem}>
                        <Text style={styles.mcpIcon}>{mcpInfo?.icon}</Text>
                        <Text style={styles.mcpNameSecondary}>{mcpInfo?.name}</Text>
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          </View>

          {/* Steps Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Steps</Text>
            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={step.id || index} style={styles.stepItem}>
                  <View style={styles.stepLeft}>
                    <Text
                      style={[
                        styles.stepIcon,
                        { color: getStatusColor(step.status) },
                      ]}
                    >
                      {getStatusIcon(step.status)}
                    </Text>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                  </View>
                  <Text
                    style={[
                      styles.stepDescription,
                      step.status === 'completed' && styles.stepCompleted,
                    ]}
                  >
                    {step.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Parameters Section */}
          {Object.keys(parameters).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parameters</Text>
              <View style={styles.parametersContainer}>
                {Object.entries(parameters).map(([key, value]) => {
                  // Skip userInput as it's too long
                  if (key === 'userInput') return null;

                  return (
                    <View key={key} style={styles.parameterItem}>
                      <Text style={styles.parameterKey}>• {key}:</Text>
                      <Text style={styles.parameterValue}>{String(value)}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Status Footer */}
          <View style={styles.footer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(status) },
              ]}
            >
              <Text style={styles.statusText}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginVertical: 8,
    marginHorizontal: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  intentIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  intentLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  intentText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  expandIcon: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },

  // Content
  content: {
    padding: 12,
  },

  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },

  // MCPs
  mcpContainer: {
    gap: 8,
  },
  mcpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  mcpIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  mcpName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  mcpNameSecondary: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  mcpBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  mcpBadgeText: {
    fontSize: 11,
    color: COLORS.TEXT_INVERSE,
    fontWeight: '600',
  },

  // Steps
  stepsContainer: {
    gap: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  stepIcon: {
    fontSize: 16,
    marginRight: 6,
    fontWeight: '600',
  },
  stepNumber: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    marginRight: 6,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    lineHeight: 20,
  },
  stepCompleted: {
    color: COLORS.TEXT_SECONDARY,
  },

  // Parameters
  parametersContainer: {
    gap: 6,
  },
  parameterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parameterKey: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginRight: 6,
  },
  parameterValue: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
    flex: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.TEXT_INVERSE,
    fontWeight: '600',
  },
});

export default MCPWorkflowCard;
