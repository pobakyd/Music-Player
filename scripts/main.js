const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const KEY_USER = 'Nhat KID'

var header = $('header h2')
var cdThumb = $('.cd-thumb')
var audio = $('#audio')
var player = $('.player')
var btnPlay = $('.btn-toggle-play')
var progress = $('#progress')
var cdElement = $('.cd')
var btnNext = $('.btn-next')
var btnPrev = $('.btn-prev')
var btnRandom = $('.btn-random')
var btnRepeat = $('.btn-repeat')
var playlistBlock = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(KEY_USER)) || {},
    setConfig: function(key,value) {
        this.config[key] = value
        localStorage.setItem(KEY_USER, JSON.stringify(this.config))
    },
    songs:  [
        {
          name: "Nevada",
          singer: "Vicetone, Cozi Zuehlsdorff",
          path: "../assets/audio/Nevada-Vicetone-4494556.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2018/06/19/7/b/9/3/1529382807600_500.jpg"
        },
        {
          name: "Lanterns-Xomu",
          singer: "Androlyx",
          path: "../assets/audio/Lanterns-Xomu.mp3",
          image:
            "https://avatar-nct.nixcdn.com/song/2019/09/05/2/6/c/4/1567655672905.jpg"
        },
        {
          name: "Reality",
          singer: "Lost Frequencies x Janieck Devy",
          path:
            "../assets/audio/Reality.m4a",
          image: "https://avatar-nct.nixcdn.com/song/2018/07/06/7/4/4/2/1530840376165.jpg"
        },
        {
          name: "Way Back Home",
          singer: "Shaun",
          path: "../assets/audio/Way Back Home.m4a",
          image:
            "https://avatar-nct.nixcdn.com/mv/2018/11/12/b/b/a/5/1541995235815_640.jpg"
        },
        {
          name: "That Girl",
          singer: "Olly Murs",
          path: "../assets/audio/ThatGirl-OllyMurs.mp3",
          image:
            "https://avatar-nct.nixcdn.com/song/2018/06/20/7/1/5/3/1529487573799_300.jpg"
        },
        {
          name: "Some Thing Just Like This",
          singer: "The Chainsmokers, Coldplay",
          path:
            "../assets/audio/SomethingJustLikeThis.mp3",
          image:
            "https://avatar-nct.nixcdn.com/song/2017/11/07/a/1/4/5/1510038809679.jpg"
        }
    ],
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function(){
        var htmls = this.songs.map((song,index) => {
            return `
            <div class="song" data-index=${index}>
                <div class="thumb" style="background-image: url(${song.image})">
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
        playlistBlock.innerHTML = htmls.join('')
    },

    loadNextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    loadPrevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    loadRandomSong: function(){
        var randomIndex = Math.floor(Math.random() * this.songs.length)
        while(randomIndex == this.currentIndex){
            randomIndex = Math.floor(Math.random() * this.songs.length)
        }
        this.currentIndex = randomIndex
        this.loadCurrentSong()
    },

    handleEvents: function(){
        var cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        var cdElementWidth = cdElement.offsetWidth
        document.onscroll = function(){
            var scrollTop = window.scrollY || document.documentElement.scrollTop
            var newcdElementWidth = cdElementWidth - scrollTop
            cdElement.style.width = newcdElementWidth > 0 ? newcdElementWidth + 'px':0
            cdElement.style.opacity = newcdElementWidth/cdElementWidth
        }

        btnPlay.onclick = function(){
			if(app.isPlaying){
				audio.pause()
			}
			else{
				audio.play()
			}
        }

		audio.onplay = function(){
			app.isPlaying = true
			player.classList.add('playing')
            cdThumbAnimate.play()
		}

        audio.onpause = function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function(){
            if (audio.duration){
                progress.value = Math.floor((audio.currentTime / audio.duration)*100)
            }
        }

        progress.onchange = function(e){
            audio.currentTime = (progress.value/100)*audio.duration
        }

        btnNext.onclick = function nextSong(){
            if (app.isRandom){
                app.loadRandomSong()
            }
            else{
                app.loadNextSong()
            } 
            audio.play()
        }

        btnPrev.onclick = function(){
            if (app.isRandom){
                app.loadRandomSong()
            }
            else{
                app.loadPrevSong()
            } 
            audio.play()
        }

        btnRandom.onclick = function(){
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            this.classList.toggle('active')
        }

        btnRepeat.onclick = function(){
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            this.classList.toggle('active')
        }

        audio.onended = function(){
            if(app.isRepeat){
                audio.play()
            }
            else{
                btnNext.click()
            }
        }

        playlistBlock.onclick = function(e){
            var closestSong = e.target.closest('.song:not(.active)')
            var closestOption = e.target.closest('.option')
            if( closestSong || closestOption){
                if (closestSong){
                    console.log(typeof closestSong.dataset.index)
                    app.currentIndex = parseInt(closestSong.dataset.index)
                    app.loadCurrentSong()
                    audio.play()
                }
            }
        }

        // var songBlocks = $$('.song')
        // songBlocks.forEach((element,index) => {
        //     element.onclick = function(){
        //         var currentActiveSong = $('.song.active')
        //         if(currentActiveSong){
        //             currentActiveSong.classList.remove('active')
        //         }
        //         this.classList.add('active')
        //         app.currentIndex = index
        //         app.loadCurrentSong()
        //         audio.play()
        //     }
        // })
    },
    loadCurrentSong: function(){
        var currentActiveSong = $('.song.active')
        if(currentActiveSong){
            currentActiveSong.classList.remove('active')
        }
        var activeSong = $$('.song')[this.currentIndex]
        activeSong.classList.add('active')
		header.textContent = this.currentSong.name
		cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
		audio.src = this.currentSong.path
        setTimeout(function(){
            activeSong.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },500)
    },

    loadConfig: function(){
        console.log(this.config)
        this.isRandom = this.config['isRandom']
        this.isRepeat = this.config['isRepeat']
        if(this.isRandom){
            console.log('a')
            btnRandom.classList.add('active')
        }
        if(this.isRepeat){
            btnRepeat.classList.add('active')
        }
    },

    start: function(){
        this.loadConfig()
		this.defineProperties()
        this.handleEvents()
        this.render()
        this.loadCurrentSong()
        
    }
}
app.start()

