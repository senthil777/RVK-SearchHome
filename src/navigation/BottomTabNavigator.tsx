import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MyListScreen from '../screens/MyListScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type BottomTabParamList = {
  Home: undefined;
  MyList: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// ── Custom tab icon ───────────────────────────────────────────────
interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

const TabIcon = ({ emoji, label, focused }: TabIconProps) => (
  <View style={tabStyles.wrapper}>
    <Text style={[tabStyles.emoji, focused && tabStyles.emojiFocused]}>
      {emoji}
    </Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>
      {label}
    </Text>
  </View>
);

const tabStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    width: 70,
  },
  emoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  emojiFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    marginTop: 3,
    color: '#aaa',
    fontWeight: '500',
  },
  labelFocused: {
    color: '#007AFF',
  },
});

// ── Navigator ─────────────────────────────────────────────────────
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#eee',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="MyList"
        component={MyListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="My List" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;