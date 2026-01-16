import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';

interface ServicePrice {
  id: number;
  serviceman_id: number;
  serviceman_name: string;
  service_id: number;
  service_name: string;
  category: {
    id: number;
    category_name: string;
  };
  price: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface PujaPrice {
  id: number;
  puja_id: number;
  puja_name: string;
  puja_type: {
    id: number;
    type_name: string;
  };
  duration: string;
  price: string;
  description: string;
  image: string;
  material_file: string;
  material_file_url: string;
  created_at: string;
  updated_at: string;
}

type PriceCardData = ServicePrice | PujaPrice;

interface PriceCardProps {
  item: PriceCardData;
  itemType: 'service' | 'puja';
  onEdit: (itemId: number) => void;
  onDelete: (itemId: number) => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ item, itemType, onEdit, onDelete }) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isService = itemType === 'service';
  const serviceItem = item as ServicePrice;
  const pujaItem = item as PujaPrice;

  const title = isService ? serviceItem.service_name : pujaItem.puja_name;
  const subtitle = isService ? serviceItem.category.category_name : pujaItem.puja_type?.type_name || 'Unknown Type';
  const price = isService ? serviceItem.price : pujaItem.price;
  const description = isService ? serviceItem.description : pujaItem.description;
  const updatedAt = isService ? serviceItem.updated_at : pujaItem.updated_at;
  const imageUrl = isService ? serviceItem.image : pujaItem.image;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.itemImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            ₹{price}
          </Text>
        </View>
      </View>

      {!isService && pujaItem.duration && (
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <MaterialIcons 
              name="schedule" 
              size={moderateScale(14)} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {pujaItem.duration}
            </Text>
          </View>
        </View>
      )}

      {description && (
        <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
          Updated: {formatDate(updatedAt)}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => onEdit(item.id)}
          >
            <MaterialIcons 
              name="edit" 
              size={moderateScale(16)} 
              color={theme.colors.background} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            onPress={() => onDelete(item.id)}
          >
            <MaterialIcons 
              name="delete" 
              size={moderateScale(16)} 
              color={theme.colors.background} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateVerticalScale(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(8),
  },
  itemImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(8),
    backgroundColor: '#f0f0f0',
    marginRight: moderateScale(12),
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(4),
  },
  subtitle: {
    fontSize: moderateScale(14),
  },
  priceContainer: {
    backgroundColor: 'transparent',
  },
  price: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: moderateVerticalScale(8),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  detailText: {
    fontSize: moderateScale(14),
    marginLeft: moderateScale(4),
  },
  description: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    marginBottom: moderateVerticalScale(12),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: moderateScale(12),
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  actionButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

export type { PriceCardProps, PriceCardData, ServicePrice, PujaPrice };

export default PriceCard;
