const elemVideo = document.querySelector('#Video');
const elemTop = document.querySelector('#Top');
const aniArr = ['ani-fade-in-top', 'ani-fade-in-down'];
let isEnd = false;
let isMobile = screen.width <= 480;
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
  let endTime = new Date(data.endTime);
  let personNum = data.personNum;
  const len = data.list.length;
  let totalNum = data.list[len - 1].level;
  let arrList = data.list;
  renderTime(endTime, personNum, totalNum);
  renderProgress(arrList, personNum, totalNum);
  renderPerson(personNum, totalNum);
}

function renderTime(endTime, personNum, totalNum) {
  const elemTime = document.querySelector('#Time');
  const now = new Date();
  const diff = endTime - now;
  let str = '';
  if (diff > 0) {
    if (personNum < totalNum) {
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

function renderProgress(arr, personNum, totalNum) {
  const elemProgress = document.querySelector('#Progress');
  let str = '';
  let level = 0;
  arr.forEach(item => {
    str += `<li class="signup__item ${personNum >= item.level ? 'signup__box--complete' : ''}" style="width: ${(item.level - level) / totalNum * 100 + '%'}">
              <div class="signup__textbox signup__textbox--top">
                <span class="signup__text signup__text--sm">達</span>
                <span class="signup__text signup__text--sm">${item.level}</span>
                <span class="signup__text signup__text--sm">人</span>
              </div>
              <div class="signup__line" style="width: ${personNum >= item.level ? '100%' : (personNum - level) / (item.level - level) * 100 + '%'}"></div>
              <div class="signup__textbox signup__textbox--bottom">
                <span class="signup__text signup__text--sm">送 ${item.productName}</span>
              </div>
            </li>`;
    level = item.level;
  });

  elemProgress.innerHTML = str;
}

function renderPerson(personNum, totalNum) {
  const elemPersonNum = document.querySelector('#PersonNum');
  let str = '';
  if (personNum < totalNum) {
    str = `<div class="signup__info" id="personNum">
            <span class="signup__text">已有</span>
            <span class="signup__text signup__text--lg">${personNum}</span>
            <span class="signup__text">人報名</span>
          </div>
          <div class="signup__btn">
              <button class="btn" type="button">搶先報名 »</button>
          </div>`;
  } else {
    !isEnd ? str = `<span class="signup__full">已爆滿!</span>` : str = `<span class="signup__full">已額滿!</span>`;
  }
  elemPersonNum.innerHTML = str;
}

function setEvent() {
  const elemPlayBtn = document.querySelector('#PlayBtn');
  let dY = 0;
  document.addEventListener('scroll', () => {
    dY = this.scrollY;
    renderNav(dY);
    scrollAni(dY);
  });

  if (isMobile) {
    document.addEventListener('click', listStateChange);
  }
  elemPlayBtn.addEventListener('click', showVideo);
  elemVideo.addEventListener('click', hideVideo);
  document.addEventListener('keyup', hideVideo);
}

function renderNav(dY) {
  const elemNav = document.querySelector('#Nav');
  if (dY > 0) {
    elemNav.classList.add('js-nav-color');
  } else {
    elemNav.classList.remove('js-nav-color');
  }
}


function scrollAni(dY) {
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
  const target = parseInt(item.children[0].dataset.num);
  let timer = setInterval(() => {
    count = count + 1;
    item.children[0].textContent = count;
    if (count >= target) {
      item.children[0].textContent = target;
      clearInterval(timer);
    }
  }, 10);
}

function listStateChange(e) {
  const elemNavList = document.querySelector('#NavList');
  e.stopPropagation();
  const self = e.target;
  if (self.nodeName === 'I') {
    elemNavList.classList.toggle('js-nav-display');
  } else {
    if (self.nodeName !== 'LI') {
      elemNavList.classList.remove('js-nav-display');
    }
  }
}

function showVideo() {
  document.body.classList.add('js-lock');
  elemVideo.classList.add('js-show');
  elemTop.classList.remove('js-show');
  const url = elemVideo.querySelector('iframe').dataset.src;
  elemVideo.querySelector('iframe').src = url;
}

function hideVideo(e) {
  if (e.type === 'click' || e.keyCode === 27) {
    elemVideo.classList.remove('js-show');
    document.body.classList.remove('js-lock');
    elemTop.classList.add('js-show');
    elemVideo.querySelector('iframe').src = '';
  }
}