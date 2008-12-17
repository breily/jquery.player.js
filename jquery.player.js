// jquery.player.js
//
// by: Brian Reily (brianreily.com)
// based on plugin from digitalxero.net/music/index.html
//
// see README for usage and full API

//
//  This version will support ID3 tags.
//

(function($) {

    // Main fuction, sets up the environment
    $.fn.player = function(swf, options) {
        // Sync defaults with user options
        if (!swf) return die("error: must specify swf file");
        if (!options) options = {};
        var defaults = {
            file: "file",
            artist: "artist",
            title: "title",
            volume: 75,
            interval: 1,
            next_song_callback: function () {},
            quality: 'high',
            id: "player",
        };
        var opts = $.extend(defaults, options);

        // A short variable because I'm lazy
        var _ = $(this);

        // HTML to inject the flash player
        var html = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-4445535400';
        html += '00" codebase="http://fpdownload.macromedia.com/pub/shockwave';
        html += '/cabs/flash/swflash.cab" width="0" height="0" id="' + opts.id;
        html += '" align="middle"><param name="movie" value="' + swf + '" /><';
        html += 'param name="quality" value="' + opts.quality + '" /><param n';
        html += 'ame="FlashVars" value="id=' + opts.id + '"/><param name="all';
        html += 'owScriptAccess" value="always"/><embed src="' + swf + '" Fla';
        html += 'shVars="id=' + opts.id + '" allowScriptAccess="always" quali';
        html += 'ty="' + opts.quality + '" bgcolor="#FFFFFF" width="0" height';
        html += '="0" name="' + opts.id + '" align="middle" type="application';
        html += '/x-shockwave-flash" pluginspage="http://www.macromedia.com/g';
        html += 'o/getflash/player" /></object>'; _.html(html);

        // Add ability to find player to global vars, and add settings to data()
        _.data("get_player",  function(id) {
            if ($.browser.msie) return window[id];
            else return document[id];
        });
        _.data("id", opts.id);
        _.data("ready", true);
        _.data("is_playing", false);
        _.data("is_loaded", false);
        _.data("is_muted", false);
        _.data("volume", opts.volume);
        _.data("mute_volume", opts.volume)
        _.data("interval", opts.interval);
        _.data("file", opts.file);
        _.data("title", opts.title);
        _.data("artist", opts.artist);
        _.data("next_song_callback", opts.next_song_callback);
        
        // Load file and volume settings
        if (options.file) {
            var init_file = function() {
                _.load(options.file);
            };
            setTimeout(init_file, 250);
        }
        var init_volume = function() {
            _.volume(options.volume);
        };
        setTimeout(init_volume, 250);

        new_this = $(this);
        return this;
    };

    // Load a sound file, and start playing
    $.fn.load = function(file, options) {
        var _ = $(this);
        if (!_.data("ready")) return die("error: must initialize");
        _.data("get_player")(_.data("id")).load(file);
        _.data("is_loaded", true);
        _.data("is_playing", true);
        _.data("file", file);
        if (!options) return this;
        // Plugin can track artist and title, if desired
        if (options.artist) _.data("artist", options.artist);
        if (options.title) _.data("title", options.title);
        return this;
    };

    // Toggle the play/pause status
    $.fn.toggle = function(command, options) {
        var _ = $(this);
        if (!_.data("ready")) return die("error: must initialize");
        var f = _.data("get_player")(_.data("id"));
        switch(command) {
            case 'play':
                f.play();
                _.data("is_playing", true);
                break;
            case 'pause':
                f.pause();
                _.data("is_playing", false);
                break;
            case 'stop':
                f.stop();
                _.data("is_playing", false);
                break;
            default:
                if (_.data("is_playing")) {
                    f.pause();
                    _.data("is_playing", false);
                } else {
                    f.play();
                    _.data("is_playing", true);
                }
        }
        return this;
    };

    // Changes the volume - note that volume() does not return jQuery object
    $.fn.volume = function(command) {
        var _ = $(this);
        if (!_.data("ready")) return die("error: must initialize");
        var f = _.data("get_player")(_.data("id"));
        if (!command && command != 0) {
            return f.get_volume();
        }
        switch(command) {
            case 'up':
                if (_.data("volume") < 100) {
                    _.data("volume", _.data("volume") + _.data("interval"));
                    f.set_volume(_.data("volume"));
                }
                break;
            case 'down':
                if (_.data("volume") > 0) {
                    _.data("volume", _.data("volume") - _.data("interval"));
                    f.set_volume(_.data("volume"));
                }
                break;
            case 'mute':
                if (_.data("is_muted")) {
                    _.data("volume", _.data("mute_volume"));
                    f.set_volume(_.data("volume"));
                    _.data("is_muted", false);
                } else {
                    _.data("mute_volume", _.data("volume"));
                    f.set_volume(0);
                    _.data("is_muted", true);
                }
                break;
            default:
                if (typeof command == "number") {
                    _.data("volume", command);
                    f.set_volume(command);
                }
        }
        return this;
    };

    // Information about sound's time - some cases don't return jQuery object
    $.fn.time = function(command) {
        var _ = $(this);
        if (!_.data("ready")) return die("error: must initialize");
        var f = _.data("get_player")(_.data("id"));
        if (!command && command != 0) {
            return f.get_position();
        }
        switch (command) {
            case 'duration':
            case 'total':
                return f.get_duration();
            default:
                if (typeof command == "number") {
                    f.set_position(command);
                }
        }
        return this;
    };

    // Information about loaded/total size of file (in bytes)
    $.fn.bytes = function(command) {
        var _ = $(this);
        if (!_.data("ready")) return die("error: must initialize");
        var f = _.data("get_player")(_.data("id"));
        if (!command) 
            return f.get_bytes_loaded();
        else if (command == "total")
            return f.get_bytes_total();
        return f.get_bytes_loaded();    
    }

    // Flash player calls this when a song ends - calls the desired callback
    $.fn.next_song = function() {
        new_this.data("next_song_callback")();
    };

    // Internal debugging function
    var die = function(msg) {
        if (console) console.log(msg);
        else alert(msg);
        return null;
    };

    // Holds the jQuery object for the next_song function 
    var new_this = null;

})(jQuery);
