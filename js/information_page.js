
function infoPage(pathName,information){
  let selectedObj = '';
  if (information[0].length){
    selectedObj = infoPage_Index(pathName,information);

  }
  else{
    information.forEach((item,i) => {
      if (information[i].Name === pathName[0]){
        selectedObj = information[i];
      }
    });
  }

  console.log(selectedObj);
  let name = selectedObj.Name;
  let year = selectedObj.Year;
  let picture = getElement('id','picture')
  picture.src = 'images/done/' + convertInput(name,'image') + '.png';
  let title = getElement('id','title');
  title.innerText = name + '(' + year + ')';
  let details = getElement('id','details');
  details.innerText = selectedObj.Introduction;
  let player = getElement('id','player');
  let link = 'https://mega.nz/embed#!';
  player.src = link + selectedObj.DriveUrl;
}

function infoPage_Index(pathName,information){
  let name = pathName[0].toLowerCase();
  let contents = information[1];
  let selectedObj;
  contents.forEach((item, i) => {
    for (let prop in item){
      let info_Name = item[prop].Name.toLowerCase();
      if (info_Name === name){
        selectedObj = item[prop];
      }
    }
  });
  return selectedObj;
}
