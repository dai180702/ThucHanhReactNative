import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
} from "react-native";
import React from "react";

const groupPeopleByLastName = (data) => {
  const groupedData = data.reduce((acc, item) => {
    const group = item.name.last[0].toUpperCase();
    if (!acc[group]) {
      acc[group] = { title: group, data: [] };
    }
    acc[group].data.push(item);
    return acc;
  }, {});

  const sections = Object.values(groupedData);

  // Sắp xếp A-Z
  return sections.sort((a, b) => a.title.localeCompare(b.title));
};

const PEOPLE = [
  { name: { title: "MS", first: "Maeva", last: "Scott" } },
  { name: { title: "MS", first: "Malle", last: "Henry" } },
  { name: { title: "MS", first: "Mohamound", last: "Faaij" } },
  { name: { title: "MS", first: "Mohamound", last: "Da" } },
  { name: { title: "MS", first: "Mohamound", last: "afegr" } },
  { name: { title: "MS", first: "Mohamound", last: "Faaij" } },
  { name: { title: "MS", first: "Mohamound", last: "khaca" } },
  { name: { title: "MS", first: "Mohamound", last: "Faaij" } },
  { name: { title: "MS", first: "Mohamound", last: "rhscg" } },
  { name: { title: "MS", first: "Mohamound", last: "Faaij" } },
  { name: { title: "MS", first: "Mohamound", last: "tish" } },
  { name: { title: "MS", first: "Mohamound", last: "Faaij" } },
];

export default function Project8() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SectionList
        sections={groupPeopleByLastName(PEOPLE)}
        keyExtractor={(item, index) => `${item.name.first}-${item.name.last}-${index}`}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>
              {item.name.first} {item.name.last}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  name: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sectionHeader: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgb(170, 170, 170)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
