import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Tabs from "./Tabs";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: "15min", expanded: false, active: "15min" };
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>GOGOGO</Text>
        </View>
        <Tabs
          selected={this.state.page}
          active={this.state.active}
          expanded={this.state.expanded}
          style={{ backgroundColor: "#151E30" }}
          selectedIconStyle={{
            borderBottomWidth: 2,
            borderBottomColor: "#6186CC"
          }}
          onSelect={(el, expanded) => {
            if (!el.props.item) {
              this.setState({ page: el.props.name, expanded: false });
            } else {
              this.setState({ expanded: !expanded, active: el.props.name });
            }
          }}
        >
          <Text
            style={{ color: "#52607D" }}
            selectedStyle={{ color: "#6186CC" }}
            name="line"
          >
            Line
          </Text>
          <Text
            style={{ color: "#52607D" }}
            selectedStyle={{ color: "#6186CC" }}
            name="15min"
          >
            15min
          </Text>
          <Text
            name="1hour"
            style={{ color: "#52607D" }}
            selectedStyle={{ color: "#6186CC" }}
          >
            1hour
          </Text>
          <Text
            name="4hour"
            style={{ color: "#52607D" }}
            selectedStyle={{ color: "#6186CC" }}
          >
            4hour
          </Text>
          <Text
            name="1day"
            style={{ color: "#52607D" }}
            selectedStyle={{ color: "#6186CC" }}
          >
            1day
          </Text>
          <Text
            style={{ color: "#52607D" }}
            selectedStyle={{ color: "#6186CC" }}
            preSelectedBgStyle={{
              backgroundColor: "#0C1723",
              borderBottomColor: "#0C1723"
            }}
            preSelectedColorStyle={{ color: "#fff" }}
            item={
              <View style={styles.content}>
                <TouchableOpacity
                  style={{ paddingLeft: 13 }}
                  onPress={() =>
                    this.setState({ expanded: false, page: "more" })
                  }
                >
                  <Text style={{ color: "#52607D" }}>1min</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 13 }}>
                  <Text style={{ color: "#52607D" }}>5min</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 13 }}>
                  <Text style={{ color: "#52607D" }}>30min</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 13 }}>
                  <Text style={{ color: "#52607D" }}>1week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 13 }}>
                  <Text style={{ color: "#52607D" }}>1mon</Text>
                </TouchableOpacity>
              </View>
            }
            name="more"
          >
            More
          </Text>
          <Text
            style={{ color: "#52607D" }}
            selectedStyle={{ color: "#6186CC" }}
            preSelectedBgStyle={{
              backgroundColor: "#0C1723",
              borderBottomColor: "#0C1723"
            }}
            preSelectedColorStyle={{ color: "#fff" }}
            name="index"
          >
            Index
          </Text>
        </Tabs>
        {/* <View style={{ backgroundColor: "blue", zIndex: 0 }}>
          <Text>You should overlap me when click!!!!!!!!!!!!!</Text>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    zIndex: 99
    // alignItems: "center",
    // justifyContent: "center"
  },
  content: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0C1723",
    height: 40
  }
});
