import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Calendar, MapPin, Euro, FileText } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (data) {
        setProject(data);
        setName(data.name);
        setDescription(data.description || '');
        setAddress(data.address || '');
        setStartDate(data.start_date || '');
        setEndDate(data.end_date || '');
        setBudget(data.budget?.toString() || '');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails du projet');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom du projet est requis');
      return false;
    }

    if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      Alert.alert('Erreur', 'La date de début doit être au format AAAA-MM-JJ');
      return false;
    }

    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      Alert.alert('Erreur', 'La date de fin doit être au format AAAA-MM-JJ');
      return false;
    }

    if (budget && isNaN(parseFloat(budget))) {
      Alert.alert('Erreur', 'Le budget doit être un nombre valide');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('projects')
        .update({
          name: name.trim(),
          description: description.trim() || null,
          address: address.trim() || null,
          start_date: startDate || null,
          end_date: endDate || null,
          budget: budget ? parseFloat(budget) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Succès', 'Le projet a été modifié avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error updating project:', error);
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la modification du projet'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom du projet<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Résidence Les Jardins"
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Description détaillée du projet"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color="#6b7280" />
              <TextInput
                style={styles.inputIcon}
                value={address}
                onChangeText={setAddress}
                placeholder="Adresse complète"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planning</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de début</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color="#6b7280" />
              <TextInput
                style={styles.inputIcon}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="AAAA-MM-JJ"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de fin prévue</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color="#6b7280" />
              <TextInput
                style={styles.inputIcon}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="AAAA-MM-JJ"
                maxLength={10}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget prévisionnel</Text>
            <View style={styles.inputWithIcon}>
              <Euro size={20} color="#6b7280" />
              <TextInput
                style={styles.inputIcon}
                value={budget}
                onChangeText={setBudget}
                placeholder="Montant en euros"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <Pressable 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Modification en cours...' : 'Modifier le projet'}
          </Text>
        </Pressable>
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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#dc2626',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  inputIcon: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});