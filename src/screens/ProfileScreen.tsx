import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { UserStorage } from '../storage/UserStorage';
import { TokenStorage } from '../storage/TokenStorage';
import { UserModel } from '../models/AuthModel';

type Props = NativeStackScreenProps<RootStackParamList, 'MainApp'>;

interface MenuItem {
  icon: string;
  label: string;
  sublabel?: string;
  danger?: boolean;
  isToggle?: boolean;
}

// ── Menu items with MaterialIcons names ────────────────────────
const ACCOUNT_ITEMS: MenuItem[] = [
  { icon: 'person-outline',     label: 'Edit Profile' },
  { icon: 'lock-outline',       label: 'Change Password' },
  { icon: 'mail-outline',       label: 'Email Preferences' },
];

const PREFERENCE_ITEMS: MenuItem[] = [
  { icon: 'notifications-none', label: 'Notifications' },
  { icon: 'language',           label: 'Language', sublabel: 'English' },
  { icon: 'dark-mode',          label: 'Dark Mode', isToggle: true },
];

const SUPPORT_ITEMS: MenuItem[] = [
  { icon: 'help-outline',           label: 'Help & FAQ' },
  { icon: 'star-outline',           label: 'Rate the App' },
  { icon: 'privacy-tip',            label: 'Privacy Policy' },
  { icon: 'description',            label: 'Terms of Service' },
];

// ── Design tokens (matches app theme) ──────────────────────────
const GREEN_NAVY = '#1A237E';
const GREEN_BG   = '#E8F5E9';
const CARD_BG    = '#FFFFFF';
const TEXT_DARK  = '#111827';
const TEXT_MUTED = '#6B8C6B';
const BORDER     = '#D4E8D4';
const ERROR      = '#D32F2F';

const ProfileScreen = ({ navigation }: Props) => {
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Load user from local storage
  const [user, setUser] = useState<UserModel | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await UserStorage.getUser();
      setUser(storedUser);
      // ✅ Sync dark mode toggle with stored preference, if present
      if (storedUser?.preferences?.darkMode !== undefined) {
        setDarkMode(storedUser.preferences.darkMode);
      }
      setLoadingUser(false);
    };
    loadUser();
  }, []);

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Guest User';

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'GU';

  const handleMenuPress = (label: string) => {
    console.log(`${label} pressed`);
  };

  const handleSettingsPress = () => console.log('Settings pressed');

  // ✅ Clears both Keychain token and AsyncStorage user
  const clearAuthStorage = async (): Promise<void> => {
    await Promise.all([
      TokenStorage.clearToken(),
      UserStorage.clearUser(),
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearAuthStorage();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  // ── Reusable menu card renderer ───────────────────────────
  const renderMenuCard = (items: MenuItem[]) => (
    <View style={styles.menuCard}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.menuItem,
            index < items.length - 1 && styles.menuItemBorder,
          ]}
          onPress={() => !item.isToggle && handleMenuPress(item.label)}
          disabled={item.isToggle}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          testID={`menu-${item.label}`}
          activeOpacity={item.isToggle ? 1 : 0.6}
        >
          <View style={styles.menuLeft}>
            <MaterialIcons
              name={item.icon}
              size={20}
              color={GREEN_NAVY}
              style={styles.menuIcon}
            />
            <View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.sublabel ? (
                <Text style={styles.menuSublabel}>{item.sublabel}</Text>
              ) : null}
            </View>
          </View>

          {item.isToggle ? (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#D4E8D4', true: GREEN_NAVY }}
              thumbColor="#fff"
              testID="dark-mode-switch"
            />
          ) : (
            <MaterialIcons name="chevron-right" size={20} color="#C4D4C4" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          testID="back-btn"
        >
          <MaterialIcons name="arrow-back" size={22} color={TEXT_DARK} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          onPress={handleSettingsPress}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          testID="settings-btn"
        >
          <MaterialIcons name="settings" size={22} color={TEXT_DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Avatar + name ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <TouchableOpacity
              style={styles.editBadge}
              accessibilityRole="button"
              accessibilityLabel="Edit avatar"
              testID="edit-avatar-btn"
            >
              <MaterialIcons name="edit" size={13} color={GREEN_NAVY} />
            </TouchableOpacity>
          </View>

          {/* ✅ Real user name and email from storage */}
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>
            {user?.email ?? 'guest@example.com'}
          </Text>

          {/* Address shown if available */}
          {user?.address ? (
            <View style={styles.addressRow}>
              <MaterialIcons name="location-on" size={14} color={TEXT_MUTED} />
              <Text style={styles.addressText} numberOfLines={1}>
                {user.address}
              </Text>
            </View>
          ) : null}

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

        {/* ── Account ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderMenuCard(ACCOUNT_ITEMS)}
        </View>

        {/* ── Preferences ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderMenuCard(PREFERENCE_ITEMS)}
        </View>

        {/* ── Support ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderMenuCard(SUPPORT_ITEMS)}
        </View>

        {/* ── Logout ── */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutCard}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Logout"
            testID="logout-btn"
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={20} color={ERROR} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
    backgroundColor: GREEN_BG,
  },
  content: {
    paddingBottom: 100,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: GREEN_NAVY,
  },

  // ── Profile card ────────────────────────────────────────────
  profileCard: {
    backgroundColor: CARD_BG,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GREEN_NAVY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '700' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  userEmail: { fontSize: 13, color: TEXT_MUTED, marginBottom: 8 },

  // ── Address ─────────────────────────────────────────────────
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
    maxWidth: '100%',
  },
  addressText: {
    fontSize: 12,
    color: TEXT_MUTED,
    flexShrink: 1,
  },

  // ── Stats ───────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: GREEN_BG,
    borderRadius: 12,
    paddingVertical: 14,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: GREEN_NAVY },
  statLabel: { fontSize: 11, color: TEXT_MUTED, marginTop: 2, fontWeight: '600' },
  statDivider: { width: 1, height: 32, backgroundColor: BORDER },

  // ── Menu sections ───────────────────────────────────────────
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: GREEN_NAVY,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4ED',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon: { width: 22 },
  menuLabel: { fontSize: 14, color: TEXT_DARK, fontWeight: '600' },
  menuSublabel: { fontSize: 12, color: '#AAB4C4', marginTop: 1 },

  // ── Logout ──────────────────────────────────────────────────
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: ERROR,
  },

  // ── Version ─────────────────────────────────────────────────
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#AAB4C4',
    marginTop: 8,
    marginBottom: 8,
  },
});