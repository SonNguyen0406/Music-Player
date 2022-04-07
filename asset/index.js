/**
 * 1.render songs
 * 2. scroll
 * 3. play/ pause/ seek
 * 4. rotate cd
 * 5. next/ prev
 * 6. random
 * 7. repeat 
 * 8. active song
 * 9. scroll active song into view
 * 10. play song when click
 * 
 */

const $ =  document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn =$('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Sau Nay',
            single: 'No1',
            path: './asset/music/sau_nay.mp3',
            image:'./asset/img/sau_nay.png'
        },
        {
            name: 'My Love',
            single: 'No2',
            path: './asset/music/my_love.mp3',
            image:'./asset/img/my_love.png'
        },
        {
            name: 'Chay Ve Noi Phia Anh',
            single: 'No3',
            path: './asset/music/chay_ve_noi_phia_anh.mp3',
            image:'./asset/img/chay_ve_noi_phia_anh.png'
        },
        {
            name: 'Duong Mot Chieu',
            single: 'No4',
            path: './asset/music/duong_mot_chieu.mp3',
            image:'./asset/img/duong_mot_chieu.png'
        },
        {
            name: 'Thuong',
            single: 'No5',
            path: './asset/music/thuong.mp3',
            image:'./asset/img/thuong.png'
        },
        {
            name: 'Tung La Tat Ca',
            single: 'No6',
            path: './asset/music/tung_la_tat_ca.mp3',
            image:'./asset/img/tung_la_tat_ca.png'
        },
      
       
    ],
    render: function(){
        const htmls = this.songs.map((song, index)=>{
            
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.single}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playlist.innerHTML = htmls.join('')
    },


    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },


    loadCurrentSong: function(){
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    handlelEvents: function(){

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}],
            {
            duration: 10000,
            iterations: Infinity
            })
            
            cdThumbAnimate.pause()
        
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrollTop =  window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' :0
            cd.style.opacity = newCdWidth / cdWidth
            
        }

       playBtn.onclick = function(){
           if(app.isPlaying){
            app.isPlaying = false
            audio.pause()
            player.classList.remove('playing')
            cdThumbAnimate.pause()
           }
           else{
            app.isPlaying = true
            audio.play()
            player.classList.add('playing')
            cdThumbAnimate.play()
           }          
       }


       nextBtn.onclick = function(){
           if(app.isRandom){
               app.randomSong()
           }
           else{

               app.nextSong()
           }
           audio.play()
           app.render()
           app.scrollToActiveSong()
       }

       prevBtn.onclick = function(){
        if(app.isRandom){
            app.randomSong()
        }
        else{

            app.prevSong()
        }
        audio.play()
        app.render()
        app.scrollToActiveSong()


    }

    randomBtn.onclick = function(){
        app.isRandom = !app.isRandom
        randomBtn.classList.toggle('active', app.isRandom)
      
    }

    repeatBtn.onclick = function(){
        app.isRepeat = !app.isRepeat
        repeatBtn.classList.toggle('active', app.isRepeat)
    }
    

    audio.onended = function(){
        if(app.isRepeat){
            audio.play()
        }
        else{

            nextBtn.click()
        }
    }

    
    playlist.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)')
        if(songNode || e.target.closest('.option')){
            if(songNode){

                app.currentIndex = Number(songNode.dataset.index)
                app.loadCurrentSong()
                app.render()
                // audio.play()
            }
          



        }
    }


     audio.ontimeupdate = function(){
         if(audio.duration){
             const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
             progress.value = progressPercent 
         }
     }
     progress.oninput = function(e){
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
    }  

    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()

    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()

    },
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)

        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        },300)
    },
    
    start: function(){
        this.render();
        this.handlelEvents();
        this.defineProperties();
        this.loadCurrentSong();
        
    }
}
app.start();


