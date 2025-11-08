/**
 * MCP Orchestrator App
 * Main application entry point
 * Sets up navigation and context providers
 */

import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { ConversationProvider } from './src/context/ConversationContext';
import { MCPProvider } from './src/context/MCPContext';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { THEME } from './src/constants/colors';

// Ignore specific warnings
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={THEME}>
      <ConversationProvider>
        <MCPProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#F2F2F7' },
                gestureEnabled: true,
                gestureDirection: 'horizontal',
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </MCPProvider>
      </ConversationProvider>
    </PaperProvider>
  );
}
