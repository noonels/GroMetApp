import React, {Component} from "react";
import {Text, View,Image} from "react-native";
export default class PlotCard extends Component {
  render() {
    return(
      <View  style={styles.outerContainer}>
        <Image style={styles.image} source={{ uri: this.props.data.img }}/>
        <View style={styles.container}>
          <Text style={styles.plantName}>{this.props.data.name}</Text>
          <Text>Plot goes here!!!</Text>
        </View>
        <View style={styles.line}></View>
      </View>);
    }
  }
  const styles = {
    outerContainer:{
      flex:1,
      flexDirection: 'row',
      alignItems:'stretch'
    },
    container: {
      flex: 3,
      justifyContent: 'space-between',
      backgroundColor: "white",
      alignItems:"center",
      padding:16
    },
    plantName: {
      marginLeft:16,
      color:'blue',
      fontSize:16,
    },
    image: {
      flex: 1,
      marginRight: 16,
    },
    line: {
      height: 1.5,
      backgroundColor: "#d3d3d3"
    }
  }