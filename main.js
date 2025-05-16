window.onload = function () {

   const navLinks = document.querySelectorAll(".sidebar-nav a[data-page]");
    const mainContent = document.querySelector(".main-content-left");

    // Hàm load nội dung trang con
    async function loadPage(page) {
        try {
            const res = await fetch(`${page}.html`);
            if (!res.ok) throw new Error("Không tìm thấy trang.");
            const text = await res.text();

            // Vì các file con chỉ có phần main nên parse dưới dạng text bình thường
            // hoặc nếu file con có cả html, thì ta lấy thẻ main
            // Ở đây giả định file con có class main-content-left
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const newContent = doc.querySelector(".main-content-left");

            if (newContent) {
                mainContent.innerHTML = newContent.innerHTML;
            } else {
                // Nếu file con trả về nội dung thuần, không có class main-content-left, hiển thị nguyên
                mainContent.innerHTML = text;
            }
            
            // Khởi tạo lại slide banners sau khi tải trang
            initializeSlider();
            
        } catch (err) {
            console.error(err);
            mainContent.innerHTML = "<p>Lỗi khi tải trang.</p>";
        }
    }

    // Gắn sự kiện click cho nav links
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = link.getAttribute("data-page");
            loadPage(page);
            
            // Cập nhật active state cho link
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            
            // Cập nhật URL nếu cần
            history.pushState(null, null, `?page=${page}`);
        });
    });

    // Kiểm tra xem có trang được chỉ định trong URL không
    function checkUrlForPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        
        if (page) {
            loadPage(page);
            // Cập nhật active state cho link tương ứng
            const activeLink = document.querySelector(`.sidebar-nav a[data-page="${page}"]`);
            if (activeLink) {
                navLinks.forEach(l => l.classList.remove("active"));
                activeLink.classList.add("active");
            }
        } else {
            // Kiểm tra xem đang ở trang nào
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage && currentPage !== 'index.html' && currentPage !== '') {
                // Nếu là trang con cụ thể, không load trang home
                console.log("Đang ở trang con:", currentPage);
            } else {
                // Nếu đang ở trang chính, load home
                loadPage("home");
                // Đặt active cho link home
                const homeLink = document.querySelector(`.sidebar-nav a[data-page="home"]`);
                if (homeLink) homeLink.classList.add("active");
            }
        }
    }
    
    // Gọi hàm kiểm tra URL khi trang tải
    checkUrlForPage();
    
    // Xử lý khi người dùng nhấn nút back/forward
    window.addEventListener('popstate', checkUrlForPage);

    // === Slider functionality ===
    function initializeSlider() {
        const slideElements = [
            document.getElementById("slide1"),
            document.getElementById("slide2"),
            document.getElementById("slide3")
        ];
        
        // Kiểm tra xem các phần tử slide có tồn tại không
        if (slideElements.every(el => el === null)) {
            console.log("Không tìm thấy các phần tử slide trên trang này");
            return; // Thoát nếu không tìm thấy slides
        }
        
        // Lọc chỉ các phần tử không null
        const slide = slideElements.filter(item => item !== null);
        
        // Định nghĩa vị trí cho hiệu ứng carousel
        const position = [
            {
                transform: "rotateY(60deg) translateZ(-200px) translateX(-250px) scale(0.8)",
                zIndex: 1,
                opacity: 0.4,
                scale: 0.8
            },
            {
                transform: "rotateY(0deg) translateZ(0px) translateX(0px) scale(1)",
                zIndex: 2,
                opacity: 1,
                scale: 1
            },
            {
                transform: "rotateY(-60deg) translateZ(-200px) translateX(250px) scale(0.8)",
                zIndex: 1,
                opacity: 0.4,
                scale: 0.8
            }
        ];
        
        // Hàm áp dụng vị trí cho slides
        function sli() {
            if (slide.length !== position.length) {
                console.warn("Số lượng slides không khớp với số lượng vị trí");
                return;
            }
    
            slide.forEach((item, index) => {
                const pos = position[index];
                item.style.transform = pos.transform;
                item.style.zIndex = pos.zIndex;
                item.style.opacity = pos.opacity;
            });
        }
    
        // Hàm cho slide tiếp theo/trước
        window.next = function () {
            position.unshift(position.pop());
            sli();
        };
    
        window.prev = function () {
            position.push(position.shift());
            sli();
        };
    
        // Khởi tạo slider
        sli();
    
        // Đặt lại interval nếu đã tồn tại
        if (window.sliderInterval) {
            clearInterval(window.sliderInterval);
        }
        
        // Thiết lập tự động xoay
        window.sliderInterval = setInterval(next, 3000);
    }

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
                    event.shiftKey ? next() : audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
                    break;
                case 'ArrowLeft':
                    event.shiftKey ? prev() : audio.currentTime = Math.max(0, audio.currentTime - 5);
                    break;
            }
        }
    });

    // === Tìm kiếm ===
    const toggleBtn22 = document.getElementById("toggle-search");
    const searchForm = document.getElementById("search-form");

    toggleBtn22?.addEventListener("click", function (event) {
        event.stopPropagation();
        searchForm.classList.toggle("tim");
    });

    document.addEventListener("click", function (event) {
        const isClickInside = searchForm.contains(event.target) || toggleBtn22.contains(event.target);
        if (!isClickInside) {
            searchForm.classList.remove("tim");
        }
    });

    // === Tiến trình phát nhạc ===
    const bufferBar = document.getElementById('buffer-bar');
    const progressBar = document.getElementById('progress-bar');

    audio.addEventListener('progress', () => {
        if (audio.buffered.length > 0) {
            const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
            const duration = audio.duration;
            if (duration > 0) {
                bufferBar.style.width = (bufferedEnd / duration) * 100 + '%';
            }
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            if (audio.currentTime >= audio.duration) {
                nextSong();
            }
        }
    });

    // === Playlist ===
    const playlist = [
        {
            title: "Muộn rồi mà sao còn",
            artist: "KV Vũ",
            src: "mp3/muon.wav",
            img: "img/pmq.png"
        },
        {
            title: "Chúng ta không thuộc về nhau",
            artist: "KV Vũ",
            src: "mp3/12A - 140 - LAO TÂM KHỔ TỨ - MK.mp3",
            img: "img/song2.jpg"
        },
        {
            title: "Tình đầu quá chén",
            artist: "KV Vũ",
            src: "mp3/Tình Đầu Quá Chén - Tino.mp3",
            img: "img/song3.jpg"
        }
    ];

    let currentSongIndex = 0;

    function renderPlaylist() {
        const container = document.getElementById('playlist-container');
        if (!container) return;
        container.innerHTML = '';

        playlist.forEach((song, index) => {
            const songElement = document.createElement('div');
            songElement.classList.add('song');
            if (index === currentSongIndex) {
                songElement.classList.add('playing');
            }

            songElement.innerHTML = `
                <img src="${song.img}" alt="${song.title}">
                <div class="song-list">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;

            songElement.addEventListener('click', () => {
                currentSongIndex = index;
                audio.src = song.src;
                audio.play();
                updateButtons(true);
                renderPlaylist();
            });

            container.appendChild(songElement);
        });

        container.appendChild(audio);
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        audio.src = playlist[currentSongIndex].src;
        audio.play();
        updateButtons(true);
        renderPlaylist();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        audio.src = playlist[currentSongIndex].src;
        audio.play();
        updateButtons(true);
        renderPlaylist();
    }

    renderPlaylist();
    audio.src = playlist[currentSongIndex].src;
    document.getElementById('next-btn')?.addEventListener('click', nextSong);
    document.getElementById('prev-btn')?.addEventListener('click', prevSong);

    // === Click tiến trình để tua ===
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
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    audio.volume = Math.max(0, audio.volume - 0.1);
                    if (volumeBar) volumeBar.value = audio.volume.toFixed(2);
                    break;
            }
        }
    });
    
    // Khởi tạo banners/slider khi trang đã tải
    initializeSlider();
};