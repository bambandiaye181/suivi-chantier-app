/*
  # Fix project policies

  This migration ensures policies are created only if they don't already exist.
  Uses DO blocks to safely check for policy existence before creation.
*/

DO $$ 
BEGIN
  -- Create projects policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' 
    AND policyname = 'Users can create their own projects'
  ) THEN
    CREATE POLICY "Users can create their own projects"
      ON projects
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Read projects policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' 
    AND policyname = 'Users can view their own projects'
  ) THEN
    CREATE POLICY "Users can view their own projects"
      ON projects
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Update projects policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' 
    AND policyname = 'Users can update their own projects'
  ) THEN
    CREATE POLICY "Users can update their own projects"
      ON projects
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Delete projects policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' 
    AND policyname = 'Users can delete their own projects'
  ) THEN
    CREATE POLICY "Users can delete their own projects"
      ON projects
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;