import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import photoStore from '../store/PhotoStore';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = observer(({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: string, urls: { small: string, regular: string } } | null>(null);

  useEffect(() => {
    photoStore.fetchPhotos();
  }, []);

  const handlePhotoPress = (photo: { id: string, urls: { small: string, regular: string } }) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: { id: string; urls: { small: string; regular: string; } } }) => (
    <TouchableOpacity
      onPress={() => handlePhotoPress(item)}
      style={styles.itemContainer}
    >
      <Image source={{ uri: item.urls.small }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {photoStore.error ? <Text>{photoStore.error}</Text> : null}
      <FlatList
        data={photoStore.photos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapperStyle}
        onEndReached={() => photoStore.fetchPhotos()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={photoStore.isLoading}
            onRefresh={() => photoStore.refreshPhotos()}
          />
        }
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            {selectedPhoto && (
              <Image source={{ uri: selectedPhoto.urls.regular }} style={styles.fullImage} />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Сохранение соотношения сторон изображения
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
});

export default HomeScreen;