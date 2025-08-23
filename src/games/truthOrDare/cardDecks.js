  import supabase from "../../databaseClient"
  export const cardDecks = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Default",
    cards: [
      { id: 1, Truth: "What’s the most embarrassing thing you’ve done at a beach?", Dare: "Act like you’re swimming in the middle of the room." },
      { id: 2, Truth: "Have you ever gambled more than you should have?", Dare: "Pretend you’re a slot machine until your next turn." },
      { id: 3, Truth: "Would you survive a week on a cruise with no internet?", Dare: "Walk around like the floor is rocking like a boat." },
      { id: 4, Truth: "What movie role would you want to play?", Dare: "Act out a dramatic death scene." },
      { id: 5, Truth: "If you were a pirate, what would your ship be named?", Dare: "Talk like a pirate for the next 3 rounds." },
      { id: 6, Truth: "Could you live in Antarctica for a month?", Dare: "Shiver dramatically for 30 seconds." },
      { id: 7, Truth: "What’s your funniest school memory?", Dare: "Pretend you’re giving a lecture about something silly." },
      { id: 8, Truth: "What’s the weirdest thing you’ve eaten at a restaurant?", Dare: "Pretend you’re a waiter taking everyone’s order." },
      { id: 9, Truth: "Would you live in space if given the chance?", Dare: "Move in slow motion like you’re in zero gravity." },
      { id: 10, Truth: "Do you get claustrophobic?", Dare: "Crawl under the table and stay for 20 seconds." },
      { id: 11, Truth: "What’s the weirdest thing you’ve bought at a store?", Dare: "Pretend to be a cashier scanning imaginary groceries." },
      { id: 12, Truth: "What play would you star in?", Dare: "Recite the most dramatic line you can think of." },
      { id: 13, Truth: "What’s your favorite train ride memory?", Dare: "Pretend to be a train conductor for 20 seconds." },
      { id: 14, Truth: "Do you enjoy flying?", Dare: "Pretend to be a flight attendant giving safety instructions." },
      { id: 15, Truth: "Have you ever faked being sick?", Dare: "Act like a patient with the worst cold ever." },
      { id: 16, Truth: "What’s the weirdest thing you’ve seen at a hotel?", Dare: "Pretend you’re the hotel concierge greeting guests." },
      { id: 17, Truth: "Have you ever broken the rules?", Dare: "Pretend you’ve been arrested and plead your case." },
      { id: 18, Truth: "What’s your most awkward money story?", Dare: "Pretend to rob the bank (dramatically, not seriously)." },
      { id: 19, Truth: "What’s your favorite amusement ride?", Dare: "Pretend you’re on a roller coaster for 15 seconds." },
      { id: 20, Truth: "Would you join the military if drafted?", Dare: "March around the room like a soldier." },
      { id: 21, Truth: "What’s your favorite museum exhibit?", Dare: "Pretend you’re a statue until your next turn." },
      { id: 22, Truth: "What book has influenced you the most?", Dare: "Pretend you’re reading a book dramatically out loud." },
      { id: 23, Truth: "Would you work in a factory job?", Dare: "Pretend to assemble an imaginary product." },
      { id: 24, Truth: "What’s your wildest night out story?", Dare: "Dance like nobody’s watching for 20 seconds." },
      { id: 25, Truth: "Have you ever lied to the police?", Dare: "Pretend you’re giving a police report about a stolen sandwich." },
    ],
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
          .eq("game_name", "truthordare");

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