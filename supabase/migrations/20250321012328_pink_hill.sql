/*
  # Initial schema setup for Construction PM

  1. New Tables
    - `projects`
      - `id` (uuid, primary key) - Unique identifier for each project
      - `name` (text, required) - Project name
      - `description` (text, optional) - Project description
      - `address` (text, optional) - Project location
      - `start_date` (date, optional) - Project start date
      - `end_date` (date, optional) - Project end date
      - `budget` (numeric, optional) - Project budget
      - `user_id` (uuid, required) - Reference to auth.users
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `projects` table
    - Add policies for:
      - Create: Users can create their own projects
      - Read: Users can view their own projects
      - Update: Users can update their own projects
      - Delete: Users can delete their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text,
  start_date date,
  end_date date,
  budget numeric,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create projects
CREATE POLICY "Users can create their own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Read projects
CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Update projects
CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete projects
CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);