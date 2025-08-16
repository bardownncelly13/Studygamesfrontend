import supabase from "../databaseClient"; 

export async function deleteDeck(deckId) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.warn("⚠️ Couldn't fetch user info:", userError.message);
      return { error: userError };
    }

    if (!user) {
      return { error: new Error("User not authenticated") };
    }

    const { data, error } = await supabase
      .from("card_decks")
      .delete()
      .eq("id", deckId)
      .eq("user_id", user.id);

    if (error) {
      console.error("❌ Error deleting deck:", error.message);
      return { error };
    }

    return { data };
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
    return { error: err };
  }
}
