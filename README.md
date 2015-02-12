# TreeListPureJs
A tree list, which can be expanded or collaposed.  It can be used to make a directory list or something similar.

No other third party library is required. 100% javascript.

example
```html
<ul id="mytree">loading...</ul>

<!-- initialize the tree -->
<script>
document.addEventListener("DOMContentLoaded", function(e) {
  //a treeList view is an ul
  var mytree = document.getElementById("mytree");
  //below is the structure of the data input for the tree
  var data = { 
    //it starts from a root
    root: {
      text: 'root',
      leaf: false,
      children: [
        {
          // a subtree child
          text: 'node'
          leaf: false,
          children: [
            {
              text: 'nodeleaf'
              leaf: true
            }
          ]
        },
        {
          // a leaf child
          text: 'leaf1',
          leaf: true
        },
        {
          // a second leaf child
          text: 'leaf2',
          leaf: true
        }
      ]
    }
  };
  //function to porpulate the tree with its data
  treeList(data, mytree);
});
</script>

