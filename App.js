/**
 * MCP Orchestrator App
 * Main application entry point
 * Sets up navigation and context providers
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { ConversationProvider } from './src/context/ConversationContext';
import { MCPProvider } from './src/context/MCPContext';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { THEME } from './src/constants/colors';

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
