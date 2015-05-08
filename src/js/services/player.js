
'use strict';

angular.module('app')
     .service('Player', ['$rootScope',
     function($rootScope) {

    var playingSound;

    return {

      playing: false,

      play: function (track) {

        if (!track) {
          if (this.currentTrack && playingSound) {
            playingSound.play();
            this.playing = true;
            $rootScope.$broadcast('statusChanged', true);
          }



          return;
        }

        var player = this;

        SC.stream(track.properties.stream_url, function(sound){

          if (playingSound) {
             if (playingSound.paused === true){  // need to work out this logic so playing song doesn't double up
              console.log('it was paused');
              playingSound.resume();
            }
            else {
            playingSound.stop();
            }
          }


          sound.play({
            whileplaying: function () {
              player.duration = Math.floor(this.durationEstimate / 1000);
              player.position = Math.floor(this.position / 1000);
              player.progress = (this.position / this.durationEstimate) * 100;
              $rootScope.$broadcast('statusChanged', true);
            },
            onfinish: function () {
              $rootScope.$broadcast('finished');
            }
          });

          playingSound = sound;
          player.currentTrack = track;
          
          player.playingSound = sound;
          player.playing = true;

          console.log(player);

          $rootScope.$broadcast('statusChanged', true);
        });
      },

      pause: function () {
        if (playingSound) {
          playingSound.pause();
          this.playing = false;
          $rootScope.$broadcast('statusChanged', true);
        }
      },

      setPosition: function (percent) {
        playingSound.setPosition(percent * playingSound.duration);
      },

     
};




     }
   ]);


