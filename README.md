# NTYVoiceReader

Work In Progress: A simple voice reader for the New York Times.
Right now the app works but is not for commercial use. It is a proof of concept.  I am having issues some issue with authentication issues with the New York Times website.
-- Edit I have implemented a temp workaround that skips the NYT auth but only retrieves the upaid snippet of the article. See below highlighted info below if you would like to experiment with the  authorization workarounds in the app
==A temporary fix I have implemented in the use of my personal NYT API Cookie, which is not ideal.  I am working on a fix for this issue, and the app will be updated when it is resolved, you can try to use it, but I am now blocked because the NYTimes thinks I am using my login for nefarious purposes.  If you want to use your own login credentials simple replace the cookie in the "nytimesCookie.json" with your own.  There are several dev tools that can help you get your cookie the one I use is called "EditThisCookie" for Chrome.==
The only other requirement is to have your own Open API key.  Once you have it place it in the env.txt file and rename it to .env.  The app will not work without it.
Other then that open a terminal in the /nytreader directory and run the following commands:

```bash
npm install
npm run dev
```

Then when prompted to log on simply click the mouse anywhere on the page and say "New York" then click again to stop the recording
All the navigation is done in the same manner, click to start recording, click to end.

## Summary

As of 5/01/2024, this app works but needs some improvements.

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
  - Make sure there is a timeout for the app listening
  - Figure out a way for the app to "listen" to the user for commands without having to press a button
- Back End
  - Change article logic to speed up the process
  - Clean up fs promises stuff in routes.
  - DB for storing user data (Prisma/Postgres)
  - Need to implement a way to store user article data (bookmarks?)
  - Need to implement a way to store user preferences
