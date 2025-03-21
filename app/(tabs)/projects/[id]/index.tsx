import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Building2, Calendar, MapPin, Euro, Pencil, Trash2 } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails du projet');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le projet',
      'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: deleteProject },
      ]
    );
  };

  const deleteProject = async () => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;

      Alert.alert('Succès', 'Le projet a été supprimé avec succès', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error deleting project:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le projet');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Projet non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Building2 size={32} color="#2563eb" />
          <Text style={styles.title}>{project.name}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            style={styles.editButton}
            onPress={() => router.push(`/projects/${id}/edit`)}
          >
            <Pencil size={20} color="#2563eb" />
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={20} color="#dc2626" />
          </Pressable>
        </View>
      </View>

      {project.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{project.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        
        {project.address && (
          <View style={styles.infoRow}>
            <MapPin size={20} color="#6b7280" />
            <Text style={styles.infoText}>{project.address}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Calendar size={20} color="#6b7280" />
          <View>
            <Text style={styles.infoLabel}>Début</Text>
            <Text style={styles.infoText}>{formatDate(project.start_date)}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Calendar size={20} color="#6b7280" />
          <View>
            <Text style={styles.infoLabel}>Fin prévue</Text>
            <Text style={styles.infoText}>{formatDate(project.end_date)}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Euro size={20} color="#6b7280" />
          <View>
            <Text style={styles.infoLabel}>Budget</Text>
            <Text style={styles.infoText}>{formatBudget(project.budget)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progression</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '45%' }]} />
          </View>
          <Text style={styles.progressText}>45%</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#111827',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
  },
});