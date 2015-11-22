# How it wroks
Taking the system time of the day, starts playing a predefined playlist in the exact second, so that every browser loading the site will see the same content.

```javascript
//a video
===


//a playlist
[===.===.===.===]


//a day
                      now
-----------------------|--------------------------------------------


//fill up the day with playlists

[===.===.===.===][===.===.===.===][===.===.===.===][===.===.===.===]
-----------------------|--------------------------------------------


//determine the video to play for the current time of the day

                      video
[===.===.===.===][===.<===>.===.===] 
------------------------|--------------------------------------------



//calculate the start second of the video

                      start
[===.===.===.===][===.<=|==>.===.===] 
------------------------|--------------------------------------------
```
