const elemNav = document.querySelector('#Nav');
const elemNavLink = document.querySelectorAll('.nav__ls a');
const elemNavList = document.querySelector('#NavList');
const elemNavBtn = document.querySelector('#NavBtn');
const elemVideo = document.querySelector('#Video');
const elemTop = document.querySelector('#Top');
const aniArr = ['ani-fade-in-top', 'ani-fade-in-down'];
let isEnd = false;
let dateTimer = setInterval(renderTime, 1000);

getData();
setEvent();

function getData() {
  const api = './data/activity.json';
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
  renderTime(endTime, personNum);
  renderProgress(arrList, personNum, totalNum);
  renderPerson(personNum);
}

function renderTime(endTime, personNum) {
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

// 整個結構需改善，3 個 <li>
function renderProgress(arr, personNum, totalNum) {
  const elemProgress = document.querySelector('#Progress');
  const elemBar = document.querySelector('#Bar');
  let str = '';
  let level = 0;
  arr.forEach(item => {
    // str += `<li class="signup__item" style="left: ${item.level / totalNum * 100 + '%'}">
    //           <div class="signup__top">
    //             <span class="signup__text signup__text--sm">達</span>
    //             <span class="signup__text signup__text--sm">${item.level}</span>
    //             <span class="signup__text signup__text--sm">人</span>
    //           </div>
    //           <div class="signup__box ${personNum >= item.level ? 'signup__box--complete' : ''}"></div>
    //           <div class="signup__bottom">
    //             <span class="signup__text signup__text--sm">送 ${item.productName}</span>
    //           </div>
    //         </li>`;
  
    str += `<li class="signup__item" style="width: ${(item.level - level) / totalNum * 100 + '%'}">
              <div class="signup__textbox signup__textbox--top">
                <span class="signup__text signup__text--sm">達</span>
                <span class="signup__text signup__text--sm">${item.level}</span>
                <span class="signup__text signup__text--sm">人</span>
              </div>
              <div class="signup__line" style="width:  ${personNum >= item.level ? '100%' : (personNum - level) / (item.level - level) * 100 + '%'}"></div>
              <div class="signup__textbox signup__textbox--bottom">
                <span class="signup__text signup__text--sm">送 ${item.productName}</span>
              </div>
              <div class="signup__box ${personNum >= item.level ? 'signup__box--complete' : ''}"></div>
            </li>`
    level = item.level;
  });

  elemProgress.innerHTML = str;
  // elemBar.style = `width: ${personNum / totalNum * 100 + '%'}`;
}

function renderPerson(personNum) {
  const elemPersonNum = document.querySelector('#PersonNum');
  let str = '';
  if (personNum < 100) {
    str = `<div class="signup__info" id="personNum">
            <span class="signup__text">已有</span>
            <span class="signup__text signup__text--lg">${personNum}</span>
            <span class="signup__text">人報名</span>
          </div>
          <div class="signup__btn">
              <button class="btn" type="button">搶先報名 »</button>
          </div>`;
  } else {
    !isEnd ? str = `<span class="signup__full">已爆滿!</span>` : str = `<span class="signup__full">已額滿!</span>`
  }
  elemPersonNum.innerHTML = str;
}

function setEvent() {
  const elemPlayBtn = document.querySelector('#PlayBtn');
  document.addEventListener('scroll', () => {
    renderNav();
    scrollAni();
  });

  document.addEventListener('click', listStateChange);
  elemPlayBtn.addEventListener('click', showVideo);
  elemVideo.addEventListener('click', hideVideo);
  document.addEventListener('keyup', hideVideo);
}

function renderNav() {
  let dY = this.scrollY;
  if (dY > 0) {
    elemNav.classList.add('js-nav-color');
  } else {
    elemNav.classList.remove('js-nav-color');
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

// function 扁平化
// let count = 0;
// let timer = '';
function animateNum(item) {
  let count = 0;
  const target = parseInt(item.childNodes[1].dataset.num);
  // timer = setInterval(renderNum, 10, item, target, timer);
  let timer = setInterval(renderNum, 5);
  function renderNum() {
    count = count + 1;
    item.childNodes[1].textContent = count;
    if (count === target) {
      clearInterval(timer);
    }
  }
}

// function renderNum(item, target, timer) {
//   count = count + 1;
//   item.childNodes[1].textContent = count;
//   if (count === target) {
//     clearInterval(timer)
//   }
// }

function listStateChange(e) {
  e.stopPropagation();
  const self = e.target;
  if (self.nodeName === 'I') {
    elemNavList.classList.toggle('js-nav__ls');
  } else {
    if (self.nodeName !== 'LI') {
      elemNavList.classList.remove('js-nav__ls');
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
