# TreeListPureJs
A tree list, which can be expanded or collapsed, was made purely by javascript.

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
    root: {
      text: 'root',
      leaf: false,
      children: [
        {
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
          text: 'leaf1',
          leaf: true
        },
        {
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

