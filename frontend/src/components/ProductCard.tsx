import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Plus, Check, AlertCircle } from 'lucide-react-native';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  cartQuantity,
}) => {
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <TouchableOpacity
      onPress={() => !isOutOfStock && onAddToCart(product)}
      disabled={isOutOfStock}
      activeOpacity={0.8}
      style={{
        backgroundColor: '#1e293b',
        borderColor: cartQuantity > 0 ? '#0284c7' : '#334155',
        borderWidth: cartQuantity > 0 ? 2 : 1,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        opacity: isOutOfStock ? 0.6 : 1,
      }}
    >
      {/* Product Image */}
      <View style={{ height: 120, width: '100%', backgroundColor: '#0f172a', position: 'relative' }}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#64748b', fontSize: 12 }}>No Image</Text>
          </View>
        )}

        {/* SKU Badge */}
        <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#0f172acc', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
          <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700' }}>{product.sku}</Text>
        </View>

        {/* Quantity Badge in Cart */}
        {cartQuantity > 0 && (
          <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#0284c7', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '800' }}>{cartQuantity}</Text>
          </View>
        )}
      </View>

      {/* Product Content */}
      <View style={{ padding: 12, flex: 1, justifyContent: 'space-between' }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ color: '#38bdf8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
              {product.category}
            </Text>

            {isLowStock && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <AlertCircle size={12} color="#fbbf24" />
                <Text style={{ color: '#fbbf24', fontSize: 10, fontWeight: '600' }}>Low ({product.stock})</Text>
              </View>
            )}
          </View>

          <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700', marginTop: 4, height: 38 }} numberOfLines={2}>
            {product.name}
          </Text>
        </View>

        {/* Price & Add Action */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{ color: '#34d399', fontSize: 17, fontWeight: '800' }}>
            ${Number(product.price).toFixed(2)}
          </Text>

          <TouchableOpacity
            onPress={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            style={{
              backgroundColor: isOutOfStock ? '#475569' : cartQuantity > 0 ? '#0284c7' : '#0284c7',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
            activeOpacity={0.7}
          >
            {cartQuantity > 0 ? (
              <Check color="#ffffff" size={16} />
            ) : (
              <Plus color="#ffffff" size={16} />
            )}
            <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>
              {isOutOfStock ? 'Sold Out' : cartQuantity > 0 ? 'Added' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
