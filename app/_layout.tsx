import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { useFonts } from 'expo-font';
import { router, Slot, usePathname } from 'expo-router';
import LeftSidebar from '@/components/leftSidebar';
import HeaderBar from '@/components/header';
import Footer from '@/components/footer';
import Cancel from '../assets/icons/x-circle.svg';
import { RefreshControl } from 'react-native';
import { DarkModeProvider, useDarkMode } from '@/context/DarkModeContext';

export default function Layout() {
  return (
    <DarkModeProvider>
      <InnerLayout />
    </DarkModeProvider>
  );
}

function InnerLayout() {
 const { isDarkMode } = useDarkMode();
 const [fontsLoaded] = useFonts({
    InterRegular: require('@/assets/fonts/Inter/static/Inter_18pt-Thin.ttf'),
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const pathname = usePathname();
  const [refreshing, setRefreshing] = useState(false);
  const routeLabels: Record<string, string> = {
    age: 'AGE',
    intothedeep: 'DIVE',
    discord: 'Discord',
    app: 'App',
    ScoutSheet: 'ScoutSheet',
    tranks: 'Teams',
    tauto: 'Auto',
    ttele: 'TeleOp',
    tendgame: 'Endgame',
    mranks: 'Matches',
    qual: 'Qualifiers',
    finals: 'Finals',
    premier: 'Premier',
  };
  var currentPage = routeLabels[pathname?.split('/').pop() || ''] || '';
  
  const sidebarTranslateX = useRef(new Animated.Value(sidebarVisible ? 0 : -209)).current;
  const overlayOpacity = useRef(new Animated.Value(sidebarVisible ? 1 : 0)).current;
  const sidebarWidth = useRef(new Animated.Value(180)).current;

  const isDesktop = screenWidth > 800;

  const onRefresh = async () => {
    setRefreshing(true);
    router.replace(usePathname() as any);
    setRefreshing(false);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (isDesktop) {
      Animated.timing(sidebarWidth, {
        toValue: sidebarVisible ? 209 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [sidebarVisible, isDesktop, sidebarWidth]);

  useEffect(() => {
    if (!isDesktop) {
      Animated.parallel([
        Animated.timing(sidebarTranslateX, {
          toValue: sidebarVisible ? 0 : -209,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: sidebarVisible ? 1 : 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sidebarVisible, isDesktop, sidebarTranslateX, overlayOpacity]);

  if (!fontsLoaded) return null;

  if (pathname === '/auth/signin' || pathname === '/auth/signup') {
    return (
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    );
  }

  if (isDesktop) {
    return (
      <View style={styles2.container}>
        <Animated.View style={[styles2.sidebar, { width: sidebarWidth }]}>
          {sidebarVisible && <LeftSidebar close={() => setSidebarVisible(false)} />}
        </Animated.View>

        <View style={[styles2.contentArea, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, .8)' }]}>
          <HeaderBar toggleSidebar={() => setSidebarVisible(!sidebarVisible)} currentPage={currentPage}/>
          <ScrollView 
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={[styles2.scrollContent, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 1)' }]}>
            <View style={[styles.pageContent, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 1)' }]}>
              <Slot />
            </View>
            <Footer />
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 1)' }]}>
      <View style={[styles.contentArea , isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 1)' }]}>
        <HeaderBar toggleSidebar={() => setSidebarVisible(!sidebarVisible)} currentPage={currentPage}/>
        <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[styles.scrollContent, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 1)' }]}>
          <View style={[styles.pageContent, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 1)' }]}>
            <Slot />
          </View>
          <Footer />
        </ScrollView>
      </View>

      {sidebarVisible && (
        <Animated.View style={[styles.blurOverlay, { opacity: overlayOpacity }]} />
      )}

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarTranslateX }] }, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 1)' }]}>
        <LeftSidebar close={() => setSidebarVisible(false)} />
        {sidebarVisible && (
          <Animated.View style={[styles.closeButton, { opacity: overlayOpacity }, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 0.8)' }]}>
            <TouchableOpacity style={[styles.closeButtonTouch, isDarkMode && { backgroundColor: 'rgba(42, 42, 42, 1)' }]} onPress={() => setSidebarVisible(false)}>
              <Cancel width={16} height={16} fill={isDarkMode ? "#fff" : '#000'}/>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'column',
  },
  pageContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 209,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: -40,
    zIndex: 1001,
    borderRadius: 6,
  },
  closeButtonTouch: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});

const styles2 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  sidebar: {
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'column',
  },
   pageContent: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});