import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Shield, Lock, Database, Bell } from "lucide-react-native";

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Shield size={48} color="#3B82F6" />
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <Text style={styles.headerSubtitle}>Your data, your control</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderIcon}>
            <Database size={24} color="#3B82F6" />
          </View>
          <Text style={styles.sectionTitle}>Local Storage Only</Text>
        </View>
        <Text style={styles.sectionText}>
          All your data is stored locally on your device only. No cloud services, no external servers, 
          and no third-party access. Your client information never leaves your device.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderIcon}>
            <Lock size={24} color="#3B82F6" />
          </View>
          <Text style={styles.sectionTitle}>Complete Offline Operation</Text>
        </View>
        <Text style={styles.sectionText}>
          This app works completely offline. No internet connection is required or used for any features. 
          Your subscription data remains private and secure on your device.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderIcon}>
            <Bell size={24} color="#3B82F6" />
          </View>
          <Text style={styles.sectionTitle}>Local Notifications</Text>
        </View>
        <Text style={styles.sectionText}>
          Renewal notifications are generated and managed locally on your device. No external notification 
          services are used.
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Data Privacy Guarantee</Text>
        <Text style={styles.infoText}>
          • No data collection{"\n"}
          • No analytics or tracking{"\n"}
          • No user accounts required{"\n"}
          • No internet connectivity needed{"\n"}
          • 100% offline operation
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Subscription Monitor v1.0</Text>
        <Text style={styles.footerSubtext}>Built with privacy in mind</Text>
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
  header: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#111827",
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeaderIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
  },
  sectionText: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: "#EFF6FF",
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1E40AF",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 22,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6B7280",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});
