const elemNav = document.querySelector('#Nav');
const elemNavLink = document.querySelectorAll('.nav__ls a');
const elemNavList = document.querySelector('#NavList');
const elemNavBtn = document.querySelector('#NavBtn');
const elemVideo = document.querySelector('#Video');
const elemTop = document.querySelector('#Top');
const aniArr = ['ani-fade-in-top', 'ani-fade-in-down'];
let endTime = '';
let personNum = 0;
let totalNum = 100;
let isEnd = false;
let dateTimer = setInterval(renderTime, 1000);

getData();
setEvent();

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
  arr.forEach(item => {
    str += `<li class="signup__item" style="left: ${item.level/totalNum*100 + '%'}">
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

  elemProgress.innerHTML = `<li class="signup__item item-first">
                              <div class="signup__box signup__box--complete"></div>
                              <div class="signup__bottom">
                                <span class="signup__text text--sm">預購開始</span>
                              </div>
                            </li>` + str;

  elemBar.style = `width: ${personNum/totalNum*100 + '%'}`;
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
              <button class="btn" type="button">搶先報名 »</button>
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

  elemNavBtn.addEventListener('click', showList);
  document.addEventListener('click', hideList);
  elemPlayBtn.addEventListener('click', showVideo);
  elemVideo.addEventListener('click', hideVideo);
  document.addEventListener('keyup', hideVideo);
}

function renderNav() {
  let dY = this.scrollY;
  if (dY > 0) {
    elemNav.style = 'background-color: rgba(256,256,256,.7)';
    elemNavList.style.backgroundColor = 'rgba(256,256,256,0)';
    elemNavLink.forEach(item => {
      item.style.color = '#000';
      item.addEventListener('mouseenter', () => {
        item.style.color = '#24b4d7';
      });
      item.addEventListener('mouseleave', () => {
        item.style.color = '#000';
      });
    });
  } else {
    elemNav.style = 'background-color: rgba(256,256,256, 0)';
    if (screen.width <= 480) {
      elemNavList.style.backgroundColor = 'rgba(256,256,256,.7)';
    }
    elemNavLink.forEach(item => {
      item.classList.remove('js-nav-top');
      item.style.color = '#24b4d7';
      item.addEventListener('mouseenter', () => {
        item.style.color = '#000';
      });
      item.addEventListener('mouseleave', () => {
        item.style.color = '#24b4d7';
      });
    });
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
          animateNum(element);
        }
      }
    });
  });
}

function animateNum(item) {
  let count = 0;
  const target = parseInt(item.innerText);
  let timer = setInterval(renderNum, 10);
  function renderNum() {
    count = count + 1;
    item.childNodes[1].innerText = count;
    if (count === target) {
      clearInterval(timer);
    }
  }
}

function showList(e) {
  e.stopPropagation();
  elemNavList.classList.toggle('js-nav__ls');
}

function hideList(e) {
  const self = e.target;
  if (self.className !== 'nav__item' && self.className !== 'link') {
    elemNavList.classList.remove('js-nav__ls');
  }
}

function showVideo() {
  elemVideo.style = 'display: block';
  document.body.style = 'overflow: hidden';
  elemTop.style = 'display: none';
  elemVideo.querySelector('iframe').src = 'https://www.youtube.com/embed/syFyL9tONRA';
}

function hideVideo(e) {
  if (e.type === 'click' || e.keyCode === 27) {
    elemVideo.style = 'display: none';
    document.body.style = 'overflow: auto';
    elemTop.style = 'display: block';
    elemVideo.querySelector('iframe').src = '';
  }
}