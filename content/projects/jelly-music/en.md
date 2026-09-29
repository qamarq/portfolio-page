---
title: Jelly Music
description: My fork of the Elovaire music player that streams music from a Jellyfin server, with Google Cast. Available on Google Play.
type: Android app · fork
role: Jellyfin integration and Cast
period: 06/2026
order: 56
cover: /projects/jelly-music.webp
url: https://play.google.com/store/apps/details?id=com.qamarq.jellymusic
repo: https://github.com/qamarq/jelly-music
tags: [Kotlin, Jetpack Compose, Media3, Jellyfin, Google Cast]
---

## About

I wanted to listen to the music from my own Jellyfin server in a nice native app, so I forked [Elovaire](https://github.com/droidbeauty/elovaire-music), an Android player for local libraries by Droid Beauty, and connected it to Jellyfin.

## My part

- Jellyfin integration: the library, albums, playlists and audio quality information
- Google Cast support with a device picker
- A custom Cast receiver for TVs with a quality pill
- A new icon and a clearer first-run setup
- Removed the built-in update check and installer
