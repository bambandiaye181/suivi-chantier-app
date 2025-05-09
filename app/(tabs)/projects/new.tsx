import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Calendar, MapPin, Euro, FileText } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function NewProjectScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Vous devez être connecté pour créer un projet');
      }

      const { error } = await supabase.from('projects').insert({
        name: name.trim(),
        description: description.trim() || null,
        address: address.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        budget: budget ? parseFloat(budget) : null,
        user_id: user.id,
      });

      if (error) throw error;

      Alert.alert('Succès', 'Le projet a été créé avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du projet'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          
          <Pressable style={styles.documentButton}>
            <FileText size={20} color="#2563eb" />
            <Text style={styles.documentButtonText}>Ajouter des documents</Text>
          </Pressable>
          <Text style={styles.documentHint}>
            Ajoutez des plans, devis ou autres documents de référence
          </Text>
        </View>

        <Pressable 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Création en cours...' : 'Créer le projet'}
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
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  documentButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  documentHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
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