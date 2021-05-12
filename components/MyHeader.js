import React, { Component } from "react";
import { Header, Icon, Badge } from "react-native-elements";
import { View } from "react-native";
import db from "../config";

export default class MyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  getNumberOfUnreadNotifications() {
    db.collection("all_notifications")
      .where("notification_status", "==", "unread")
      .onSnapshot((snapshot) => {
        var unreadNotifications = snapshot.docs.map((doc) => doc.data());
        this.setState({
          value: unreadNotifications.length,
        });
      });
  }

  componentDidMount() {
    this.getNumberOfUnreadNotifications();
  }

  BellIconWithBadge = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="font-awesome"
          color="black"
          size={30}
          onPress={() => this.props.navigation.navigate("Notification")}
        />
        <Badge
          value={this.state.value}
          containerStyle={{ position: "absolute", top: -7, right: -10 }}
        />
      </View>
    );
  };

  render() {
    return (
      <Header
        leftComponent={
          <Icon
            name="bars"
            type="font-awesome"
            color="black"
            size={30}
            onPress={() => this.props.navigation.toggleDrawer()}
          />
        }
        centerComponent={{
          text: this.props.title,
          style: {
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
            marginTop: -5,
          },
        }}
        rightComponent={<this.BellIconWithBadge {...this.props} />}
        backgroundColor="#32867d"
      />
    );
  }
}
