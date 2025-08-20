import supabase from '../databaseClient';
import axios from 'axios';

export default async function callAzureOpenAI(messages) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", backendUrl);

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get session to get access token
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('No access token found');

  try {
    const response = await axios.post(
      backendUrl,
      { messages },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10s timeout to catch hanging requests
      }
    );

    // Check for unexpected status codes
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    // Axios error handling
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:");
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);
      } else if (error.request) {
        // Request was made but no response
        console.error("No response received. Request:", error.request);
      } else {
        // Something went wrong setting up the request
        console.error("Axios setup error:", error.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // rethrow so caller can handle
  }
}
