import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  title: string;
  onSeeAllPress?: () => void;
}

const SectionHeader = ({ title, onSeeAllPress }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {onSeeAllPress && (
      <TouchableOpacity
        onPress={onSeeAllPress}
        accessibilityRole="link"
        accessibilityLabel={`See all ${title}`}
        testID={`see-all-${title.toLowerCase()}`}
      >
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 17, fontWeight: '600', color: '#111' },
  seeAll: { fontSize: 13, color: '#007AFF', fontWeight: '500' },
});