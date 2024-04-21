export const Message = {
  WelcomeMessage: `Hello!

I am an assistant for those who are learning Serbian 🇷🇸.
Just type in any word in Serbian or English and will come up with useful insights.

Go try it now! Good luck in learning! 🎓📚`,
  ErrorMessage: 'Oops! Something went wrong.',
  DailyLimitExceeded:
    'You have exceeded daily usage limit. Please try again tomorrow.',
  PhraseIsNotInSerbian:
    'Seems like it is not in Serbian, please consider the following translations:',
  PhraseCanNotBeInterpret:
    'Sorry, I can not understand this. Can you please rephrase?',
} as const;
