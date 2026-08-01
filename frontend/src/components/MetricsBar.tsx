import React from 'react';
import { View, Text } from 'react-native';
import { DollarSign, ShoppingBag, PackageCheck, AlertTriangle } from 'lucide-react-native';
import { POSMetrics } from '../types';

interface MetricsBarProps {
  metrics: POSMetrics;
  lowStockCount?: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, lowStockCount = 0 }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#0f172a' }}>
      {/* Metric 1: Today Sales */}
      <View style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 14, borderColor: '#334155', borderWidth: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>
            Today's Sales
          </Text>
          <View style={{ backgroundColor: '#0284c720', padding: 6, borderRadius: 8 }}>
            <DollarSign color="#38bdf8" size={18} />
          </View>
        </View>
        <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 6 }}>
          ${metrics.totalSalesToday.toFixed(2)}
        </Text>
      </View>

      {/* Metric 2: Orders Count */}
      <View style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 14, borderColor: '#334155', borderWidth: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>
            Total Orders
          </Text>
          <View style={{ backgroundColor: '#10b98120', padding: 6, borderRadius: 8 }}>
            <ShoppingBag color="#34d399" size={18} />
          </View>
        </View>
        <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 6 }}>
          {metrics.totalOrdersCount}
        </Text>
      </View>

      {/* Metric 3: Items Sold */}
      <View style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 14, borderColor: '#334155', borderWidth: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>
            Items Sold
          </Text>
          <View style={{ backgroundColor: '#8b5cf620', padding: 6, borderRadius: 8 }}>
            <PackageCheck color="#a78bfa" size={18} />
          </View>
        </View>
        <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 6 }}>
          {metrics.totalItemsSoldToday}
        </Text>
      </View>

      {/* Metric 4: Low Stock Alert */}
      <View style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 14, borderColor: lowStockCount > 0 ? '#f59e0b50' : '#334155', borderWidth: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>
            Low Stock Alerts
          </Text>
          <View style={{ backgroundColor: lowStockCount > 0 ? '#f59e0b20' : '#334155', padding: 6, borderRadius: 8 }}>
            <AlertTriangle color={lowStockCount > 0 ? '#fbbf24' : '#64748b'} size={18} />
          </View>
        </View>
        <Text style={{ color: lowStockCount > 0 ? '#fbbf24' : '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 6 }}>
          {lowStockCount} {lowStockCount === 1 ? 'item' : 'items'}
        </Text>
      </View>
    </View>
  );
};
