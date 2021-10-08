const elemPic = document.querySelector('#Banner');
const elemNav = document.querySelector('#Nav');
const elemNavLink = document.querySelectorAll('.nav__item a');
const elemVideo = document.querySelector('#Video');
const picData = ['banr_ice.jpg', 'banr_mountain.jpg', 'banr_run.jpg', 'banr_snow.jpg'];
const aniArr = ['ani-fade-in-top', 'ani-fade-in-down'];
let picCount = 0;
let endTime = '';
let personNum = 0;
let isEnd = false;
let isNavRender = false;
let dateTimer = setInterval(renderTime, 1000);

setInterval(renderPic, 5000);
getData();
setEvent();

function renderPic() {
  picCount = swap(picCount);
  elemPic.style = `background-image: url('../images/${picData[picCount]}')`;
}

function swap(picCount) {
  return picCount < picData.length - 1 ? picCount += 1 : 0;
}

function getData() {
  const api = '../data/activity.json';
  fetch(api)
    .then(res => res.json())
    .then(data => {
      setTemplate(data);
    });
}

function setTemplate(data) {
  endTime = new Date(data['endTime']);
  personNum = data['personNum'];
  let arrList = data['list'];
  renderTime();
  renderProgress(arrList);
  renderPerson();
}

function renderTime() {
  const elemTime = document.querySelector('#Time');
  const now = new Date();
  const diff = endTime - now;
  let str = '';
  if (diff > 0) {
    if (personNum < 100) {
      const day = Math.floor(diff / 1000 / 60 / 60 / 24);
      const hour = Math.floor(diff / 1000 / 60 / 60) % 24;
      const min = Math.floor(diff / 1000 / 60) % 60;
      const sec = Math.floor(diff / 1000) % 60;
      str = `<p class="signup__sale">優惠倒數</p>
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
      str = `<p class="signup__sale">贈送完畢</p>
                <span class="signup__time">我們提早結束優惠</span>`;
      clearInterval(dateTimer);
    }
  } else {
    str = `<p class="signup__sale">優惠活動結束</p>
              <span class="signup__time">請再關注我們的優惠時間</span>`;
    isEnd = true;
    clearInterval(dateTimer);
  }
  elemTime.innerHTML = str;
}

function renderProgress(arr) {
  const elemProgress = document.querySelector('#Progress');
  const elemBar = document.querySelector('#Bar');
  let str = '';
  arr.forEach((item, index) => {
    str += `<li class="signup__item item-${index + 1}">
                    <div class="signup__top">
                      <span class="signup__text text--sm">達</span>
                      <span class="signup__text text--sm">${item.level}</span>
                      <span class="signup__text text--sm">人</span>
                    </div>
                    <div class="signup__box ${personNum >= item.level ? 'signup__box--complete' : ''}"></div>
                    <div class="signup__bottom">
                      <span class="signup__text text--sm">送</span>
                      <span class="signup__text text--sm">${item.productName}</span>
                    </div>
                  </li>`
  });

  elemProgress.innerHTML = `<li class="signup__item item-0">
                              <div class="signup__box signup__box--complete"></div>
                              <div class="signup__bottom">
                                <span class="signup__text text--sm">預購開始</span>
                              </div>
                            </li>` + str;

  elemBar.style = `width: ${personNum + '%'}`;
}

function renderPerson() {
  const elemPersonNum = document.querySelector('#PersonNum');
  let str = '';
  if (personNum < 100) {
    str = `<div class="signup__info" id="personNum">
                <span class="signup__text">已有</span>
                <span class="signup__text text--lg">${personNum}</span>
                <span class="signup__text">人報名</span>
              </div>
              <div class="signup__btn">
                <button class="btn">搶先報名 »</button>
              </div>`;
  } else {
    if (!isEnd) {
      str = `<span class="signup__full">已爆滿!</span>`
    } else {
      str = `<span class="signup__full">已額滿!</span>`
    }
  }
  elemPersonNum.innerHTML = str;
}


function setEvent() {
  const elemPlayBtn = document.querySelector('#PlayBtn');
  document.addEventListener('scroll', () => {
    renderNav();
    scrollAni();
  });
  elemPlayBtn.addEventListener('click', showVideo);
  elemVideo.addEventListener('click', hideVideo);
  document.addEventListener('keyup', hideVideo);
}

function renderNav() {
  if (!isNavRender) {
    elemNav.style = 'background-color: rgba(256,256,256,.7)';
    elemNavLink.forEach(item => {
      item.style = 'color: #000';
      item.addEventListener('mouseenter', () => {
        item.style = 'color: #24b4d7';
      });
      item.addEventListener('mouseleave', () => {
        item.style = 'color: #000';
      });
    });
    isNavRender = true;
  }
}

function scrollAni() {
  let dY = this.scrollY;
  let screenHeight = this.innerHeight;

  aniArr.forEach(item => {
    let elemItems = document.querySelectorAll(`.${item}`);
    elemItems.forEach(element => {
      if (element.classList.contains(`js-${item}`)) {
        return;
      }
      if (dY > element.offsetTop - screenHeight / 2) {
        element.classList.add(`js-${item}`);
        if (element.classList.contains('train__body')) {
          animateNum();
        }
      }
    });
  });
}

function animateNum() {
  const elemNum = document.querySelectorAll('.train__num');
  elemNum.forEach(item => {
    let count = 0;
    const target = parseInt(item.innerText);
    let timer = setInterval(renderNum, 10);
    function renderNum() {
      count = count + 1;
      item.innerText = count;
      if (count === target) {
        clearInterval(timer);
      }
    }
  });
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