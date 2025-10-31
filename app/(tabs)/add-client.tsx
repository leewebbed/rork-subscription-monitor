import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Client, SubscriptionDuration } from "@/types";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";

export default function AddClientScreen() {
  const { categories, addClient } = useApp();
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [subscriptionStartDate, setSubscriptionStartDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [duration, setDuration] = useState<SubscriptionDuration>("ONE_MONTH");
  const [notes, setNotes] = useState<string>("");

  const [amountPaid, setAmountPaid] = useState<string>("");

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter client name");
      return;
    }

    if (!categoryId) {
      Alert.alert("Error", "Please select a service category");
      return;
    }

    if (categories.length === 0) {
      Alert.alert(
        "No Categories",
        "Please add at least one category first",
        [
          { text: "OK" },
        ]
      );
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      categoryId,
      subscriptionStartDate: subscriptionStartDate.getTime(),
      subscriptionDuration: duration,
      notes: notes.trim(),

      amountPaid: amountPaid ? parseFloat(amountPaid) : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addClient(newClient);

    Alert.alert(
      "Success",
      "Client added successfully",
      [
        { text: "OK", onPress: () => {
          setName("");
          setEmail("");
          setPhone("");
          setCategoryId("");
          setSubscriptionStartDate(new Date());
          setDuration("ONE_MONTH");
          setNotes("");

          setAmountPaid("");
          router.push("/");
        }}
      ]
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSubscriptionStartDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Client Information</Text>

        <Text style={styles.label}>Client Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter client name"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="client@example.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 234 567 8900"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>Subscription Details</Text>

        <Text style={styles.label}>Service Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.length === 0 ? (
            <Text style={styles.noCategoriesText}>No categories available. Please add categories first.</Text>
          ) : (
            categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  categoryId === category.id && styles.categoryChipSelected,
                ]}
                onPress={() => setCategoryId(category.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    categoryId === category.id && styles.categoryChipTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <Text style={styles.label}>Start Date & Time *</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {subscriptionStartDate.toLocaleString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={subscriptionStartDate}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={styles.label}>Duration *</Text>
        <View style={styles.durationContainer}>
          <View style={[styles.durationButtonWrapper, styles.durationButtonWrapperFirst]}>
            <TouchableOpacity
              style={[
                styles.durationButton,
                duration === "ONE_WEEK" && styles.durationButtonSelected,
              ]}
              onPress={() => setDuration("ONE_WEEK")}
            >
              <Text
                style={[
                  styles.durationButtonText,
                  duration === "ONE_WEEK" && styles.durationButtonTextSelected,
                ]}
              >
                One Week
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.durationButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.durationButton,
                duration === "ONE_MONTH" && styles.durationButtonSelected,
              ]}
              onPress={() => setDuration("ONE_MONTH")}
            >
              <Text
                style={[
                  styles.durationButtonText,
                  duration === "ONE_MONTH" && styles.durationButtonTextSelected,
                ]}
              >
                One Month
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.durationButtonWrapper, styles.durationButtonWrapperLast]}>
            <TouchableOpacity
              style={[
                styles.durationButton,
                duration === "ONE_YEAR" && styles.durationButtonSelected,
              ]}
              onPress={() => setDuration("ONE_YEAR")}
            >
              <Text
                style={[
                  styles.durationButtonText,
                  duration === "ONE_YEAR" && styles.durationButtonTextSelected,
                ]}
              >
                One Year
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any additional notes"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Payment Details</Text>

        <Text style={styles.label}>Amount Paid</Text>
        <TextInput
          style={styles.input}
          value={amountPaid}
          onChangeText={setAmountPaid}
          placeholder="£0.00"
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Client</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  form: {
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
    marginTop: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  categoryChipSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  noCategoriesText: {
    fontSize: 14,
    color: "#EF4444",
    fontStyle: "italic" as const,
  },
  dateButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#111827",
  },
  durationContainer: {
    flexDirection: "row",
  },
  durationButtonWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  durationButtonWrapperFirst: {
    marginLeft: 0,
  },
  durationButtonWrapperLast: {
    marginRight: 0,
  },
  durationButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  durationButtonSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
  },
  durationButtonTextSelected: {
    color: "#FFFFFF",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
