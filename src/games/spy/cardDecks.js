  import supabase from "../../databaseClient"
  export const cardDecks = [
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      name: "Default",
      cards: [
        { id: 1, prompt: "Beach Resort" },
        { id: 2, prompt: "Casino" },
        { id: 3, prompt: "Cruise Ship" },
        { id: 4, prompt: "Movie Studio" },
        { id: 5, prompt: "Pirate Ship" },
        { id: 6, prompt: "Polar Station" },
        { id: 7, prompt: "School" },
        { id: 8, prompt: "Restaurant" },
        { id: 9, prompt: "Space Station" },
        { id: 10, prompt: "Submarine" },
        { id: 11, prompt: "Supermarket" },
        { id: 12, prompt: "Theater" },
        { id: 13, prompt: "Train" },
        { id: 14, prompt: "Airplane" },
        { id: 15, prompt: "Hospital" },
        { id: 16, prompt: "Hotel" },
        { id: 17, prompt: "Jail" },
        { id: 18, prompt: "Bank" },
        { id: 19, prompt: "Amusement Park" },
        { id: 20, prompt: "Military Base" },
        { id: 21, prompt: "Museum" },
        { id: 22, prompt: "Library" },
        { id: 23, prompt: "Factory" },
        { id: 24, prompt: "Nightclub" },
        { id: 25, prompt: "Police Station" },
      ]
    },
  ];
  export async function getAllCardDecks() {
      try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.warn("⚠️ Couldn't fetch user info:", userError.message);
      }

      
      if (user) {
        const { data, error } = await supabase
          .from("card_decks")
          .select("id, deck_name, cards")
          .eq("user_id", user.id)
          .eq("game_name", "Spyfall");

        if (error) {
          console.error("❌ Error fetching user decks:", error.message);
          return cardDecks;
        }

        const userDecks = data.map((deck) => ({
          id: deck.id,
          name: deck.deck_name, 
          cards: deck.cards,
        }));

        return [...cardDecks, ...userDecks];
      }

      return cardDecks;
    } catch (err) {
      console.error("❌ Unexpected error:", err.message);
      return cardDecks;
    }
  }