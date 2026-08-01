import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions, ActivityIndicator } from 'react-native';
import { Header } from '../src/components/Header';
import { MetricsBar } from '../src/components/MetricsBar';
import { SearchBar } from '../src/components/SearchBar';
import { CategoryFilter } from '../src/components/CategoryFilter';
import { ProductCard } from '../src/components/ProductCard';
import { CartDrawer } from '../src/components/CartDrawer';
import { CheckoutModal } from '../src/components/CheckoutModal';
import { useCart } from '../src/context/CartContext';
import { Product, POSMetrics } from '../src/types';
import { api } from '../src/services/api';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Artisan Espresso',
    sku: 'BEV-001',
    barcode: '8901001001',
    description: 'Double shot rich dark roast espresso.',
    price: 3.50,
    category: 'Beverages',
    stock: 48,
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Iced Vanilla Oat Latte',
    sku: 'BEV-002',
    barcode: '8901001002',
    description: 'Smooth cold espresso poured over oat milk and Madagascar vanilla.',
    price: 5.25,
    category: 'Beverages',
    stock: 32,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Matcha Green Tea Latte',
    sku: 'BEV-003',
    barcode: '8901001003',
    description: 'Ceremonial grade Uji matcha steamed with creamy milk.',
    price: 5.75,
    category: 'Beverages',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Freshly Baked Croissant',
    sku: 'BAK-001',
    barcode: '8902002001',
    description: 'Flaky french buttery croissant baked fresh every morning.',
    price: 3.25,
    category: 'Bakery',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    name: 'Avocado Toast & Sourdough',
    sku: 'BAK-002',
    barcode: '8902002002',
    description: 'Toasted sourdough topped with crushed avocado and red pepper flakes.',
    price: 8.50,
    category: 'Bakery',
    stock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    name: 'Chocolate Chip Cookie',
    sku: 'BAK-003',
    barcode: '8902002003',
    description: 'Soft-baked gourmet cookie with Belgian dark chocolate chips.',
    price: 2.75,
    category: 'Bakery',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '7',
    name: 'Smoked Turkey & Swiss Sandwich',
    sku: 'SNK-001',
    barcode: '8903003001',
    description: 'Sliced turkey breast, aged swiss cheese, and honey mustard blend.',
    price: 9.75,
    category: 'Snacks',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '8',
    name: 'Organic Honey Granola Bowl',
    sku: 'SNK-002',
    barcode: '8903003002',
    description: 'Greek yogurt topped with toasted oats, chia seeds, and berries.',
    price: 6.95,
    category: 'Snacks',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '9',
    name: 'Fresh Crisp Fuji Apple',
    sku: 'PRD-001',
    barcode: '8904004001',
    description: 'Sweet and crispy farm-fresh organic Fuji apple.',
    price: 1.50,
    category: 'Produce',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '10',
    name: 'Organic Whole Milk 1L',
    sku: 'DRY-001',
    barcode: '8905005001',
    description: 'Pasteurized 100% pure organic whole milk carton.',
    price: 4.10,
    category: 'Dairy',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
  },
];

export default function POSDashboardScreen() {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(['All', 'Beverages', 'Bakery', 'Snacks', 'Produce', 'Dairy']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [metrics, setMetrics] = useState<POSMetrics>({
    totalSalesToday: 142.50,
    totalOrdersCount: 18,
    totalItemsSoldToday: 42,
    totalOrdersAllTime: 124,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [checkoutVisible, setCheckoutVisible] = useState<boolean>(false);

  const screenWidth = Dimensions.get('window').width;
  const isTabletOrDesktop = screenWidth >= 768;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedCategories, fetchedMetrics] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getMetrics(),
      ]);

      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      }
      if (fetchedCategories && fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      }
      if (fetchedMetrics) {
        setMetrics((prev) => ({ ...prev, ...fetchedMetrics }));
      }
    } catch (error) {
      console.warn('Backend server not connected yet, using embedded catalog state.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time Product Search & Category Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  }, [products]);

  const getCartQuantityForProduct = (productId: string) => {
    const found = cart.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  const handleCheckoutSuccess = () => {
    setMetrics((prev) => ({
      ...prev,
      totalOrdersCount: prev.totalOrdersCount + 1,
    }));
    loadData();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Header */}
      <Header onRefresh={loadData} />

      {/* POS Terminal Split View Layout */}
      <View style={{ flex: 1, flexDirection: isTabletOrDesktop ? 'row' : 'column' }}>
        {/* Main Catalog & Search Section */}
        <View style={{ flex: isTabletOrDesktop ? 7 : 1, flexDirection: 'column' }}>
          {/* Dashboard Metrics Bar */}
          <MetricsBar metrics={metrics} lowStockCount={lowStockCount} />

          {/* Search Bar (Requirement #2) */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            resultCount={filteredProducts.length}
          />

          {/* Category Filter Pills */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Products Grid */}
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadData();
                }}
                tintColor="#38bdf8"
              />
            }
          >
            {loading && !refreshing ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#38bdf8" />
                <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 10 }}>Loading product catalog...</Text>
              </View>
            ) : filteredProducts.length === 0 ? (
              <View style={{ paddingVertical: 50, alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 16, borderColor: '#334155', borderWidth: 1 }}>
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>No Products Found</Text>
                <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  No item matches "{searchQuery}" in category "{selectedCategory}".
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginHorizontal: -6,
                  paddingBottom: 24,
                }}
              >
                {filteredProducts.map((product) => (
                  <View
                    key={product.id}
                    style={{
                      width: isTabletOrDesktop ? '33.33%' : '50%',
                      padding: 6,
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={addToCart}
                      cartQuantity={getCartQuantityForProduct(product.id)}
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Right Active Cart Sidebar / Drawer (Requirements #3 and #4) */}
        <View style={{ width: isTabletOrDesktop ? 400 : '100%', height: isTabletOrDesktop ? '100%' : 380 }}>
          <CartDrawer onOpenCheckout={() => setCheckoutVisible(true)} />
        </View>
      </View>

      {/* Checkout Payment Modal */}
      <CheckoutModal
        visible={checkoutVisible}
        onClose={() => setCheckoutVisible(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </View>
  );
}
