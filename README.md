# audiobook-application (Work in Progress).

Audiobook player made with React Native. 
Plays Audiobooks from the public domain.

Fetches Audiobook data from the Librivox api:
https://librivox.org/api/info.

Uses the expo audio API for playing audio:
https://docs.expo.io/versions/latest/sdk/audio/

// TODO for v1.0 milestone: 

- [ ] Store audiotrack positions in persistant storage.
 
- [ ] Store (persistantly) whether audiobook has been shelved in audiotrack page.
 
- [ ] Add options to searchby for searchbar (e.g Author).
 
- [ ] Fix how many time updateStatus is called to prevent locking up
 controls (threads?, interpolation?).
 
- [ ] Fix delay on controls when hitting play or stop (or show feedback/waiting)
 
- [ ] Add a user setting page to change settings (e.g darkmode toggle)
 
- [ ] When adding audiobook to history tab check if already stored in database.
 
- [ ] Add option to download audiobooks for listening offline.
