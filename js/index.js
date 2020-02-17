
function loadIndex(information){

  document.addEventListener('click',(event) => {buttonClicked(event)});

  let titles = information[0];
  let page_info = information[1];
  let available = [];
  let final_index = [];

  page_info.forEach((item, i) => {
    if (item.length){
      available.push(item);
    }
    else{
      titles.splice(i,1);
    }
  });
  available.forEach((item, i) => {
    shuffle(item);
  });
  titles.forEach((item, i) => {
    titles[i] = item.replace('.html','');
    titles[i] = titles[i].capitalize();
  });
  index_Content(titles,available);
}

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

function index_Content(type,information){
  let output = '';
  for (let i = 0;i<type.length;i++){
    output = '';
    let contentDivs = getElement('id',type[i]);
    contentDivs.classList.add('mdl-shadow--3dp');
    contentDivs.classList.remove('disappear');
    let selected_Array = information[i];
    output += '<div class="mdl-cell index_title"><h4>' + type[i] + '</h4></div>';
    output += '<div class="mdl-grid video-max-width">';
    for (let j = 0;j < 8;j++){
      let sel_cont = selected_Array[j];
      if (sel_cont !== undefined){
        let name = sel_cont.Name;
        output += '<div class="mdl-cell mdl-cell--3-col mdl-card mdl-shadow--4dp video-card">';
        output += '<div class="mdl-card__media">';
        output += '<img class="article-image" src="images/done/' + convertInput(name,'image') + '.png" border="0" alt=""></div>';
        output += '<div class="mdl-card__supporting-text video-title">';
        output += '<h2 class="mdl-card__title-text">' + name + '</h2></div>';
        output += '<div class="mdl-card__actions mdl-card--border">';
        output += '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect play-button" id="' + name + '">Play</a>';
        output += '</div></div>';
      }
    }
    output += '</div>';
    contentDivs.innerHTML = output;
  }
}
