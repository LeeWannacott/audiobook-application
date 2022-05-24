# audiobook-application (Work in Progress).

Audiobook player made with React Native.
Plays Audiobooks from the public domain.

Fetches Audiobook data from the Librivox api:
https://librivox.org/api/info.

Uses the expo audio API for playing audio:
https://docs.expo.io/versions/latest/sdk/audio/

// TODO for v1.0 milestone:

- [x] Store audiotrack positions in persistant storage.

- [x] Store (persistantly) whether audiobook has been shelved in audiotrack page.

- [x] Add options to searchby for searchbar (e.g Author).

- [x] Fix how many time updateStatus is called to prevent locking up
      controls (threads?, interpolation?).

- [x] Fix delay on controls when hitting play or stop (or show feedback/waiting)

- [x] Add a user setting page to change settings (e.g darkmode toggle)

- [x] When adding audiobook to history tab check if already stored in database.

- [ ] Add option to download audiobooks for listening offline.
