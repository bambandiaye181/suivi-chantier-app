/*
  # Add tasks and work categories

  1. New Tables
    - `work_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (gros œuvre, second œuvre)
      - `created_at` (timestamptz)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text) - Task title
      - `description` (text) - Task description
      - `status` (text) - Task status (not_started, in_progress, completed)
      - `project_id` (uuid) - Reference to projects
      - `category_id` (uuid) - Reference to work_categories
      - `due_date` (date) - Task due date
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create work categories table
CREATE TABLE IF NOT EXISTS work_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES work_categories(id) NOT NULL,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE work_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Insert default categories
INSERT INTO work_categories (name) 
VALUES 
  ('Gros œuvre'),
  ('Second œuvre')
ON CONFLICT DO NOTHING;

-- Create policies for work_categories
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'work_categories' AND policyname = 'Users can view work categories'
  ) THEN
    CREATE POLICY "Users can view work categories"
      ON work_categories
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for tasks
DO $$ 
BEGIN
  -- Select tasks policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can view tasks of their projects'
  ) THEN
    CREATE POLICY "Users can view tasks of their projects"
      ON tasks
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = tasks.project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;

  -- Insert tasks policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can create tasks for their projects'
  ) THEN
    CREATE POLICY "Users can create tasks for their projects"
      ON tasks
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;

  -- Update tasks policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can update tasks of their projects'
  ) THEN
    CREATE POLICY "Users can update tasks of their projects"
      ON tasks
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = tasks.project_id
          AND projects.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;

  -- Delete tasks policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can delete tasks of their projects'
  ) THEN
    CREATE POLICY "Users can delete tasks of their projects"
      ON tasks
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = tasks.project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;
END $$;