import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

interface MenuItem {
  icon: string;
  label: string;
  sublabel?: string;
  danger?: boolean;
}

const MENU_SECTIONS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Account',
    items: [
      { icon: '👤', label: 'Edit Profile' },
      { icon: '🔒', label: 'Change Password' },
      { icon: '📧', label: 'Email Preferences' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: '🔔', label: 'Notifications' },
      { icon: '🌐', label: 'Language', sublabel: 'English' },
      { icon: '🌙', label: 'Dark Mode' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: '❓', label: 'Help & FAQ' },
      { icon: '⭐', label: 'Rate the App' },
      { icon: '📄', label: 'Privacy Policy' },
      { icon: '📋', label: 'Terms of Service' },
    ],
  },
  {
    title: '',
    items: [
      { icon: '🚪', label: 'Logout', danger: true },
    ],
  },
];

const ProfileScreen = () => {
  const handleMenuPress = (label: string) => {
    if (label === 'Logout') {
      // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      console.log('Logout pressed');
    }
    console.log(`${label} pressed`);
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Avatar + name */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Text style={styles.editBadgeText}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Recent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Shared</Text>
          </View>
        </View>
      </View>

      {/* Menu sections */}
      {MENU_SECTIONS.map((section, sIndex) => (
        <View key={sIndex} style={styles.section}>
          {section.title ? (
            <Text style={styles.sectionTitle}>{section.title}</Text>
          ) : null}

          <View style={styles.menuCard}>
            {section.items.map((item, iIndex) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  iIndex < section.items.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleMenuPress(item.label)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                testID={`menu-${item.label}`}
                activeOpacity={0.6}
              >
                <View style={styles.menuLeft}>
                  <View style={[
                    styles.menuIconBox,
                    item.danger && styles.menuIconBoxDanger,
                  ]}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                  </View>
                  <View>
                    <Text style={[
                      styles.menuLabel,
                      item.danger && styles.menuLabelDanger,
                    ]}>
                      {item.label}
                    </Text>
                    {item.sublabel ? (
                      <Text style={styles.menuSublabel}>{item.sublabel}</Text>
                    ) : null}
                  </View>
                </View>
                {!item.danger && (
                  <Text style={styles.menuChevron}>›</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { paddingBottom: 40 },

  // Header
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#F8F9FB',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111' },

  // Profile card
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '700' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  editBadgeText: { fontSize: 12 },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  userEmail: { fontSize: 13, color: '#888', marginBottom: 20 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8F9FB',
    borderRadius: 10,
    paddingVertical: 14,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#111' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#eee' },

  // Menu sections
  section: { marginHorizontal: 20, marginBottom: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconBoxDanger: { backgroundColor: '#FFF0F0' },
  menuIcon: { fontSize: 17 },
  menuLabel: { fontSize: 14, color: '#111', fontWeight: '500' },
  menuLabelDanger: { color: '#E24B4A' },
  menuSublabel: { fontSize: 12, color: '#aaa', marginTop: 1 },
  menuChevron: { fontSize: 20, color: '#ccc' },

  // Version
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ccc',
    marginTop: 8,
    marginBottom: 8,
  },
});