function uploadSong() {
                    // var file = document.querySelector("#upload").files[0].name;

                    // songList.push(file)
                    // console.log(file)
                    // console.log(songList)
                    var input = document.getElementById("upload");
                    var file = input.files[0].name
                    var fReader = new FileReader();
                    fReader.readAsDataURL(input.files[0]);
                    fReader.onloadend = function(event){
                        console.log(event.target.result)
                        songList.push(event.target.result)
                        // var img = document.getElementById("yourImgTag");
                        // img.src = event.target.result;
                    sound = new Howl({
                        src: songList,
                        _onpos: function() {
                            console.log("test")
                        },
                        _onseek: function() {
                            console.log("yo")
                        }
                        // src: songList
                    });
                    }
                    

                        var li = document.createElement("li");
                        li.appendChild(document.createTextNode(file));
                        console.log(li,showListOfSongs);
                        showListOfSongs.appendChild(li)
                }

                songList.forEach(function(element) {
                    var li = document.createElement("li");
                    li.appendChild(document.createTextNode(element));
                    console.log(li,showListOfSongs);
                    showListOfSongs.appendChild(li)     
                });

                function playSound() {
                    sound.play()
                    // var cleanTime = Math.round(sound._duration)
                    if (sound.playing()) {
                        endCounter.innerHTML = formatTime(sound._duration);
                        startCounter.innerHTML = formatTime(sound._sounds[0]._seek);
                    }

                }
                function pauseSound() {
                    sound.pause();
                }

                function stopSound() {
                    sound.stop();
                }

                function nextSound() {

                }

                function prevSound() {

                }

                function startTimer(endTime) {
                    var songlength = endTime;
                    var currentplayed = 0;
                    var timer = setInterval ( function(){
                        currentplayed++
                        startCounter.innerHTML = currentplayed;
                        console.log(currentplayed)
                        if(currentplayed >= songlength) {
                            clearInterval ( timer );
                        }

                    }, 1000 )
                } 



                function formatTime(secs) {
                    var minutes = Math.floor(secs / 60) || 0;
                    var seconds = (secs - minutes * 60) || 0;

                    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                }