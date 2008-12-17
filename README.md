jquery.player.js
----------------

* Use javascript to control the Flash playback of MP3s

* by: Brian Reily (brianreily.com)
* based on plugin from digitalxero.net/music/index.html

Usage - Included test.html and test.mp3 for convenience
-------------------------------------------------------

<pre><code>

// Initialize the player object
$("#test").player("music.swf", { options });
    // options you can use:
    // file               -> load a file and start playing immediately
    // artist, title      -> you can use the plugin to track these
    // volume             -> initial volume
    // interval           -> amount to change by when using volume("up"/"down")
    // next_song_callback -> function to call when a song ends

// Load and play a file
$("#test").load("test.mp3", { options });
    // options: artist, title (same as above)

// Toggle play/pause
$("#test").toggle();
$("#test").toggle("play"); // explicitly play the file
$("#test").toggle("pause"); // explicitly pause the file
$("#test").toggle("stop"); // stop playback, set position to 0

// Control the volume
$("#test").volume(); // returns current volume value
$("#test").volume("up"); // increase volume by "interval" (see above, default is 1)
$("#test").volume("down"); // decrease volume by "interval"
$("#test").volume("mute"); // toggles mute on/off
$("#test").volume(42); // set the volume to 42    

// Get information about playtime (all in seconds)
$("#test").time(); // returns current time
$("#test").time("total"); // returns the total time of the file
$("#test").time(42); // set position to 42 seconds

// Get information about bytes loaded
$("#test").bytes(); // returns number of bytes loaded
$("#test").bytes("total"); // returns the total file size, in bytes

</code></pre>

Todo
----

Things I'm considering working on:   

* Adding access to a song's ID3 tags through Flash.

* Perhaps combine functions into one function, for example:
    $("#test").player("volume", "up")  

* Come up with a sweet name for the plugin. 
