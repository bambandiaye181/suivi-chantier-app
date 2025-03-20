import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { TriangleAlert as AlertTriangle, Camera } from 'lucide-react-native';

export default function IssuesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Problèmes</Text>
        <Text style={styles.subtitle}>Suivre et résoudre les problèmes du projet</Text>
      </View>

      <Pressable style={styles.addButton}>
        <Text style={styles.addButtonText}>Signaler un problème</Text>
      </Pressable>

      <View style={styles.issueList}>
        {[1, 2, 3].map((issue) => (
          <Pressable key={issue} style={styles.issueCard}>
            <View style={styles.issueHeader}>
              <AlertTriangle size={20} color="#dc2626" />
              <Text style={styles.issuePriority}>Haute priorité</Text>
            </View>
            <Text style={styles.issueTitle}>Fuite d'eau au sous-sol</Text>
            <Text style={styles.issueDescription}>
              Fuite d'eau détectée au sous-sol près des fondations. Intervention immédiate requise.
            </Text>
            <View style={styles.issueMedia}>
              <View style={styles.issueImage}>
                <Camera size={20} color="#6b7280" />
              </View>
              <Text style={styles.mediaCount}>2 Photos</Text>
            </View>
            <View style={styles.issueFooter}>
              <Text style={styles.issueDate}>Signalé le: 25 jan. 2024</Text>
              <View style={styles.issueStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Ouvert</Text>
              </View>
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
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  issueList: {
    padding: 20,
  },
  issueCard: {
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
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  issuePriority: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  issueDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  issueMedia: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  issueImage: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  mediaCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  issueDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  issueStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
});