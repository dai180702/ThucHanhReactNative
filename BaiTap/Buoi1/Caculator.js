import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";

const Caculator = () => {
  //darkMode
  const [darkMode, setDarkMode] = useState(false);
  const bgColorFunction = darkMode ? "#414853" : "#ededed";
  const bgColorNumber = darkMode ? "#303946" : "#fff";
  const bgColorResut = darkMode ? "#282f3b" : "#f5f5f5";
  const bgColorThemeButton = darkMode ? "#7b8084" : "#e5e5e5";
  const bgColorHistory = darkMode ? "#B5B7BB" : "#7c7c7c";
  const ColorIcon = darkMode ? "white" : "black";

  //Buttons
  const buttonsLeft = [
    ["C", "DEL"],
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    [0, "."],
  ];

  //Events
  const [lastNumber, setLastNumber] = useState("");
  const [currenNumber, setCurrenNumber] = useState("");
  const caculator = () => {
    {
      let lastChar = currenNumber[currenNumber.length - 1];
      if (
        lastChar === "/" ||
        lastChar === "*" ||
        lastChar === "-" ||
        lastChar === "+" ||
        lastChar === "."
      ) {
        setCurrenNumber(currenNumber);
      } else {
        let result = eval(currenNumber).toString();
        setCurrenNumber(result);
      }
    }
  };

  const handleInput = (buttonPress) => {
    switch (buttonPress) {
      case "+":
      case "-":
      case "*":
      case "/":
        Vibration.vibrate(35);
        setCurrenNumber(currenNumber + buttonPress);
        break;
      case "DEL":
        Vibration.vibrate(35);
        setCurrenNumber(currenNumber.substring(0, currenNumber.length - 1));
        break;
      case "C":
        Vibration.vibrate(35);
        setCurrenNumber("");
        setLastNumber("");
        break;
      case "=":
        Vibration.vibrate(35);
        setLastNumber(currenNumber + "=");
        caculator();
        break;
      default:
        Vibration.vibrate(35);
        setCurrenNumber(currenNumber + buttonPress);
        break;
    }
  };

  const buttonsRight = [ "/", "*", "-", "+", "="];
  return (
    <View style={styles.container}>
      <View
        style={{ ...styles.containerResult, backgroundColor: bgColorResut }}
      >
        <TouchableOpacity
          style={{ ...styles.themeButton, backgroundColor: bgColorThemeButton }}
          onPress={() => setDarkMode(!darkMode)}
        >
          <Entypo
            name={darkMode ? "light-up" : "moon"}
            size={30}
            style={{ color: ColorIcon }}
          />
        </TouchableOpacity>

        <Text style={{ ...styles.historyText, color: bgColorHistory }}>
          {lastNumber}
        </Text>
        <Text style={styles.resultText}>{currenNumber}</Text>
      </View>
      {/* Button */}
      <View style={styles.cantainerButton}>
        <View style={styles.containerButtonLeft}>
          {buttonsLeft.map((row, index) => (
            <View
              style={{
                ...styles.containerRow,
                backgroundColor: index == 0 ? bgColorFunction : bgColorNumber,
              }}
            >
              {row.map((item) => (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleInput(item)}
                >
                  <Text style={styles.buttonText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.containerButtonRight}>
          {buttonsRight.map((item) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleInput(item)}
            >
              <Text style={{ ...styles.buttonText, color: "#fff" }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Caculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerResult: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  containerButtonLeft: {
    flex: 3,
    backgroundColor: "aqua",
  },
  containerButtonRight: {
    flex: 1,
    backgroundColor: "#00b9d6",
  },
  cantainerButton: {
    flex: 2,
    flexDirection: "row",
  },
  themeButton: {
    marginTop: 50,
    marginLeft: 20,
    borderRadius: 90,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  historyText: {
    fontSize: 20,
    marginRight: 10,
  },
  resultText: {
    color: "#00b9d6",
    fontSize: 35,
    margin: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  containerRow: {
    flex: 1,
    flexDirection: "row",
  },
});
