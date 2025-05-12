import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const splitWineName = (fullName: string): [string, string] => {
  const match = fullName.match(/(\d{4})/);
  if (match) {
    const index = match.index!;
    return [
      fullName.substring(0, index).trim(),
      fullName.substring(index).trim(),
    ];
  }
  return [fullName, ''];
};

type Product = {
  id: string;
  nameline1: string;
  nameline2?: string;
  quantity: number;
};

const rawData = [
  { id: '1', name: 'Alpha Omega - Cabernet Sauvignon To Kalon 2026', quantity: 6 },
  { id: '2', name: "Tito's Vodka", quantity: 0.5 },
  { id: '3', name: 'Patron Silver', quantity: 0.8 },
];

const mockData: Product[] = rawData.map((item) => {
  const [nameline1, nameline2] = splitWineName(item.name);
  return {
    id: item.id,
    nameline1,
    nameline2,
    quantity: item.quantity,
  };
});

const SessionScreen = () => {
  const [products, setProducts] = useState<Product[]>(mockData);

  const renderItem = ({ item, index }: { item: Product; index: number }) => {
    const rowStyle = index % 2 === 0 ? styles.rowLight : styles.rowDark;
    return (
      <>
        <View style={styles.separator} />
        <View style={[styles.row, rowStyle]}>
          <View style={styles.cellColumn}>
            <Text style={styles.cell}>{item.nameline1}</Text>
            {item.nameline2 && <Text style={styles.cell}>{item.nameline2}</Text>}
          </View>
          <View style={styles.separatorBar} />
          <Text style={styles.cell}>{item.quantity}</Text>
        </View>
        <View style={styles.separator} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.iconWrapper}>
          <Image
            source={require('../../assets/vintageMic.png')}
            style={styles.icon}
          />
          <Text style={styles.iconLabel}>Start</Text>
        </View>
        <View style={styles.iconWrapper}>
          <Image
            source={require('../../assets/pausebutton.png')}
            style={styles.icon}
          />
          <Text style={styles.iconLabel}>Stop</Text>
        </View>
      </View>

      <Text style={styles.transcript}>"Grey Goose Orange .9"</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.table}
      />

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Manually</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Finalize Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SessionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffef8',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  iconLabel: {
    fontSize: 14,
    color: '#333',
  },
  transcript: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    paddingVertical: 10,
    borderTopColor: 'rgba(120,88,4,0.5)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  table: {
    flexGrow: 0,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowLight: {
    backgroundColor: 'rgba(255, 249, 235, 0.8)',
  },
  rowDark: {
    backgroundColor: 'rgba(236, 219, 184, 0.8)',
  },
  cell: {
    fontSize: 16,
    color: '#333',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    paddingTop: 10,
    borderTopColor: 'rgba(120,88,4,0.5)',
    borderTopWidth: 2,
  },
  button: {
    flex: 1,
    backgroundColor: '#785804',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cellColumn: {
    flex: 1,
  },
  separator: {
    height: 4,
    backgroundColor: '#fff',
  },
  separatorBar: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 8,
    height: '100%',
  },
});