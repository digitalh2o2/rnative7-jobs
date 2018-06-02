import React from "react";
import { Notifications } from "expo";
import { StyleSheet, Text, View, Platform, Alert } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import { Provider } from "react-redux";
import { Icon } from "react-native-elements";
import registerForNotifications from "./services/push_notifications";

import store from "./store";
import AuthScreen from "./screens/AuthScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import MapScreen from "./screens/MapScreen";
import DeckScreen from "./screens/DeckScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ReviewScreen from "./screens/ReviewScreen";

export default class App extends React.Component {
  componentDidMount() {
    registerForNotifications();
    Notifications.addListener(notification => {
      const {
        data: { text },
        origin
      } = notification;

      if (origin === "received" && text) {
        Alert.alert("New Push Notification", text, [{ text: "Ok." }]);
      }
    });
  }

  render() {
    const MainNavigator = createBottomTabNavigator(
      {
        welcome: { screen: WelcomeScreen },
        auth: { screen: AuthScreen },
        main: {
          screen: createBottomTabNavigator(
            {
              map: { screen: MapScreen },
              deck: { screen: DeckScreen },
              review: {
                screen: createStackNavigator({
                  review: { screen: ReviewScreen },
                  settings: { screen: SettingsScreen }
                }),
                navigationOptions: {
                  title: "Review Jobs",
                  tabBarIcon: ({ tintColor }) => (
                    <Icon name="favorite" size={30} color={tintColor} />
                  )
                }
              }
            },
            {
              tabBarOptions: {
                labelStyle: { fontSize: 12 }
              }
            }
          )
        }
      },
      {
        navigationOptions: {
          tabBarVisible: false
        },
        lazy: true
      }
    );

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center"
  }
});
