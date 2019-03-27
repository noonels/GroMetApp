import React, {Component} from "react";
import { View, FlatList, List, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
const { Map } = require('immutable');
import firebase from 'firebase';

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
      id: 'test0',
      img: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Green_circle.png",
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
      console.log(PlantData);
    }, 500);
  }

  onRefresh() {
    this.setState({
      refreshing: true,
      data: PlantData
    });
    this.setState({
      refreshing: false
    });
    console.log(PlantData);
  }

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      console.log(id);
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <ListItem
      button onPress={() => {
        Alert.alert(
          'Details',
          'Presumably, we can put the plot here',
          [
            {text: 'Print index', onPress: () => console.log(item)},
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
      }}
      button onLongPress={() => {
        Alert.alert(
          'Long Press!',
          'Presumably, we can put the edit page here',
          [
            {text: 'Print index', onPress: () => console.log(item)},
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
      }}
      roundAvatar
      selected={!!this.state.selected.get(item.id)}
      title={`${item.name} ${item.species !== "" ? '(' : ''}${item.species}${item.species !== "" ? ')' : ''}`}
      subtitle={`Humidity: ${item.latest_hum}\nLight Exposure: ${item.latest_light}`}
      leftAvatar={{ source: { uri: item.img } }}
      topDivider={true}
      bottomDivider={false}
    />
  );

  render() {
    return (
      <View style={styles.container}>
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
  console.log('run readUserData');
  var info;
  var plants;
  firebase.database().ref('info/').on('value', (snapshot) => {
    info = snapshot.val();
    console.log('run info update');
  });
  firebase.database().ref('plants/').on('value', (snapshot) => {
    console.log('run plant update');
    var newPlantData = [];
    plants = snapshot.val()
    for (let plantID in plants) {
      var plant = {};
      plant.id = plantID;
      plant.img = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Green_circle.png';
      plant.name = info[plantID]['name'];
      plant.species = info[plantID]['species'];
      var hum_array = [];
      var light_array = [];
      for (let instance in plants[plantID]) {
        hum_array.push(plants[plantID][instance]['hum']);
        light_array.push(plants[plantID][instance]['light']);
      }
      var data = {};
      data.latest_hum = plants[plantID]['latest']['hum'];
      data.latest_light = plants[plantID]['latest']['light'];
      data.hum = hum_array;
      data.light = light_array;
      plant.data = data;
      newPlantData.push(plant)
    }
    PlantData = newPlantData;
    console.log(PlantData);
  });
  console.log(PlantData);
})();

(function updateUserData() {
  console.log('run readUserData');
  var info;
  var plants;
  firebase.database().ref('info/').on('value', (snapshot) => {
    info = snapshot.val();
    console.log('run info update');
  });
  firebase.database().ref('plants/').on('value', (snapshot) => {
    console.log('run plant update');
    var newPlantData = [];
    plants = snapshot.val()
    for (let plantID in plants) {
      var plant = {};
      plant.id = plantID;
      plant.img = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Green_circle.png';
      plant.name = info[plantID]['name'];
      plant.species = info[plantID]['species'];
      var hum_array = [];
      var light_array = [];
      for (let instance in plants[plantID]) {
        hum_array.push(plants[plantID][instance]['hum']);
        light_array.push(plants[plantID][instance]['light']);
      }
      var data = {};
      data.latest_hum = plants[plantID]['latest']['hum'];
      data.latest_light = plants[plantID]['latest']['light'];
      data.hum = hum_array;
      data.light = light_array;
      plant.data = data;
      newPlantData.push(plant)
    }
    PlantData = newPlantData;
    console.log(PlantData);
  });
  console.log(PlantData);
})();
////////////////////////// END FIREBASE CODE ///////////////////////////////////

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

export default MainPage;
