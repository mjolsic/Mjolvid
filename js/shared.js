
initialise();

function initialise(){
  //
  stringProto();
  let pathName = htmlChecker();
  if (pathName.indexOf('index') !== -1){

  }
  else if (pathName.indexOf('information_page') !== -1){
    let KEY = 'INDEX';
    let index;
    if (localStorage[KEY] !== undefined){
      index = getInfo(KEY);
    }
    // index is an array
    readExcel('INFO-PAGE',index)
  }
  else if (pathName.indexOf('movies') !== -1 || pathName.indexOf('anime') !== -1){
    let KEY1 = 'FILTER';
    let KEY2 = 'INDEX';
    let KEY3 = 'PAGE-BUTTON';
    removeInfo(KEY1);
    removeInfo(KEY2);
    removeInfo(KEY3);
    readExcel('INFORMATION',pathName);
  }
}

function stringProto(){
  String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
  }
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
}

// third and fourth is used when filter button is clicked
// selOpt = selected options/type, selVal = selected value
function readExcel(input,pathName,selOpt,selVal){
  var url = "information.xlsx";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);

  oReq.responseType = "arraybuffer";
  oReq.onload = function(e) {
    var arraybuffer = oReq.response;

    // convert data to binary string
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    // Call XLSX
    var workbook = XLSX.read(bstr, {type:"binary"});
    // DO SOMETHING WITH workbook HERE

    // Get worksheet
    var worksheet = '';
    workbook.SheetNames.forEach((item) => {
      if (input !== 'INFO-PAGE'){
        if (pathName.indexOf(item) !== -1){
          worksheet = workbook.Sheets[item]
        }
      }
      else{
        if (pathName[1].indexOf(item) !== -1){
          worksheet = workbook.Sheets[item]
        }
      }
    });
    var information = XLSX.utils.sheet_to_json(worksheet,{raw:true});
    displayDivs(input,pathName,information,selOpt,selVal);
  }

  oReq.send();
  let parsedArray = getInfo(input);
  return parsedArray;
}

function displayDivs(type,pathName,information,selOpt,selVal){
  if (type === 'INFORMATION'){
    pageButtonRMB();
    loadDiv(information,1);
    pageDisable();
  }
  else if (type === 'FILTER'){
    sortFuntionality(selOpt,selVal,information);
  }
  else if (type === 'INFO-PAGE'){
    infoPage(pathName,information);
  }
  else if (type === 'PAGE-BUTTON'){
    dispContBut(information,selOpt);
    regenBut(information,selOpt);
    pageDisable(information);
  }
}

// Input is the storage key
function getInfo(input){

  // get storage item
  var storageItem = localStorage.getItem(input);
  // parse item back to normal
  var parseInfo = JSON.parse(storageItem);
  // return the data
  return parseInfo;
}

function removeInfo(input){
  // remove storage item
  if (localStorage[input] !== undefined){
    localStorage.removeItem(input);
  }
}

function setInfo(key,input){
  let stringInfo = '';
  if (typeof input !== 'string'){
    stringInfo = JSON.stringify(input)
  }
  else{
    stringInfo = input;
  }
  localStorage.setItem(key,stringInfo);
}

function htmlChecker(){
  let path = window.location.pathname;
  return path;
}

function pageButtonRMB(action,navigate_Index){
  let KEY = 'PAGE-BUTTON';
  if (localStorage[KEY]){
    let cur_Index = '';
    if (action === 'Add'){
      let prev_Index = parseInt(getInfo(KEY));
      cur_Index = prev_Index + 1;
    }
    else if (action === 'Subtract'){
      let prev_Index = parseInt(getInfo(KEY));
      cur_Index = prev_Index - 1;
    }
    else if (action === 'Navigate') {
      let selected_Page = parseInt(navigate_Index);
      cur_Index = selected_Page;
    }
    setInfo(KEY,cur_Index);
  }
  else{
    setInfo(KEY,1);
  }
}

function getElement(type,name){
  let output = '';
  if (type === 'id'){
    output = document.getElementById(name);
  }
  else if (type === 'cn'){
    output = document.getElementsByClassName(name);
  }
  else if (type === 'qs'){
    output = document.querySelector('.' + name);
    if (output === null){
      output = document.querySelector('#' + name);
    }
  }
  return output;
}

function redirect(input){
  let KEY = 'INDEX';
  setInfo(KEY,input);
  window.location.href = 'information_page.html';
}

function loadDiv(data,index){
  //
  document.addEventListener('click',(event) => {buttonClicked(event)});
  // get the filter elements
  let type1 = 'filter';
  let filterDivs = getElement('id',type1);
  let filterList = createFilterList(data);
  let filterOutput = generateContents(type1,filterList);
  filterDivs.innerHTML = filterOutput;
  let filterStorage = sortRMB(filterList[0]);
  // get the contents element
  let type2 = 'contents';
  let contentDivs = getElement('id',type2);
  let contentOutput = '';
  for (let i=index;i<index+8;i++){
    if (data[i] !== undefined){
      contentOutput += generateContents(type2,data[i]);
    }
  }
  contentDivs.innerHTML = contentOutput;
  // record the number of page number
  let number = data.length;
  calButNum(type2,number,index);
}

function generateContents(type,data){
  //
  let output = '';
  if (type === 'filter'){
    let key = data[0];
    let obj = data[1];
    for (let i=0; i<key.length;i++){
      let names = key[i];
      let valuesArray = obj[names];
      let all = 'All';
      output += '<ul class="type-list" id="' + names + '">';
      output += '<li class="label">By ' + names + '</li>';
      output += '<li class="options" id="all-' + names + '">' + all + '</li>';
      valuesArray.forEach((item) => {
        output += '<li class="options" id="' + item + '">' + item + '</li>';
      });
      output += '</ul>';
    }
  }
  else if(type === 'contents'){
    let name = data.Name;
    output += '<div class="mdl-cell mdl-cell--3-col mdl-card mdl-shadow--4dp video-card">';
    output += '<div class="mdl-card__media">';
    output += '<img class="article-image" src="images/done/' + convertInput(name,'image') + '.png" border="0">';
    output += '</div><div class="mdl-card__supporting-text video-title">';
    output += '<h2 class="mdl-card__title-text">' + name + '</h2>';
    output += '</div><div class="mdl-card__actions mdl-card--border">';
    output += '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect play-button" id="' + name + '">Play</a></div></div>';
  }
  return output;
}

function createFilterList(data){
  let outputObj = {};
  let key = ['Year','Location','Language','Genre'];

  data.forEach((item,i) => {
    for (let i = 0;i<key.length;i++){
      if (outputObj.hasOwnProperty(key[i])){
        // current selection
        let curSel = outputObj[key[i]];
        // current loop
        let curLoop = item[key[i]];
        if (curSel.indexOf(curLoop) === -1){
          // selected values for current loop
          let currentValues = convertInput(curLoop);
          // check if selected values returns in array
          if (typeof currentValues === 'object' && currentValues.length > 1){
            for (let i=0;i<currentValues.length;i++){
              if (curSel.indexOf(currentValues[i]) === -1){
                curSel.push(currentValues[i]);
              }
            }
          }
          else if (typeof currentValues === 'number' || typeof currentValues === 'string'){
            curSel.push(currentValues);
          }
        }
      }
      else{
        outputObj[key[i]] = [];
      }
    }
  }
  )

  for(let prop in outputObj){
    let curSel = outputObj[prop];
    if (typeof curSel[0] === 'number'){
      let tempArray = curSel.slice();
      tempArray.sort();
      outputObj[prop] = tempArray;
    }
  }

  let output = [key,outputObj];
  return output;
}

function convertInput(input,type){
  let output = '';
  if(typeof input === 'string' && input.indexOf(',') !== -1){
    output = input.split(',');
  }
  else if (type === 'image'){
    let temp = input;
    while (temp.indexOf('-') !== -1 || temp.indexOf(':') !== -1 || temp.indexOf(' ') !== -1){
      if (temp.indexOf('-') !== -1){
        temp = temp.replaceAll('-','_');
      }
      else if(temp.indexOf(':') !== -1){
        temp = temp.replaceAll(':','_');
      }
      else if(temp.indexOf(' ') !== -1){
        temp = temp.replaceAll(' ','_');
      }
    }
    output = temp;
  }
  else{
    output = input;
  }
  return output;
}

function buttonClicked(event){
  if (event.target.matches('.options')){
    // selected option
    let selOpt = event.target.parentElement.id;
    // selected value
    let selVal = event.target.id;
    // current page location
    let pathName = htmlChecker();
    // key to trigger if statement
    let input = 'FILTER';
    console.log(pathName)
    readExcel(input,pathName,selOpt,selVal)
  }
  else if (event.target.matches('.mdl-button__ripple-container') || event.target.matches('.play-button')){
    let selection = event.target.parentElement.id;
    if (!selection){
      selection = event.target.id;
    }
    let pathName = htmlChecker();
    redirect([selection,pathName]);
  }
  else if (event.target.matches('.pages-button')) {
    // selected button
    let selBut = event.target.id;
    checkPageBut(selBut);
  }
  //console.log(event.target)
}

// give hightlights when filter button clicked
function sortRMB(type,value,information){
  let KEY = 'FILTER';
  let outputObj = {};
  if (localStorage[KEY] !== undefined){
    let data = getInfo(KEY);
    let previous = data[type];
    data[type] = value;
    let current = data[type];
    outputObj = data;
    let stage = '1';
    sortButton(stage,previous,current);
  }
  else{
    let stage = '0';
    for (let i=0;i<type.length;i++){
      let ids = 'all' + '-' + type[i];
      outputObj[type[i]] = ids;
      sortButton(stage,ids);
    }
  }
  setInfo(KEY,outputObj);
}

function sortFilter(type,value,information){
  //
  let KEY = 'FILTER';
  let data = getInfo(KEY);

  let tempArray = [];
  let name = [];
  let total_count = Object.keys(data).length;
  let indi_count = 0;

  for (let i=0;i<information.length;i++){
    indi_count = 0;
    let curSel = information[i];
    for (let prop in data){
      let curProp = curSel[prop];
      if (typeof curProp === 'number'){
        curProp = curProp.toString();
      }
      if (data[prop].indexOf('all') !== -1){
        indi_count += 1;
      }
      else{
        if (curProp.indexOf(data[prop]) !== -1){
          indi_count += 1;
        }
      }
    }
    if (indi_count === total_count){
      tempArray.push(i);
      name.push(information[i].Name)
    }
  }
  console.log([tempArray,information])
  return [tempArray,information];
}

function sortButton(stage,data1,data2){
  let class_name = 'selected';
  if (stage === '0'){
    let current = getElement('id',data1);
    current.classList.add(class_name);
  }
  else{
    if (data1 === undefined){
      let current = getElement('id',data2);
      current.classList.add(class_name);
    }
    else{
      let previous = getElement('id',data1);
      let current = getElement('id',data2);
      previous.classList.remove(class_name);
      current.classList.add(class_name);
    }
  }
}

function sortDisplay(input,data){
  let count = input.length;
  let type = 'contents';
  let contentDivs = getElement('id',type);
  let output = '';
  for (let i=0;i<count;i++){
    let curSel = input[i];
    output += generateContents(type,data[curSel]);
  }
  contentDivs.innerHTML = output;
}

function sortFuntionality(type,data,information){
  sortRMB(type,data);
  let indexArray = sortFilter(type,data,information);
  sortDisplay(indexArray[0],indexArray[1]);
}

// calculate button number
function calButNum(type,number_of_pg,start_index){
  let output = '';
  let pages = getElement('id','pages');
  if (type === 'filter'){

  }
  else if (type === 'contents'){
    let still_have = number_of_pg / 8;
    output += createButDiv('Previous');
    // check if dramas need more than 4 page to handle
    if (still_have > 4){
      let count = Math.ceil(still_have);
      // check if there is pages index to hide
      if (start_index > 1){
        output += createButDiv('...');
        // check if the final index display will be larger than needed index
        // for dramas
        if (start_index+4 > count){
          // display 4 index of pages up to the last one needed
          for (let i=count-3;i<count+1;i++){
            output += createButDiv(i);
          }
        }
        else{
          let final_index_plus_1 = start_index+4;
          // display 4 pages for the dramas
          for(let i=start_index;i<final_index_plus_1;i++){
            output += createButDiv(i);
          }
          output += createButDiv('...');
        }
      }
      else if (start_index === 1){
        for (let i=1;i<5;i++){
          output += createButDiv(i);
        }
        output += createButDiv('...');
      }
    }
    else{
      let count = Math.ceil(still_have);
      console.log(still_have)
      for (let i=start_index;i<=count;i++){
        output += createButDiv(i);
      }
    }
    output += createButDiv('Next');
  }
  pages.innerHTML = output;
}

function createButDiv(count){
  let output ='<button class="mdl-button mdl-js-button mdl-button--raised pages-button" id="' + count + '">' + count + '</button>';
  return output;
}

function pageDisable(information){
  let KEY = 'PAGE-BUTTON';
  let start_index = getInfo(KEY);
  let converted_Index = parseInt(start_index);
  let name = 'pages-button';
  let theClass = getElement('cn',name);
  let still_have,index,condition_1;
  if (information){
    still_have = information.length/8;
    index = Math.ceil(still_have);
  }
  for (let i=0;i<theClass.length;i++){
    if (theClass[i].disabled){
      theClass[i].disabled = false;
    }
    let condition = parseInt(theClass[i].id);
    if (theClass[i].id === '...' || condition === converted_Index){
      theClass[i].disabled = true;
      if (index === condition){
        condition_1 = true;
      }
    }
  }
  if (converted_Index < 2){
    theClass[0].disabled = true;
  }
  else if (condition_1 === true){
    theClass[theClass.length-1].disabled = true;
  }
}

function checkPageBut(id){
  let KEY = 'PAGE-BUTTON';
  let pathName = htmlChecker();
  if (id === 'Previous'){
    pageButtonRMB('Subtract');
  }
  else if (id === 'Next'){
    pageButtonRMB('Add');
  }
  else{
    pageButtonRMB('Navigate',id)
  }
  let currentPage = getInfo(KEY);
  readExcel(KEY,pathName,currentPage)
}

//display button for selected content
function dispContBut(information,start_index){
  let output = '';
  let type = 'contents';
  let contentDivs = getElement('id',type);
  let count = (start_index - 1) * 8;
  for (let i = count;i<count+8;i++){
    if (information[i]!== undefined){
      output += generateContents(type,information[i]);
    }
  }
  contentDivs.innerHTML = output;
}

function regenBut(information,input_Index){
  let selected_Id = parseInt(input_Index);
  let to_Hide = 1;
  let still_have = information.length;
  if (selected_Id > 2){
    to_Hide = selected_Id - 2;
  }
  calButNum('contents',still_have,to_Hide);
}
