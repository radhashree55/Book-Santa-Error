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

export default class MyDonationScreen extends Component {
  constructor() {
    super();
    this.state = {
      donorId: firebase.auth().currentUser.email,
      donorName: "",
      allDonations: [],
    };
    this.requestRef = null;
  }

  static navigationOptions = { header: null };

  getDonorDetails = (donorId) => {
    db.collection("users")
      .where("email_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  getAllDonations = () => {
    this.requestRef = db
      .collection("all_donations")
      .where("donor_id", "==", this.state.donorId)
      .onSnapshot((snapshot) => {
        var allDonations = [];
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation["doc_id"] = doc.id;
          allDonations.push(donation);
        });
        this.setState({
          allDonations: allDonations,
        });
      });
  };

  sendBook = (bookDetails) => {
    if (bookDetails.request_status === "Book Sent") {
      var requestStatus = "Donor Interested";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: "Donor Interested",
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      var requestStatus = "Book Sent";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: "Book Sent",
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };

  sendNotification = (bookDetails, requestStatus) => {
    var requestId = bookDetails.request_id;
    var donorId = bookDetails.donor_id;
    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Book Sent") {
            message = this.state.donorName + " sent you the Book";
          } else {
            message =
              this.state.donorName + " has shown interest in Donating the book";
          }
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <TouchableOpacity>
      <ListItem key={i} bottomDivider>
        <Icon name="book" type="font-awesome" color="#696969" size={30} />

        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 20, fontWeight: "bold" }}>
            {item.book_name}
          </ListItem.Title>
          <ListItem.Subtitle>
            {"Requested By : " +
              item.requested_by +
              "\nStatus : " +
              item.request_status}
          </ListItem.Subtitle>
          <Text style={styles.button}>Send Book</Text>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  componentDidMount() {
    this.getAllDonations();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Donations" />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of all Book Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 90,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    textAlign: "center",
    fontWeight: "bold",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
