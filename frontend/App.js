import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Pressable, TouchableOpacity, Alert } from 'react-native';
import Ipcim from './Ipcim';

export default function App() {
  useEffect(() => {
    letoltes();
  }, []);

  const [adatok, setAdatok] = useState([]);

  const letoltes = async () => {
    try {
      const response = await fetch(Ipcim.Ipcim + "filmek");
      if (!response.ok) {
        throw new Error('Hálózati hiba: ' + response.statusText);
      }
      const data = await response.json();
      setAdatok(data);
    } catch (error) {
      console.error('Hiba a filmek letöltése során:', error);
      Alert.alert('Hiba', 'A filmek letöltése során hiba történt. Kérjük, próbálja meg később.');
    }
  };

  const szavazas = async (id) => {
    try {
      const response = await fetch(Ipcim.Ipcim + "szavazas", {
        method: "POST",
        body: JSON.stringify({ "szavazat_film": id }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });

      if (!response.ok) {
        throw new Error('Hálózati hiba: ' + response.statusText);
      }

      const message = await response.text();
      Alert.alert('Siker', message);
    } catch (error) {
      console.error('Hiba a szavazás során:', error);
      Alert.alert('Hiba', 'A szavazás során hiba történt. Kérjük, próbálja meg később.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.focim}>Marvel filmek</Text>

      <FlatList
        data={adatok}
        renderItem={({ item }) => 
          <View style={styles.dobozok}>
            <Text style={styles.cimek}>{item.film_cim}</Text>
            <Image source={{ uri: `${Ipcim.Ipcim}${item.film_kep}` }} style={styles.kepek} />
            <TouchableOpacity onPress={() => szavazas(item.film_id)}>
              <Text style={styles.gombok_szoveg}>Erre szavazok</Text>
            </TouchableOpacity>
          </View>
        }
        keyExtractor={item => item.film_id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  focim: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 30,
  },
  cimek: {
    fontSize: 20,
    letterSpacing: 2,
    color: 'darkred',
    fontWeight: 'bold',
  },
  kepek: {
    height: 500,
    width: 300,
  },
  gombok_szoveg: {
    fontSize: 20,
    backgroundColor: 'skyblue',
    color: 'white',
    textAlign: 'center',
    padding: 10,
    letterSpacing: 3,
  },
  dobozok: {
    marginBottom: 30,
  },
});
