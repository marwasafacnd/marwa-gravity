import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Plus, Minus, Trash2 } from 'lucide-react-native';
import { CartItem } from '../types';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity, subtotal } = item;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
      }}
    >
      {/* Product Image */}
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: 44, height: 44, borderRadius: 8, marginRight: 10 }}
        />
      ) : (
        <View style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: '#1e293b', marginRight: 10 }} />
      )}

      {/* Product Details */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
          ${Number(product.price).toFixed(2)} x {quantity}
        </Text>
      </View>

      {/* Quantity Modifiers */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#1e293b',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#334155',
          marginRight: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => onUpdateQuantity(product.id, quantity - 1)}
          style={{ paddingHorizontal: 8, paddingVertical: 6 }}
          activeOpacity={0.7}
        >
          <Minus color="#cbd5e1" size={14} />
        </TouchableOpacity>

        <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700', paddingHorizontal: 6 }}>
          {quantity}
        </Text>

        <TouchableOpacity
          onPress={() => onUpdateQuantity(product.id, quantity + 1)}
          style={{ paddingHorizontal: 8, paddingVertical: 6 }}
          activeOpacity={0.7}
        >
          <Plus color="#cbd5e1" size={14} />
        </TouchableOpacity>
      </View>

      {/* Line Item Total */}
      <Text style={{ color: '#34d399', fontSize: 14, fontWeight: '800', width: 55, textAlign: 'right', marginRight: 8 }}>
        ${subtotal.toFixed(2)}
      </Text>

      {/* REMOVE PRODUCT BUTTON (Requirement #4) */}
      <TouchableOpacity
        onPress={() => onRemove(product.id)}
        style={{
          backgroundColor: '#ef444420',
          padding: 8,
          borderRadius: 8,
          borderColor: '#ef444440',
          borderWidth: 1,
        }}
        activeOpacity={0.7}
      >
        <Trash2 color="#f87171" size={16} />
      </TouchableOpacity>
    </View>
  );
};
