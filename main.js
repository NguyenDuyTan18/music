/*  1. Render song
2. Scroll top handleEvents
3. Play / pause / seek 
4. CD rorate
5. Next / prev
6. Random
7. Next / Repeat when ended
8. Active songs
9. Scroll active song to view
10.Play song when click*/

    
    
    
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
    
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Không Thể Say',
            singer: 'HieuThuHai',
            path: './assets/music/song2.mp3',
            img: './assets/img/song2.jpg'
        },
        {
            name: 'Ngủ Một Mình',
            singer: 'HieuThuHai',
            path: './assets/music/song1.mp3',
            img: './assets/img/song1.jpg'
        },
        {
            name: 'Exit Sign',
            singer: 'HieuThuHai',
            path: './assets/music/song3.mp3',
            img: './assets/img/song3.jpg'
        },
        {
            name: 'Không Phải Gu',
            singer: 'HieuThuHai',
            path: './assets/music/song4.mp3',
            img: './assets/img/song4.jpg'
        },
        {
            name: 'NOLOVENOLIFE',
            singer: 'HieuThuHai',
            path: './assets/music/song5.mp3',
            img: './assets/img/song5.jpg'
        },
        {
            name: 'Vệ Tinh',
            singer: 'HieuThuHai',
            path: './assets/music/song6.mp3',
            img: './assets/img/song6.jpg'
        },
        {
            name: 'Bật Nhạc Lên 1',
            singer: 'HieuThuHai',
            path: './assets/music/song7.mp3',
            img: './assets/img/song7.jpg'
        },
        {
            name: 'Nghe Như Tình Yêu',
            singer: 'HieuThuHai',
            path: './assets/music/song8.mp3',
            img: './assets/img/song8.jpg'
        },
        {
            name: '1-800-love',
            singer: 'HieuThuHai',
            path: './assets/music/song9.mp3',
            img: './assets/img/song9.jpg'
        },
        {
            name: 'Mama Boy',
            singer: 'HieuThuHai',
            path: './assets/music/song10.mp3',
            img: './assets/img/song10.jpg'
        },
    ],
    render: function () {
       // 1. Render song
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
            $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    loadCurrentSong: function() {
       heading.textContent = this.currentSong.name
       cdThumb.style.backgroundImage = `url(${this.currentSong.img})`
       audio.src = this.currentSong.path
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth
        const _this = this
        // CD quay

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // 10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        // phóng to thu nhỏ
        document.onscroll = function() {
             // 2. Scroll top handleEvents
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;

           if(newWidth > 0) {
                cd.style.width = newWidth + 'px';
           } else {
                cd.style.width = 0;
           }

           cd.style.opacity = newWidth / cdWidth;
        }

        // xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        // khi play 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // khi pause 
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        
        // xử lý khi tua 
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime;
        }

        
        // tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }


        // khi click next 
        nextBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRadomSong()
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong()
        }

        // khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom){
                _this.playRadomSong()
            }else {
                _this.prevSong();
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // bật tắt random
        randomBtn.onclick = function (){
            _this.isRandom = !_this.isRandom
            this.classList.toggle('active', _this.isRandom)
            
        }

        // xu ly lap lai
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            this.classList.toggle('active', _this.isRepeat)
        }

        // khi kết thúc tự next
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click();

            }
        } 

        // xử lý khi click playplist
        playlist.onclick = function (e) {
            const nodeSong = e.target.closest('.song:not(.active)') 
            
            if( nodeSong || e.target.closest('.option')) {
                //
                if(nodeSong) {               
                    _this.currentIndex = Number(nodeSong.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }



            }
        } 
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0 
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRadomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex) 
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },

    scrollToActiveSong: function() {
        setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    blook: 'nearest'
                })
        })
    },

    start: function(){
        // Định nghĩa cho các Object
        this.defineProperties()

        // xử lý DOM / Events
        this.handleEvents()

        // load ảnh vào UI
        this.loadCurrentSong()

        // playplist
        this.render()
    }
}

app.start()