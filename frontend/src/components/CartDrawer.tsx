import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ShoppingCart, Trash2, ArrowRight, Tag, UserCheck } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { CartItemRow } from './CartItemRow';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    discountRate,
    setDiscountRate,
    discountAmount,
    total,
    itemCount,
  } = useCart();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderLeftWidth: 1,
        flexDirection: 'column',
        justify: 'space-between',
      }}
    >
      {/* Drawer Header */}
      <View
        style={{
          padding: 16,
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          borderBottomWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ShoppingCart color="#38bdf8" size={22} style={{ marginRight: 10 }} />
          <View>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>
              Active POS Order
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 11 }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
            </Text>
          </View>
        </View>

        {cart.length > 0 && (
          <TouchableOpacity
            onPress={clearCart}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 }}
            activeOpacity={0.7}
          >
            <Trash2 color="#cbd5e1" size={14} />
            <Text style={{ color: '#cbd5e1', fontSize: 12, fontWeight: '600' }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Customer Quick Selector */}
      <View style={{ backgroundColor: '#0f172a50', paddingHorizontal: 16, paddingVertical: 8, borderColor: '#334155', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <UserCheck size={14} color="#34d399" />
          <Text style={{ color: '#cbd5e1', fontSize: 12, fontWeight: '600' }}>Walk-in Customer</Text>
        </View>
        <Text style={{ color: '#0284c7', fontSize: 12, fontWeight: '700' }}>Guest #1042</Text>
      </View>

      {/* Cart Items List */}
      <ScrollView style={{ flex: 1, padding: 12 }}>
        {cart.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <View style={{ backgroundColor: '#0f172a', padding: 20, borderRadius: 999, marginBottom: 12 }}>
              <ShoppingCart color="#475569" size={40} />
            </View>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>
              Cart is Empty
            </Text>
            <Text style={{ color: '#64748b', fontSize: 12, textAlign: 'center', marginTop: 4, paddingHorizontal: 20 }}>
              Select products from the catalog or search by name/SKU to add items.
            </Text>
          </View>
        ) : (
          cart.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))
        )}
      </ScrollView>

      {/* Financial Summary & Actions */}
      <View style={{ padding: 16, backgroundColor: '#0f172a', borderColor: '#334155', borderTopWidth: 1 }}>
        {/* Discount Selector */}
        <View style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 4 }}>
            <Tag size={12} color="#94a3b8" />
            <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
              Apply Order Discount
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[0, 5, 10, 15].map((rate) => (
              <TouchableOpacity
                key={rate}
                onPress={() => setDiscountRate(rate)}
                style={{
                  flex: 1,
                  backgroundColor: discountRate === rate ? '#0284c7' : '#1e293b',
                  borderColor: discountRate === rate ? '#38bdf8' : '#334155',
                  borderWidth: 1,
                  paddingVertical: 6,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: discountRate === rate ? '#ffffff' : '#94a3b8',
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {rate === 0 ? 'None' : `${rate}%`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={{ gap: 6, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>Subtotal</Text>
            <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600' }}>
              ${subtotal.toFixed(2)}
            </Text>
          </View>

          {discountAmount > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#fbbf24', fontSize: 13 }}>Discount ({discountRate}%)</Text>
              <Text style={{ color: '#fbbf24', fontSize: 13, fontWeight: '600' }}>
                -${discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>Estimated Sales Tax (8%)</Text>
            <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600' }}>
              ${tax.toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: '#334155',
              marginVertical: 4,
            }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>Total Amount</Text>
            <Text style={{ color: '#34d399', fontSize: 22, fontWeight: '900' }}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Checkout Primary Action Button */}
        <TouchableOpacity
          onPress={onOpenCheckout}
          disabled={cart.length === 0}
          style={{
            backgroundColor: cart.length === 0 ? '#475569' : '#10b981',
            paddingVertical: 14,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>
            Pay ${total.toFixed(2)}
          </Text>
          <ArrowRight color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
