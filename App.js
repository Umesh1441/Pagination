import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';

const API_KEY = '6f102c62f41998d151e5a1b48713cf13';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${API_KEY}&format=json&nojsoncallback=1&extras=url_s&page=${currentPage}`;
      if (searchQuery) {
        url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&format=json&nojsoncallback=1&extras=url_s&text=${searchQuery}&page=${currentPage}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      setPhotos(result.photos.photo);
      setTotalPages(result.photos.pages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.url_s }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search..."
      />
      <Button title="Search" onPress={handleSearch} />
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      )}
      <View style={styles.pagination}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || loading}
        />
        <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
        <Button
          title="Next"
          onPress={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top:10,
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9c2ff',
  },
  image: {
    width: '100%',
    height: 150,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});