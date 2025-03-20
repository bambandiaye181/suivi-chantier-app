import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.subtitle}>Bienvenue, Jean</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Building2 size={24} color="#2563eb" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Projets actifs</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={24} color="#2563eb" />
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Tâches à faire</Text>
        </View>
        <View style={styles.statCard}>
          <AlertTriangle size={24} color="#2563eb" />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Problèmes</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projets récents</Text>
        {[1, 2, 3].map((project) => (
          <Pressable
            key={project}
            style={styles.projectCard}
            onPress={() => router.push('/project/1')}
          >
            <View>
              <Text style={styles.projectTitle}>Projet {project}</Text>
              <Text style={styles.projectSubtitle}>123 Rue Principale</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
            </View>
            <Text style={styles.projectProgress}>60%</Text>
          </Pressable>
        ))}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  projectSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  projectProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 8,
    width: 200,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
});