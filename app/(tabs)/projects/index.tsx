import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Building2 } from 'lucide-react-native';

export default function ProjectsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projets</Text>
        <Text style={styles.subtitle}>Gérer vos projets de construction</Text>
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/projects/new')}
      >
        <Plus size={24} color="#ffffff" />
        <Text style={styles.addButtonText}>Nouveau projet</Text>
      </Pressable>

      <View style={styles.projectList}>
        {[1, 2, 3].map((project) => (
          <Pressable
            key={project}
            style={styles.projectCard}
            onPress={() => router.push(`/project/${project}`)}
          >
            <View style={styles.projectHeader}>
              <Building2 size={24} color="#2563eb" />
              <View style={styles.projectStatus}>
                <View style={[styles.statusDot, { backgroundColor: '#059669' }]} />
                <Text style={[styles.statusText, { color: '#059669' }]}>En cours</Text>
              </View>
            </View>
            <Text style={styles.projectTitle}>Résidence Les Jardins</Text>
            <Text style={styles.projectAddress}>123 Rue des Fleurs, 75001 Paris</Text>
            <View style={styles.projectDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>1.2M €</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Début</Text>
                <Text style={styles.detailValue}>15 mars 2024</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Fin prévue</Text>
                <Text style={styles.detailValue}>30 nov. 2024</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '45%' }]} />
              </View>
              <Text style={styles.progressText}>45%</Text>
            </View>
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
  addButton: {
    margin: 20,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  projectList: {
    padding: 20,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  projectAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
});