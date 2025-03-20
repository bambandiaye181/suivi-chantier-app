import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function TasksScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tâches</Text>
        <Text style={styles.subtitle}>Gérer vos tâches de projet</Text>
      </View>

      <View style={styles.filterContainer}>
        <Pressable style={[styles.filterButton, styles.filterButtonActive]}>
          <Text style={styles.filterButtonTextActive}>Tout</Text>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <Text style={styles.filterButtonText}>En cours</Text>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Terminé</Text>
        </Pressable>
      </View>

      <View style={styles.taskList}>
        {[
          { status: 'terminé', icon: CheckCircle2, color: '#059669' },
          { status: 'en-cours', icon: Clock, color: '#d97706' },
          { status: 'bloqué', icon: AlertCircle, color: '#dc2626' },
        ].map((task, index) => {
          const Icon = task.icon;
          return (
            <Pressable key={index} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Icon size={20} color={task.color} />
                <Text style={[styles.taskStatus, { color: task.color }]}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Text>
              </View>
              <Text style={styles.taskTitle}>Installation électrique Zone A</Text>
              <Text style={styles.taskDescription}>
                Compléter l'installation électrique selon les plans approuvés.
              </Text>
              <View style={styles.taskFooter}>
                <Text style={styles.taskDue}>Échéance: 30 jan. 2024</Text>
                <View style={styles.taskAssignee}>
                  <View style={styles.avatar} />
                  <Text style={styles.assigneeName}>Jean Dupont</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontSize: 14,
  },
  taskList: {
    padding: 20,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskStatus: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  taskDue: {
    fontSize: 12,
    color: '#6b7280',
  },
  taskAssignee: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  assigneeName: {
    fontSize: 12,
    color: '#6b7280',
  },
});