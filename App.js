import React, {Component} from "react";
import { View, FlatList, List, Text, Image, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { ListItem } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from "react-navigation";
const { Map } = require('immutable');
import firebase from 'firebase';
import DetailsScreen from './DetailsScreen';
import EditPlant from './EditPlant';

var firebaseConfig = {
  apiKey: "AIzaSyD5lJW2xnGJXHzijMyJMHVTEa_60z6x2X4",
  authDomain: "gromet-a0b7d.firebaseapp.com",
  databaseURL: "https://gromet-a0b7d.firebaseio.com",
  projectId: "gromet-a0b7d",
  storageBucket: "gromet-a0b7d.appspot.com",
  messagingSenderId: "539802681511"
};
firebase.initializeApp(firebaseConfig);

var PlantData = [ // default data to display
    {
      id: 'loading',
      img: '',
      name: "Loading...",
      species: "",
      data: {
        latest_hum: 0,
        latest_light: 0,
        hum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        light: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      }
    }];




class MainPage extends Component {
  static navigationOptions = {
    title: 'Plants',
    headerStyle: {
      backgroundColor: '#43a047',
    },
    headerTintColor: '#000',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: PlantData,
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      selected: (new Map(): Map<string, boolean>),
    };

    // update once
    setTimeout(() => {
      this.setState({
        refreshing: true,
        data: PlantData
      });
      this.setState({
        refreshing: false
      });
    }, 1000);
  }

  onRefresh() {
    this.setState({
      refreshing: true,
      data: PlantData
    });
    this.setState({
      refreshing: false
    });
  }

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <ListItem
      containerStyle = {styles.item, {backgroundColor: getColor2(getHealth(item))}}
      onPress={() => this.props.navigation.navigate('Details',
          {data: item.data, title: item.name, img: item.img})}
      onLongPress={() => this.props.navigation.navigate('Edit',
          {key: item, data: item.data, title: item.name, img: item.img})}
      roundAvatar
      selected={!!this.state.selected.get(item.id)}
      title={`${item.name} ${item.species !== "" ? '(' : ''}${item.species}${item.species !== "" ? ')' : ''}`}
      subtitle={`Humidity: ${item.data.latest_hum}\nLight Exposure: ${item.data.latest_light}`}
      leftAvatar={{ source: { uri: item.img } }}
      topDivider={true}
      bottomDivider={false}
    />
  );
    
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
            barStyle="light-content"
            backgroundColor="#00701a"
          />
        <FlatList
          onPressItem={this._onPressItem}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.state.refreshing}
          data={this.state.data}
          extraData={Map({
            plants: this.props.data
          })}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

////////////////////////// FIREBASE UPDATING ///////////////////////////////////
(function initUserData() {
  var info;
  var plants;
  firebase.database().ref('info/').on('value', (snapshot) => {
    info = snapshot.val();
  });
  firebase.database().ref('plants/').on('value', (snapshot) => {
    var newPlantData = [];
    plants = snapshot.val()
    for (let plantID in plants) {
      var plant = {};
      plant.id = plantID;
      plant.img = info[plantID]['img'];
      plant.name = info[plantID]['name'];
      plant.species = info[plantID]['species'];
      var hum_array = [];
      var light_array = [];
      for (let instance in plants[plantID]) {
        hum_array.push(plants[plantID][instance]['hum']);
        light_array.push(plants[plantID][instance]['light']);
      }
      var data = {};
      if (light_array.length > 10) {
        data.light = light_array.slice(1).slice(-10);
      } else if (light_array.length < 10) {
        (arr = []).length = 10 - light_array.length;
        arr.fill(0);
        data.light = arr.concat(light_array);
      } else {
        data.light = light_array;
      }
      if (hum_array.length > 10) {
        data.hum = hum_array.slice(1).slice(-10);
      } else if (hum_array.length < 10) {
        (arr = []).length = 10 - hum_array.length;
        arr.fill(0);
        data.hum = arr.concat(hum_array);
      } else {
        data.hum = hum_array;
      }
      data.latest_hum = plants[plantID]['latest']['hum'];
      data.latest_light = plants[plantID]['latest']['light'];
      plant.data = data;
      newPlantData.push(plant)
    }
    PlantData = newPlantData;
    console.log(PlantData);
  });
})();

(function updateUserData() {
  var info;
  var plants;
  firebase.database().ref('info/').on('value', (snapshot) => {
    info = snapshot.val();
  });
  firebase.database().ref('plants/').on('value', (snapshot) => {
    var newPlantData = [];
    plants = snapshot.val()
    for (let plantID in plants) {
      var plant = {};
      plant.id = plantID;
      plant.img = info[plantID]['img'];
      plant.name = info[plantID]['name'];
      plant.species = info[plantID]['species'];
      var hum_array = [];
      var light_array = [];
      for (let instance in plants[plantID]) {
        hum_array.push(plants[plantID][instance]['hum']);
        light_array.push(plants[plantID][instance]['light']);
      }
      var data = {};
      if (light_array.length > 10) {
        data.light = light_array.slice(1).slice(-10);
      } else if (light_array.length < 10) {
        (arr = []).length = 10 - light_array.length;
        arr.fill(0);
        data.light = arr.concat(light_array);
      } else {
        data.light = light_array;
      }
      if (hum_array.length > 10) {
        data.hum = hum_array.slice(1).slice(-10);
      } else if (hum_array.length < 10) {
        (arr = []).length = 10 - hum_array.length;
        arr.fill(0);
        data.hum = arr.concat(hum_array);
      } else {
        data.hum = hum_array;
      }
      data.latest_hum = plants[plantID]['latest']['hum'];
      data.latest_light = plants[plantID]['latest']['light'];
      plant.data = data;
      newPlantData.push(plant)
    }
    PlantData = newPlantData;
    console.log(PlantData);
  });
})();
////////////////////////// END FIREBASE CODE ///////////////////////////////////

  getColor = (item) => {
    if (item.data.latest_hum > 50
        && item.data.latest_light > 75)
            return '#82e570'
    else if (item.data.latest_hum > 25
        && item.data.latest_light > 50)
            return '#fcff7c'
    else
            return '#d6a782'
  ;}

  getHealth = (item) => {
      return ((item.data.latest_hum + item.data.latest_light) / 2)
  };

  //function ready for when the health value stuff works
  getColor2 = (healthValue) => {
    if (healthValue > 95)
        return '#43a047'
    else if (healthValue > 90)
        return '#4da23a'
    else if (healthValue > 85)
        return '#59a537'
    else if (healthValue > 80)
        return '#67a834'
    else if (healthValue > 75)
        return '#7aad2f'
    else if (healthValue > 70)
        return '#8cb12a'
    else if (healthValue > 65)
        return '#a1b626'
    else if (healthValue > 60)
        return '#babb1f'
    else if (healthValue > 55)
        return '#d1c01a'
    else if (healthValue > 50)
        return '#e3c415'
    else if (healthValue > 45)
        return '#eec713'
    else if (healthValue > 40)
        return '#e8c016'
    else if (healthValue > 35)
        return '#e0b61c'
    else if (healthValue > 30)
        return '#d6ab22'
    else if (healthValue > 25)
        return '#cb9e2a'
    else if (healthValue > 20)
        return '#c29230'
    else if (healthValue > 15)
        return '#b98735'
    else if (healthValue > 10)
        return '#b17e3a'
    else if (healthValue > 5)
        return '#aa753e'
    else if (healthValue > 0)
        return '#a46e42'
    else
        return '#a06a45'
  };

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 76,
    backgroundColor: 'blue',
    //color: '#43a047'
  },
  button: {
    backgroundColor: '#43a047',
    color: '#43a047'
  },
})

const AppNavigator = createStackNavigator(
  {
  Home: MainPage,
  Details: DetailsScreen,
  Edit: EditPlant,
  },
  {
    initialRouteName: "Home"
  });

export default createAppContainer(AppNavigator);
