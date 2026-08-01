import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Coffee, Cookie, Utensils, Apple, Milk, Layers } from 'lucide-react-native';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Layers size={16} />,
  Beverages: <Coffee size={16} />,
  Bakery: <Cookie size={16} />,
  Snacks: <Utensils size={16} />,
  Produce: <Apple size={16} />,
  Dairy: <Milk size={16} />,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const icon = CATEGORY_ICONS[cat] || <Layers size={16} />;

          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isSelected ? '#0284c7' : '#1e293b',
                borderColor: isSelected ? '#38bdf8' : '#334155',
                borderWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                gap: 6,
              }}
            >
              {React.cloneElement(icon as React.ReactElement, {
                color: isSelected ? '#ffffff' : '#94a3b8',
              })}
              <Text
                style={{
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  fontSize: 14,
                  fontWeight: isSelected ? '700' : '500',
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
