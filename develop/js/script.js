// /* ==========================
//   Imports
// =========================== */

const teachers = require("../json/data.json");
import {Teacher} from "./_class";


document.addEventListener("DOMContentLoaded", () => {
  inputFocus();
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


// /* ==========================
//   Functions メイン処理
// =========================== */

// ***** [START] ***** //

// ボタンにクリックイベントを登録
const inputToSearch = () => {
console.log('inputToSearch')

  const searchBtn = document.getElementById('searchBtn');
  const resultArea = document.getElementById('resultArea');

  // resultArea.innerHTML += "Sorry! <code>preventDefault()</code> won't let you check this!<br>";
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
  })
  // searchBtn.addEventListener('click', getInputText); //この場合はgetInputText内でremoveEleを呼び出す
  searchBtn.onclick= () => {
    removeEle(resultArea);
    getInputText();
  }
}


// 入力内容を取得
const getInputText = () => {
  const searchInput = document.getElementById('searchInput');
  searchText = searchInput.value;
  // console.log(searchText);
  searchJson(searchText);
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
console.log(searchedArr)


  // jsonToHTML(searchedArr) // class使わない版</
  displayNoMatch(searchedArr)
  generateResultObject(searchedArr);
}

const displayNoMatch = (searchedArr) => {
  const noMatch = document.getElementById('noMatch');
  // *****検索結果あった場合の処理*****
                    // 補足：「何件ありました」とかするなら関数作ってここで呼び出す
  setIsHidden(noMatch);

  // *****検索結果がなかった場合*****
  if ( searchedArr.length == 0 ) {
    removeIsHidden(noMatch);
  }
}

// インスタンス作成→配列に加える
const generateResultObject = (arr) => {
  resultObjectArray = []
  arr.forEach(ele => {
    // console.log(ele)
    resultObjectArray.push( new Teacher(
      ele.name, ele.position, ele.degree, ele.specialty, ele.currentRI, ele.image) );
    // const aaa = new Teacher(ele.name, ele.position, ele.degree, ele.specialty, ele.currentRI, ele.image);
    //   // aaa.mesodo()
    //   console.log("generateResultObject -> aaa", aaa.mesodo())
  });
  // console.log(resultObjectArray)
// console.log(resultArray)
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




