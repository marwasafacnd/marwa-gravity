import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Store, Wifi, Clock, RefreshCw } from 'lucide-react-native';

interface HeaderProps {
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' | ' +
        now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Branding */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#0284c7', width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Store color="#ffffff" size={24} />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '700', marginRight: 8 }}>
                Antigravity POS
              </Text>
              <View style={{ backgroundColor: '#10b98120', borderColor: '#10b98140', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
                <Text style={{ color: '#34d399', fontSize: 11, fontWeight: '600' }}>REGISTER #01 ACTIVE</Text>
              </View>
            </View>
            <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
              Smart Retail & Point of Sale Terminal
            </Text>
          </View>
        </View>

        {/* Right System Info & Actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 12 }}>
            <Clock color="#94a3b8" size={16} style={{ marginRight: 6 }} />
            <Text style={{ color: '#cbd5e1', fontSize: 13, fontWeight: '500' }}>{timeStr}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, marginRight: 12 }}>
            <Wifi color="#34d399" size={16} style={{ marginRight: 6 }} />
            <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '600' }}>Online</Text>
          </View>

          {onRefresh && (
            <TouchableOpacity
              onPress={onRefresh}
              style={{ backgroundColor: '#1e293b', padding: 10, borderRadius: 10 }}
              activeOpacity={0.7}
            >
              <RefreshCw color="#38bdf8" size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
