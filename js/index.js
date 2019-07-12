                //Variables
                var playList = [];
                var songId = 0;
                var globalFileName;
                var globalFile;
                var soundSeeking = false;
                var songIndex = 0;

                var soundInterval ;
                var sound;
                var timer = 0;
                var counting = false;

                var player              = document.querySelector("#player");
                var playButton          = document.querySelector("#play");
                var pauseButton         = document.querySelector("#pause");
                var stopButton          = document.querySelector("#stop");
                var uploadInput         = document.querySelector("#upload");
                var nextButton          = document.querySelector("#next");
                var prevButton          = document.querySelector("#prev");
                var toggleMuteButton    = document.querySelector("#toggle_mute_button");
                var currentPlayTime     = document.querySelector("#start_counter");
                var songLength          = document.querySelector("#end_counter");
                var soundTracker        = document.querySelector("#soundTracker");
                var visualPlayList      = document.querySelector("#soundlist");
                

                //EventListeners
                pauseButton.addEventListener('click', pauseSound);
                playButton.addEventListener('click', playSound);
                stopButton.addEventListener('click', stopSound);
                uploadInput.addEventListener('change', uploadSound);
                nextButton.addEventListener('click', nextSound);
                prevButton.addEventListener('click', prevSound);
                toggleMuteButton.addEventListener('click', toggleSound);


                //Set event listner when "sound exists"
                function setEvent() {
                    sound.addEventListener('seeking', (event) => {
                        soundSeeking = false;
                        timer = soundTracker.value;
                    });

                    sound.addEventListener('ended', (event) => {
                        nextSound();
                    });
                }

                //update currenttime on change - dont mix change and oninput.
                soundTracker.addEventListener('change', function() {
                    if(sound) {
                        sound.currentTime = this.value;
                    }
                })

                //live update slide. 
                soundTracker.oninput = function() {
                    currentPlayTime.innerHTML = formatTime(this.value) ;
                    soundSeeking = true;
                };

                //create blob of file. 
                function uploadSound() {
                    var uploadfile = document.getElementById("upload");
                    var file = uploadfile.files[0].name;
                    var fReader = new FileReader();

                   var ext = file.name.split(".").pop().toLowerCase();
                   if($.inArray(ext, ["mp3"]) == -1) {
                        alert("You cant uplaod other files than mp3")
                        return
                   }

                    fReader.readAsDataURL(uploadfile.files[0]);
                    fReader.onloadend = function(event){
                        if(playList.length == 0) {
                            sound = new Audio(event.target.result)
                            setEvent();
                        }
                        globalFileName = file;
                        globalFile = event.target.result; 
                        getReady(globalFileName, globalFile);
                        }
                }

                //timer during sound play
                function startTimer() {
                    soundInterval = setInterval(function() {
                        if(counting) {
                            timer++;
                            if(!soundSeeking) {
                                currentPlayTime.innerHTML = formatTime(timer);
                                soundTracker.value = timer;
                            };
                        } if(timer >= Math.round(sound.duration)) {
                            clearInterval(soundInterval);
                        };
                    }, 1000);
                }

                //Wait for data
                function getReady(name, file) {
                    if(sound.readyState !== 4) {
                        setTimeout(function(){ getReady(globalFileName, globalFile)  }, 500);
                    } else {
                        
                        var foundEqualSound = playList.filter(function(item) {
                            if(item.name == name) {
                                alert( "this song already exists " );
                                return item
                            }
                        });
                        console.log(foundEqualSound);
                        if(foundEqualSound.length > 0) return;

                        playList.push({
                            name: name,
                            file: file,
                            id: "position" + songId
                        });

                        createListItem(name, file);
                    }
                }

                //Create HTML list item
                function createListItem(name, file) {
                    var li = document.createElement("li");
                    var liText = name;

                    if(name.length > 15 ) {
                        liText = name.slice(0,15) + "...";
                    }

                    li.appendChild(document.createTextNode(liText));
                    li.setAttribute("id", "position" + songId);
                    if(playList.length == 1) {
                        li.setAttribute("class", "active_sound");
                    }
                    li.setAttribute("data-src", file);
                    li.setAttribute("data-filename", name);
                    visualPlayList.appendChild(li);   
                    songId++
                    soundTracker.setAttribute("max", sound.duration);
                    var time = sound.duration;   
                    songLength.innerHTML = formatTime(time);

                }


                //FormatTime
                function formatTime(time) {
                    var minutes = Math.floor(time/ 60);
                    var seconds = time - minutes * 60;
                    if (seconds < 10) {
                        seconds = "0" + Math.round(seconds);
                    } else {
                        seconds = Math.round(seconds);
                    };
                    return minutes + ":" + seconds;
                }

                //Remove highlighed song
                function clearHighlight() {
                    document.querySelectorAll("li").forEach(function(el){
                        el.classList.remove("active_sound");
                    })
                }

                //Play
                function playSound() {
                    if(sound) {
                        sound.play();
                        counting = true;
                        playButton.classList.add("playerActive");
                        pauseButton.classList.remove("playerActive"); 

                        startTimer();
                    } else {
                        return;
                    };
                };

                //Pause
                function pauseSound() {
                    if(sound) {
                        sound.pause();
                        counting = false;
                        playButton.classList.remove("playerActive");
                        pauseButton.classList.add("playerActive"); 
                        clearInterval(soundInterval);
                    } else {
                        return;
                    };
                };

                //Stop
                function stopSound() {
                    if(sound) {
                        sound.pause();
                        counting = false;
                        timer = 0;
                        soundTracker.value = 0;
                        sound.currentTime = 0;
                        currentPlayTime.innerHTML = formatTime(timer);
                        clearInterval(soundInterval);
                        playButton.classList.remove("playerActive");
                        pauseButton.classList.add("playerActive"); 
                    } else {
                        return
                    }
                };

                //Toggle mute
                function toggleSound() {
                    if(sound) {
                        var soundStatus = sound.muted ? false : true;
                        sound.muted = soundStatus;
                        if(soundStatus == true) {
                            $(".mute_icon").addClass("fa-volume-off");
                            $(".mute_icon").removeClass("fa-volume-up");
                        } else {
                            $(".mute_icon").addClass("fa-volume-up");
                            $(".mute_icon").removeClass("fa-volume-off");
                        }
                    } else {
                        return;
                    }
                }

                //Play next if there is any
                function nextSound() {
                    if(playList.length > 1 && songIndex < playList.length-1) {
                        songIndex++;
                        sound.src = playList[songIndex].file;
                        switchSound(playList[songIndex].file, playList[songIndex].id);
                    } else {
                        clearPlayer();
                    };
                };

                //Play prev if there is any
                function prevSound() {
                    if(playList.length > 1 && songIndex != 0) {
                        songIndex--
                        sound.src = playList[songIndex].file;
                        switchSound(playList[songIndex].file, playList[songIndex].id);
                    } 
                };

                //Clear current sound data
                function clearPlayer() {
                    sound.pause();
                    counting = false;
                    timer = 0;
                    sound.currentTime = 0;
                    currentPlayTime.innerHTML = formatTime(timer);
                    soundTracker.value = 0;
                    playButton.classList.remove("playerActive");
                    pauseButton.classList.add("playerActive"); 
                    clearInterval(soundInterval);
                };

                //SetSound durations
                function setValues(duration) {
                    soundTracker.setAttribute("max", duration);
                    songLength.innerHTML = formatTime(Math.round(duration));
                };

                //Switch sound
                function switchSound(src, id) {
                    if(sound.readyState === 4) {
                        clearPlayer();
                        clearHighlight();
                        document.querySelector("#" + id).classList.add("active_sound");
                        setValues(sound.duration);
                        playSound();
                    } else {
                        setTimeout(function(){ switchSound(src, id)  }, 500);
                    };
                };