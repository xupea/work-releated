import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform
} from "react-native";

type State = {
  keyboardUp: boolean,
  expanded: boolean
};

export default class Tabs extends Component {
  state: State = {};

  onSelect(el) {
    if (el.props.item) {
      this.setState({
        // expanded: !this.state.expanded,
        expandedContent: el.props.item
      });
    }

    console.log(el.setNativeProps);

    const expanded = this.props.expanded;

    if (el.props.onSelect) {
      el.props.onSelect(el, expanded);
    } else if (this.props.onSelect) {
      this.props.onSelect(el, expanded);
    }
  }

  componentWillMount() {
    if (Platform.OS === "android") {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this.keyboardWillShow
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this.keyboardWillHide
      );
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardWillShow = e => {
    this.setState({ keyboardUp: true });
  };

  keyboardWillHide = e => {
    this.setState({ keyboardUp: false });
  };

  render() {
    const self = this;
    let selected = this.props.selected;
    let active = this.props.active;
    let expanded = this.props.expanded;
    if (!selected) {
      React.Children.forEach(this.props.children.filter(c => c), el => {
        if (!selected || el.props.initial) {
          selected = el.props.name || el.key;
        }
      });
    }
    return (
      <View style={{ height: 50, zIndex: 1 }}>
        <View
          style={[
            styles.tabbarView,
            this.props.style,
            this.state.keyboardUp && styles.hidden
          ]}
        >
          {React.Children.map(this.props.children.filter(c => c), el => (
            <TouchableOpacity
              key={el.props.name + "touch"}
              testID={el.props.testID}
              style={[
                styles.iconView,
                this.props.iconStyle,
                (el.props.name || el.key) == selected
                  ? this.props.selectedIconStyle ||
                    el.props.selectedIconStyle ||
                    {}
                  : {},
                expanded && (el.props.name || el.key) == active
                  ? el.props.preSelectedBgStyle
                  : {}
              ]}
              onPress={() => !self.props.locked && self.onSelect(el)}
              onLongPress={() => self.onSelect(el)}
              activeOpacity={el.props.pressOpacity}
            >
              {selected == (el.props.name || el.key)
                ? React.cloneElement(el, {
                    selected: true,
                    style: [
                      el.props.style,
                      this.props.selectedStyle,
                      el.props.selectedStyle
                    ]
                  })
                : expanded & ((el.props.name || el.key) == active)
                  ? React.cloneElement(el, {
                      style: [el.props.preSelectedColorStyle]
                    })
                  : el}
            </TouchableOpacity>
          ))}
        </View>
        {expanded ? (
          <View style={styles.popup}>{this.state.expandedContent}</View>
        ) : null}
      </View>
    );
  }
}
var styles = StyleSheet.create({
  tabbarView: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 30,
    opacity: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0
  },
  iconView: {
    flex: 1,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  hidden: {
    height: 0
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  popup: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    backgroundColor: "#000000"
  }
});
