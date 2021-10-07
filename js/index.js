const elemNav = document.querySelector('#Nav');
const elemNavLink = document.querySelectorAll('.nav__item a');
const elemPic = document.querySelector('#Banner');
const elemPlayBtn = document.querySelector('#PlayBtn');
const elemVideo = document.querySelector('#Video');
const picData = ['banr_ice.jpg', 'banr_mountain.jpg', 'banr_run.jpg', 'banr_snow.jpg'];
const elemArr = ['ani-fade-in-top', 'ani-fade-in-down']
let picCount = 0;
let endTime = '';
let personNum = 0;
let isEnd = false;
let timer = setInterval(setTime, 1000);

setInterval(renderPic, 5000);
getData();
setEvent();

function renderPic() {
  picCount = swap(picCount);
  elemPic.style = `background-image: url('https:/raw.githubsercontent.com/cynthia101488/cynthia101488.github.io/F2E__Lmain/images/${picData[picCount]}')`;
}

function swap(picCount) {
  return picCount < picData.length - 1 ? picCount += 1 : 0;
}

function getData() {
  const api = 'https://cynthia101488.github.io/data/activity.json';
  fetch(api)
    .then(res => res.json())
    .then(data => {
      setTemplate(data);
    });
}

function setTemplate(data) {
  endTime = new Date(data['endTime']);
  personNum = data['personNum'];
  setTime();

  const elemPersonNum = document.querySelector('#personNum');
  let numstr = '';
  if (personNum < 100) {
    numstr = `<div class="signup__info" id="personNum">
                <span class="signup__num">已有</span>
                <span class="signup__num signup__num--lg">${personNum}</span>
                <span class="signup__num">人報名</span>
              </div>
              <div class="signup__btn">
                <button class="btn">搶先報名 »</button>
              </div>`;
  } else {
    if (!isEnd) {
      numstr = `<span class="signup__full">已爆滿!</span>`
    } else {
      numstr = `<span class="signup__full">已額滿!</span>`
    }
  }
  elemPersonNum.innerHTML = numstr;
}

function setTime() {
  const elemCountDown = document.querySelector('#CountDown');
  const currentTime = new Date();
  const diff = endTime - currentTime;
  let timestr = '';
  if (diff > 0) {
    if (personNum < 100) {
      const day = Math.floor(diff / 1000 / 60 / 60 / 24);
      const hour = Math.floor(diff / 1000 / 60 / 60) % 24;
      const min = Math.floor(diff / 1000 / 60) % 60;
      const sec = Math.floor(diff / 1000) % 60;
      timestr = `<p class="signup__sale">優惠倒數</p>
                <div class="signup__countdown">
                  <span class="signup__time signup__time--lg">${day}</span>
                  <span class="signup__time">天</span>
                  <span class="signup__time signup__time--lg">${hour < 10 ? '0' + hour : hour}</span>
                  <span class="signup__time">時</span>
                  <span class="signup__time signup__time--lg">${min < 10 ? '0' + min : min}</span>
                  <span class="signup__time">分</span>
                  <span class="signup__time signup__time--lg">${sec < 10 ? '0' + sec : sec}</span>
                  <span class="signup__time">秒</span>
                </div>`;
    } else {
      timestr = `<p class="signup__sale">贈送完畢</p>
                <span class="signup__time">我們提早結束優惠</span>`;
      clearInterval(timer);
    }
  } else {
    timestr = `<p class="signup__sale">優惠活動結束</p>
              <span class="signup__time">請再關注我們的優惠時間</span>`;
    isEnd = true;
    clearInterval(timer);
  }
  elemCountDown.innerHTML = timestr;
}

function setEvent() {
  let isNavRender = false;
  document.addEventListener('scroll', ()=> {
    if (!isNavRender) {
      elemNav.style = 'background-color: rgba(256,256,256,.7)';
      elemNavLink.forEach(item => {
        item.style = 'color: #000';
        item.addEventListener('mouseenter', function() {
          item.style = 'color: #24b4d7';
        });
        item.addEventListener('mouseleave', function() {
          item.style = 'color: #000';
        });
      });
      isNavRender = true;
    }

    let dY = this.scrollY;
    let screenHeight = this.innerHeight;
  
    elemArr.forEach((item, index) => {
      let elemItems = document.querySelectorAll(`.${item}`);
      elemItems.forEach(element => {
        if (element.classList.contains(`js-${elemArr[index]}`)) {
          return;
        }
        if (dY > element.offsetTop - screenHeight / 2) {
          element.classList.add(`js-${elemArr[index]}`);
        }
      });
    });
  });

  elemPlayBtn.addEventListener('click', showVideo);
  elemVideo.addEventListener('click', hideVideo);
  document.addEventListener('keyup', hideVideo);
}

function showVideo() {
  elemVideo.style = 'display: block';
  document.body.style = 'overflow: hidden';
}

function hideVideo(e) {
  if (e.type === 'click' || e.keyCode === 27) {
    elemVideo.style = 'display: none';
    document.body.style = 'overflow: auto';
  }
}
