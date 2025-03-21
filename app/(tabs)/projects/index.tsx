import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Building2 } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les projets');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(budget);
  };

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
        {isLoading ? (
          <Text style={styles.loadingText}>Chargement des projets...</Text>
        ) : projects.length === 0 ? (
          <View style={styles.emptyState}>
            <Building2 size={48} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>Aucun projet</Text>
            <Text style={styles.emptyStateText}>
              Commencez par créer votre premier projet
            </Text>
          </View>
        ) : (
          projects.map((project) => (
            <Pressable
              key={project.id}
              style={styles.projectCard}
              onPress={() => router.push(`/project/${project.id}`)}
            >
              <View style={styles.projectHeader}>
                <Building2 size={24} color="#2563eb" />
                <View style={styles.projectStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#059669' }]} />
                  <Text style={[styles.statusText, { color: '#059669' }]}>En cours</Text>
                </View>
              </View>
              <Text style={styles.projectTitle}>{project.name}</Text>
              {project.address && (
                <Text style={styles.projectAddress}>{project.address}</Text>
              )}
              <View style={styles.projectDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Budget</Text>
                  <Text style={styles.detailValue}>{formatBudget(project.budget)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Début</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(project.start_date)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fin prévue</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(project.end_date)}
                  </Text>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '45%' }]} />
                </View>
                <Text style={styles.progressText}>45%</Text>
              </View>
            </Pressable>
          ))
        )}
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
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
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