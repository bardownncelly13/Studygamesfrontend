import supabase from '../databaseClient';
import axios from 'axios';

export default async function callAzureOpenAI(messages) {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get session to get access token
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) throw new Error('No access token found');

  try {
    const response = await axios.post(
      "https://studygames-backend-80244932095.us-central1.run.app",
      { messages },  // POST body here
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
