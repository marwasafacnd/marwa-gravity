import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Search, X, Barcode } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  resultCount,
}) => {
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#1e293b',
          borderColor: '#334155',
          borderWidth: 1,
          borderRadius: 14,
          paddingHorizontal: 14,
          height: 48,
        }}
      >
        <Search color="#38bdf8" size={20} style={{ marginRight: 10 }} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search products by Name, SKU, or Barcode (e.g. BEV-001)..."
          placeholderTextColor="#64748b"
          style={{
            flex: 1,
            color: '#ffffff',
            fontSize: 15,
            fontWeight: '500',
            height: '100%',
          }}
        />

        {value.length > 0 ? (
          <TouchableOpacity
            onPress={onClear}
            style={{ backgroundColor: '#334155', borderRadius: 999, padding: 4, marginRight: 8 }}
            activeOpacity={0.7}
          >
            <X color="#94a3b8" size={16} />
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 }}>
            <Barcode color="#94a3b8" size={16} style={{ marginRight: 4 }} />
            <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '600' }}>SCAN</Text>
          </View>
        )}

        <View style={{ backgroundColor: '#0284c720', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '700' }}>
            {resultCount} {resultCount === 1 ? 'Product' : 'Products'}
          </Text>
        </View>
      </View>
    </View>
  );
};
