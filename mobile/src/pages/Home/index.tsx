import React, {useState, useEffect} from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface SelectItem {
  label: string;
  value: string;
}
const Home = () => {
    const [uf, setUf] = useState<SelectItem[]>([]);
    const [city, setCity] = useState<SelectItem[]>([]);
    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
      axios
        .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then((response) => {
          const loadedUfs = response.data.map(
            (uf: { nome: string; sigla: string }) => ({
              label: uf.nome,
              value: uf.sigla,
            })
          );
          setUf(loadedUfs);
        });
    }, []);
  
    useEffect(() => {
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
        )
        .then((response) => {
          const loadedCities = response.data.map((city: { nome: string }) => ({
            label: city.nome,
            value: city.nome,
          }));
          setCity(loadedCities);
        });
    }, [selectedUf]);



    function handleNavigateToPoints(){
        navigation.navigate('Points', {
          uf: selectedUf,
          city: selectedCity,
        });
    }

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ImageBackground 
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <View>
                  <Text style={styles.title}>Seu markteplace de coleta de resíduos</Text>
                  <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficienete.</Text>
                </View>
            </View>

            <View style={styles.footer}>
            <RNPickerSelect
                placeholder={{ label: 'Selecione um Estado' }}
                itemKey="value"
                onValueChange={(value) => setSelectedUf(value)}
                items={uf}
                style={{ viewContainer: styles.input }}
              >
              </RNPickerSelect>

              <RNPickerSelect
                  placeholder={{ label: 'Selecione uma Cidade' }}
                  disabled={selectedUf === ''}
                  itemKey="value"
                  onValueChange={(value) => setSelectedCity(value)}
                  items={city}
                  style={{ viewContainer: styles.input }}
                >
                </RNPickerSelect>

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;