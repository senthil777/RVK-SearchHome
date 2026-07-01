import React from 'react';
import {View, Text, StyleSheet, Platform,Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import MyListScreen from '../screens/MyListScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type BottomTabParamList = {
  Home: undefined;
  MyList: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface TabIconProps {
  icon: any;
  label: string;
  focused: boolean;
}

const TabIcon = ({
  icon,
  label,
  focused,
}: TabIconProps) => (
  <View style={tabStyles.wrapper}>
    <Image
      source={icon}
      style={[
        tabStyles.icon,
        {
          opacity: focused ? 1 : 0.5,
        },
        {
      tintColor: focused ? '#1A237E' : '#aaa',
    },

      ]}
      resizeMode="contain"
    />

    <Text
      style={[
        tabStyles.label,
        focused && tabStyles.labelFocused,
      ]}>
      {label}
    </Text>
  </View>
);

const BottomTabNavigator = () => {
  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom']}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0.5,
            borderTopColor: '#eee',
            height: Platform.OS === 'ios' ? 85 : 70,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -3,
            },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <TabIcon
                icon={require('../assets/icons/home.png')}
                label="Home"
                focused={focused}
              />
            ),
          }}
        />

        <Tab.Screen
          name="MyList"
          component={MyListScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <TabIcon
                icon={require('../assets/icons/myList.png')}
                label="My List"
                focused={focused}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <TabIcon
                icon={require('../assets/icons/profile.png')}
                label="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const tabStyles = StyleSheet.create({

  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    marginTop:16,
    width: 70,
  },

  icon: {
    width: 20,
    height: 20,
  },

  label: {
    fontSize: 11,
    marginTop: 3,
    color: '#aaa',
    fontWeight: '500',
  },

  labelFocused: {
    color: '#1A237E',
  },

});