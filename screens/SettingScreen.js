import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

export default class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      firstName: "",
      lastName: "",
      address: "",
      contact: "",
      docId: "",
    };
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email_id", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.email_id,
            firstName: data.first_name,
            lastName: data.last_name,
            address: data.address,
            contact: data.contact,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      contact: this.state.contact,
    });

    Alert.alert("Profile Updated Successfully");
  };

  componentDidMount() {
    this.getUserDetails();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.12 }}>
          <MyHeader title="Settings" navigation={this.props.navigation} />
        </View>
        <View style={styles.formContainer}>
          <View
            style={{
              flex: 0.66,
            }}
          >
            <Text style={styles.label}>First Name </Text>
            <TextInput
              style={styles.formTextInput}
              placeholder={"First Name"}
              placeholderTextColor="black"
              onChangeText={(text) => {
                this.setState({
                  firstName: text,
                });
              }}
              value={this.state.firstName}
            />
            <Text style={styles.label}>Last Name </Text>
            <TextInput
              style={styles.formTextInput}
              placeholder={"Last Name"}
              placeholderTextColor="black"
              onChangeText={(text) => {
                this.setState({
                  lastName: text,
                });
              }}
              value={this.state.lastName}
            />
            <Text style={styles.label}>Contact </Text>
            <TextInput
              style={styles.formTextInput}
              placeholder={"Contact"}
              placeholderTextColor="black"
              maxLength={10}
              keyboardType={"numeric"}
              onChangeText={(text) => {
                this.setState({
                  contact: text,
                });
              }}
              value={this.state.contact}
            />
            <Text style={styles.label}>Address </Text>
            <TextInput
              style={styles.formTextInput}
              placeholder={"Address"}
              placeholderTextColor="black"
              multiline={true}
              onChangeText={(text) => {
                this.setState({
                  address: text,
                });
              }}
              value={this.state.address}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateUserDetails();
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6fc0b8",
  },
  formContainer: {
    flex: 0.88,
    justifyContent: "center",
  },
  label: {
    fontSize: RFValue(18),
    color: "#717D7E",
    fontWeight: "bold",
    marginLeft: RFValue(20),
  },
  formTextInput: {
    width: "90%",
    height: RFValue(50),
    padding: RFValue(10),
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: RFValue(10),
    marginLeft: RFValue(20),
  },
  button: {
    width: "75%",
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonView: {
    flex: 0.4,
    alignItems: "center",
  },
  buttonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff",
  },
});
