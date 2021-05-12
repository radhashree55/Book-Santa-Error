import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Header, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config.js";
import { RFValue } from "react-native-responsive-fontsize";

export default class ReceiverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: "",
      receiverId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      bookName: this.props.navigation.getParam("details")["book_name"],
      bookImage: "#",
      reason_for_requesting:
        this.props.navigation.getParam("details")["reason_to_request"],
      receiverName: "",
      receiverContact: "",
      receiverAddress: "",
      receiverRequestDocId: "",
    };
  }

  getReceiverDetails() {
    db.collection("users")
      .where("email_id", "==", this.state.receiverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().first_name,
            receiverContact: doc.data().contact,
            receiverAddress: doc.data().address,
          });
        });
      });

    db.collection("requested_books")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ receiverRequestDocId: doc.id });
        });
      });
  }

  getUserDetails = (userId) => {
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  updateBookStatus = () => {
    db.collection("all_donations").add({
      book_name: this.state.bookName,
      request_id: this.state.requestId,
      requested_by: this.state.receiverName,
      donor_id: this.state.userId,
      request_status: "Donor Interested",
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + " has shown interest in Donating the book";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.receiverId,
      donor_id: this.state.userId,
      request_id: this.state.requestId,
      book_name: this.state.bookName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getReceiverDetails();
    this.getUserDetails(this.state.userId);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#ffffff"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: "Donate Books",
              style: {
                color: "#ffffff",
                fontSize: RFValue(25),
                fontWeight: "bold",
                marginTop: RFValue(-10),
              },
            }}
            backgroundColor="#32867d"
          />
        </View>
        <View style={{ flex: 0.9 }}>
          <View
            style={{
              flex: 0.9,
              marginTop: RFValue(-300),
            }}
          >
            <View style={{ flex: 0.4 }}>
              <Image
                source={{ uri: this.state.bookImage }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View
              style={{
                flex: 0.6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(27),
                  textAlign: "center",
                }}
              >
                {this.state.bookName}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(5),
                }}
              >
                {this.state.reason_for_requesting}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
            }}
          >
            <View
              style={{
                flex: 0.5,
                alignItems: "center",
                borderWidth: 5,
                borderColor: "#deeedd",
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(24),
                }}
              >
                Receiver's Information
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(15),
                  alignSelf: "flex-start",
                }}
              >
                Name: {this.state.receiverName}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(15),
                  alignSelf: "flex-start",
                }}
              >
                Contact: {this.state.receiverContact}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(15),
                  alignSelf: "flex-start",
                }}
              >
                Address: {this.state.receiverAddress}
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.receiverId !== this.state.userId ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateBookStatus();
                    this.addNotification();
                    this.props.navigation.navigate("MyDonations");
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: RFValue(20) }}>
                    Donate
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "65%",
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(20),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 20,
  },
});
