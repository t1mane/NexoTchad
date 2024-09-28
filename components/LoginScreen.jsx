import { View, Text, Image, TouchableOpacityBase } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useWarmUpBrowser } from './../hooks/useWarmUpBrowser';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo'

WebBrowser.maybeCompleteAuthSession();
export default function loginscreen() {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({strategy: 'oauth_google'});
const onPress = React.useCallback(async ()=> {
    try{
        const{ createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        SetActive({session: createdSessionId});
      } else {
        // Use signIn or SignUp for next steps as MFA
      }
    } catch (err) {
        console.error('OAuth error', err);
    } 
}, []); 
 
 



  return (
    <View>
        <View style={{
            display:'flex',
            alignItems: 'center',
            marginTop: 200,
            
        }}>
            

       
      <Image source={require('./../assets/images/Orange_copy 2.png')}
      style={{
        width:350,
        height:200,
        borderRadius:20,
        
        
        
      }}
      />
        </View>
      <View style={styles.subContainer}>
        <Text style={{fontSize:17,
            fontFamily:'outfit_bold',
            textAlign:'center',
            }}>
            <Text style={{color:Colors.Primary, padding:50, fontSize:25,}}>Nexo</Text>, votre application de confiance pour des transferts d’argent et des paiements sans souci au Tchad.
            
            </Text>
            <Text style={{
                fontSize:20,
                fontFamily:'outfit_bold',
                textAlign:'center',
                marginTop:15,
                color:Colors.Primary
            }}>
            Déposez, transférez et gérez votre argent facilement avec Nexo.
            </Text>
            <TouchableOpacity style={styles.btn}
            onPress={onPress}
            >
                <Text style={{
                    textAlign:'center',
                    color:'#fff',
                    fontFamily: 'outfit_bold'
                }}>Se Connecter</Text>

            </TouchableOpacity>

      </View>

    </View>
  )
}
const styles = StyleSheet.create({
    subContainer:{
        backgroundColor:'#fff',
        marginTop:-65,
        borderTopWidth:1,
        
    },
    btn:{
        backgroundColor: Colors.Primary,
        padding:19,
        borderRadius:99,
        marginTop: 15,


    }

})