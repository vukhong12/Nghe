window.onload = function () {
    // === Sidebar: Danh sách phát tiếp theo ===
    const toggleUpNextButton = document.getElementById("toggle-upnext");
    const toggleUpNextButton1 = document.getElementById("toggle-upnext1");
    const upNextSidebar = document.querySelector(".up-next");

    const toggleSidebar = () => {
        upNextSidebar?.classList.toggle("active");
    };

    toggleUpNextButton?.addEventListener("click", toggleSidebar);
    toggleUpNextButton1?.addEventListener("click", toggleSidebar);

    // === Phát nhạc ===
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleBtn1 = document.getElementById('toggleBtn1');
    const audio = document.createElement('audio');

    function updateButtons(isPlaying) {
        const icon = isPlaying
            ? '<i class="fa-solid fa-pause"></i>'
            : '<i class="fa-solid fa-play"></i>';

        if (toggleBtn) toggleBtn.innerHTML = icon;
        if (toggleBtn1) toggleBtn1.innerHTML = icon;
    }

    function toggleAudio() {
        if (!audio) return;

        if (audio.paused) {
            audio.play();
            updateButtons(true);
        } else {
            audio.pause();
            updateButtons(false);
        }
    }

    toggleBtn?.addEventListener('click', toggleAudio);
    toggleBtn1?.addEventListener('click', toggleAudio);

    document.addEventListener('keydown', (event) => {
        const tag = document.activeElement.tagName;

        if (!['INPUT', 'TEXTAREA'].includes(tag)) {
            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    toggleAudio();
                    break;
                case 'ArrowRight':
                    if (event.shiftKey) {
                        next();
                    } else {
                        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
                    }
                    break;
                case 'ArrowLeft':
                    if (event.shiftKey) {
                        prev();
                    } else {
                        audio.currentTime = Math.max(0, audio.currentTime - 5);
                    }
                    break;

            }
        }
    });
    
    document.getElementById("toggle-search").addEventListener("click", function () {
        const searchForm = document.getElementById("search-form");
        searchForm.classList.toggle("tim");
    });
    
    
    
    // === Tiến trình phát nhạc ===
    const bufferBar = document.getElementById('buffer-bar');
    const progressBar = document.getElementById('progress-bar');

    audio.addEventListener('progress', () => {
        if (audio.buffered.length > 0) {
            const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
            const duration = audio.duration;
            if (duration > 0) {
                const percent = (bufferedEnd / duration) * 100;
                bufferBar.style.width = percent + '%';
            }
        }
    });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        if(audio.currentTime >= audio.duration){
             nextSong() }
    });

    // === Playlist ===
    const playlist = [
        {
            title: "Muộn rồi mà sao còn",
            artist: "Sơn Tùng M-TP",
            src: "mp3/muon.wav",
            img: "img/pmq.png"
        },
        {
            title: "Chúng ta không thuộc về nhau",
            artist: "Sơn Tùng M-TP",
            src: "mp3/12A - 140 - LAO TÂM KHỔ TỨ - MK.mp3",
            img: "img/song2.jpg"
        },
        {
            title: "Lạc trôi",
            artist: "Sơn Tùng M-TP",
            src: "mp3/Tình Đầu Quá Chén - Tino.mp3",
            img: "img/song3.jpg"
        }
    ];

    let currentSongIndex = 0;

    function renderCurrentSong() {
        const container = document.getElementById('playlist-container');
        if (!container) return;

        container.innerHTML = '';
        const song = playlist[currentSongIndex];

        const songElement = document.createElement('div');
        songElement.classList.add('song');
        songElement.innerHTML = `
            <img src="${song.img}" alt="${song.title}" width="100">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        `;

        container.appendChild(songElement);
        audio.src = song.src;
        audio.controls = true;
        container.appendChild(audio);
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        renderCurrentSong();
        toggleAudio();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        renderCurrentSong();
        toggleAudio();
    }

    renderCurrentSong();

    document.getElementById('next-btn')?.addEventListener('click', nextSong);
    document.getElementById('prev-btn')?.addEventListener('click', prevSong);

    const progressContainer = document.querySelector('.progress-container');
    progressContainer?.addEventListener('click', (event) => {
        const clickX = event.offsetX;
        const containerWidth = progressContainer.offsetWidth;
        const percent = (clickX / containerWidth) * 100;
        progressBar.style.width = percent + '%';
        audio.currentTime = (percent / 100) * audio.duration;
    });

    // === Âm lượng ===
    const volumeBar = document.getElementById('volume-bar');
    volumeBar?.addEventListener('input', (event) => {
        const volume = event.target.value;
        audio.volume = volume;
    });
    document.addEventListener('keydown', (event) => {
        const tag = document.activeElement.tagName;

        if (!['INPUT', 'TEXTAREA'].includes(tag)) {
            switch (event.code) {
                case 'ArrowUp':
                    event.preventDefault();
                    audio.volume = Math.min(1, audio.volume + 0.1);
                    if (volumeBar) volumeBar.value = audio.volume.toFixed(2);
                    console.log('Âm lượng:', Math.round(audio.volume * 100) + '%');
                    break;

                case 'ArrowDown':
                    event.preventDefault();
                    audio.volume = Math.max(0, audio.volume - 0.1);
                    if (volumeBar) volumeBar.value = audio.volume.toFixed(2);
                    console.log('Âm lượng:', Math.round(audio.volume * 100) + '%');
                    break;
            }
        }
    });

    // === Slide (sửa lỗi) ===
    const slide = [
        document.getElementById("slide1"),
        document.getElementById("slide2"),
        document.getElementById("slide3")
    ].filter(item => item !== null);

    const position = [
        {
            transform: "rotateY(60deg) translateZ(-200px) translateX(-250px)",
            zIndex: 1,
            opacity: 0.4,
            scale: 0.8
        },
        {
            transform: "rotateY(0deg) translateZ(0px) translateX(0px)",
            zIndex: 2,
            opacity: 1,
            scale: 1
        },
        {
            transform: "rotateY(-60deg) translateZ(-200px) translateX(250px)",
            zIndex: 1,
            opacity: 0.4,
            scale: 0.8
        }
    ];

    function sli() {
        if (slide.length !== position.length) return;
        slide.forEach((item, index) => {
            item.style.transform = position[index].transform;
            item.style.zIndex = position[index].zIndex;
            item.style.opacity = position[index].opacity;
            item.style.scale = position[index].scale;
        });
    }

    window.next = function () {
        position.unshift(position.pop());
        sli();
    };

    window.prev = function () {
        position.push(position.shift());
        sli();
    };

    sli();
    setInterval(next, 3000);
};
