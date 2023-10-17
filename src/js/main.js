/* Burger */

let burger = document.querySelector('.header__burger');
let burgerContainer = document.querySelector('.header__tablet');
let closeBurger = document.querySelector('.header__close-burger');
let burgerInside = document.querySelector('.header__burger-open');

burger.addEventListener('click', function () {
  burger.style.display = 'none';
  burgerContainer.classList.add('open-burger');
  burgerInside.classList.add('burger-display');
  burgerInside.classList.remove('close-burger');
})

closeBurger.addEventListener('click', function () {
  burger.style.display = 'block';
  burgerContainer.classList.remove('open-burger');
  burgerInside.classList.add('close-burger');
})

/* Search */

let searchBtn = document.querySelector('.header__search');
let searchBtnSmall = document.querySelector('.header__search-white');
let nav = document.querySelector('.header__nav');
let searchField = document.querySelector('.header__search-field');
let closeSearch = document.querySelector('.header__close');
let closeSmall = document.querySelector('.header__close-small');
let logo = document.querySelector('.header__logo');

searchBtn.addEventListener('click', function () {
  searchBtn.style.display = 'none';
  nav.style.display = 'none';
  searchField.style.display = 'flex';
});

closeSearch.addEventListener('click', function () {
  searchField.style.display = 'none';
  searchBtn.style.display = 'block';
  nav.style.display = 'block';
});

searchBtnSmall.addEventListener('click', function () {
  searchBtnSmall.style.display = 'none';
  logo.style.display = 'none';
  searchField.style.display = 'flex';
});

closeSmall.addEventListener('click', function () {
  searchBtnSmall.style.display = 'block';
  logo.style.display = 'block';
  searchField.style.display = 'none';
});

const mQuery = window.matchMedia('(max-width: 750px)');

function searchBtnResize(e) {
  if (e.matches) {
    searchBtn.style.display = 'none';
    searchBtnSmall.style.display = 'block';
  }
}

mQuery.addEventListener('change', searchBtnResize);

const maxQuery = window.matchMedia('(min-width: 750px)');

function smallBtnResize(e) {
  if (e.matches) {
    searchBtnSmall.style.display = 'none';
    searchBtn.style.display = 'block';
  }
}

maxQuery.addEventListener('change', smallBtnResize);

/* Validation */

new JustValidate(".about__form", {
  rules: {
    mail: {
      required: true,
      email: true,
    },
  },
});

const validationAbout = new JustValidate(".about__form", {
  tooltip: {
    position: "top",
  },
});

validationAbout
  .addField("#email-about", [
    {
      rule: "required",
      errorMessage: "Введите email",
    },
    {
      rule: "email",
      errorMessage: "Недопустимый формат",
    },
  ])


new JustValidate(".contacts__form", {
  rules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    mail: {
      required: true,
      email: true,
    },
  },
});

const validationContacts = new JustValidate(".contacts__form", {
  tooltip: {
    position: "top",
  },
});

validationContacts
  .addField("#name", [
    {
      rule: "required",
      errorMessage: "Введите имя",
    },
    {
      rule: "minLength",
      value: 2,
      errorMessage: "Минимальная длина имени - 2 символа",
    },
    {
      rule: "maxLength",
      value: 30,
      errorMessage: "Максимальная длина имени - 30 символов",
    },
    {
      rule: 'customRegexp',
      value: /^[a-zа-яё]+$/i,
      errorMessage: "Недопустимый формат",
    },
  ])
  .addField("#email", [
    {
      rule: "required",
      errorMessage: "Введите email",
    },
    {
      rule: "email",
      errorMessage: "Недопустимый формат",
    },
  ]);

/* Серое окно с адресом на карте */

let darkBackground = document.querySelector('.contacts__darken');
let closeContacts = document.querySelector('.contacts__close');
let openContacts = document.querySelector('.contacts__open');

let tl = gsap.timeline({ paused: true });
let topPad;

if (window.screen.width > 1330) {

  tl.to('.contacts__inside', { duration: 0.01, opacity: 0 }, 0)
    .to('.contacts__open', { display: 'block' }, 0)
    .to('.contacts__darken', { duration: 0.3, width: '78px' }, 0);
}
else {
  darkBackground.style.width = '100%';
  openContacts.style.transform = 'rotate(-90deg)';
  if (window.screen.width < 750) {
    topPad = '420px';
  }
  else {
    topPad = '405px';
  }
  tl.to('.contacts__inside', { duration: 0.01, opacity: 0 }, 0)
    .to('.contacts__close', { display: 'none' }, 0)
    .to('.contacts__open', { display: 'block' }, 0)
    .to('.contacts__darken', { duration: 0.3, height: '55px', }, 0)
    .to('.contacts__darken', { duration: 0.3, top: topPad, }, 0);
}

closeContacts.addEventListener('click', function (e) {
  e.preventDefault();
  tl.play();

  openContacts.addEventListener('click', function (e) {
    e.preventDefault();
    tl.reverse(true);
  })
})

/* Yandex map */

ymaps.ready(init);
function init() {
  const mapElem = document.querySelector('#map');
  const myMap = new ymaps.Map(
    "map",
    {
      center: [55.760220568958395, 37.618560499999894],
      zoom: 13,
      controls: []
    },
    {
      suppressMapOpenBlock: true,
    }
  );

  myMap.behaviors.disable('scrollZoom');

  const myPlacemark = new ymaps.Placemark(
    [55.76953456898229, 37.63998549999998],
    {},
    {
      iconLayout: "default#image",
      iconImageHref: "images/icon.png",
      iconImageSize: [12, 12],
      iconImageOffset: [-3, -30],
    }
  );

  myMap.geoObjects.add(myPlacemark);
  myMap.container.fitToViewport();
}

/* Текст в карточке проектов */

let cardFirst = document.querySelector('.projects__descr-1');
let cardSecond = document.querySelector('.projects__descr-2');
let cardThird = document.querySelector('.projects__descr-3');

textChange();
window.addEventListener('resize', textChange);

function textChange() {
  if (window.screen.width <= 1330 && window.screen.width > 1020) {
    cardFirst.innerHTML = 'Синтетически, смешаны с не уникальными...';
    cardSecond.innerHTML = 'В своём стремлении улучшить опыт мы...';
    cardThird.innerHTML = 'Равным образом, высокое качество позиционных высокотехнологичная концепция общественного уклада';
  }
  else {
    cardFirst.innerHTML = 'Синтетически, смешаны с не уникальными данными до степени...';
    cardSecond.innerHTML = 'В своём стремлении улучшить опыт мы упускаем, что явные...';
    cardThird.innerHTML = 'Равным образом, высокое качество позиционных...';
  }
}
