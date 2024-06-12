import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Text,
  Animated,
  Easing,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import photoStore from '../store/PhotoStore';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Gallery'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: string, urls: { small: string, regular: string } } | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    photoStore.fetchPhotos();
  }, []);

  useEffect(() => {
    if (photoStore.error) {
      Alert.alert('Error', photoStore.error);
    }
  });

  const handlePhotoPress = (photo: { id: string, urls: { small: string, regular: string } }) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedPhoto(null);
    });
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderItem = ({ item }: { item: { id: string; urls: { small: string; regular: string; } } }) => (
    <TouchableOpacity
      onPress={() => handlePhotoPress(item)}
      style={styles.itemContainer}
    >
      <Image source={{ uri: item.urls.small }} style={styles.image} />
    </TouchableOpacity>
  );

  const modalBackgroundStyle = {
    ...styles.modalBackground,
    opacity: animation,
  };

  const modalImageStyle = {
    ...styles.fullImage,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
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
      <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
        <Text style={styles.scrollToTopButtonText}> ^ </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <Animated.View style={modalBackgroundStyle}>
            {selectedPhoto && (
              <Animated.Image source={{ uri: selectedPhoto.urls.regular }} style={modalImageStyle} />
            )}
          </Animated.View>
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
    aspectRatio: 1,
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
  scrollToTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'rgb(33, 37, 41)',
    padding: 15,
    paddingHorizontal: 20,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollToTopButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 24,
  },
});

export default HomeScreen;
