import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Button,
  Alert, Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
  const today = new Date().toISOString().split("T")[0];

  function showAlert(message) {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(message);
    }
  }  // Example schedule data
  const receptionistSchedule: Record<string, string[]> = {
    "2026-07-11": [
      "Sarah Johnson",
      "Emily Davis",
      "Michael Brown",
    ],
    "2026-07-12": [
      "Jessica Smith",
      "Chris Wilson",
    ],
    "2026-07-13": [
      "Amanda Lee",
      "Daniel Garcia",
      "Rachel White",
      "John Miller",
    ],
    "2026-07-15": [
      "Olivia Moore",
      "David Taylor",
    ],
    "2026-07-18": [
      "Ashley Clark",
      "Robert King",
      "Emma Lewis",
    ],
  };

  const [selectedDate, setSelectedDate] = useState(today);

  // Add dots to days that have schedules
  const markedDates = useMemo(() => {
    const marks: any = {};

    Object.keys(receptionistSchedule).forEach((date) => {
      marks[date] = {
        marked: true,
        dotColor: "#007AFF",
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#007AFF",
      marked: receptionistSchedule[selectedDate] !== undefined,
      dotColor: "#fff",
    };

    return marks;
  }, [selectedDate]);

  const receptionists = receptionistSchedule[selectedDate] || [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Receptionist Schedule</Text>

      <Calendar
        current={today}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        enableSwipeMonths
        theme={{
          todayTextColor: "#007AFF",
          selectedDayBackgroundColor: "#007AFF",
          arrowColor: "#007AFF",
          dotColor: "#007AFF",
          monthTextColor: "#222",
          textMonthFontWeight: "bold",
          textDayFontSize: 15,
          textMonthFontSize: 20,
        }}
      />

      <View style={styles.scheduleContainer}>
        <Text style={styles.dateTitle}>
          Receptionists Working
        </Text>

        <Text style={styles.selectedDate}>
          {selectedDate}
        </Text>

        {receptionists.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No receptionists scheduled.
            </Text>
          </View>
        ) : (
          <FlatList
            data={receptionists}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.charAt(0)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item}</Text>
                  <Text style={styles.shift}>
                    Shift: 8:00 AM – 4:00 PM
                  </Text>
                </View>

                <Button 
                  onPress={() => showAlert('Simple Button pressed')}
                  title="Remove"
                  color="#e22626"
                  accessibilityLabel="Learn more about this purple button"
                />
              </View>
              
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 15,
    color: "#222",
  },

  scheduleContainer: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 20,
  },

  dateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },

  selectedDate: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },

  shift: {
    marginTop: 4,
    color: "#666",
    fontSize: 14,
  },

  number: {
    fontWeight: "bold",
    color: "#999",
  },

  emptyCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  emptyText: {
    color: "#777",
    fontSize: 16,
  },
});