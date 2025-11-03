import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from "react-native";
import { useState, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { SortOption } from "@/types";
import { ArrowUpDown, Calendar, User, Clock, Trash2, ChevronDown, ChevronUp } from "lucide-react-native";
import { getExpiryDate, getDaysUntilExpiry, isExpired } from "@/utils/notifications";

export default function HomeScreen() {
  const { clients, deleteClient, getCategoryById } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>("expiry");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const sortedClients = useMemo(() => {
    const clientsWithExpiry = clients.map(client => ({
      ...client,
      expiryDate: getExpiryDate(client.subscriptionStartDate, client.subscriptionDuration).getTime(),
    }));

    if (sortBy === "name") {
      return clientsWithExpiry.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return clientsWithExpiry.sort((a, b) => a.expiryDate - b.expiryDate);
    }
  }, [clients, sortBy]);

  const toggleSort = () => {
    setSortBy(current => current === "name" ? "expiry" : "name");
  };

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Client",
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteClient(id) },
      ]
    );
  };

  const getStatusColor = (startDate: number, duration: any) => {
    if (isExpired(startDate, duration)) {
      return "#EF4444";
    }
    const daysLeft = getDaysUntilExpiry(startDate, duration);
    if (daysLeft <= 7) {
      return "#F59E0B";
    }
    return "#10B981";
  };

  const getStatusText = (startDate: number, duration: any) => {
    if (isExpired(startDate, duration)) {
      return "Expired";
    }
    const daysLeft = getDaysUntilExpiry(startDate, duration);
    if (daysLeft === 0) {
      return "Expires today";
    }
    if (daysLeft === 1) {
      return "Expires tomorrow";
    }
    return `${daysLeft} days left`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Subscriptions</Text>
          <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
            <ArrowUpDown size={18} color="#3B82F6" />
            <Text style={styles.sortButtonText}>
              Sort by {sortBy === "name" ? "Name" : "Expiry"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>{clients.length} active clients</Text>
      </View>

      <FlatList
        data={sortedClients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const category = getCategoryById(item.categoryId);
          const expiryDate = getExpiryDate(item.subscriptionStartDate, item.subscriptionDuration);
          const statusColor = getStatusColor(item.subscriptionStartDate, item.subscriptionDuration);
          const statusText = getStatusText(item.subscriptionStartDate, item.subscriptionDuration);

          const isExpanded = expandedCards.has(item.id);

          return (
            <TouchableOpacity 
              style={styles.clientCard} 
              onPress={() => toggleCard(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.clientInfo}>
                  <View style={styles.nameRow}>
                    <User size={16} color="#111827" />
                    <Text style={styles.clientName}>{item.name}</Text>
                  </View>
                  {category && (
                    <Text style={styles.categoryText}>{category.name}</Text>
                  )}
                </View>
                <View style={styles.statusBadgeCompact}>
                  <Text style={[styles.statusTextCompact, { color: statusColor }]}>
                    {statusText}
                  </Text>
                </View>
              </View>

              {isExpanded && (
                <View style={styles.cardBody}>
                  {item.email && (
                    <Text style={styles.contactText}>📧 {item.email}</Text>
                  )}
                  {item.phone && (
                    <Text style={styles.contactText}>📱 {item.phone}</Text>
                  )}

                  <View style={styles.dateRow}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.dateText}>
                      Started: {new Date(item.subscriptionStartDate).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.dateRow}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.dateText}>
                      Expires: {expiryDate.toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.durationRow}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.dateText}>
                      Duration: {item.subscriptionDuration}
                    </Text>
                  </View>

                  {item.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{item.notes}</Text>
                    </View>
                  )}

                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id, item.name)}
                  >
                    <Trash2 size={16} color="#FFFFFF" />
                    <Text style={styles.deleteButtonText}>Delete Client</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.expandIndicator}>
                {isExpanded ? (
                  <ChevronUp size={20} color="#9CA3AF" />
                ) : (
                  <ChevronDown size={20} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No clients yet</Text>
            <Text style={styles.emptySubtext}>Add your first client to start tracking subscriptions</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#3B82F6",
  },
  listContent: {
    padding: 16,
  },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clientInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
  },
  categoryText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  statusBadgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusTextCompact: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  cardBody: {
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  contactText: {
    fontSize: 14,
    color: "#374151",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  notesContainer: {
    marginTop: 4,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  expandIndicator: {
    alignItems: "center",
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
