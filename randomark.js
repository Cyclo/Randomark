var bookmarks = [];
var tab_id = 0;

function get_bookmarks(bookmark){
  bookmark.forEach(function(child){

    if(child.children){
      if(child.title.length > 0){
        var selected =(child.id == localStorage['folder'] ? ' selected':'');
        $('#bookmark_folder').append('<option value='+child.id+selected+'>'+child.title+'</option>');
      }
      get_bookmarks(child.children);
    }else{
      bookmarks.push(child);
    }
  });
}
  
chrome.bookmarks.getTree(function(all){
  get_bookmarks(all);
});


function bookmarks_from_folder(folder){
  var output = [];
  bookmarks.forEach(function(child){
    if(child.parentId == folder){
      output.push(child);
    }
  });
  return output;
}

function random_bookmark(parent){

  var folder_bookmarks = bookmarks_from_folder(parent);
  var bookmark_id =  Math.floor(Math.random() * folder_bookmarks.length);
  var bookmark = folder_bookmarks[bookmark_id];

  if(tab_id !=0 ){
    chrome.tabs.update(tab_id,{url:bookmark.url});
  }else{
    chrome.tabs.create({url: bookmark.url},function(tab){
      tab_id = tab.id;
    });
  }
}

chrome.tabs.onRemoved.addListener(function(){
  tab_id = 0;  
});

function save_folder(){
  var folder = $("#bookmark_folder").val();
  localStorage['folder'] = folder;
  alert('Options Saved!');
}