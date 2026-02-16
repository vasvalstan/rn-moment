export interface DailyTopic {
  topic: string;
  category: string;
  openingPrompt: string;
  suggestedQuestion: string;
}

export const DAILY_TOPICS: DailyTopic[] = [
  {
    topic: "Gratitude in Small Moments",
    category: "gratitude",
    openingPrompt: "Guide the user to explore gratitude for the small, often overlooked moments in their day.",
    suggestedQuestion: "What small moment today made you pause and feel thankful?",
  },
  {
    topic: "Letting Go of Control",
    category: "acceptance",
    openingPrompt: "Help the user reflect on what they can and cannot control, and finding peace in releasing.",
    suggestedQuestion: "What is something you've been trying to control that might be better to release?",
  },
  {
    topic: "Your Inner Dialogue",
    category: "self-awareness",
    openingPrompt: "Explore how the user speaks to themselves and whether that inner voice is kind or critical.",
    suggestedQuestion: "If you listened to your inner voice today, was it more like a friend or a critic?",
  },
  {
    topic: "The Power of Breath",
    category: "mindfulness",
    openingPrompt: "Guide the user to reflect on their relationship with their breath and how it anchors them.",
    suggestedQuestion: "When was the last time you noticed your breathing without trying to change it?",
  },
  {
    topic: "Boundaries and Self-Care",
    category: "self-compassion",
    openingPrompt: "Help the user explore where they might need to set healthier boundaries in their life.",
    suggestedQuestion: "Where in your life do you feel your energy is being drained without return?",
  },
  {
    topic: "Finding Stillness in Chaos",
    category: "mindfulness",
    openingPrompt: "Guide the user to find pockets of calm even in the busiest days.",
    suggestedQuestion: "What does stillness feel like to you, and where do you find it?",
  },
  {
    topic: "Growth Through Discomfort",
    category: "growth",
    openingPrompt: "Help the user reframe discomfort as a signal of growth rather than something to avoid.",
    suggestedQuestion: "What recent challenge pushed you outside your comfort zone?",
  },
  {
    topic: "Connection with Others",
    category: "relationships",
    openingPrompt: "Explore the quality of the user's relationships and meaningful connections.",
    suggestedQuestion: "Who in your life makes you feel truly seen and heard?",
  },
  {
    topic: "Impermanence",
    category: "acceptance",
    openingPrompt: "Guide the user to contemplate how nothing is permanent and find freedom in that truth.",
    suggestedQuestion: "What change in your life felt difficult at first but turned out to be a gift?",
  },
  {
    topic: "Your Relationship with Rest",
    category: "self-compassion",
    openingPrompt: "Help the user examine whether they allow themselves true rest without guilt.",
    suggestedQuestion: "Do you give yourself permission to rest, or does it come with guilt?",
  },
  {
    topic: "Mindful Eating",
    category: "mindfulness",
    openingPrompt: "Explore the user's awareness around how and what they eat, and the experience of nourishment.",
    suggestedQuestion: "When was the last time you truly savored a meal without distraction?",
  },
  {
    topic: "Forgiveness",
    category: "self-compassion",
    openingPrompt: "Guide the user to explore forgiveness -- of others or themselves -- as a path to lightness.",
    suggestedQuestion: "Is there something you've been carrying that forgiveness could lighten?",
  },
  {
    topic: "Purpose and Meaning",
    category: "growth",
    openingPrompt: "Help the user reflect on what gives their life a sense of meaning and direction.",
    suggestedQuestion: "What activity makes you lose track of time because it feels so meaningful?",
  },
  {
    topic: "The Stories We Tell Ourselves",
    category: "self-awareness",
    openingPrompt: "Explore the narratives the user constructs about their life and whether they serve them well.",
    suggestedQuestion: "What story about yourself have you been repeating that might not be true anymore?",
  },
  {
    topic: "Nature and Presence",
    category: "mindfulness",
    openingPrompt: "Guide the user to connect with the natural world and the grounding it provides.",
    suggestedQuestion: "When did you last spend time in nature and how did it make you feel?",
  },
  {
    topic: "Emotional Awareness",
    category: "self-awareness",
    openingPrompt: "Help the user notice and name their emotions without judgment.",
    suggestedQuestion: "What emotion has been visiting you most often this week?",
  },
  {
    topic: "Simplicity",
    category: "mindfulness",
    openingPrompt: "Explore how simplifying life can create space for what truly matters.",
    suggestedQuestion: "What could you remove from your life that would create more space for peace?",
  },
  {
    topic: "Body Awareness",
    category: "mindfulness",
    openingPrompt: "Guide the user to tune into the sensations and messages their body is sending.",
    suggestedQuestion: "Where in your body do you tend to hold stress, and what might it be telling you?",
  },
  {
    topic: "Compassion for Others",
    category: "relationships",
    openingPrompt: "Explore extending compassion and understanding to the people around you.",
    suggestedQuestion: "Is there someone in your life who might be struggling silently that you could reach out to?",
  },
  {
    topic: "The Present Moment",
    category: "mindfulness",
    openingPrompt: "Help the user practice arriving fully in the present moment rather than dwelling in past or future.",
    suggestedQuestion: "Right now, in this very moment, what are you aware of?",
  },
  {
    topic: "Fear and Courage",
    category: "growth",
    openingPrompt: "Guide the user to examine their fears and discover the courage that exists alongside them.",
    suggestedQuestion: "What would you do if fear wasn't holding you back?",
  },
  {
    topic: "Patience with the Process",
    category: "acceptance",
    openingPrompt: "Help the user cultivate patience with their own journey of growth and healing.",
    suggestedQuestion: "Where in your life are you rushing that might benefit from more patience?",
  },
  {
    topic: "Joy and Play",
    category: "gratitude",
    openingPrompt: "Explore the role of unstructured joy and playfulness in the user's adult life.",
    suggestedQuestion: "When was the last time you did something purely for the joy of it?",
  },
  {
    topic: "Digital Mindfulness",
    category: "self-awareness",
    openingPrompt: "Help the user reflect on their relationship with technology and screens.",
    suggestedQuestion: "How does your screen time make you feel at the end of the day?",
  },
  {
    topic: "Vulnerability as Strength",
    category: "growth",
    openingPrompt: "Explore how showing vulnerability can deepen connections and inner strength.",
    suggestedQuestion: "When was the last time being vulnerable led to something meaningful?",
  },
  {
    topic: "Sleep and Dreams",
    category: "self-compassion",
    openingPrompt: "Guide the user to reflect on their sleep quality and what their mind processes at rest.",
    suggestedQuestion: "How does the quality of your sleep affect the quality of your waking hours?",
  },
  {
    topic: "Comparison and Contentment",
    category: "self-awareness",
    openingPrompt: "Help the user notice where comparison steals their peace and practice contentment.",
    suggestedQuestion: "Where do you find yourself comparing your life to others, and how does it feel?",
  },
  {
    topic: "Acts of Kindness",
    category: "relationships",
    openingPrompt: "Explore how small acts of kindness, given and received, shape the user's day.",
    suggestedQuestion: "What small act of kindness did you witness or offer recently?",
  },
  {
    topic: "Your Relationship with Time",
    category: "acceptance",
    openingPrompt: "Guide the user to examine whether they feel they have enough time or are always racing it.",
    suggestedQuestion: "Do you feel like you have enough time, or are you always chasing it?",
  },
  {
    topic: "Beginner's Mind",
    category: "growth",
    openingPrompt: "Explore approaching familiar things with fresh eyes and curiosity, as if for the first time.",
    suggestedQuestion: "What would it be like to approach something familiar in your life as if for the first time?",
  },
];

/**
 * Returns today's topic based on the current date.
 * Rotates through the pool using day-of-year.
 */
export function getTodaysTopic(dateString?: string): DailyTopic {
  const date = dateString ? new Date(dateString + "T00:00:00") : new Date();
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_TOPICS[dayOfYear % DAILY_TOPICS.length];
}
