/*
1. Render Songs
2. Scroll Top
3. Play/Pause/Seek 
4. CD Rotate
5. Next/Prev Song
6. Random
7. Next/Repeat When Ended
8. Active Song
9. Scroll Active Song Into View
10. Play Song When Click To The Playlist Item
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY = 'MP_PLAYER'

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Leave The Door Open',
            singer: 'Bruno Mars, Anderson .Paak, Silk Sonic',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Star Boy',
            singer: 'The Weeknd',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Save Your Tears',
            singer: 'The Weeknd',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'I Feel It Coming',
            singer: 'The Weeknd',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Blinding Lights',
            singer: 'The Weeknd',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'The Nights',
            singer: 'Avicii',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Payphone',
            singer: 'Maroon 5, Wiz Khalifa',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Closer',
            singer: 'The Chainsmokers, Halsey',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Something Just Like This',
            singer: 'The Chainsmokers, Coldplay',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Don\'t Let Me Down',
            singer: 'The Chainsmokers, Daya',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
    ],
    setConfig(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
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
        playlist.innerHTML = htmls.join('')
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // X??? l?? CD quay, d???ng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, // 1 chu k??? = 10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // X??? l?? ph??ng to, thu nh??? CD
        document.onscroll = function() { 
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // X??? l?? khi b???m n??t play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        // Khi b??i h??t ???????c play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi b??i h??t b??? pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // X??? l?? khi tua b??i h??t
        progress.onchange = function() {
            const seekTime = progress.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        // Khi next b??i h??t
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev b??i h??t
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi random b??i h??t
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // X??? l?? l???p l???i b??i h??t
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Chuy???n/l???p l???i b??i h??t khi k???t th??c
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
            }
        }
        
        // L???ng nghe h??nh vi click v??o playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // X??? l?? khi click v??o song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index) // N???u ???? ?????t data-index th?? d??ng dataset cho ti???n nh??ng s??? tr??? v??? d???ng chu???i => convert sang number. Ho???c c?? th??? d??ng songNode.getAttribute('data-index')
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if (e.target.closest('.option')) {
                    console.log("Show Option")
                }
            }
        }

    },
    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300);
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start() {
        // G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig()

        // ?????nh ngh??a c??c thu???c t??nh cho Object
        this.defineProperties()
        
        // L???ng nghe / X??? l?? c??c s??? ki???n (DOM Events)
        this.handleEvent()
        
        // Load th??ng tin b??i h??t hi???n t???i v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hi???n th??? tr???ng th??i ban ?????u c???a button Repeat & Random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}
app.start()