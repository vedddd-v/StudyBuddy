/*
  # Initial StudyBuddy Database Schema

  1. New Tables
    - `profiles` - User profile information
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `avatar_url` (text, nullable)
      - `academic_level` (text)
      - `bio` (text, nullable)
      - `phone` (text)
      - `rating` (numeric, default 5.0)
      - `total_reviews` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `subjects` - User subject expertise
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `category` (text)
      - `skill_level` (text)
      - `can_help` (boolean, default false)
      - `needs_help` (boolean, default false)
      - `created_at` (timestamp)

    - `help_requests` - Student help requests
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `subject_name` (text)
      - `subject_category` (text)
      - `title` (text)
      - `description` (text)
      - `urgency` (text)
      - `status` (text, default 'open')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `help_responses` - Responses to help requests
      - `id` (uuid, primary key)
      - `request_id` (uuid, references help_requests)
      - `user_id` (uuid, references profiles)
      - `message` (text)
      - `created_at` (timestamp)

    - `tutoring_sessions` - Scheduled tutoring sessions
      - `id` (uuid, primary key)
      - `tutor_id` (uuid, references profiles)
      - `student_id` (uuid, references profiles)
      - `subject_name` (text)
      - `subject_category` (text)
      - `scheduled_at` (timestamp)
      - `duration` (integer)
      - `status` (text, default 'scheduled')
      - `meeting_link` (text, nullable)
      - `created_at` (timestamp)

    - `study_groups` - Study group information
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `subject_name` (text)
      - `subject_category` (text)
      - `max_members` (integer)
      - `created_by` (uuid, references profiles)
      - `is_private` (boolean, default false)
      - `created_at` (timestamp)

    - `study_group_members` - Study group membership
      - `id` (uuid, primary key)
      - `group_id` (uuid, references study_groups)
      - `user_id` (uuid, references profiles)
      - `joined_at` (timestamp)

    - `reviews` - User reviews and ratings
      - `id` (uuid, primary key)
      - `reviewer_id` (uuid, references profiles)
      - `reviewee_id` (uuid, references profiles)
      - `session_id` (uuid, references tutoring_sessions, nullable)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  academic_level text NOT NULL,
  bio text,
  phone text NOT NULL,
  rating numeric DEFAULT 5.0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  skill_level text NOT NULL,
  can_help boolean DEFAULT false,
  needs_help boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create help_requests table
CREATE TABLE IF NOT EXISTS help_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject_name text NOT NULL,
  subject_category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  urgency text NOT NULL,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create help_responses table
CREATE TABLE IF NOT EXISTS help_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES help_requests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tutoring_sessions table
CREATE TABLE IF NOT EXISTS tutoring_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject_name text NOT NULL,
  subject_category text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration integer NOT NULL,
  status text DEFAULT 'scheduled',
  meeting_link text,
  created_at timestamptz DEFAULT now()
);

-- Create study_groups table
CREATE TABLE IF NOT EXISTS study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  subject_name text NOT NULL,
  subject_category text NOT NULL,
  max_members integer NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create study_group_members table
CREATE TABLE IF NOT EXISTS study_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES tutoring_sessions(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Subjects policies
CREATE POLICY "Users can view all subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own subjects"
  ON subjects FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Help requests policies
CREATE POLICY "Users can view all help requests"
  ON help_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create help requests"
  ON help_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own help requests"
  ON help_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Help responses policies
CREATE POLICY "Users can view all help responses"
  ON help_responses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create help responses"
  ON help_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tutoring sessions policies
CREATE POLICY "Users can view their tutoring sessions"
  ON tutoring_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = tutor_id OR auth.uid() = student_id);

CREATE POLICY "Users can create tutoring sessions"
  ON tutoring_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = tutor_id OR auth.uid() = student_id);

CREATE POLICY "Users can update their tutoring sessions"
  ON tutoring_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = tutor_id OR auth.uid() = student_id);

-- Study groups policies
CREATE POLICY "Users can view public study groups"
  ON study_groups FOR SELECT
  TO authenticated
  USING (NOT is_private OR created_by = auth.uid());

CREATE POLICY "Users can create study groups"
  ON study_groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own study groups"
  ON study_groups FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Study group members policies
CREATE POLICY "Users can view study group members"
  ON study_group_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join study groups"
  ON study_group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave study groups"
  ON study_group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Users can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_responses_request_id ON help_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_tutoring_sessions_tutor_id ON tutoring_sessions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutoring_sessions_student_id ON tutoring_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group_id ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user_id ON study_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_help_requests_updated_at
  BEFORE UPDATE ON help_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();