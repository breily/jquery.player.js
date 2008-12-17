// music.as
//
// by: Brian Reily (brianreily.com)
// based on plugin from digitalxero.net/music/index.html
//
// Compile with mtasc (www.mtasc.org):
// mtasc -main music.as -swf music.swf -header 450:325:20 -version 8 -group

import flash.external.ExternalInterface;

class Music {
    static var app:Music;
    var sound:Sound;
    var last_position:Number;

    // Constructor, plus adds all the JS callbacks
    function Music() {
        this.sound = new Sound();
        this.last_position = 0;

        ExternalInterface.addCallback("play",  this, play);
        ExternalInterface.addCallback("pause", this, pause);
        ExternalInterface.addCallback("stop",  this, stop);
        ExternalInterface.addCallback("load",  this, load);

        ExternalInterface.addCallback("set_volume",       this, set_volume);
        ExternalInterface.addCallback("get_volume",       this, get_volume);
        ExternalInterface.addCallback("set_position",     this, set_position);
        ExternalInterface.addCallback("get_position",     this, get_position);
        ExternalInterface.addCallback("get_duration",     this, get_duration);
        ExternalInterface.addCallback("get_bytes_total",  this, get_bytes_total);
        ExternalInterface.addCallback("get_bytes_loaded", this, get_bytes_loaded);
    }

    function load(url:String) {
        this.last_position = 0;
        this.sound.loadSound(url, true);
        this.sound.onSoundComplete = function() {
            ExternalInterface.call("$.fn.next_song");
        };
    }

    function play() {
        this.sound.start(this.last_position);
    }

    function pause() {
        this.last_position = this.sound.position / 1000;
        this.sound.stop();
    }

    function stop() {
        this.last_position = 0;
        this.sound.stop();
    }

    function set_volume(vol:Number) {
        this.sound.setVolume(vol);
    }

    function get_volume() {
        return this.sound.getVolume();
    }

    function set_position(pos:Number) {
        this.sound.stop();
        this.sound.start(pos);
    }

    function get_position() {
        return this.sound.position / 1000;
    }

    function get_duration() {
        return this.sound.duration / 1000;
    }

    function get_bytes_total() {
        return this.sound.getBytesTotal();
    }

    function get_bytes_loaded() {
        return this.sound.getBytesLoaded();
    }

    static function main(mc:MovieClip) {
        app = new Music();
    }
}
