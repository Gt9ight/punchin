import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Animated, TextInput, KeyboardAvoidingView, Platform, FlatList, Button } from 'react-native';
import React, { useState, useRef } from 'react';

const Home = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [hourlyRate, setHourlyRate] = useState('');
  const [payPeriod, setPayPeriod] = useState('');
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [search, setSearch] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [clockInInfo, setClockInInfo] = useState(null);
  const [clockOutInfo, setClockOutInfo] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [combinedInfo, setCombinedInfo] = useState('');
  const [displayInfo, setDisplayInfo] = useState('');
  const statesList = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];
  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = statesList.filter((state) =>
        state.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
  };

  const handleSelectState = (state) => {
    setSearch(state);
    setFilteredStates([]);
  };

  const handleClockIn = () => {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options); // e.g., "Monday, 1/20/2025"
    const formattedTime = currentDate.toLocaleTimeString(); // e.g., "3:45:00 PM"
    const clockInText = `${formattedDate}: Clock in at ${formattedTime}`;
    setClockInInfo({ date: formattedDate, time: formattedTime });
    setDisplayInfo(clockInText); // Display clock-in info immediately
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleTimeString(); // e.g., "5:30PM"

    if (clockInInfo) {
      const combinedText = `${clockInInfo.date}: Clock in at ${clockInInfo.time} - Clock out at ${formattedTime}`;
      setClockOutInfo({ time: formattedTime });
      setDisplayInfo(combinedText); // Update the display with clock-out info
    }

    setIsClockedIn(false);
  };
  
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.main}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.name}>Mariano Sanchez</Text>
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Text style={styles.buttonText}>Update Details</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View>
      {!isClockedIn ? (
        <Button title="Clock In" onPress={handleClockIn} />
      ) : (
        <Button title="Clock Out" onPress={handleClockOut} />
      )}

{displayInfo && (
          <Text style={styles.infoText}>{displayInfo}</Text>
        )}
    </View>

      {/* Modal */}
      <Modal transparent visible={isModalVisible} animationType="none">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.overlayTouch} onPress={closeModal} />
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.modalText}>Details</Text>

            {/* State Input */}
            <Text style={styles.inputLabel}>State:</Text>
            <TextInput
        style={styles.input}
        placeholder="Search for a state"
        value={search}
        onChangeText={handleSearch}
      />
      {filteredStates.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredStates}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectState(item)}>
                <Text style={styles.suggestion}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

            {/* Hourly Rate Input */}
            <Text style={styles.inputLabel}>Hourly Rate:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your hourly rate"
              keyboardType="numeric"
              value={hourlyRate}
              onChangeText={setHourlyRate}
            />

            {/* Pay Period Selection */}
            <Text style={styles.inputLabel}>Pay Period:</Text>
            <View style={styles.payPeriodContainer}>
              <TouchableOpacity
                style={[
                  styles.payPeriodButton,
                  payPeriod === 'weekly' && styles.payPeriodButtonSelected,
                ]}
                onPress={() => setPayPeriod('weekly')}
              >
                <Text
                  style={[
                    styles.payPeriodText,
                    payPeriod === 'weekly' && styles.payPeriodTextSelected,
                  ]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payPeriodButton,
                  payPeriod === 'biweekly' && styles.payPeriodButtonSelected,
                ]}
                onPress={() => setPayPeriod('biweekly')}
              >
                <Text
                  style={[
                    styles.payPeriodText,
                    payPeriod === 'biweekly' && styles.payPeriodTextSelected,
                  ]}
                >
                  Biweekly
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  safeArea: { backgroundColor: '#f0f0f0' },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  button: { padding: 8 },
  buttonText: { fontSize: 16, color: '#007BFF' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouch: { flex: 1 },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  payPeriodContainer: { flexDirection: 'row', marginTop: 10 },
  payPeriodButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
  },
  payPeriodButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  payPeriodText: { fontSize: 16, color: '#000' },
  payPeriodTextSelected: { color: '#fff' },
  closeButton: { alignSelf: 'flex-end', padding: 10 },
  closeButtonText: { fontSize: 16, color: '#FF0000' },
  Stateinput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  suggestionsContainer: {
    maxHeight: 150, // Fixed height for the suggestions window
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  infoText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default Home;
