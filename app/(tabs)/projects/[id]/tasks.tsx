import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleCheck, Clock, CircleAlert, Plus } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];
type WorkCategory = Database['public']['Tables']['work_categories']['Row'];

type GroupedTasks = {
  [key: string]: {
    categoryName: string;
    tasks: Task[];
  };
};

export default function ProjectTasksScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({});

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      
      // Fetch tasks with their categories
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          work_categories (
            id,
            name
          )
        `)
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Group tasks by category
      const grouped = (tasks || []).reduce((acc: GroupedTasks, task: any) => {
        const categoryId = task.category_id;
        const categoryName = task.work_categories?.name || 'Non catégorisé';

        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryName,
            tasks: [],
          };
        }

        acc[categoryId].tasks.push(task);
        return acc;
      }, {});

      setGroupedTasks(grouped);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CircleCheck size={20} color="#059669" />;
      case 'in_progress':
        return <Clock size={20} color="#d97706" />;
      default:
        return <CircleAlert size={20} color="#dc2626" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tâches du projet</Text>
        <Text style={styles.subtitle}>Gérer les tâches par catégorie</Text>
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push(`/projects/${id}/tasks/new`)}
      >
        <Plus size={24} color="#ffffff" />
        <Text style={styles.addButtonText}>Nouvelle tâche</Text>
      </Pressable>

      {Object.entries(groupedTasks).map(([categoryId, { categoryName, tasks }]) => (
        <View key={categoryId} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{categoryName}</Text>
          
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucune tâche dans cette catégorie</Text>
            </View>
          ) : (
            tasks.map((task) => (
              <Pressable
                key={task.id}
                style={styles.taskCard}
                onPress={() => router.push(`/projects/${id}/tasks/${task.id}`)}
              >
                <View style={styles.taskHeader}>
                  {getStatusIcon(task.status)}
                  <Text
                    style={[
                      styles.taskStatus,
                      task.status === 'completed' && styles.statusCompleted,
                      task.status === 'in_progress' && styles.statusInProgress,
                      task.status === 'not_started' && styles.statusNotStarted,
                    ]}
                  >
                    {task.status === 'completed' && 'Terminé'}
                    {task.status === 'in_progress' && 'En cours'}
                    {task.status === 'not_started' && 'À faire'}
                  </Text>
                </View>

                <Text style={styles.taskTitle}>{task.title}</Text>
                
                {task.description && (
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}

                {task.due_date && (
                  <Text style={styles.taskDueDate}>
                    Échéance : {formatDate(task.due_date)}
                  </Text>
                )}
              </Pressable>
            ))
          )}
        </View>
      ))}
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
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  emptyState: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 16,
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
    marginBottom: 12,
  },
  taskStatus: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  statusCompleted: {
    color: '#059669',
  },
  statusInProgress: {
    color: '#d97706',
  },
  statusNotStarted: {
    color: '#dc2626',
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
  taskDueDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});