import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ title, children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B', // deep slate 800
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#6366f1', // neon glow shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#f8fafc', // ultra light text
    letterSpacing: 0.5,
  },
});

export default Card;
