  import supabase from "../../databaseClient"
  export const cardDecks = [
    {
      id: "default",
      name: "Actions",
      cards: [
        { id: 1, prompt: "Brushing teeth" },
        { id: 2, prompt: "Running a marathon" },
        { id: 3, prompt: "Playing guitar" },
        { id: 4, prompt: "Dancing salsa" },
        { id: 5, prompt: "Cooking dinner" },
        { id: 6, prompt: "Reading a book" },
        { id: 7, prompt: "Painting a picture" },
        { id: 8, prompt: "Riding a bike" },
        { id: 9, prompt: "Swimming laps" },
        { id: 10, prompt: "Playing basketball" },
        { id: 11, prompt: "Walking the dog" },
        { id: 12, prompt: "Gardening" },
        { id: 13, prompt: "Singing karaoke" },
        { id: 14, prompt: "Taking a selfie" },
        { id: 15, prompt: "Fishing" },
        { id: 16, prompt: "Climbing a mountain" },
        { id: 17, prompt: "Doing yoga" },
        { id: 18, prompt: "Flying a kite" },
        { id: 19, prompt: "Playing chess" },
        { id: 20, prompt: "Shopping for groceries" },
        { id: 21, prompt: "Making coffee" },
        { id: 22, prompt: "Watching a movie" },
        { id: 23, prompt: "Writing a letter" },
        { id: 24, prompt: "Building a sandcastle" },
        { id: 25, prompt: "Taking out the trash" },
        { id: 26, prompt: "Playing soccer" },
        { id: 27, prompt: "Driving a car" },
        { id: 28, prompt: "Jumping rope" },
        { id: 29, prompt: "Playing video games" },
        { id: 30, prompt: "Blowing bubbles" },
        { id: 31, prompt: "Skateboarding" },
        { id: 32, prompt: "Doing push-ups" },
        { id: 33, prompt: "Making a phone call" },
        { id: 34, prompt: "Eating ice cream" },
        { id: 35, prompt: "Wrapping a gift" },
        { id: 36, prompt: "Folding laundry" },
        { id: 37, prompt: "Taking a nap" },
        { id: 38, prompt: "Playing tennis" },
        { id: 39, prompt: "Jumping on a trampoline" },
        { id: 40, prompt: "Watching birds" },
        { id: 41, prompt: "Washing the car" },
        { id: 42, prompt: "Playing drums" },
        { id: 43, prompt: "Skiing" },
      ],
    },
    {
      id: "animals",
      name: "Animals",
      cards: [
        { id: 1, prompt: "Elephant" },
        { id: 2, prompt: "Kangaroo" },
        { id: 3, prompt: "Penguin" },
        { id: 4, prompt: "Giraffe" },
        { id: 5, prompt: "Lion" },
        { id: 6, prompt: "Tiger" },
        { id: 7, prompt: "Zebra" },
        { id: 8, prompt: "Dolphin" },
        { id: 9, prompt: "Koala" },
        { id: 10, prompt: "Cheetah" },
        { id: 11, prompt: "Panda" },
        { id: 12, prompt: "Rhinoceros" },
        { id: 13, prompt: "Hippopotamus" },
        { id: 14, prompt: "Ostrich" },
        { id: 15, prompt: "Flamingo" },
        { id: 16, prompt: "Crocodile" },
        { id: 17, prompt: "Alligator" },
        { id: 18, prompt: "Wolf" },
        { id: 19, prompt: "Fox" },
        { id: 20, prompt: "Bear" },
        { id: 21, prompt: "Eagle" },
        { id: 22, prompt: "Owl" },
        { id: 23, prompt: "Parrot" },
        { id: 24, prompt: "Rabbit" },
        { id: 25, prompt: "Squirrel" },
        { id: 26, prompt: "Deer" },
        { id: 27, prompt: "Moose" },
        { id: 28, prompt: "Whale" },
        { id: 29, prompt: "Shark" },
        { id: 30, prompt: "Octopus" },
        { id: 31, prompt: "Crab" },
        { id: 32, prompt: "Butterfly" },
        { id: 33, prompt: "Bee" },
        { id: 34, prompt: "Ant" },
        { id: 35, prompt: "Horse" },
        { id: 36, prompt: "Donkey" },
        { id: 37, prompt: "Camel" },
        { id: 38, prompt: "Llama" },
        { id: 39, prompt: "Chimpanzee" },
        { id: 40, prompt: "Gorilla" },
        { id: 41, prompt: "Seal" },
        { id: 42, prompt: "Walrus" },
        { id: 44, prompt: "Platypus" },
      ]
    },
    {
      id: "movies",
      name: "Movies",
      cards: [
        { id: 1, prompt: "Titanic" },
        { id: 2, prompt: "Jurassic Park" },
        { id: 3, prompt: "The Matrix" },
        { id: 4, prompt: "Inception" },
        { id: 5, prompt: "The Godfather" },
        { id: 6, prompt: "Star Wars" },
        { id: 7, prompt: "Avengers: Endgame" },
        { id: 8, prompt: "Forrest Gump" },
        { id: 9, prompt: "The Dark Knight" },
        { id: 10, prompt: "Pulp Fiction" },
        { id: 11, prompt: "The Shawshank Redemption" },
        { id: 12, prompt: "Gladiator" },
        { id: 13, prompt: "Back to the Future" },
        { id: 14, prompt: "Frozen" },
        { id: 15, prompt: "Jurassic World" },
        { id: 16, prompt: "Toy Story" },
        { id: 17, prompt: "The Lion King" },
        { id: 18, prompt: "Harry Potter" },
        { id: 19, prompt: "Finding Nemo" },
        { id: 20, prompt: "The Avengers" },
        { id: 21, prompt: "Avatar" },
        { id: 22, prompt: "Iron Man" },
        { id: 23, prompt: "Spider-Man" },
        { id: 24, prompt: "Black Panther" },
        { id: 25, prompt: "Wonder Woman" },
        { id: 26, prompt: "Frozen II" },
        { id: 27, prompt: "Guardians of the Galaxy" },
        { id: 28, prompt: "Deadpool" },
        { id: 29, prompt: "Thor" },
        { id: 30, prompt: "Captain America" },
        { id: 31, prompt: "Doctor Strange" },
        { id: 32, prompt: "The Hunger Games" },
        { id: 33, prompt: "Pirates of the Caribbean" },
        { id: 34, prompt: "The Incredibles" },
        { id: 35, prompt: "Jurassic World: Fallen Kingdom" },
        { id: 36, prompt: "The Twilight Saga" },
        { id: 37, prompt: "Shrek" },
        { id: 38, prompt: "Despicable Me" },
        { id: 39, prompt: "Minions" },
        { id: 40, prompt: "Coco" },
        { id: 41, prompt: "The Lego Movie" },
      ]
    },
    {
      id: "frisky",
      name: "Frisky",
      cards: [
        { id: 1, prompt: "Flirting" },
        { id: 2, prompt: "Winking" },
        { id: 3, prompt: "Blowing a kiss" },
        { id: 4, prompt: "Dancing seductively" },
        { id: 5, prompt: "Giving a massage" },
        { id: 6, prompt: "Tickling" },
        { id: 7, prompt: "Playing hard to get" },
        { id: 8, prompt: "Shooting a sultry look" },
        { id: 9, prompt: "Whispering a secret" },
        { id: 10, prompt: "Flashing a smile" },
        { id: 11, prompt: "Sending a love note" },
        { id: 12, prompt: "Wearing lipstick" },
        { id: 13, prompt: "Fixing your hair" },
        { id: 14, prompt: "Slow dancing" },
        { id: 15, prompt: "Biting your lip" },
        { id: 16, prompt: "Tossing your hair" },
        { id: 17, prompt: "Blowing out birthday candles" },
        { id: 18, prompt: "Playing footsie" },
        { id: 19, prompt: "Cheeky grin" },
        { id: 20, prompt: "Blowing bubbles" },
        { id: 21, prompt: "Peeking over sunglasses" },
        { id: 22, prompt: "Wearing heels" },
        { id: 23, prompt: "Making eye contact" },
        { id: 24, prompt: "Touching your neck" },
        { id: 25, prompt: "Flipping a coin" },
        { id: 26, prompt: "Playfully nudging" },
        { id: 27, prompt: "Blowing a raspberry" },
        { id: 28, prompt: "Peeling an orange" },
        { id: 29, prompt: "Winking twice" },
        { id: 30, prompt: "Sneaking a peek" },
        { id: 31, prompt: "Hiding a smile" },
        { id: 32, prompt: "Leaning in" },
        { id: 33, prompt: "Shooting a finger gun" },
        { id: 34, prompt: "Flicking your hair" },
        { id: 35, prompt: "Pretending to be shy" },
        { id: 36, prompt: "Laughing coyly" },
        { id: 37, prompt: "Blowing a kiss" },
        { id: 38, prompt: "Pretending to text" },
        { id: 39, prompt: "Flashing a peace sign" },
        { id: 40, prompt: "Playful wink" },
      ]
    }
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
          .eq("game_name", "Charades");

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