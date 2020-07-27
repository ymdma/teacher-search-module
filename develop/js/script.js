// /* ==========================
//   Imports
// =========================== */

const teachers = require("../json/data.json");
import {Teacher} from "./_class";


document.addEventListener("DOMContentLoaded", () => {
  inputFocus();
  hbg();
});


// /* ==========================
//   Global Variable
// =========================== */

let searchText; // SONでの検索のキー
let resultObjectArray;
let state = 'state';


// /* ==========================
//   Functions    制御系
// =========================== */

// 読み込むコードを制限する
const conditionalBranch = () => {
  switch (state) {
    case 'state':  break;
    case 'set':    inputToSearch(); break;
  }
};

// stateを'set'に変更する
// const changeState_set = () => {
//   state = 'set';
//   console.log(state)
//   conditionalBranch();
// };

// focusされるまで関数（変数）を読み込まない
const inputFocus = () => {
  const searchInput = document.getElementById('searchInput');

  // searchInput.addEventListener('focus', changeState_set);  // 実行されてしまうので引数を渡さない
                                                              // focusのたびに呼び出されるので↓に改善
  searchInput.addEventListener('focus', () => {
    state = 'set';
    console.log(state)
    conditionalBranch();
  }, { once: true}); // 一回だけ実行(こうすれば使わない機能分の読み込み量を抑えられる)

}



// /* ==========================
//   Functions ユーティリティ系
// =========================== */
                                // タイムライン外の処理

// 対象要素にisHiddenクラスの付与
const setIsHidden = target => {
  target.classList.add('is-hidden');
}

// 対象要素のisHiddenクラス削除
const removeIsHidden = target => {
    target.classList.remove('is-hidden');
}

// target.toggleClass('.is-hidden')
const isHidden = target => {
  if (target.classList.contains('is-hidden')) {
    target.classList.remove('is-hidden');
  } else {
    target.classList.add('is-hidden');
  }
}

// 画面の初期化
const removeEle = (ele) => {
  while (ele.firstChild) ele.removeChild(ele.firstChild);
}

function setAriaExpanded(target) {
  const checkProp = target.getAttribute('aria-expanded')
  if (checkProp === 'true') {
    target.setAttribute('aria-expanded', false);
  }
  else {
    target.setAttribute('aria-expanded', true);
  }

};

// /* ==========================
//   Functions メイン処理
// =========================== */

// ***** [START] ***** //

// ボタンにクリックイベントを登録
const inputToSearch = () => {
// console.log('inputToSearch')

  const searchBtn = document.getElementById('searchBtn');
  const resultArea = document.getElementById('resultArea');
  const searchInput = document.getElementById('searchInput')
  // resultArea.innerHTML += "Sorry! <code>preventDefault()</code> won't let you check this!<br>";
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
  })
  // searchBtn.addEventListener('click', getInputText); //この場合はgetInputText内でremoveEleを呼び出す
  searchInput.onkeyup= () => {
    removeEle(resultArea);
    getInputText();
    // toggleNoMatch()
  }
  searchBtn.click= () => {
    removeEle(resultArea);
    getInputText();
  }
}


// 入力内容を取得
const getInputText = () => {
  const searchInput = document.getElementById('searchInput');
  searchText = searchInput.value.replace(/^\s+|\s+$/g,''); //最初と最後のspaceを抜く

  toggleNoMatch(searchText); // 検索結果なしの表示
  searchText ? searchJson(searchText) : false ; // スペースのみを検索しない為
  // console.log(searchText ? true: false )
}

// 検索結果なしの表示 (入力時)
const toggleNoMatch = (searchText) => {
  const noMatch = document.getElementById('noMatch');
  const numOfHit = document.getElementById('numOfHit');
  if (!searchText) {
    removeIsHidden(noMatch);
    setIsHidden(numOfHit);
  }
  else if (searchText) {
    isHidden(noMatch);
    removeIsHidden(numOfHit);
  }
}


// JSONデータの中から一致するオブジェクトを取り出して配列に入れる
const searchJson = (key) => {

  // 完全一致のみの検索
  // const searchedArr = teachers.filter( (teacher, index) => {
  //   // console.log(teachers[index])
  //   return teacher.name == `${key}`;
  // });

  // 部分一致の検索
  const inputKey = `${key}`;
  const regexp = new RegExp(inputKey);
  const searchedArr = teachers.filter( teacher => {
    return teacher.name.match(regexp);
  });


  // jsonToHTML(searchedArr) // class使わない版
  displayNoMatch(searchedArr)
  generateResultObject(searchedArr);
}

// 検索結果なしの表示 (検索後)
const displayNoMatch = (searchedArr) => {
  const noMatch = document.getElementById('noMatch');


  // *****検索結果がなかった場合*****
  if ( searchedArr.length == 0 ) {
    const numOfHit = document.getElementById('numOfHit');
    isHidden(numOfHit);
    removeIsHidden(noMatch);
  }
  // *****検索結果あった場合の処理*****
  else {
    numberOfHit(searchedArr)
    setIsHidden(noMatch);
  }
}


// 何件ヒットしたかの表示
const numberOfHit = (arr) => {
  const numOfHit = document.getElementById('numOfHit');
  let num = arr.length;

  removeIsHidden(numOfHit);

  numOfHit.innerHTML = `${num}件の一致`
}


// インスタンス作成→配列に加える
const generateResultObject = (arr) => {
  resultObjectArray = []
  arr.forEach(ele => {
    resultObjectArray.push( new Teacher(
      ele.name, ele.position, ele.degree, ele.specialty, ele.currentRI, ele.image) );
  });

  toHTML(resultObjectArray);
}


// HTMLに反映
const toHTML = (resultObjectArray) => {
  const
      resultArea = document.getElementById('resultArea');
  let
      wrapDiv,nameP,positionP,degreeP,specialtyP,currentP,imageP,personWrap;

  resultObjectArray.forEach( (ele, index) => {
    wrapDiv = document.createElement('div');
    nameP = document.createElement('p');
    positionP = document.createElement('p');
    degreeP = document.createElement('p');
    specialtyP = document.createElement('p');
    currentP = document.createElement('p');
    imageP = document.createElement('p');

    // innerHTML
    nameP.innerHTML = `名前: ${ele.name}`;
    positionP.innerHTML = `役職: ${ele.position}`;
    degreeP.innerHTML = `学位: ${ele.degree}`;
    specialtyP.innerHTML = `専門分野: ${ele.specialty}`;
    currentP.innerHTML = `現在の研究分野: ${ele.currentRI}`;
    imageP.innerHTML = `ここに画像: ${ele.image}`;
    // 枠のdiv
    wrapDiv.classList.add(`result-${index}`);
    resultArea.appendChild(wrapDiv);
    personWrap = document.querySelector('#resultArea > div:last-of-type');
    // append
    personWrap.appendChild(nameP);
    personWrap.appendChild(positionP);
    personWrap.appendChild(degreeP);
    personWrap.appendChild(specialtyP);
    personWrap.appendChild(currentP);
    personWrap.appendChild(imageP);
  });
}



// クラスを使わない方法
// これだけならこちらの方が短いといえば短い

// 検索結果の表示の実行
// jsonToHTML(searchResult);

// // 検索結果の表示 // classで書き替える
// const jsonToHTML = (id) => {
//   document.getElementById('name').innerHTML = `${teachers[id].name}`;
//   document.getElementById('position').innerHTML = `${teachers[id].position}`;
//   document.getElementById('degree').innerHTML = `${teachers[id].degree}`;
//   document.getElementById('specialty').innerHTML = `${teachers[id].specialty}`;
//   document.getElementById('currentRI').innerHTML = `${teachers[id].currentRI}`;
//   document.getElementById('image').innerHTML = `${teachers[id].image}`;
// // console.log(teacher[id].name)
// }


// HBG


const hbg = () => {
  const
      hamburgerBtn = document.getElementById('hamburgerBtn'),
      hbg = document.getElementById('hbg'),
      navList = document.getElementById('navList');

  hamburgerBtn.addEventListener('click', () => {
    setAriaExpanded(hamburgerBtn);
    setAriaExpanded(hbg);
    setAriaExpanded(navList);
  })
  closeButton.onclick = () => {
    setAriaExpanded(hamburgerBtn);
    setAriaExpanded(hbg);
    setAriaExpanded(navList);
  }

}
