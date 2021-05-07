import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";
import MyHeader from "../components/MyHeader.js";
import firebase from "firebase";
import db from "../config.js";
import { RFValue } from "react-native-responsive-fontsize";

export default class MyReceivedBooksScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      receivedBooksList: [],
    };
    this.requestRef = null;
  }

  getReceivedBooksList = () => {
    this.requestRef = db
      .collection("requested_books")
      .where("user_id", "==", this.state.userId)
      .where("book_status", "==", "received")
      .onSnapshot((snapshot) => {
        var receivedBooksList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          receivedBooksList: receivedBooksList,
        });
      });
  };

  componentDidMount() {
    this.getReceivedBooksList();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  renderItem = ({ item, i }) => (
    <TouchableOpacity>
      <ListItem key={i} bottomDivider>
        <Icon name="book" type="font-awesome" color="#696969" size={30} />

        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 20, fontWeight: "bold" }}>
            {item.book_name}
          </ListItem.Title>
          <ListItem.Subtitle>{item.bookStatus}</ListItem.Subtitle>
          <Image
            style={styles.LiImage}
            source={{
              uri: item.image_link,
            }}
          />
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Received Books" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.receivedBooksList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Received Books</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.receivedBooksList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  LiImage: {
    height: RFValue(50),
    width: RFValue(50),
  },
  titlestyle: {
    color: "black",
    fontWeight: "bold",
  },
});
