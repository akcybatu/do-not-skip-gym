import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'workout', label: 'Log Workout', icon: '🏋️' },
  { id: 'stats', label: 'Stats', icon: '📊' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab,
          ]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text
            style={[
              styles.label,
              activeTab === tab.id && styles.activeLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20, // Account for home indicator on newer iPhones
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
