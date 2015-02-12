<script>
 
/**
 * create the tree from an empty ul
**/
function treeList(treeData, rootNode) {
  //set up the rootNode
  rootNode.className += ' treeList';
  rootNode.innerHTML = '';  
  var treeTitle = document.createElement("b");
  treeTitle.appendChild(document.createTextNode(treeData.root.text));
  rootNode.appendChild(treeTitle);
  treeData.root.domElement = rootNode;
  //add event listener to root
  if (treeTitle.addEventListener){
    //disable text selection on it
    treeTitle.addEventListener('mousedown', function (e){ e.preventDefault(); }, false);
    //hightlight the text when clicked
    treeTitle.addEventListener('click', getTreeSelectionListener(treeData.root), false);
  } else {
    //disable text selection on it
    treeTitle.attachEvent('onselectstart', function(){ event.returnValue = false; });
    //hightlight the text when clicked
    treeTitle.attachEvent('onclick', getTreeSelectionListener(treeData.root));
  }
  //save the folderId if it's writable
  if(treeData.root.canWrite) {
    treeTitle.id = treeData.root.folderId;
    treeTitle.className += " canWrite";
  } else {
    treeTitle.className += " canNotWrite";
  }
  
  //build the tree
  treeData.root.children = sortFolderItems(treeData.root.children); //first to sort the files and directories
  createTreeList(rootNode, treeData.root.children, false);

  //add event handlers to 'folder' node
  addTreeNodeHandlers(treeData.root.children);
  
  //expand the tree node is it's in cache
  if(folderIdCache != null && folderIdCache != '') {
    var expandedFolder = document.getElementById(folderIdCache);
    var finalFolder    = document.getElementById(folderIdCache);
    var theEvent = document.createEvent("MouseEvent");
    theEvent.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); 
    //expand all parents
    do {
      if(expandedFolder != null) {       
        if(finalFolder != expandedFolder) expandedFolder.dispatchEvent(theEvent);
        if(expandedFolder.parentNode == rootNode || expandedFolder.parentNode.parentNode == rootNode) break;
        expandedFolder = expandedFolder.parentNode.parentNode.parentNode.firstChild;
      }
    } while(expandedFolder != null);
    if(finalFolder != null) finalFolder.dispatchEvent(theEvent);
  }
}

/**
 * the function attach the list of subTrees to the rootTree
**/
function createTreeList(ulRoot, list, isCollapsed) {
  for(var i = 0; i < list.length; i++) {
    var uli = document.createElement("li");
    var txtHead = document.createElement("span");
    uli.appendChild(txtHead);
    var txt = document.createElement("span");
    txt.appendChild(document.createTextNode(list[i].text));
    uli.appendChild(txt);
      
    if(list[i].leaf) { 
      txtHead.className += " leaf";
    } else {
      //if not a leaf, create a <li>text<ul>children</ul></li>
      txtHead.className += " collapsed";
      if(list[i].canWrite) {
        txtHead.id = list[i].folderId;
        txt.className += " canWrite";
      } else {
        txt.className += " canNotWrite";
      }
      var uul = document.createElement("ul");
      list[i].children = sortFolderItems(list[i].children); //first to sort the files and directories
      createTreeList(uul, list[i].children, true);
      uli.appendChild(uul);
    }
    uli.style.display = isCollapsed ? 'none' : 'block';
    ulRoot.appendChild(uli);
    list[i].domElement = uli;
  }
}

/**
 * a function to sort the files and folders ASC by their names
 * directories always display first
 * param - list (inout): the list of foder items (can be file or folder)
**/
function sortFolderItems(list) {
  var dirList  = [];   // a temp list to hold the sorted folders
  var fileList = [];   // a temp list to hold the sorted files
  //sort all files and directories into their tmp lists
  for(var i = 0; i < list.length; i++) {
    if(list[i].leaf) { // file item
      if(fileList.length <= 0) {
        fileList.push(list[i]);
      } else {  //find its slot
        var isItemInserted = false;
        for(var j = 0; j < fileList.length; j++) {
          if( list[i].text <= fileList[j].text ) {   //insert it to the right position
            fileList.splice(j, 0, list[i]);
            isItemInserted = true;
            break;
          }
        }
        if(!isItemInserted) {  //append it to the end
          fileList.push(list[i]);
        }
      }
    } else {  // folder item
      if(dirList.length <= 0) {
        dirList.push(list[i]);
      } else { //find its slot
        var isItemInserted = false;
        for(var j = 0; j < dirList.length; j++) {
          if( list[i].text <= dirList[j].text ) {
            dirList.splice(j, 0, list[i]);
            isItemInserted = true;
            break;
          }
        }
        if(!isItemInserted) { //append it to the end
          dirList.push(list[i]);
        }
      }
    }
  }
  
  //now combine them
  return dirList.concat(fileList);
}

/**
 * add tree handlers. 
 * there are two types of events: 'collapse/expand' and 'select'
**/
function addTreeNodeHandlers(list) {
  for(var i = 0; i < list.length; i++) {
    // disable some default events
    if (list[i].domElement.addEventListener){
      list[i].domElement.addEventListener('mousedown', function (e){ e.preventDefault(); }, false);
    } else {
      list[i].domElement.attachEvent('onselectstart', function(){ event.returnValue = false; });
    }
    
    if(list[i].leaf) continue;  //skip leaf
    
    //add listeners to collapse/expand the 'folder' nodes
    var nodeObject = list[i].domElement.firstChild;
    if (nodeObject.addEventListener){
      nodeObject.addEventListener('click', getTreeNodeListener(list[i]), false);
    } else {
      nodeObject.attachEvent('onclick', getTreeNodeListener(list[i]));
    }
    
    //addlistener to select the 'folder' nodes 
    var nodeObject2 = nodeObject.nextSibling;
    if (nodeObject2.addEventListener){
      nodeObject2.addEventListener('click', getTreeSelectionListener(list[i]), false);
    } else {
      nodeObject2.attachEvent('onclick', getTreeSelectionListener(list[i]));
    }
    
    addTreeNodeHandlers(list[i].children);
  }
}

/**
 * get the event handler for 'collapse/expand'
**/
function getTreeNodeListener(node) {
  return function(e) {
    var isExpanded = node.domElement.firstChild.className.match(/(^| )expanded( |$)/);
    
    //toggle the display of its children
    for(var i = 0; i < node.children.length; i++) {
      node.children[i].domElement.style.display = isExpanded ? 'none' : 'block';
    }
    
    //update the class
    node.domElement.firstChild.className = 
      node.domElement.firstChild.className.replace(/(^| )(expanded|collapsed)( |$)/, '');
    node.domElement.firstChild.className += isExpanded ? ' collapsed' : ' expanded';
         
    //highlight the clicked node
    folderIdCache = '';  //clear the folderId cache
    var highlighted = document.getElementById("selected-writable");
    if(highlighted != null) {
      highlighted.id = null;
    }
    highlighted = document.getElementById("selected-not-writable");
    if(highlighted != null) {
      highlighted.id = null;
    }
    if(node.canWrite) {  //usr has permission to write under this folder
      node.domElement.firstChild.id = 'selected-writable';
      document.getElementById('selectedFolder').innerHTML = node.text + "\\";
      folderIdCache = node.folderId;
    } else {  //user do not have permssion to write under this folder
      node.domElement.firstChild.id = 'selected-not-writable';
      document.getElementById('selectedFolder').innerHTML = node.text + "\\ <font color='red'>(no upload permission)</font>";
    }
  }
}
/**
 * get the event handler for 'select'
**/
function getTreeSelectionListener(node) {
  return function(e) {
    //highlight the clicked node
    folderIdCache = '';  //clear the folderId cache
    var highlighted = document.getElementById("selected-writable");
    if(highlighted != null) {
      highlighted.id = null;
    }
    highlighted = document.getElementById("selected-not-writable");
    if(highlighted != null) {
      highlighted.id = null;
    }
    if(node.canWrite) {  //usr has permission to write under this folder
      node.domElement.firstChild.id = 'selected-writable';
      document.getElementById('selectedFolder').innerHTML = node.text + "\\";
      folderIdCache = node.folderId;
    } else {  //user do not have permssion to write under this folder
      node.domElement.firstChild.id = 'selected-not-writable';
      document.getElementById('selectedFolder').innerHTML = node.text + "\\ <font color='red'>(no upload permission)</font>";
    }
  }
}

//a cache for the currently selected folder
var folderIdCache = '';
</script>
