import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FIREBASE_AUTH, FIRESTORE_DB } from './../../config/FirebaseConfig';
import { useNavigation } from '@react-navigation/native'; 
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Scan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const svgRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (loading) return; // Prevent multiple presses while loading
    setScanned(true);
    setShowCamera(false);
    setLoading(true); // Set loading to true when processing begins
  
    try {
      const userQuery = query(collection(FIRESTORE_DB, 'Users'), where('email', '==', data));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userEmail = userDoc.data().email;
  
        // Navigate to home screen with params for email and openTransferModal
        navigation.navigate('home', { 
          email: userEmail, 
          openTransferModal: true, 
          timestamp: new Date().getTime() // Ensures uniqueness and triggers the modal
        });
  
        setScanned(false);
      } else {
        Alert.alert('User not found', `No user associated with this QR code.`);
        setScanned(false); 
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      Alert.alert('Error', 'There was a problem processing your request.');
      setScanned(false);
    } finally {
      setLoading(false); // Set loading to false after processing ends
    }
  };

  const generateQRCode = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      setQrCodeValue(user.email);
    } else {
      Alert.alert('Error', 'User not authenticated.');
    }
  };

  const downloadQRCode = async () => {
    if (!svgRef.current) {
      Alert.alert('QR Code not generated.');
      return;
    }

    try {
      svgRef.current.toDataURL(async (data) => {
        const fileUri = `${FileSystem.documentDirectory}QRCode.png`;
        const base64Code = `data:image/png;base64,${data}`;

        await FileSystem.writeAsStringAsync(fileUri, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('QRCode', asset, false);
        Alert.alert('Success', 'QR code saved to your gallery.');
      });
    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert('Error', 'An issue occurred while saving the QR code.');
    }
  };

  const handleScanPress = () => {
    setShowCamera(true);
    setScanned(false);
  };

  const handleBackButton = () => {
    setShowCamera(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  
  if (hasPermission === false) {
    return <Text>Camera access denied.</Text>;
  }

  return (
    <View style={styles.container}>
      {!showCamera && (
        <View>
          <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
            <Text style={styles.buttonText}>Scannez un code QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.generateButton} onPress={generateQRCode}>
            <Text style={styles.buttonText}>Générer Votre Code QR</Text>
          </TouchableOpacity>

          {qrCodeValue && (
            <View style={styles.qrContainer}>
              <QRCode value={qrCodeValue} size={250} getRef={svgRef} />
              <TouchableOpacity style={styles.downloadButton} onPress={downloadQRCode}>
                <Text style={styles.buttonText}>Télécharger le Code QR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {showCamera && (
        <View style={styles.cameraContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.barCodeScanner} 
          />
          <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      )}

      {scanned && (
        <Button title="Appuyez pour scanner à nouveau" onPress={() => setScanned(false)} />
      )}

      {loading && (
        <ActivityIndicator size="large" color="#ff5a00" style={{ marginTop: 20 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barCodeScanner: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
  },
  scanButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'oswald-Bold',
  },
  generateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30, 
    elevation: 5,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },
  backButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 99,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
});
