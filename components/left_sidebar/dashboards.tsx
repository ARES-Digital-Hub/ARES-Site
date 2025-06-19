import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Chart from '../../assets/icons/chart-pie-slice-fill.svg';
import Graph from '../../assets/icons/chart-line-fill.svg';
import { useRouter } from 'expo-router';
import { useDarkMode } from '@/context/DarkModeContext';

type DashboardsProps = {
  close?: () => void;
};

const Dashboards = ({ close }: DashboardsProps) => {
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  const textColor = isDarkMode ? '#fff' : '#000';
  const mutedColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const bgColor = isDarkMode ? 'rgba(42, 42, 42, 1)' : '#fff';
  const hoverBg = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <View style={[styles.sidebar, { backgroundColor: bgColor }]}>
      <Text style={[styles.sectionTitle, { color: mutedColor }]}>Dashboards</Text>

      <SidebarItem
        label="Into the Deep"
        icon={<View style={styles.teamIcons}><Chart width={18} height={18} fill={isDarkMode ? '#fff' : '#000'}/></View>}
        onPress={() => {
          router.push('/dashboards/intothedeep');
          // close?.();
        }}
        isDarkMode={isDarkMode}
      />

      <SidebarItem
        label="Decode"
        icon={<View style={styles.teamIcons}><Graph width={18} height={18} fill={isDarkMode ? '#fff' : '#000'}/></View>}
        onPress={() => {
          router.push('/dashboards/age');
          // close?.();
        }}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

const SidebarItem = ({
  label,
  icon,
  isSelected = false,
  onPress,
  isDarkMode,
}: {
  label: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onPress?: () => void;
  isDarkMode: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  const textColor = isDarkMode ? '#fff' : '#000';
  const hoverBg = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.item,
        hovered && { backgroundColor: hoverBg, borderRadius: 13 },
      ]}
    >
      <View style={styles.iconLabel}>
        {icon ? icon : <View style={{ width: 16, height: 16, paddingLeft: 60 }} />}
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    paddingHorizontal: 9,
    gap: 2.2,
    paddingVertical: 9,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    marginBottom: 9,
    paddingHorizontal: 13,
  },
  item: {
    paddingVertical: 9,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  label: {
    fontSize: 15,
  },
  teamIcons: {
    paddingLeft: 33,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4.4,
    position: 'relative',
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Dashboards;