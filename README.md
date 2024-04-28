# NTYVoiceReader

Work In Progress: A simple voice reader for the New York Times.

## Summary

As of 1/25/2024, this app works but needs some improvements.

### Known Issues / Improvements

- There is a placeholder for where the login page should be. It will include the following:
  - Voice Registration
  - Voice Login
  - Opening Voice Instructions
  - Use the word-list library to ensure credential is word and recorded correctly
- UI/Navigation needs to be improved
  - voice "loading" message
  - Need to implement voice commands for alternate navigation (Right now, you can find the article and have it read to you, but you can't go back to the main menu without using the back button)
  - Need to implement voice and visual error messages and be able to fix them (Right now, if you say something that isn't recognized, it will still return the article based on what the options are and its proximity to the recording)
  - Need visual and audio feedback for when the app is listening
  - Have audio "instructions" optional; say "instructions" to hear them
- Back End
  - DB for storing user data (Prisma/Postgres)
  - Need to implement a way to store user article data (bookmarks?)
  - Need to implement a way to store user preferences
