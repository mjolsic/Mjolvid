
function infoPage(information){
  let KEY = 'INDEX';
  console.log(information)
  if (localStorage[KEY] !== undefined){
    let index = localStorage.getItem(KEY);
    let selectedObj = '';
    information.forEach((item,i) => {
      if (information[i].Name === index){
        selectedObj = information[i];
      }
    });
    console.log(selectedObj)
    let name1 = selectedObj.Name;
    let name2 = selectedObj.Name_2;
    let year = selectedObj.Year
    let picture = getElement('id','picture')
    picture.src = 'images/done/' + convertInput(name1,'image') + '.png';
    let title = getElement('id','title');
    title.innerText = name1 + '   ' + name2 + '(' + year + ')';
    let details = getElement('id','details');
    details.innerText = selectedObj.Introduction;
    let player = getElement('id','player');
    let link = 'https://mega.nz/embed#!';
    player.src = link + selectedObj.DriveUrl;
  }
}
